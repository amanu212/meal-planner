// src/services/recipes.ts
import type { Meal } from "../types/meal";
import { mealdbSearchByName } from "./mealdb";
import { edamamSearch } from "./edamam";

export async function searchMeals(
  q: string,
  filters?: { lowCarb?: boolean; highFiber?: boolean; lowGlycemic?: boolean }
): Promise<Meal[]> {
  const [a, b] = await Promise.allSettled([
    mealdbSearchByName(q),
    edamamSearch(q, filters),
  ]);

  const results: Meal[] = [];
  if (a.status === "fulfilled") results.push(...a.value);
  if (b.status === "fulfilled") results.push(...b.value);

  const seen = new Set<string>();
  return results.filter((m) => {
    const k = `${m.title.toLowerCase()}|${m.source}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}