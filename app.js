import {
  DEMO_PLAN,
  FOODS,
  SUMMARY_MEMBERS,
  ageLabel,
  createSeedState,
  daysAgoISO,
  loadState,
  saveState,
  clearState,
  shortDate,
  todayISO,
  totalsFor,
} from "./data.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const state = loadState();

const ui = {
  view: "today",
  food: null,
  unit: "oz",
  qty: 0,
  meal: "Breakfast",
  planDay: 0,
  deferredInstall: null,
  toastTimer: null,
};

const GLYPHS = {
  bowl: "i-bowl",
  protein: "i-protein",
  carb: "i-carb",
  shake: "i-shake",
  fruit: "i-fruit",
  fat: "i-fat",
};

const MEAL_ORDER = ["Breakfast", "Lunch", "Dinner", "Snacks"];
const RING_RADIUS = 72;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function icon(name, className = "icon") {
  return `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

function foodOrb(food, extraClass = "") {
  return `<span class="food-orb ${extraClass}" style="--orb:${food.color}">${icon(GLYPHS[food.glyph] || "bowl")}</span>`;
}

function defaultMeal() {
  const hour = new Date().getHours();
  if (hour < 11) return "Breakfast";
  if (hour < 15) return "Lunch";
  if (hour < 18) return "Snacks";
  return "Dinner";
}

function errorMessage(message) {
  toast(message);
}

/* ------------------------------------------------------------------ */
/* render: shell, hero, targets                                        */
/* ------------------------------------------------------------------ */

function renderAll() {
  renderShell();
  renderFuel();
  renderMeals();
  renderWater();
  renderAI();
  renderPlan();
  renderProgress();
  renderReview();
  renderAccount();
}

function renderShell() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning," : hour < 17 ? "Good afternoon," : "Good evening,";
  const totals = totalsFor(state.logs);
  const proteinLeft = Math.max(0, state.targets.protein - totals.protein);

  $("#todayLabel").textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  $("#heroGreeting").textContent = greeting;
  $("#heroName").textContent = `${state.member.firstName}.`;
  $("#streakCount").textContent = state.streak;
  $("#bestStreak").textContent = state.bestStreak;
  $("#heroCopy").innerHTML =
    proteinLeft > 0
      ? `Day ${state.streak} of your streak. <strong>${proteinLeft}g of protein left</strong> to hit today's target.`
      : `Day ${state.streak} of your streak. <strong>Protein target hit.</strong> Now finish the day strong.`;
  $("#calorieTargetPill").textContent = `${formatNumber(state.targets.calories)} kcal target`;
}

function renderFuel() {
  const totals = totalsFor(state.logs);
  const caloriesLeft = Math.max(0, state.targets.calories - totals.kcal);
  const progress = Math.min(1, totals.kcal / state.targets.calories);
  const ring = $("#ringProgress");

  ring.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
  ring.style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - progress)}`;
  $("#caloriesLeft").textContent = formatNumber(caloriesLeft);
  $("#caloriesConsumed").textContent = formatNumber(totals.kcal);
  $("#mealCount").textContent = state.logs.length;

  const macros = [
    ["protein", "protein", "proteinValue", "proteinBar", "proteinLeft"],
    ["carbs", "carbs", "carbsValue", "carbsBar", "carbsLeft"],
    ["fat", "fat", "fatValue", "fatBar", "fatLeft"],
  ];
  for (const [key, targetKey, valueId, barId, leftId] of macros) {
    const target = state.targets[targetKey];
    const consumed = totals[key];
    const left = Math.max(0, target - consumed);
    $(`#${valueId}`).textContent = `${consumed} / ${target}g`;
    $(`#${barId}`).style.width = `${Math.min(100, (consumed / target) * 100)}%`;
    $(`#${leftId}`).textContent = left > 0 ? `${left}g left` : "target hit";
  }
}

/* ------------------------------------------------------------------ */
/* render: meals                                                       */
/* ------------------------------------------------------------------ */

function syncProteinHistory() {
  const totals = totalsFor(state.logs);
  if (Array.isArray(state.proteinHistory) && state.proteinHistory.length) {
    state.proteinHistory[state.proteinHistory.length - 1] = totals.protein;
  }
}

