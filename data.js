const STORAGE_KEY = "fitcode.macro-track.v1";
const MS_DAY = 86400000;

export const TARGETS = {
  calories: 2150,
  protein: 165,
  carbs: 210,
  fat: 62,
  water: 8,
};

export const MEMBER = {
  id: "mbr_maya_chen",
  firstName: "Maya",
  name: "Maya Chen",
  email: "maya.chen@fitcode.test",
  initials: "MC",
  role: "member",
  location: "Lincoln Park",
  memberSince: "September 2026",
  coach: "Elena Ruiz",
  goal: "Recomp",
};

export const FOODS = [
  {
    id: "greek-yogurt-bowl",
    name: "Greek yogurt bowl",
    detail: "Yogurt, blueberries, granola",
    servingOz: 8,
    handLabel: "1 cupped hand",
    handOz: 6,
    kcal: 310,
    protein: 24,
    carbs: 38,
    fat: 7,
    color: "#E9D9B8",
    glyph: "bowl",
  },
  {
    id: "grilled-chicken",
    name: "Grilled chicken",
    detail: "Seasoned breast, grilled",
    servingOz: 4,
    handLabel: "1 palm",
    handOz: 4,
    kcal: 187,
    protein: 35,
    carbs: 0,
    fat: 4,
    color: "#E7C4A3",
    glyph: "protein",
  },
  {
    id: "jasmine-rice",
    name: "Jasmine rice",
    detail: "Cooked, lightly salted",
    servingOz: 6,
    handLabel: "1 fist",
    handOz: 6,
    kcal: 220,
    protein: 4,
    carbs: 48,
    fat: 0.4,
    color: "#F0E7C3",
    glyph: "carb",
  },
  {
    id: "salmon",
    name: "Roasted salmon",
    detail: "Center-cut fillet",
    servingOz: 5,
    handLabel: "1 palm",
    handOz: 5,
    kcal: 280,
    protein: 34,
    carbs: 0,
    fat: 15,
    color: "#F2B7A0",
    glyph: "protein",
  },
  {
    id: "sweet-potato",
    name: "Roasted sweet potato",
    detail: "Olive oil, flaky salt",
    servingOz: 5,
    handLabel: "1 fist",
    handOz: 5,
    kcal: 160,
    protein: 3,
    carbs: 37,
    fat: 0.2,
    color: "#F3C77B",
    glyph: "carb",
  },
  {
    id: "protein-shake",
    name: "Whey protein shake",
    detail: "Two scoops, water",
    servingOz: 12,
    handLabel: "1 shaker",
    handOz: 12,
    kcal: 170,
    protein: 30,
    carbs: 6,
    fat: 3,
    color: "#D9E2C5",
    glyph: "shake",
  },
  {
    id: "cottage-cheese",
    name: "Cottage cheese",
    detail: "Low-fat, black pepper",
    servingOz: 6,
    handLabel: "1 cupped hand",
    handOz: 6,
    kcal: 180,
    protein: 22,
    carbs: 12,
    fat: 4,
    color: "#E4E4D2",
    glyph: "bowl",
  },
  {
    id: "apple",
    name: "Honeycrisp apple",
    detail: "One medium apple",
    servingOz: 3,
    handLabel: "1 fist",
    handOz: 3,
    kcal: 95,
    protein: 0,
    carbs: 25,
    fat: 0.3,
    color: "#DCE3AD",
    glyph: "fruit",
  },
  {
    id: "eggs",
    name: "Whole eggs",
    detail: "Three eggs, scrambled",
    servingOz: 3,
    handLabel: "1 palm",
    handOz: 3,
    kcal: 210,
    protein: 18,
    carbs: 1,
    fat: 15,
    color: "#F4D98C",
    glyph: "protein",
  },
  {
    id: "almonds",
    name: "Almonds",
    detail: "Dry roasted, unsalted",
    servingOz: 1,
    handLabel: "1 thumb",
    handOz: 1,
    kcal: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    color: "#DCC6A4",
    glyph: "fat",
  },
  {
    id: "olive-oil",
    name: "Olive oil",
    detail: "Extra virgin",
    servingOz: 0.5,
    handLabel: "1 thumb",
    handOz: 0.5,
    kcal: 120,
    protein: 0,
    carbs: 0,
    fat: 14,
    color: "#C9D9A4",
    glyph: "fat",
  },
  {
    id: "sourdough",
    name: "Sourdough toast",
    detail: "One thick slice",
    servingOz: 2,
    handLabel: "1 fist",
    handOz: 2,
    kcal: 140,
    protein: 5,
    carbs: 27,
    fat: 1,
    color: "#E8D3AE",
    glyph: "carb",
  },
];

