// src/pages/PlanMeals.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { usePageTitle } from "../hooks/usePageTitle";
import { saveMeal, type SavedMeal } from "../utils/savedMeals";

import avocadoImg from "../assets/Avocado Toast.png";
import mixedGreenImg from "../assets/Mixed green with protein.png";
import herbChickenImg from "../assets/Herb Chicken with veggies.png";

type Meal = {
  id: string;
  title: string;
  img: string;
  categories: ("Breakfast" | "Lunch" | "Dinner" | "Low Carb")[];
  time: string;      // e.g. "10 min"
  calories: number;  // e.g. 280
  tag: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  // NEW: richer content
  ingredients: string[];
  steps: string[];
};

const ALL_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Low Carb"] as const;

const MEALS: Meal[] = [
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

  // Search + filter + selection + save toast
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(MEALS[0].id);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

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

  // Apply filters + search
  const filteredMeals = useMemo(() => {
    let res = MEALS;
    if (activeFilters.length) {
      res = res.filter((m) =>
        activeFilters.every((f) => m.categories.includes(f as any))
      );
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter((m) => m.title.toLowerCase().includes(q));
    }
    return res;
  }, [query, activeFilters]);

  // Keep a valid selection as results change
  useEffect(() => {
    if (filteredMeals.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!filteredMeals.find((m) => m.id === selectedId)) {
      setSelectedId(filteredMeals[0].id);
    }
  }, [filteredMeals, selectedId]);

  const selectedMeal = filteredMeals.find((m) => m.id === selectedId) || null;

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
      time: selectedMeal.time,
      calories: selectedMeal.calories,
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
        <p
          style={{
            textAlign: "center",
            marginTop: -8,
            marginBottom: 24,
            fontWeight: 600,
          }}
        >
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
            <span role="img" aria-label="search">
              🔎
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
            <div
              className="grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 16,
              }}
            >
              {filteredMeals.map((m) => {
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

            {filteredMeals.length === 0 && (
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
                  }}
                >
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
                </div>

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