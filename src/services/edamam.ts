// src/services/edamam.ts
import { httpGet } from "./http";
import type { Meal } from "../types/meal";

const APP_ID  = import.meta.env.VITE_EDAMAM_APP_ID as string | undefined;
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY as string | undefined;
const BASE = "https://api.edamam.com/api/recipes/v2";

type Nutrients = Record<string, { quantity: number }>;
type Hit = {
  recipe: {
    uri: string; label: string; image: string; url: string;
    cuisineType?: string[]; healthLabels?: string[];
    ingredientLines: string[];
    totalNutrients?: Nutrients;
    yield?: number;
  };
};
type Resp = { hits: Hit[] };

const perServing = (n?: number, s?: number) => (!n || !s ? undefined : n / s);

export async function edamamSearch(
  q: string,
  opts?: { lowCarb?: boolean; highFiber?: boolean; lowGlycemic?: boolean }
): Promise<Meal[]> {
  if (!q?.trim()) return [];
  if (!APP_ID || !APP_KEY) return []; // gracefully skip if no creds

  const query: Record<string, any> = {
    type: "public",
    q,
    app_id: APP_ID,
    app_key: APP_KEY,
  };
  if (opts?.lowCarb) query.diet = "low-carb";
  if (opts?.lowGlycemic) query.health = "low-glycemic";
  if (opts?.highFiber) query["nutrients[FIBTG][gte]"] = 5;

  const data = await httpGet<Resp>(BASE, { query });
  return data.hits.map(({ recipe }) => {
    const n = recipe.totalNutrients || {};
    const s = recipe.yield ?? 1;
    return {
      id: recipe.uri,
      title: recipe.label,
      image: recipe.image,
      source: "edamam",
      url: recipe.url,
      cuisine: recipe.cuisineType?.[0],
      tags: recipe.healthLabels ?? [],
      ingredients: recipe.ingredientLines,
      calories: perServing(n.ENERC_KCAL?.quantity, s),
      carbs:    perServing(n.CHOCDF?.quantity, s),
      protein:  perServing(n.PROCNT?.quantity, s),
      fat:      perServing(n.FAT?.quantity, s),
      fiber:    perServing(n.FIBTG?.quantity, s),
    };
  });
}