export const SUMMARY_MEMBERS = [
  {
    name: "Jordan Ellis",
    initials: "JE",
    daysSince: 1,
    streak: 4,
    proteinAvg: 128,
    proteinTarget: 150,
    weight: 192.4,
    trend: -0.6,
  },
  {
    name: "Priya Shah",
    initials: "PS",
    daysSince: 0,
    streak: 21,
    proteinAvg: 142,
    proteinTarget: 140,
    weight: 131.8,
    trend: 0.2,
  },
  {
    name: "Marcus Reed",
    initials: "MR",
    daysSince: 6,
    streak: 0,
    proteinAvg: 92,
    proteinTarget: 180,
    weight: 224.6,
    trend: 1.1,
  },
  {
    name: "Elena Ortiz",
    initials: "EO",
    daysSince: 0,
    streak: 9,
    proteinAvg: 151,
    proteinTarget: 155,
    weight: 142.0,
    trend: -1.4,
  },
  {
    name: "Sam Whitaker",
    initials: "SW",
    daysSince: 2,
    streak: 3,
    proteinAvg: 115,
    proteinTarget: 160,
    weight: 178.9,
    trend: -0.3,
  },
];

const PLAN_DAYS = [
  {
    label: "Day 1",
    focus: "Lower strength",
    meals: [
      {
        slot: "Breakfast",
        name: "Steel-cut oats + whey",
        description: "Oats, whey, blueberries, almond butter",
        kcal: 520,
        protein: 42,
        carbs: 62,
        fat: 12,
      },
      {
        slot: "Lunch",
        name: "Chicken rice bowl",
        description: "Chicken, jasmine rice, cucumber, chili crunch",
        kcal: 610,
        protein: 48,
        carbs: 64,
        fat: 16,
      },
      {
        slot: "Snack",
        name: "Cottage cheese + pineapple",
        description: "Cottage cheese, pineapple, cinnamon",
        kcal: 210,
        protein: 24,
        carbs: 16,
        fat: 4,
      },
      {
        slot: "Dinner",
        name: "Sheet-pan salmon",
        description: "Salmon, baby potatoes, broccolini, lemon",
        kcal: 720,
        protein: 48,
        carbs: 58,
        fat: 28,
      },
    ],
  },
  {
    label: "Day 2",
    focus: "Upper strength",
    meals: [
      {
        slot: "Breakfast",
        name: "Eggs + sourdough",
        description: "Three eggs, sourdough, avocado, tomato",
        kcal: 480,
        protein: 32,
        carbs: 34,
        fat: 22,
      },
      {
        slot: "Lunch",
        name: "Turkey smash wrap",
        description: "Turkey, Greek yogurt slaw, spinach, tortilla",
        kcal: 560,
        protein: 44,
        carbs: 52,
        fat: 18,
      },
      {
        slot: "Snack",
        name: "Shake + banana",
        description: "Whey, banana, oat milk",
        kcal: 300,
        protein: 32,
        carbs: 36,
        fat: 4,
      },
      {
        slot: "Dinner",
        name: "Steak + sweet potato",
        description: "Flank steak, roasted sweet potato, green beans",
        kcal: 700,
        protein: 52,
        carbs: 55,
        fat: 26,
      },
    ],
  },
  {
    label: "Day 3",
    focus: "Conditioning",
    meals: [
      {
        slot: "Breakfast",
        name: "Greek yogurt crunch",
        description: "Greek yogurt, berries, granola, honey",
        kcal: 450,
        protein: 38,
        carbs: 48,
        fat: 10,
      },
      {
        slot: "Lunch",
        name: "Salmon grain bowl",
        description: "Salmon, farro, greens, lemon-tahini",
        kcal: 640,
        protein: 42,
        carbs: 60,
        fat: 24,
      },
      {
        slot: "Snack",
        name: "Jerky + apple",
        description: "Turkey jerky, honeycrisp apple",
        kcal: 230,
        protein: 24,
        carbs: 22,
        fat: 4,
      },
      {
        slot: "Dinner",
        name: "Chicken pesto pasta",
        description: "Chicken, rigatoni, pesto, cherry tomatoes",
        kcal: 740,
        protein: 52,
        carbs: 72,
        fat: 24,
      },
    ],
  },
];

