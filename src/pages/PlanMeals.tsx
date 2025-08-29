// src/pages/PlanMeals.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { usePageTitle } from "../hooks/usePageTitle";
import { saveMeal, type SavedMeal } from "../utils/savedMeals";

import avocadoImg from "../assets/Avocado Toast.png";
import mixedGreenImg from "../assets/Mixed green with protein.png";
import herbChickenImg from "../assets/Herb Chicken with veggies.png";

import { searchMeals } from "../services/recipes";
import type { Meal as ApiMeal } from "../types/meal";

// Local seed meal type (now includes url + optional nutrition for API carry-over)
type LocalMeal = {
  id: string;
  title: string;
  img: string;
  categories: ("Breakfast" | "Lunch" | "Dinner" | "Low Carb")[];
  time?: string;      // e.g. "10 min"
  calories?: number;  // per serving
  carbs?: number;     // g per serving
  fiber?: number;     // g per serving
  tag?: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  url?: string;       // source link (Edamam/MealDB)
  ingredients: string[];
  steps: string[];
};

const MEAL_TYPE_TAGS = ["Breakfast", "Lunch", "Dinner", "Low Carb"] as const;
const EXTRA_API_FILTERS = ["High Fiber", "Low GI"] as const;
const ALL_CATEGORIES = [...MEAL_TYPE_TAGS, ...EXTRA_API_FILTERS] as const;

const MEALS: LocalMeal[] = [
  {
    id: "avocado-toast",
    title: "Avocado Toast",
    img: avocadoImg,
    categories: ["Breakfast", "Low Carb"],
    time: "10 min",
    calories: 280,
    tag: "Breakfast",
    ingredients: [
      "1 slice whole-grain bread",
      "1/2 ripe avocado",
      "1 egg (optional)",
      "Pinch of salt & pepper",
      "Squeeze of lemon (optional)",
    ],
    steps: [
      "Toast the bread to your liking.",
      "Mash avocado; season with salt, pepper, and lemon.",
      "Spread on toast. Top with a fried or poached egg, if using.",
      "Serve immediately.",
    ],
  },
  {
    id: "mixed-green",
    title: "Mixed green with proteins",
    img: mixedGreenImg,
    categories: ["Lunch", "Low Carb"],
    time: "15 min",
    calories: 500,
    tag: "Lunch",
    ingredients: [
      "2 cups mixed greens",
      "1/2 cup cooked chicken or chickpeas",
      "1/4 avocado, sliced",
      "A handful of cherry tomatoes, halved",
      "2 tbsp vinaigrette (olive oil + lemon)",
      "Salt & pepper to taste",
    ],
    steps: [
      "Add greens to a bowl and toss with vinaigrette.",
      "Top with protein, avocado, and tomatoes.",
      "Season to taste and serve.",
    ],
  },
  {
    id: "herb-chicken",
    title: "Herb Chicken and Veggies",
    img: herbChickenImg,
    categories: ["Dinner"],
    time: "25 min",
    calories: 350,
    tag: "Dinner",
    ingredients: [
      "1 chicken breast",
      "1 cup mixed veggies (zucchini, carrots, peppers)",
      "1 tbsp olive oil",
      "1 tsp mixed dried herbs (oregano, thyme)",
      "Salt & pepper",
    ],
    steps: [
      "Season chicken with herbs, salt, and pepper.",
      "Sauté chicken in olive oil 4–5 min per side until cooked through.",
      "In the same pan, sauté veggies until tender-crisp.",
      "Plate chicken with veggies and serve.",
    ],
  },
];

