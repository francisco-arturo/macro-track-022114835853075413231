import { DEMO_PLAN } from "../data.js";

const ALLOWED_GOALS = new Set(["Strength cut", "Maintenance", "Lean build"]);
const ALLOWED_DIETS = new Set(["High protein", "Mostly plants", "Dairy free"]);
const DEFAULT_LIMIT = 3;
const MAX_BODY_BYTES = 32 * 1024;

// Prototype metering: per warm function instance. Production moves this to a
// Postgres ai_usage table keyed by (member_id, usage_date) with an RLS policy.
const usageBuckets = new Map();

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function limitForToday() {
  const parsed = Number(process.env.AI_DAILY_LIMIT);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 50 ? parsed : DEFAULT_LIMIT;
}

function usageFor(memberId) {
  const today = todayUTC();
  const key = `${memberId}:${today}`;
  const used = usageBuckets.get(key) || 0;
  return { date: today, used, limit: limitForToday(), remaining: Math.max(0, limitForToday() - used) };
}

function recordUsage(memberId) {
  const today = todayUTC();
  const key = `${memberId}:${today}`;
  usageBuckets.set(key, (usageBuckets.get(key) || 0) + 1);
  for (const existing of usageBuckets.keys()) {
    if (!existing.endsWith(`:${today}`)) usageBuckets.delete(existing);
  }
  return usageFor(memberId);
}

function json(res, status, payload, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  for (const [key, value] of Object.entries(extraHeaders)) res.setHeader(key, value);
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.length) return JSON.parse(req.body);

  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY_BYTES) throw new Error("Body too large");
  }
  return raw ? JSON.parse(raw) : {};
}

function cleanString(value, fallback, max = 60) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}

function clampNumber(value, fallback, min, max) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.round(parsed))) : fallback;
}

function buildDemoPlan({ goal, days, diet, targets }) {
  const plan = structuredClone(DEMO_PLAN);
  plan.title = `${days}-day ${goal.toLowerCase()} block`;
  plan.subtitle = `${diet} · built around ${targets.calories.toLocaleString("en-US")} kcal and ${
    targets.protein
  }g protein`;
  plan.source = "demo";
  const baseDays = structuredClone(DEMO_PLAN.days);
  plan.days = Array.from({ length: days }, (_, index) => {
    const base = baseDays[index % baseDays.length];
    return {
      ...base,
      label: `Day ${index + 1}`,
      meals: base.meals.map((meal) => ({ ...meal })),
    };
  });
  return plan;
}

function validateGeneratedPlan(plan, days) {
  if (!plan || typeof plan !== "object" || !Array.isArray(plan.days) || plan.days.length < days) return null;
  const cleanDays = plan.days.slice(0, days).map((day, index) => {
    if (!day || !Array.isArray(day.meals) || day.meals.length < 3) return null;
    return {
      label: cleanString(day.label, `Day ${index + 1}`, 20),
      focus: cleanString(day.focus, "Training day", 40),
      meals: day.meals.slice(0, 6).map((meal) => ({
        slot: cleanString(meal.slot, "Meal", 20),
        name: cleanString(meal.name, "Training meal", 80),
        description: cleanString(meal.description, "Built around your target", 120),
        kcal: clampNumber(meal.kcal, 500, 150, 1400),
        protein: clampNumber(meal.protein, 30, 0, 120),
        carbs: clampNumber(meal.carbs, 40, 0, 180),
        fat: clampNumber(meal.fat, 15, 0, 90),
      })),
    };
  });
  if (cleanDays.some((day) => day === null)) return null;
  return {
    id: `plan_${Date.now()}`,
    title: cleanString(plan.title, `${days}-day strength block`, 80),
    subtitle: cleanString(plan.subtitle, "Built around your target", 120),
    source: "anthropic",
    days: cleanDays,
    grocery: Array.isArray(plan.grocery)
      ? plan.grocery.slice(0, 30).map((item) => cleanString(item, "Staples", 80))
      : DEMO_PLAN.grocery,
  };
}

async function callAnthropic(input) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  const prompt = `Build a ${input.days}-day meal plan for a strength-training gym member.
Goal: ${input.goal}
Food style: ${input.diet}
Daily targets: ${input.targets.calories} kcal, ${input.targets.protein}g protein, ${input.targets.carbs}g carbs, ${input.targets.fat}g fat.
Member first name: ${input.member}.

Return ONLY valid JSON with this exact shape:
{
  "title": "short plan title",
  "subtitle": "one line describing the target",
  "days": [
    {
      "label": "Day 1",
      "focus": "Lower strength",
      "meals": [
        {"slot":"Breakfast","name":"...","description":"...","kcal":520,"protein":42,"carbs":60,"fat":14}
      ]
    }
  ],
  "grocery": ["item with quantity"]
}
Rules: four meals per day (Breakfast, Lunch, Snack, Dinner). Each day lands within 150 kcal of the calorie target and within 15g of the protein target. Food must be practical, mostly whole foods, and consistent with the food style. Use no markdown, no code fences, and no commentary.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
      max_tokens: 2600,
      temperature: 0.5,
      system:
        "You are a performance nutrition coach for a strength and conditioning gym. You write practical meal plans and return strict JSON only.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic returned ${response.status}`);
  const payload = await response.json();
  const text = (payload.content || [])
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in model response");
  return validateGeneratedPlan(JSON.parse(match[0]), input.days);
}

async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") {
    json(res, 405, { error: "Method not allowed" }, { Allow: "POST" });
    return;
  }

  const memberId = cleanString(req.headers?.["x-member-id"], "", 64);
  if (!/^[a-zA-Z0-9_-]{3,64}$/.test(memberId)) {
    json(res, 401, { error: "A valid member id is required." });
    return;
  }

  const before = usageFor(memberId);
  if (before.remaining <= 0) {
    json(res, 429, { error: "Daily AI limit reached.", usage: before }, { "X-AI-Remaining": "0" });
    return;
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    json(res, 400, { error: "Send a JSON body." });
    return;
  }

  if (!ALLOWED_GOALS.has(body.goal)) {
    json(res, 400, { error: "Unsupported goal." });
    return;
  }
  if (!ALLOWED_DIETS.has(body.diet)) {
    json(res, 400, { error: "Unsupported food style." });
    return;
  }

  const input = {
    goal: body.goal,
    diet: body.diet,
    days: clampNumber(body.days, 3, 3, 5),
    member: cleanString(body.member?.name, "Member", 30),
    targets: {
      calories: clampNumber(body.targets?.calories, 2150, 1200, 5000),
      protein: clampNumber(body.targets?.protein, 165, 60, 300),
      carbs: clampNumber(body.targets?.carbs, 210, 50, 600),
      fat: clampNumber(body.targets?.fat, 62, 20, 200),
    },
  };

  let plan = null;
  try {
    plan = await callAnthropic(input);
  } catch {
    plan = null;
  }

  const source = plan ? "anthropic" : "demo";
  if (!plan) plan = buildDemoPlan(input);

  const usage = recordUsage(memberId);
  json(
    res,
    200,
    { plan, usage, source },
    {
      "X-AI-Remaining": String(usage.remaining),
      "X-AI-Source": source,
    },
  );
}

export default handler;