export const DEMO_PLAN = {
  id: "plan_strength_3",
  title: "3-day strength block",
  subtitle: "Built around 2,150 kcal and 165g protein",
  source: "demo",
  days: PLAN_DAYS,
  grocery: [
    "Chicken breast, 2 lb",
    "Salmon, 1.5 lb",
    "Flank steak, 1 lb",
    "Eggs, 12",
    "Greek yogurt, 32 oz",
    "Cottage cheese, 16 oz",
    "Whey protein",
    "Steel-cut oats",
    "Jasmine rice",
    "Sweet potatoes, 2",
    "Blueberries + pineapple",
    "Sourdough + tortillas",
    "Broccolini + green beans",
    "Avocado + bananas",
    "Olive oil + almond butter",
    "Pesto + lemon-tahini",
  ],
};

export function todayISO() {
  const d = new Date();
  return dateISO(d);
}

export function dateISO(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysAgoISO(days) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return dateISO(d);
}

function seedWeights() {
  const points = [
    [49, 150.4],
    [42, 149.9],
    [35, 149.6],
    [28, 149.1],
    [21, 148.9],
    [14, 148.6],
    [7, 148.4],
    [0, 148.2],
  ];
  return points.map(([offset, value]) => ({
    date: daysAgoISO(offset),
    value,
  }));
}

function seedLogs() {
  return [
    {
      id: "log_seed_1",
      meal: "Breakfast",
      time: "7:35 AM",
      foodId: "greek-yogurt-bowl",
      name: "Greek yogurt bowl",
      detail: "Yogurt, blueberries, granola",
      amountLabel: "8 oz",
      kcal: 310,
      protein: 24,
      carbs: 38,
      fat: 7,
      color: "#E9D9B8",
      glyph: "bowl",
    },
    {
      id: "log_seed_2",
      meal: "Lunch",
      time: "12:20 PM",
      foodId: "grilled-chicken",
      name: "Grilled chicken",
      detail: "Seasoned breast, grilled",
      amountLabel: "5 oz",
      kcal: 234,
      protein: 44,
      carbs: 0,
      fat: 5,
      color: "#E7C4A3",
      glyph: "protein",
    },
    {
      id: "log_seed_3",
      meal: "Lunch",
      time: "12:20 PM",
      foodId: "jasmine-rice",
      name: "Jasmine rice",
      detail: "Cooked, lightly salted",
      amountLabel: "6 oz",
      kcal: 220,
      protein: 4,
      carbs: 48,
      fat: 0,
      color: "#F0E7C3",
      glyph: "carb",
    },
    {
      id: "log_seed_4",
      meal: "Lunch",
      time: "12:20 PM",
      foodId: "olive-oil",
      name: "Olive oil",
      detail: "Extra virgin",
      amountLabel: "0.5 oz",
      kcal: 120,
      protein: 0,
      carbs: 0,
      fat: 14,
      color: "#C9D9A4",
      glyph: "fat",
    },
    {
      id: "log_seed_5",
      meal: "Snacks",
      time: "3:05 PM",
      foodId: "protein-shake",
      name: "Whey protein shake",
      detail: "Two scoops, water",
      amountLabel: "12 oz",
      kcal: 170,
      protein: 30,
      carbs: 6,
      fat: 3,
      color: "#D9E2C5",
      glyph: "shake",
    },
    {
      id: "log_seed_6",
      meal: "Snacks",
      time: "3:05 PM",
      foodId: "apple",
      name: "Honeycrisp apple",
      detail: "One medium apple",
      amountLabel: "3 oz",
      kcal: 95,
      protein: 0,
      carbs: 25,
      fat: 0,
      color: "#DCE3AD",
      glyph: "fruit",
    },
    {
      id: "log_seed_7",
      meal: "Snacks",
      time: "4:15 PM",
      foodId: "cottage-cheese",
      name: "Cottage cheese",
      detail: "Low-fat, black pepper",
      amountLabel: "6 oz",
      kcal: 180,
      protein: 22,
      carbs: 12,
      fat: 4,
      color: "#E4E4D2",
      glyph: "bowl",
    },
  ];
}

