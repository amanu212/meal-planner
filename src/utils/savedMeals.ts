// src/utils/savedMeals.ts
export type SavedMeal = {
  id: string;                 // unique id (e.g., slug or title)
  title: string;
  tag: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  time: string;               // "25 min"
  calories: number;           // 350
  img: string;                // asset path or URL
};

export const SAVED_KEY = "mp_saved_v1";

export function loadSaved(): SavedMeal[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveMeal(meal: SavedMeal) {
  const list = loadSaved();
  // avoid duplicates by id
  if (!list.some((m) => m.id === meal.id)) {
    list.unshift(meal); // put newest first
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  }
}

export function removeMeal(id: string) {
  const list = loadSaved().filter((m) => m.id !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(list));
}

export function clearSaved() {
  localStorage.removeItem(SAVED_KEY);
}