function renderMeals() {
  const groups = new Map();
  for (const log of state.logs) {
    if (!groups.has(log.meal)) groups.set(log.meal, []);
    groups.get(log.meal).push(log);
  }

  const ordered = MEAL_ORDER.filter((meal) => groups.has(meal));
  const html = ordered
    .map((meal) => {
      const logs = groups.get(meal);
      const total = logs.reduce((sum, log) => sum + Number(log.kcal || 0), 0);
      const time = logs[0]?.time || "";
      return `
        <article class="meal-group">
          <header class="meal-group-head">
            <strong>${esc(meal)}</strong>
            <span class="meal-time">${esc(time)}</span>
            <span class="meal-total">${formatNumber(Math.round(total))} kcal</span>
          </header>
          ${logs
            .map(
              (log) => `
            <div class="log-row">
              <span class="food-orb" style="--orb:${log.color || "#E9E4D8"}">${icon(GLYPHS[log.glyph] || "bowl")}</span>
              <div class="log-copy">
                <strong>${esc(log.name)}</strong>
                <span>${esc(log.amountLabel)} · ${esc(log.detail || "")}</span>
              </div>
              <div class="log-kcal">
                <strong>${Math.round(log.kcal)}</strong>
                <span>${Math.round(log.protein)}P · ${Math.round(log.carbs)}C · ${Math.round(log.fat)}F</span>
              </div>
              <button class="log-remove" data-remove="${esc(log.id)}" aria-label="Remove ${esc(log.name)}">
                ${icon("close")}
              </button>
            </div>`,
            )
            .join("")}
        </article>`;
    })
    .join("");

  $("#mealGroups").innerHTML =
    html || `<div class="meal-group empty-log"><p>Nothing logged yet. Start with protein.</p></div>`;
}

function renderWater() {
  const cups = Math.min(8, Math.max(0, state.water));
  $("#waterCount").textContent = cups;
  $("#waterCups").innerHTML = Array.from({ length: state.targets.water }, (_, i) => {
    const filled = i < cups;
    return `<button class="cup ${filled ? "is-filled" : ""}" data-cup="${i + 1}" aria-label="${
      filled ? `Set water to ${i + 1} cups` : `Fill cup ${i + 1}`
    }" aria-pressed="${filled}"></button>`;
  }).join("");
}

/* ------------------------------------------------------------------ */
/* render: AI + plan                                                   */
/* ------------------------------------------------------------------ */

function aiRemaining() {
  return Math.max(0, state.aiUsage.limit - state.aiUsage.used);
}

function renderAI() {
  const remaining = aiRemaining();
  $("#aiUsageDots").innerHTML = Array.from(
    { length: state.aiUsage.limit },
    (_, i) => `<span class="${i < state.aiUsage.used ? "is-used" : ""}"></span>`,
  ).join("");
  $("#aiUsageLabel").textContent = `${remaining} of ${state.aiUsage.limit} generations left`;
  $("#planUsageBadge").textContent = `${remaining} left`;
  $("#generatePlan").disabled = remaining === 0;
  $("#planStatus").textContent =
    remaining === 0
      ? "Daily limit reached. It resets at midnight."
      : "Uses one of your 3 daily generations.";
}