export function createSeedState() {
  return {
    version: 1,
    day: todayISO(),
    member: MEMBER,
    targets: TARGETS,
    logs: seedLogs(),
    water: 5,
    weights: seedWeights(),
    proteinHistory: [171, 168, 166, 165, 164, 160, 124],
    streak: 11,
    bestStreak: 18,
    aiUsage: { date: todayISO(), used: 1, limit: 3 },
    planPrefs: { goal: "Strength cut", days: "3", diet: "High protein" },
    plan: structuredClone(DEMO_PLAN),
    planSavedAt: null,
  };
}

export function loadState() {
  let saved = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) saved = JSON.parse(raw);
  } catch {
    saved = null;
  }

  const seed = createSeedState();
  if (!saved || typeof saved !== "object" || saved.version !== 1) {
    return seed;
  }

  const state = {
    ...seed,
    ...saved,
    member: { ...MEMBER, ...(saved.member || {}) },
    targets: { ...TARGETS, ...(saved.targets || {}) },
    aiUsage: { ...seed.aiUsage, ...(saved.aiUsage || {}) },
    planPrefs: { ...seed.planPrefs, ...(saved.planPrefs || {}) },
  };

  if (!Array.isArray(state.logs)) state.logs = seed.logs;
  if (!Array.isArray(state.weights) || state.weights.length < 2) state.weights = seed.weights;
  if (!Array.isArray(state.proteinHistory)) state.proteinHistory = seed.proteinHistory;
  if (!state.plan || !Array.isArray(state.plan.days)) state.plan = seed.plan;

  // A demo should open on a complete day. Roll the seed forward on a new date
  // without touching the member's saved plan or weight trend.
  if (state.day !== todayISO()) {
    state.day = todayISO();
    state.logs = seed.logs;
    state.water = 5;
    state.streak = Math.max(state.streak || 0, 1);
    state.aiUsage = { date: todayISO(), used: 0, limit: 3 };
  }

  if (state.aiUsage.date !== todayISO()) {
    state.aiUsage = { date: todayISO(), used: 0, limit: 3 };
  }

  return state;
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in private mode; the demo still works in memory.
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

export function totalsFor(logs) {
  const totals = logs.reduce(
    (sum, log) => {
      sum.kcal += Number(log.kcal) || 0;
      sum.protein += Number(log.protein) || 0;
      sum.carbs += Number(log.carbs) || 0;
      sum.fat += Number(log.fat) || 0;
      return sum;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
  totals.kcal = Math.round(totals.kcal);
  totals.protein = Math.round(totals.protein);
  totals.carbs = Math.round(totals.carbs);
  totals.fat = Math.round(totals.fat);
  return totals;
}

export function shortDate(iso, opts = {}) {
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day, 12);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...opts,
  });
}

export function ageLabel(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const then = new Date(year, month - 1, day, 12).getTime();
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const days = Math.max(0, Math.round((now.getTime() - then) / MS_DAY));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export { STORAGE_KEY };
