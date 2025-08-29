import { httpGet } from "./http";
import type { Meal } from "../types/meal";

const BASE = import.meta.env.VITE_MEALDB_BASE || "https://www.themealdb.com/api/json/v1/1";

type MealDBMeal = {
  idMeal: string; strMeal: string; strMealThumb: string;
  strArea?: string; strCategory?: string; strTags?: string | null;
  strInstructions?: string | null;
  [k: `strIngredient${number}`]: string | undefined;
  [k: `strMeasure${number}`]: string | undefined;
};
type SearchResp = { meals: MealDBMeal[] | null };

const mapMeal = (m: MealDBMeal): Meal => {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = m[`strIngredient${i}` as const];
    const meas = m[`strMeasure${i}` as const];
    if (!ing) continue;
    ingredients.push(meas ? `${meas.trim()} ${ing.trim()}` : ing.trim());
  }
  const instructions = m.strInstructions?.split(/\r?\n/).filter(Boolean) ?? [];
  const tags = (m.strTags ?? "").split(",").map(s => s.trim()).filter(Boolean);

  return {
    id: m.idMeal,
    title: m.strMeal,
    image: m.strMealThumb,
    source: "mealdb",
    cuisine: m.strArea || m.strCategory || undefined,
    tags,
    ingredients,
    instructions,
    url: `https://www.themealdb.com/meal/${m.idMeal}`,
  };
};

export async function mealdbSearchByName(q: string): Promise<Meal[]> {
  if (!q?.trim()) return [];
  const data = await httpGet<SearchResp>(`${BASE}/search.php`, { query: { s: q } });
  return (data.meals ?? []).map(mapMeal);
}