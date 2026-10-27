import { readFile, stat } from "node:fs/promises";
import { createAppServer } from "./dev-server.mjs";

const REQUIRED = [
  "index.html",
  "styles.css",
  "app.js",
  "data.js",
  "manifest.webmanifest",
  "sw.js",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "api/meal-plan.mjs",
  "README.md",
  "DEMO.md",
];

const failures = [];
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failures.push(`${name}${detail ? `: ${detail}` : ""}`);
    console.log(`FAIL  ${name}${detail ? `: ${detail}` : ""}`);
  }
}

async function main() {
  console.log("=== Fit Code prototype verification ===");
  console.log(`Node ${process.version}`);

  for (const file of REQUIRED) {
    const info = await stat(file).catch(() => null);
    check(`file ${file}`, Boolean(info?.isFile()));
  }

  const manifest = JSON.parse(await readFile("manifest.webmanifest", "utf8"));
  check("manifest is standalone", manifest.display === "standalone");
  check("manifest has 192 icon", manifest.icons.some((icon) => icon.sizes === "192x192"));
  check("manifest has maskable icon", manifest.icons.some((icon) => icon.purpose === "maskable"));

  const html = await readFile("index.html", "utf8");
  check("HTML has app root", html.includes('id="main"'));
  check("HTML loads module app", html.includes('type="module"'));
  check("HTML has bottom navigation", html.includes("bottom-nav"));
  check("HTML declares manifest", html.includes("manifest.webmanifest"));

  const app = await readFile("app.js", "utf8");
  check("app includes quick log flow", app.includes("addFoodToLog"));
  check("app calls server AI endpoint", app.includes('fetch("/api/meal-plan"'));
  check("app includes export flow", app.includes("exportData"));
  check("app includes delete flow", app.includes("deleteAccount"));
  check("SQL view uses security_invoker", app.includes("security_invoker = true"));
  check("no Anthropic key in browser code", !/sk-ant-|ANTHROPIC_API_KEY/.test(app));

  const api = await readFile("api/meal-plan.mjs", "utf8");
  check("API reads server env key", api.includes("process.env.ANTHROPIC_API_KEY"));
  check("API enforces daily usage", api.includes("usageBuckets"));
  check("API allow-lists goals", api.includes("ALLOWED_GOALS"));

  const server = createAppServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const home = await fetch(`${base}/`);
    check("GET / returns 200", home.status === 200, String(home.status));
    const homeText = await home.text();
    check("home renders Fit Code", homeText.includes("FIT<span>/</span>CODE"));

    for (const path of ["/styles.css", "/app.js", "/data.js", "/manifest.webmanifest", "/sw.js", "/icons/icon-192.png"]) {
      const response = await fetch(`${base}${path}`);
      check(`GET ${path} returns 200`, response.status === 200, String(response.status));
    }

    const member = `verify-${Date.now()}`;
    const request = () =>
      fetch(`${base}/api/meal-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-member-id": member },
        body: JSON.stringify({
          goal: "Strength cut",
          days: 3,
          diet: "High protein",
          targets: { calories: 2150, protein: 165, carbs: 210, fat: 62 },
          member: { name: "Verify" },
        }),
      });

    const first = await request();
    const payload = await first.json();
    check("AI endpoint returns 200", first.status === 200, String(first.status));
    check("AI endpoint returns three days", payload.plan?.days?.length === 3);
    check("AI plan has four meals per day", payload.plan?.days?.every((day) => day.meals.length === 4));
    check("AI endpoint reports usage", payload.usage?.limit === 3 && payload.usage?.used === 1);
    check("AI endpoint does not return a key", !JSON.stringify(payload).includes("sk-ant-"));

    await request();
    await request();
    const fourth = await request();
    check("AI endpoint enforces the daily limit", fourth.status === 429, String(fourth.status));
    const fourthPayload = await fourth.json();
    check("limit response includes usage", fourthPayload.usage?.remaining === 0);

    const bad = await fetch(`${base}/api/meal-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-member-id": "verify-bad-goal" },
      body: JSON.stringify({ goal: "Eat everything", days: 3, diet: "High protein" }),
    });
    check("AI endpoint rejects unknown goals", bad.status === 400, String(bad.status));

    const noMember = await fetch(`${base}/api/meal-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal: "Strength cut", days: 3, diet: "High protein" }),
    });
    check("AI endpoint requires a member id", noMember.status === 401, String(noMember.status));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }

  console.log(`\n${failures.length === 0 ? "ALL CHECKS PASSED" : `${failures.length} CHECK(S) FAILED`}`);
  if (failures.length) {
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
