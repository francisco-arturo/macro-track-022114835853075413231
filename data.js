const STORAGE_KEY = "fitcode.macro-track.es.v1";
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
  memberSince: "Septiembre 2026",
  coach: "Elena Ruiz",
  goal: "Recomposición",
};

export const FOODS = [
  {
    id: "greek-yogurt-bowl",
    name: "Bol de yogur griego",
    detail: "Yogur, arándanos, granola",
    servingOz: 8,
    handLabel: "1 mano ahuecada",
    handPlural: "manos ahuecadas",
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
    name: "Pollo a la parrilla",
    detail: "Pechuga sazonada, a la parrilla",
    servingOz: 4,
    handLabel: "1 palma",
    handPlural: "palmas",
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
    name: "Arroz jazmín",
    detail: "Cocido, con un poco de sal",
    servingOz: 6,
    handLabel: "1 puño",
    handPlural: "puños",
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
    name: "Salmón al horno",
    detail: "Filete central",
    servingOz: 5,
    handLabel: "1 palma",
    handPlural: "palmas",
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
    name: "Batata al horno",
    detail: "Aceite de oliva, sal en escamas",
    servingOz: 5,
    handLabel: "1 puño",
    handPlural: "puños",
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
    name: "Batido de proteína",
    detail: "Dos scoops, con agua",
    servingOz: 12,
    handLabel: "1 batido",
    handPlural: "batidos",
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
    name: "Requesón",
    detail: "Bajo en grasa, con pimienta",
    servingOz: 6,
    handLabel: "1 mano ahuecada",
    handPlural: "manos ahuecadas",
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
    name: "Manzana Honeycrisp",
    detail: "Una manzana mediana",
    servingOz: 3,
    handLabel: "1 puño",
    handPlural: "puños",
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
    name: "Huevos enteros",
    detail: "Tres huevos revueltos",
    servingOz: 3,
    handLabel: "1 palma",
    handPlural: "palmas",
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
    name: "Almendras",
    detail: "Tostadas, sin sal",
    servingOz: 1,
    handLabel: "1 pulgar",
    handPlural: "pulgares",
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
    name: "Aceite de oliva",
    detail: "Virgen extra",
    servingOz: 0.5,
    handLabel: "1 pulgar",
    handPlural: "pulgares",
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
    name: "Tostada de masa madre",
    detail: "Una rebanada gruesa",
    servingOz: 2,
    handLabel: "1 puño",
    handPlural: "puños",
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
    label: "Día 1",
    focus: "Fuerza inferior",
    meals: [
      {
        slot: "Desayuno",
        name: "Avena con proteína",
        description: "Avena, proteína, arándanos, mantequilla de almendra",
        kcal: 520,
        protein: 42,
        carbs: 62,
        fat: 12,
      },
      {
        slot: "Almuerzo",
        name: "Bol de pollo y arroz",
        description: "Pollo, arroz jazmín, pepino, chili crujiente",
        kcal: 610,
        protein: 48,
        carbs: 64,
        fat: 16,
      },
      {
        slot: "Merienda",
        name: "Requesón con piña",
        description: "Requesón, piña, canela",
        kcal: 210,
        protein: 24,
        carbs: 16,
        fat: 4,
      },
      {
        slot: "Cena",
        name: "Salmón al horno",
        description: "Salmón, papas pequeñas, brócoli, limón",
        kcal: 720,
        protein: 48,
        carbs: 58,
        fat: 28,
      },
    ],
  },
  {
    label: "Día 2",
    focus: "Fuerza superior",
    meals: [
      {
        slot: "Desayuno",
        name: "Huevos con masa madre",
        description: "Tres huevos, masa madre, aguacate, tomate",
        kcal: 480,
        protein: 32,
        carbs: 34,
        fat: 22,
      },
      {
        slot: "Almuerzo",
        name: "Wrap de pavo",
        description: "Pavo, col con yogur griego, espinaca, tortilla",
        kcal: 560,
        protein: 44,
        carbs: 52,
        fat: 18,
      },
      {
        slot: "Merienda",
        name: "Batido con plátano",
        description: "Proteína, plátano, leche de avena",
        kcal: 300,
        protein: 32,
        carbs: 36,
        fat: 4,
      },
      {
        slot: "Cena",
        name: "Bistec con batata",
        description: "Bistec de falda, batata asada, judías verdes",
        kcal: 700,
        protein: 52,
        carbs: 55,
        fat: 26,
      },
    ],
  },
  {
    label: "Día 3",
    focus: "Acondicionamiento",
    meals: [
      {
        slot: "Desayuno",
        name: "Yogur griego crujiente",
        description: "Yogur griego, frutos rojos, granola, miel",
        kcal: 450,
        protein: 38,
        carbs: 48,
        fat: 10,
      },
      {
        slot: "Almuerzo",
        name: "Bol de salmón y granos",
        description: "Salmón, farro, verduras, tahini y limón",
        kcal: 640,
        protein: 42,
        carbs: 60,
        fat: 24,
      },
      {
        slot: "Merienda",
        name: "Cecina con manzana",
        description: "Cecina de pavo, manzana Honeycrisp",
        kcal: 230,
        protein: 24,
        carbs: 22,
        fat: 4,
      },
      {
        slot: "Cena",
        name: "Pasta con pollo y pesto",
        description: "Pollo, rigatoni, pesto, tomates cherry",
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
  title: "Bloque de fuerza de 3 días",
  subtitle: "Ajustado a 2,150 kcal y 165 g de proteína",
  source: "demo",
  days: PLAN_DAYS,
  grocery: [
    "Pechuga de pollo, 1 kg",
    "Salmón, 700 g",
    "Bistec de falda, 500 g",
    "Huevos, 12",
    "Yogur griego, 900 g",
    "Requesón, 450 g",
    "Proteína de suero",
    "Avena",
    "Arroz jazmín",
    "Batatas, 2",
    "Arándanos y piña",
    "Masa madre y tortillas",
    "Brócoli y judías verdes",
    "Aguacate y plátanos",
    "Aceite de oliva y mantequilla de almendra",
    "Pesto, tahini y limón",
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
      meal: "Desayuno",
      time: "7:35",
      foodId: "greek-yogurt-bowl",
      name: "Bol de yogur griego",
      detail: "Yogur, arándanos, granola",
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
      meal: "Almuerzo",
      time: "12:20",
      foodId: "grilled-chicken",
      name: "Pollo a la parrilla",
      detail: "Pechuga sazonada, a la parrilla",
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
      meal: "Almuerzo",
      time: "12:20",
      foodId: "jasmine-rice",
      name: "Arroz jazmín",
      detail: "Cocido, con un poco de sal",
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
      meal: "Almuerzo",
      time: "12:20",
      foodId: "olive-oil",
      name: "Aceite de oliva",
      detail: "Virgen extra",
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
      meal: "Meriendas",
      time: "15:05",
      foodId: "protein-shake",
      name: "Batido de proteína",
      detail: "Dos scoops, con agua",
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
      meal: "Meriendas",
      time: "15:05",
      foodId: "apple",
      name: "Manzana Honeycrisp",
      detail: "Una manzana mediana",
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
      meal: "Meriendas",
      time: "16:15",
      foodId: "cottage-cheese",
      name: "Requesón",
      detail: "Bajo en grasa, con pimienta",
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
    planPrefs: { goal: "Definición", days: "3", diet: "Alta proteína" },
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
    // El almacenamiento puede no estar disponible en modo privado; la demo sigue en memoria.
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // No hay nada que borrar.
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
  return d.toLocaleDateString("es-US", {
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
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

export { STORAGE_KEY };