function renderPlan() {
  const plan = state.plan;
  $("#planTitle").textContent = plan.title || "3-day strength block";
  $("#planMeta").textContent = plan.subtitle || "Built around your targets";
  $("#planSource").textContent =
    plan.source === "anthropic" ? "Generated with Claude · just now" : "Demo plan · saved on this device";

  if (ui.planDay >= plan.days.length) ui.planDay = 0;
  $("#planDayTabs").innerHTML = plan.days
    .map(
      (day, index) => `
      <button role="tab" aria-selected="${index === ui.planDay}" data-plan-day="${index}" class="${
        index === ui.planDay ? "is-active" : ""
      }">${esc(day.label)}</button>`,
    )
    .join("");

  const day = plan.days[ui.planDay];
  const totals = day.meals.reduce(
    (sum, meal) => {
      sum.kcal += meal.kcal;
      sum.protein += meal.protein;
      sum.carbs += meal.carbs;
      sum.fat += meal.fat;
      return sum;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );

  $("#planDays").innerHTML = `
    <section class="plan-day-card">
      <div class="plan-day-head">
        <div>
          <p class="panel-kicker">${esc(day.label)} · training day</p>
          <h2>${esc(day.focus)}</h2>
        </div>
        <div class="day-total">
          <strong>${formatNumber(totals.kcal)}</strong>
          <span>kcal · ${totals.protein}P / ${totals.carbs}C / ${totals.fat}F</span>
        </div>
      </div>
      ${day.meals
        .map(
          (meal) => `
        <div class="plan-meal">
          <span class="meal-slot">${esc(meal.slot)}</span>
          <div class="plan-meal-copy">
            <strong>${esc(meal.name)}</strong>
            <span>${esc(meal.description)}</span>
          </div>
          <div class="plan-macros">
            <span><strong>${meal.protein}g</strong> P</span>
            <span><strong>${meal.carbs}g</strong> C</span>
            <span><strong>${meal.fat}g</strong> F</span>
            <span><strong>${meal.kcal}</strong> kcal</span>
          </div>
        </div>`,
        )
        .join("")}
    </section>`;

  const grocery = plan.grocery || DEMO_PLAN.grocery;
  $("#groceryCount").textContent = `${grocery.length} items`;
  $("#groceryList").innerHTML = grocery
    .map(
      (item, index) => `
      <div class="grocery-item">
        <label>
          <input type="checkbox" id="grocery-${index}" />
          <span class="grocery-check">${icon("check")}</span>
          <span>${esc(item)}</span>
        </label>
      </div>`,
    )
    .join("");
}

function setPlanControls() {
  $("#planGoal").value = state.planPrefs.goal;
  $("#planDays").value = state.planPrefs.days;
  $("#planDiet").value = state.planPrefs.diet;
}

/* ------------------------------------------------------------------ */
/* render: progress                                                    */
/* ------------------------------------------------------------------ */

function renderProgress() {
  const weights = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
  const first = weights[0];
  const last = weights[weights.length - 1];
  const delta = last.value - first.value;
  const proteinAvg = Math.round(state.proteinHistory.reduce((sum, v) => sum + v, 0) / state.proteinHistory.length);
  const proteinPct = Math.round((proteinAvg / state.targets.protein) * 100);

  $("#latestWeight").textContent = last.value.toFixed(1);
  $("#weightDelta").textContent = `${delta < 0 ? "−" : delta > 0 ? "+" : ""}${Math.abs(delta).toFixed(
    1,
  )} lb since ${shortDate(first.date)}`;
  $("#proteinAvg").textContent = proteinAvg;
  $("#proteinPct").textContent = `${proteinPct}% of target`;
  $("#streakStat").textContent = state.streak;
  $("#weightRange").textContent = `${shortDate(first.date)} – ${shortDate(last.date)}`;

  renderWeightChart(weights);
  renderProteinChart();
  renderStreakCalendar();
}

function renderWeightChart(weights) {
  const width = 760;
  const height = 252;
  const pad = { top: 30, right: 24, bottom: 34, left: 42 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const values = weights.map((point) => point.value);
  const min = Math.floor(Math.min(...values) - 1);
  const max = Math.ceil(Math.max(...values) + 1);
  const x = (index) => pad.left + (index / (weights.length - 1)) * plotW;
  const y = (value) => pad.top + ((max - value) / (max - min)) * plotH;

  const points = weights.map((point, index) => [x(index), y(point.value)]);
  const linePath = points.map(([px, py], index) => `${index === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${points.at(-1)[0].toFixed(1)},${(pad.top + plotH).toFixed(1)} L${points[0][0].toFixed(
    1,
  )},${(pad.top + plotH).toFixed(1)} Z`;

  const ticks = Array.from({ length: 2 }, (_, index) => min + ((max - min) / 2) * index);
  ticks.push(max);
  const grid = ticks
    .map(
      (tick) => `
      <line class="chart-grid-line" x1="${pad.left}" y1="${y(tick).toFixed(1)}" x2="${width - pad.right}" y2="${y(tick).toFixed(1)}" />
      <text class="chart-axis-label" x="${pad.left - 9}" y="${(y(tick) + 3).toFixed(1)}" text-anchor="end">${tick.toFixed(0)}</text>`,
    )
    .join("");

  const labelIndexes = new Set([0, Math.floor((weights.length - 1) / 2), weights.length - 1]);
  const labels = weights
    .map((point, index) =>
      labelIndexes.has(index)
        ? `<text class="chart-axis-label" x="${x(index).toFixed(1)}" y="${height - 10}" text-anchor="${
            index === 0 ? "start" : index === weights.length - 1 ? "end" : "middle"
          }">${shortDate(point.date)}</text>`
        : "",
    )
    .join("");

  const dots = weights
    .map(
      (point, index) => `
      <circle class="chart-dot ${index === weights.length - 1 ? "is-last" : ""}" cx="${x(index).toFixed(
        1,
      )}" cy="${y(point.value).toFixed(1)}" r="${index === weights.length - 1 ? 5 : 3.2}">
        <title>${shortDate(point.date)}: ${point.value.toFixed(1)} lb</title>
      </circle>`,
    )
    .join("");

  const lastPoint = points.at(-1);
  $("#weightChart").innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
      <defs>
        <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d8ff48" stop-opacity="0.65" />
          <stop offset="100%" stop-color="#d8ff48" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      ${grid}
      <path class="chart-area" d="${areaPath}" />
      <path class="chart-line" d="${linePath}" />
      ${dots}
      <text class="chart-callout" x="${(lastPoint[0] - 6).toFixed(1)}" y="${(lastPoint[1] - 13).toFixed(1)}" text-anchor="end">${weights.at(-1).value.toFixed(1)} lb</text>
      ${labels}
    </svg>`;
}

function renderProteinChart() {
  const values = state.proteinHistory;
  const max = 180;
  const days = values.map((_, index) => daysAgoISO(values.length - 1 - index));
  $("#proteinChart").innerHTML = values
    .map((value, index) => {
      const below = value < state.targets.protein * 0.9;
      const date = days[index];
      const day = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" });
      return `<div class="protein-bar-wrap" title="${day}: ${value}g protein">
        <div class="protein-bar ${below ? "is-below" : ""}" style="height:${Math.min(100, (value / max) * 100)}%"></div>
        <span class="protein-bar-label">${day.slice(0, 2)}</span>
      </div>`;
    })
    .join("");
}

function renderStreakCalendar() {
  const days = Array.from({ length: 14 }, (_, index) => daysAgoISO(13 - index));
  $("#streakCalendar").innerHTML = days
    .map((date, index) => {
      const logged = index >= 14 - state.streak;
      const isToday = date === todayISO();
      const label = new Date(`${date}T12:00:00`).getDate();
      return `<div class="cal-day ${logged ? "is-logged" : ""} ${isToday ? "is-today" : ""}" title="${shortDate(
        date,
      )}: ${logged ? "logged" : "missed"}">${label}</div>`;
    })
    .join("");
}

