// src/utils/savedMeals.ts
export type SavedMeal = {
  id: string;
  title: string;
  img: string;
  url?: string;        // keep recipe/source link
  tag?: string;
  time?: string;
  calories?: number;
  carbs?: number;
  fiber?: number;
  createdAt?: number;  // for ordering (newest first)
};

const KEY = "mp_saved_meals_v2";
const MAX_ITEMS = 500;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

function normalize(list: SavedMeal[]): SavedMeal[] {
  const map = new Map<string, SavedMeal>();
  for (const m of list) {
    if (!m || !m.id || !m.title || !m.img) continue;
    map.set(m.id, { ...m, createdAt: m.createdAt ?? Date.now() });
  }
  return Array.from(map.values()).sort((a, b) => (b.createdAt! - a.createdAt!));
}

export function loadSavedMeals(): SavedMeal[] {
  return normalize(safeParse<SavedMeal[]>(localStorage.getItem(KEY)) || []);
}

function write(items: SavedMeal[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ITEMS))); } catch {}
}

export function saveMeal(m: SavedMeal) {
  const items = loadSavedMeals().filter(x => x.id !== m.id);
  items.unshift({ ...m, createdAt: Date.now() });
  write(items);
}

export function removeMeal(id: string) {
  write(loadSavedMeals().filter((m) => m.id !== id));
}

export function clearMeals() {
  try { localStorage.removeItem(KEY); } catch {}
}