export default function PlanMeals() {
  usePageTitle("Plan Meals");
  const location = useLocation();

  // Search (debounced) + API state
  const [qInput, setQInput] = useState("");      // user typing
  const [query, setQuery] = useState("");        // debounced value
  const [apiMeals, setApiMeals] = useState<ApiMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters + selection + toast
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(MEALS[0].id);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  // Debounce qInput → query
  useEffect(() => {
    const t = setTimeout(() => setQuery(qInput.trim()), 250);
    return () => clearTimeout(t);
  }, [qInput]);

  // Preselect from /plan?id=<mealId> (and support router state { selectId })
  useEffect(() => {
    const queryId = new URLSearchParams(location.search).get("id");
    const stateId = (location.state as any)?.selectId as string | undefined;
    const wanted = queryId || stateId;
    if (wanted && MEALS.some((m) => m.id === wanted)) {
      setSelectedId(wanted);
    }
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch from BOTH APIs when query changes
  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError(null);
      setLoading(true);
      try {
        const res = await searchMeals(query, {
          lowCarb: activeFilters.includes("Low Carb"),
          highFiber: activeFilters.includes("High Fiber"),
          lowGlycemic: activeFilters.includes("Low GI"),
        });
        if (!cancelled) setApiMeals(res);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to fetch meals");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (query) run();
    else setApiMeals([]);
    return () => { cancelled = true; };
  }, [query, activeFilters]);

  // Apply filters to local seeds only (API-only chips should NOT affect locals)
  const filteredLocalMeals = useMemo(() => {
    const localFilters = activeFilters.filter((f) =>
      (MEAL_TYPE_TAGS as readonly string[]).includes(f)
    );
    let res = MEALS;
    if (localFilters.length) {
      res = res.filter((m) =>
        localFilters.every((f) => m.categories.includes(f as any))
      );
    }
    return res;
  }, [activeFilters]);

  // Adapt API meals -> LocalMeal shape (carry nutrition + URL if available)
  const adaptedApiMeals: LocalMeal[] = useMemo(() => {
    return apiMeals.map((m) => ({
      id: m.id,
      title: m.title,
      img: m.image,
      categories: ["Lunch"], // placeholder; APIs don't map to our UI categories
      time: "—",
      calories: typeof m.calories === "number" ? Math.round(m.calories) : undefined,
      carbs: typeof m.carbs === "number" ? Math.round(m.carbs) : undefined,
      fiber: typeof m.fiber === "number" ? Math.round(m.fiber) : undefined,
      tag: "Snack",
      ingredients: m.ingredients ?? [],
      steps: m.instructions ?? [], // Edamam often has none
      url: m.url,                  // <- carry through source link
    }));
  }, [apiMeals]);

  // Decide which list to show: API results when searching, otherwise local seeds
  const results: LocalMeal[] = query ? adaptedApiMeals : filteredLocalMeals;

  // Keep a valid selection as results change
  useEffect(() => {
    if (results.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!results.find((m) => m.id === selectedId)) {
      setSelectedId(results[0].id);
    }
  }, [results, selectedId]);

  const selectedMeal = results.find((m) => m.id === selectedId) || null;

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const onSave = () => {
    if (!selectedMeal) return;
    const payload: SavedMeal = {
      id: selectedMeal.id,
      title: selectedMeal.title,
      tag: selectedMeal.tag,
      url: selectedMeal.url,
      time: selectedMeal.time,
      calories: selectedMeal.calories,
      carbs: selectedMeal.carbs,
      fiber: selectedMeal.fiber,
      img: selectedMeal.img,
    };
    saveMeal(payload);
    setSavedMsg("Added to Saved Meals");
    setTimeout(() => setSavedMsg(null), 1600);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <main className="content">
        <h2 className="page-title" style={{ textAlign: "center" }}>
          Plan your Meals
        </h2>
        <p style={{ textAlign: "center", marginTop: -8, marginBottom: 24, fontWeight: 600 }}>
          Choose ingredients or meal types to build your plan
        </p>

        {/* Search + Filters */}
        <div style={{ maxWidth: 680, margin: "0 auto 16px auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#eee",
              padding: "10px 14px",
              borderRadius: 24,
            }}
          >
            <span role="img" aria-label="search">🔎</span>
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Search ingredients or meals..."
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 16,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {ALL_CATEGORIES.map((cat) => {
              const active = activeFilters.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleFilter(cat)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: active ? "#2f855a" : "#ccc",
                    background: active ? "#c6f6d5" : "#f1f1f1",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  aria-pressed={active}
                >
                  {cat} {active ? "×" : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 560px) 1fr",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* Left: grid of meals */}
          <section>
            {loading && <p className="muted">Searching…</p>}
            {error && <p className="error">{error}</p>}

            <div
              className="grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 16,
              }}
            >
              {results.map((m) => {
                const isActive = selectedMeal?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    style={{
                      textAlign: "left",
                      padding: 10,
                      borderRadius: 14,
                      background: isActive ? "#e6fffa" : "#f7f7f7",
                      border: isActive ? "2px solid #319795" : "1px solid #eee",
                      cursor: "pointer",
                    }}
                    aria-pressed={isActive}
                  >
                    <img
                      src={m.img}
                      alt={m.title}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 12,
                        display: "block",
                        marginBottom: 8,
                      }}
                    />
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{m.title}</div>
                  </button>
                );
              })}
            </div>

            {results.length === 0 && !loading && !error && (
              <p style={{ marginTop: 16, color: "#666" }}>
                No meals match your search/filters.
              </p>
            )}
          </section>

          {/* Right: details of selected meal */}
          <section style={{ fontSize: 15, lineHeight: 1.7 }}>
            {selectedMeal ? (
              <div>
                <img
                  src={selectedMeal.img}
                  alt={selectedMeal.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    maxWidth: 480,
                    height: "auto",
                    borderRadius: 12,
                    display: "block",
                    margin: "0 auto",
                  }}
                />
                <h3 style={{ textAlign: "center", marginTop: 10 }}>
                  {selectedMeal.title}
                </h3>

                {/* meta chips */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                    marginTop: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {selectedMeal.tag && (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        background: "#f3f4f6",
                        fontWeight: 700,
                      }}
                    >
                      {selectedMeal.tag}
                    </span>
                  )}
                  {selectedMeal.time && (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        background: "#f3f4f6",
                        fontWeight: 700,
                      }}
                    >
                      {selectedMeal.time}
                    </span>
                  )}
                  {typeof selectedMeal.calories === "number" && (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        background: "#f3f4f6",
                        fontWeight: 700,
                      }}
                    >
                      {selectedMeal.calories} cal
                    </span>
                  )}
                  {typeof selectedMeal.carbs === "number" && (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        background: "#f3f4f6",
                        fontWeight: 700,
                      }}
                    >
                      {selectedMeal.carbs} g carbs
                    </span>
                  )}
                  {typeof selectedMeal.fiber === "number" && (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        background: "#f3f4f6",
                        fontWeight: 700,
                      }}
                    >
                      {selectedMeal.fiber} g fiber
                    </span>
                  )}
                </div>

                {/* source link (Edamam often has the full recipe externally) */}
                {selectedMeal.url && (
                  <a
                    href={selectedMeal.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 10,
                      marginBottom: 6,
                      textDecoration: "none",
                      fontWeight: 700,
                      color: "#2563eb",
                    }}
                  >
                    View full recipe →
                  </a>
                )}

                {/* rich content */}
                <div style={{ display: "grid", gap: 16, marginTop: 12 }}>
                  <div>
                    <h4 style={{ marginBottom: 8 }}>Ingredient List</h4>
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {selectedMeal.ingredients.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ marginBottom: 8 }}>Instructions</h4>
                    <ol style={{ paddingLeft: 18, margin: 0 }}>
                      {selectedMeal.steps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSave}
                  style={{
                    marginTop: 12,
                    borderRadius: 12,
                    padding: "10px 14px",
                    background: "#111827",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  Save to Saved Meals
                </button>

                {savedMsg && (
                  <div
                    role="status"
                    style={{
                      marginTop: 8,
                      padding: "8px 12px",
                      background: "#dcfce7",
                      color: "#065f46",
                      borderRadius: 12,
                      fontWeight: 700,
                    }}
                  >
                    {savedMsg}
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: "#666" }}>
                Select a meal from the left to view its details.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}