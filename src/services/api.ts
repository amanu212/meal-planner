// src/services/api.ts
const MEALDB = "https://www.themealdb.com/api/json/v1/1";
const EDAMAM_APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;

export type RemoteMeal = {
  id: string;
  title: string;
  image: string;
  category?: string;
  area?: string;
  instructions?: string;
  ingredients: string[]; // e.g. ["2 eggs", "50g cheese"]
};

export type Nutrition = {
  calories: number;
  carbs: number;     // grams
  fiber?: number;    // grams
};

// ────────────────────────────────────────────────────────────────
// Helpers to parse TheMealDB's joined fields (strIngredientX/strMeasureX)
// ────────────────────────────────────────────────────────────────
function parseMealDBItem(m: any): RemoteMeal {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = (m[`strIngredient${i}`] || "").trim();
    const meas = (m[`strMeasure${i}`] || "").trim();
    if (!ing) continue;
    // combine measure + ingredient into a single line
    ingredients.push([meas, ing].filter(Boolean).join(" ").trim());
  }
  return {
    id: String(m.idMeal),
    title: m.strMeal,
    image: m.strMealThumb,
    category: m.strCategory || undefined,
    area: m.strArea || undefined,
    instructions: m.strInstructions || undefined,
    ingredients,
  };
}

// ────────────────────────────────────────────────────────────────
// TheMealDB: search by name
// ────────────────────────────────────────────────────────────────
export async function searchMeals(term: string): Promise<RemoteMeal[]> {
  const r = await fetch(`${MEALDB}/search.php?s=${encodeURIComponent(term)}`);
  const json = await r.json();
  const meals = (json.meals || []) as any[];
  return meals.map(parseMealDBItem);
}

// Optional: Lookup by id (useful when you deep-link with id)
export async function lookupMealById(id: string): Promise<RemoteMeal | null> {
  const r = await fetch(`${MEALDB}/lookup.php?i=${encodeURIComponent(id)}`);
  const json = await r.json();
  const meals = (json.meals || []) as any[];
  if (!meals.length) return null;
  return parseMealDBItem(meals[0]);
}

// ────────────────────────────────────────────────────────────────
// Edamam Nutrition Analysis (per recipe). Gracefully returns null
// if keys are missing or the request fails.
// ────────────────────────────────────────────────────────────────
export async function analyzeNutrition(ingrLines: string[]): Promise<Nutrition | null> {
  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) return null;
  const url =
    `https://api.edamam.com/api/nutrition-details?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingr: ingrLines }),
  });

  if (!r.ok) return null;

  const j = await r.json();
  return {
    calories: Math.round(j.calories ?? 0),
    carbs: Math.round(j.totalNutrients?.CHOCDF?.quantity ?? 0),
    fiber: j.totalNutrients?.FIBTG?.quantity != null
      ? Math.round(j.totalNutrients.FIBTG.quantity)
      : undefined,
  };
}