/* ------------------------------------------------------------------ */
/* render: owner review                                                */
/* ------------------------------------------------------------------ */

function summaryRows() {
  const weights = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
  const first = weights[0];
  const last = weights.at(-1);
  const proteinAvg = Math.round(state.proteinHistory.reduce((sum, value) => sum + value, 0) / state.proteinHistory.length);
  const maya = {
    name: state.member.name,
    initials: state.member.initials,
    daysSince: 0,
    streak: state.streak,
    proteinAvg,
    proteinTarget: state.targets.protein,
    weight: last.value,
    trend: last.value - first.value,
    isDemo: true,
  };
  return [maya, ...SUMMARY_MEMBERS];
}

function statusFor(row) {
  const ratio = row.proteinAvg / row.proteinTarget;
  if (row.daysSince >= 5 || row.streak === 0) return { label: "At risk", key: "at-risk" };
  if (row.daysSince >= 2 || ratio < 0.85) return { label: "Watch", key: "watch" };
  return { label: "On track", key: "on-track" };
}

function renderReview() {
  const rows = summaryRows();
  const assessed = rows.map((row) => ({ ...row, status: statusFor(row) }));
  const atRisk = assessed.filter((row) => row.status.key === "at-risk").length;
  const avg = Math.round(
    (assessed.reduce((sum, row) => sum + Math.min(1.2, row.proteinAvg / row.proteinTarget), 0) / assessed.length) * 100,
  );

  $("#reviewCount").textContent = assessed.length;
  $("#reviewAtRisk").textContent = atRisk;
  $("#reviewAvg").textContent = avg;
  $("#reviewUpdated").textContent = `Updated ${new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  $("#summaryRows").innerHTML = assessed
    .map((row) => {
      const ratio = Math.round((row.proteinAvg / row.proteinTarget) * 100);
      const trendText = `${row.trend > 0 ? "+" : ""}${row.trend.toFixed(1)} lb`;
      return `<tr>
        <td>
          <div class="member-cell">
            <span class="member-avatar">${esc(row.initials)}</span>
            <span><strong>${esc(row.name)}${row.isDemo ? " (you)" : ""}</strong><span>${
              row.isDemo ? "Seeded demo member" : "Fit Code member"
            }</span></span>
          </div>
        </td>
        <td class="days-cell"><strong>${row.daysSince}</strong> <span>${row.daysSince === 1 ? "day" : "days"}</span></td>
        <td class="streak-cell">${row.streak}d</td>
        <td class="protein-cell">
          <div class="protein-cell-top"><strong>${row.proteinAvg}g</strong><span>/ ${row.proteinTarget}g · ${ratio}%</span></div>
          <div class="protein-mini"><span style="width:${Math.min(100, ratio)}%"></span></div>
        </td>
        <td class="weight-cell">${row.weight.toFixed(1)} lb<span>${trendText}</span></td>
        <td><span class="status-chip ${row.status.key}">${row.status.label}</span></td>
      </tr>`;
    })
    .join("");
}

/* ------------------------------------------------------------------ */
/* render: account                                                     */
/* ------------------------------------------------------------------ */

function renderAccount() {
  $("#accountAvatar").textContent = state.member.initials;
  $("#accountName").textContent = state.member.name;
  $("#accountEmail").textContent = state.member.email;
  $("#accountRole").textContent = state.member.role === "admin" ? "Admin" : "Member";
  $("#accountLocation").textContent = state.member.location;
  $("#accountSince").textContent = state.member.memberSince;
  $("#accountCoach").textContent = state.member.coach;
  $("#accountGoal").textContent = state.member.goal;
  $("#accountBtn").textContent = state.member.initials;
}

/* ------------------------------------------------------------------ */
/* views + navigation                                                  */
/* ------------------------------------------------------------------ */

function setView(view, { scroll = true } = {}) {
  const known = ["today", "plan", "progress", "review"];
  if (!known.includes(view)) view = "today";
  ui.view = view;
  $$(".view").forEach((section) => {
    section.hidden = section.dataset.view !== view;
  });
  $$(".nav-link, .bottom-link").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ------------------------------------------------------------------ */
/* quick log dialog                                                    */
/* ------------------------------------------------------------------ */

function openLogDialog({ foodId = null, meal = null } = {}) {
  ui.food = null;
  ui.unit = "oz";
  ui.qty = 0;
  ui.meal = meal || defaultMeal();
  $("#foodSearch").value = "";
  $("#portionPanel").hidden = true;
  $("#mealPick").querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.meal === ui.meal);
  });
  $("#addMealLabel").textContent = ui.meal;
  renderFoodList("");
  const dialog = $("#logDialog");
  if (!dialog.open) dialog.showModal();
  if (foodId) {
    const food = FOODS.find((item) => item.id === foodId);
    if (food) selectFood(food);
  }
}

function renderFoodList(query = "") {
  const normalized = query.trim().toLowerCase();
  const foods = FOODS.filter((food) =>
    `${food.name} ${food.detail}`.toLowerCase().includes(normalized),
  );
  $("#foodList").innerHTML = foods.length
    ? foods
        .map(
          (food) => `
        <button class="food-option ${ui.food?.id === food.id ? "is-selected" : ""}" data-food="${food.id}">
          ${foodOrb(food)}
          <span class="food-option-copy">
            <strong>${esc(food.name)}</strong>
            <span>${food.servingOz} oz · ${food.kcal} kcal</span>
          </span>
        </button>`,
        )
        .join("")
    : `<p class="food-empty">No match. Try chicken, rice, eggs or shake.</p>`;
}

function selectFood(food) {
  ui.food = food;
  ui.unit = "oz";
  ui.qty = food.servingOz;
  $("#portionPanel").hidden = false;
  $("#selectedOrb").outerHTML = foodOrb(food, "food-orb").replace(
    'class="food-orb food-orb"',
    'class="food-orb" id="selectedOrb"',
  );
  $("#selectedName").textContent = food.name;
  $("#selectedDetail").textContent = food.detail;
  $("#selectedKcal").textContent = `${food.kcal} kcal`;
  $$(".segmented button").forEach((button) => button.classList.toggle("is-active", button.dataset.unit === "oz"));
  renderPortion();
  renderFoodList($("#foodSearch").value);
  $("#portionPanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function handLabel(food, qty) {
  const parts = food.handLabel.split(" ");
  parts[0] = formatQty(qty);
  if (qty !== 1) parts[parts.length - 1] = `${parts[parts.length - 1]}s`;
  return parts.join(" ");
}

function formatQty(qty) {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(1);
}

function portionMultiplier() {
  if (!ui.food) return 0;
  return ui.unit === "oz"
    ? ui.qty / ui.food.servingOz
    : (ui.qty * ui.food.handOz) / ui.food.servingOz;
}

function portionOunces() {
  if (!ui.food) return 0;
  return ui.unit === "oz" ? ui.qty : ui.qty * ui.food.handOz;
}

function renderPortion() {
  if (!ui.food) return;
  const multiplier = portionMultiplier();
  const kcal = Math.round(ui.food.kcal * multiplier);
  const protein = Math.round(ui.food.protein * multiplier);
  const carbs = Math.round(ui.food.carbs * multiplier);
  const fat = Math.round(ui.food.fat * multiplier);

  $("#qtyValue").textContent = formatQty(ui.qty);
  $("#qtyUnit").textContent = ui.unit === "oz" ? "oz" : "portion";
  $("#selectedKcal").textContent = `${kcal} kcal`;
  $("#previewKcal").textContent = kcal;
  $("#previewProtein").textContent = `${protein}g`;
  $("#previewCarbs").textContent = `${carbs}g`;
  $("#previewFat").textContent = `${fat}g`;

  if (ui.unit === "oz") {
    $("#portionHint").textContent = `${formatQty(ui.qty)} oz · about ${Math.round(
      ui.qty * 28.35,
    )}g · 1 ${ui.food.handLabel.split(" ").slice(1).join(" ")} ≈ ${ui.food.handOz} oz`;
  } else {
    const ounces = portionOunces();
    $("#portionHint").textContent = `${handLabel(ui.food, ui.qty)} ≈ ${formatQty(round(ounces, 1))} oz`;
  }
  $("#addMealLabel").textContent = ui.meal;
}

function stepPortion(direction) {
  if (!ui.food) return;
  const step = ui.unit === "oz" ? 1 : 0.5;
  const min = ui.unit === "oz" ? 0.5 : 1;
  const max = ui.unit === "oz" ? 32 : 6;
  ui.qty = Math.min(max, Math.max(min, round(ui.qty + step * direction, 1)));
  renderPortion();
}

function addFoodToLog() {
  if (!ui.food || !ui.qty) return;
  const multiplier = portionMultiplier();
  const amountLabel =
    ui.unit === "oz"
      ? `${formatQty(ui.qty)} oz`
      : `${handLabel(ui.food, ui.qty)} (${formatQty(round(portionOunces(), 1))} oz)`;
  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    meal: ui.meal,
    time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    foodId: ui.food.id,
    name: ui.food.name,
    detail: ui.food.detail,
    amountLabel,
    kcal: Math.round(ui.food.kcal * multiplier),
    protein: Math.round(ui.food.protein * multiplier),
    carbs: Math.round(ui.food.carbs * multiplier),
    fat: Math.round(ui.food.fat * multiplier),
    color: ui.food.color,
    glyph: ui.food.glyph,
  };
  state.logs.push(log);
  syncProteinHistory();
  saveState(state);
  renderFuel();
  renderMeals();
  renderShell();
  $("#logDialog").close();
  toast(`${log.name} added to ${log.meal}.`);
}

/* ------------------------------------------------------------------ */
/* plan generation                                                     */
/* ------------------------------------------------------------------ */

function localPlan(prefs) {
  const plan = structuredClone(DEMO_PLAN);
  const goal = prefs.goal.toLowerCase();
  plan.title = `${prefs.days}-day ${goal} block`;
  plan.subtitle = prefs.diet === "High protein"
    ? `Built around ${formatNumber(state.targets.calories)} kcal and ${state.targets.protein}g protein`
    : `${prefs.diet} · built around your current target`;
  plan.source = "demo";
  return plan;
}

async function generatePlan() {
  const prefs = {
    goal: $("#planGoal").value,
    days: $("#planDays").value,
    diet: $("#planDiet").value,
  };
  state.planPrefs = prefs;
  saveState(state);

  const button = $("#generatePlan");
  const label = $(".btn-label", button);
  const original = label.textContent;
  button.disabled = true;
  label.textContent = "Building your plan…";
  $("#planStatus").textContent = "Checking targets, then writing meals.";

  const minimumDelay = new Promise((resolve) => setTimeout(resolve, 850));

  try {
    const response = await fetch("/api/meal-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-member-id": state.member.id,
      },
      body: JSON.stringify({
        goal: prefs.goal,
        days: Number(prefs.days),
        diet: prefs.diet,
        targets: state.targets,
        member: { name: state.member.firstName },
      }),
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    await minimumDelay;

    if (response.status === 429) {
      if (payload?.usage) {
        state.aiUsage = payload.usage;
        saveState(state);
        renderAI();
      }
      toast("Daily AI limit reached. It resets at midnight.");
      return;
    }

    if (!response.ok || !payload?.plan) throw new Error("Plan endpoint unavailable");

    state.plan = payload.plan;
    state.planSavedAt = new Date().toISOString();
    if (payload.usage) state.aiUsage = payload.usage;
    saveState(state);
    ui.planDay = 0;
    renderAI();
    renderPlan();
    toast("New plan saved. Your next 3 days are ready.");
  } catch {
    await minimumDelay;
    if (aiRemaining() <= 0) {
      toast("Daily AI limit reached. It resets at midnight.");
      return;
    }
    state.plan = localPlan(prefs);
    state.planSavedAt = new Date().toISOString();
    state.aiUsage.used = Math.min(state.aiUsage.limit, state.aiUsage.used + 1);
    saveState(state);
    ui.planDay = 0;
    renderAI();
    renderPlan();
    toast("Demo plan rebuilt. Add an Anthropic key to call the live model.");
  } finally {
    label.textContent = original;
    button.disabled = aiRemaining() === 0;
    renderAI();
  }
}

/* ------------------------------------------------------------------ */
/* weight, export, account actions                                     */
/* ------------------------------------------------------------------ */

function openWeightDialog() {
  const latest = [...state.weights].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  $("#weightInput").value = latest ? latest.value.toFixed(1) : "";
  $("#weightDialog").showModal();
  setTimeout(() => $("#weightInput").select(), 80);
}

function saveWeight() {
  const value = Number($("#weightInput").value);
  if (!Number.isFinite(value) || value < 60 || value > 500) {
    toast("Enter a weight between 60 and 500 lb.");
    return;
  }
  const today = todayISO();
  const existing = state.weights.find((point) => point.date === today);
  if (existing) existing.value = round(value, 1);
  else state.weights.push({ date: today, value: round(value, 1) });
  state.weights.sort((a, b) => a.date.localeCompare(b.date));
  saveState(state);
  $("#weightDialog").close();
  renderProgress();
  toast(`Weigh-in saved at ${value.toFixed(1)} lb.`);
}

function exportData() {
  const payload = {
    app: "Fit Code Nutrition",
    exportedAt: new Date().toISOString(),
    member: state.member,
    targets: state.targets,
    mealLogs: state.logs.map(({ id, meal, time, name, detail, amountLabel, kcal, protein, carbs, fat }) => ({
      id,
      meal,
      time,
      name,
      detail,
      amountLabel,
      kcal,
      protein,
      carbs,
      fat,
    })),
    dailyLogs: state.weights.map((point) => ({
      date: point.date,
      weightLb: point.value,
    })),
    waterLogs: [{ date: state.day, cups: state.water }],
    mealPlan: state.plan,
    aiUsage: state.aiUsage,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fit-code-${state.member.firstName.toLowerCase()}-export.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast("Export downloaded as JSON.");
}

function resetDemo() {
  const seed = createSeedState();
  for (const key of Object.keys(state)) delete state[key];
  Object.assign(state, seed);
  saveState(state);
  ui.planDay = 0;
  $("#accountDialog").close();
  renderAll();
  setPlanControls();
  setView("today");
  toast("Demo data restored.");
}

function showFarewell() {
  $("#accountDialog").close();
  $("#deleteDialog").close();
  $$("header, main, .bottom-nav").forEach((element) => {
    element.hidden = true;
  });
  $("#farewell").hidden = false;
  document.title = "Account deleted · Fit Code";
  window.scrollTo(0, 0);
}

function deleteAccount() {
  clearState();
  showFarewell();
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("is-visible");
  clearTimeout(ui.toastTimer);
  ui.toastTimer = setTimeout(() => element.classList.remove("is-visible"), 3600);
}

/* ------------------------------------------------------------------ */
/* event wiring                                                        */
/* ------------------------------------------------------------------ */

function bindEvents() {
  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest("button[data-view]");
    if (viewButton) {
      setView(viewButton.dataset.view);
      return;
    }

    const logButton = event.target.closest("[data-open-log]");
    if (logButton) {
      openLogDialog();
      return;
    }

    const exportButton = event.target.closest("[data-export]");
    if (exportButton) {
      exportData();
      return;
    }

    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) {
      closeButton.closest("dialog")?.close();
    }
  });

  $("#accountBtn").addEventListener("click", () => $("#accountDialog").showModal());
  $("#mobileAccountBtn").addEventListener("click", () => $("#accountDialog").showModal());

  $("#accountDialog").addEventListener("click", (event) => {
    if (event.target === $("#accountDialog")) $("#accountDialog").close();
  });
  $("#deleteDialog").addEventListener("click", (event) => {
    if (event.target === $("#deleteDialog")) $("#deleteDialog").close();
  });
  $("#logDialog").addEventListener("click", (event) => {
    if (event.target === $("#logDialog")) $("#logDialog").close();
  });
  $("#weightDialog").addEventListener("click", (event) => {
    if (event.target === $("#weightDialog")) $("#weightDialog").close();
  });

  // quick log
  $("#foodSearch").addEventListener("input", (event) => renderFoodList(event.target.value));
  $("#foodList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-food]");
    if (!button) return;
    const food = FOODS.find((item) => item.id === button.dataset.food);
    if (food) selectFood(food);
  });

  $$(".segmented button").forEach((button) => {
    button.addEventListener("click", () => {
      if (!ui.food) return;
      ui.unit = button.dataset.unit;
      ui.qty = ui.unit === "oz" ? ui.food.servingOz : 1;
      $$(".segmented button").forEach((item) => item.classList.toggle("is-active", item === button));
      renderPortion();
    });
  });

  $("#qtyMinus").addEventListener("click", () => stepPortion(-1));
  $("#qtyPlus").addEventListener("click", () => stepPortion(1));

  $("#mealPick").addEventListener("click", (event) => {
    const button = event.target.closest("[data-meal]");
    if (!button) return;
    ui.meal = button.dataset.meal;
    $$("#mealPick button").forEach((item) => item.classList.toggle("is-active", item === button));
    $("#addMealLabel").textContent = ui.meal;
  });

  $("#addFoodBtn").addEventListener("click", addFoodToLog);

  $("#mealGroups").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const log = state.logs.find((item) => item.id === button.dataset.remove);
    state.logs = state.logs.filter((item) => item.id !== button.dataset.remove);
    syncProteinHistory();
    saveState(state);
    renderFuel();
    renderMeals();
    renderShell();
    toast(`${log?.name || "Item"} removed.`);
  });

  $("#plannedDinner").addEventListener("click", () => openLogDialog({ foodId: "salmon", meal: "Dinner" }));

  // water
  $("#waterCups").addEventListener("click", (event) => {
    const cup = event.target.closest("[data-cup]");
    if (!cup) return;
    state.water = Number(cup.dataset.cup);
    saveState(state);
    renderWater();
  });
  $("#waterPlus").addEventListener("click", () => {
    state.water = Math.min(state.targets.water, state.water + 1);
    saveState(state);
    renderWater();
    toast(state.water === state.targets.water ? "Eight cups. Hydration target hit." : "One cup added.");
  });
  $("#waterMinus").addEventListener("click", () => {
    state.water = Math.max(0, state.water - 1);
    saveState(state);
    renderWater();
  });

  // plan
  $("#planDayTabs").addEventListener("click", (event) => {
    const tab = event.target.closest("[data-plan-day]");
    if (!tab) return;
    ui.planDay = Number(tab.dataset.planDay);
    renderPlan();
  });
  $("#generatePlan").addEventListener("click", generatePlan);

  // progress
  $("#logWeightBtn").addEventListener("click", openWeightDialog);
  $("#saveWeightBtn").addEventListener("click", saveWeight);

  // account
  $("#installBtn").addEventListener("click", installApp);
  $("#resetDemo").addEventListener("click", resetDemo);
  $("#deleteAccountBtn").addEventListener("click", () => {
    $("#accountDialog").close();
    $("#deleteDialog").showModal();
  });
  $("#deleteFromProgress").addEventListener("click", () => $("#deleteDialog").showModal());
  $("#confirmDelete").addEventListener("click", deleteAccount);
  $("#restoreDemo").addEventListener("click", () => {
    clearState();
    window.location.reload();
  });

  $("#adjustTargetBtn").addEventListener("click", () => {
    toast("Target changes are coach-managed in Phase 1.");
  });

  // owner review
  $("#copySqlBtn").addEventListener("click", async () => {
    const sql = $("#viewSql").textContent;
    try {
      await navigator.clipboard.writeText(sql);
      toast("SQL copied.");
    } catch {
      toast("Select the SQL and copy it manually.");
    }
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    ui.deferredInstall = event;
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

async function installApp() {
  if (ui.deferredInstall) {
    ui.deferredInstall.prompt();
    const choice = await ui.deferredInstall.userChoice;
    ui.deferredInstall = null;
    if (choice.outcome === "accepted") toast("Fit Code added to your home screen.");
    return;
  }
  toast("On iPhone: Share, then Add to Home Screen. On Android: menu, then Install app.");
}

/* ------------------------------------------------------------------ */
/* SQL preview                                                         */
/* ------------------------------------------------------------------ */

const VIEW_SQL = `create view public.member_summary
with (security_invoker = true) as
select
  p.id as member_id,
  p.full_name,
  current_date - (
    select max(d.log_date)
    from public.daily_logs d
    where d.member_id = p.id
  ) as days_since_last_log,
  coalesce(s.current_streak, 0) as current_streak,
  (
    select round(avg(m.protein_g))
    from public.meal_logs m
    where m.member_id = p.id
      and m.log_date > current_date - 7
  ) as avg_protein_7d,
  (
    select mp.protein_g
    from public.macro_plans mp
    where mp.member_id = p.id
      and mp.is_active
    order by mp.created_at desc
    limit 1
  ) as protein_target_g,
  (
    select d.weight_lb
    from public.daily_logs d
    where d.member_id = p.id
      and d.weight_lb is not null
    order by d.log_date desc
    limit 1
  ) as latest_weight_lb
from public.profiles p
left join public.streaks s on s.member_id = p.id;

-- Owner reads this in the Supabase dashboard (service role).
-- Members get their own rows through security_invoker + RLS.`;

/* ------------------------------------------------------------------ */
/* boot                                                                */
/* ------------------------------------------------------------------ */

function boot() {
  $("#viewSql").textContent = VIEW_SQL;
  renderAll();
  setPlanControls();
  bindEvents();

  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view) setView(view, { scroll: false });
  if (params.get("action") === "log") {
    setTimeout(() => openLogDialog(), 250);
  }
}

boot();
