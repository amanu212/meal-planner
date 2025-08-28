import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";

// Images you already have in /src/assets
import avocadoImg from "../assets/Avocado Toast.png";
import mixedGreenImg from "../assets/Mixed green with protein.png";
import herbChickenImg from "../assets/Herb Chicken with veggies.png";
import { usePageTitle } from "../hooks/usePageTitle";

type Meal = {
  id: string;
  title: string;
  img: string;
  categories: ("Breakfast" | "Lunch" | "Dinner" | "Low Carb")[];
  ingredients: string[];
  instructions: string[];
};

const ALL_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Low Carb"] as const;

const MEALS: Meal[] = [
  {
    id: "avocado-toast",
    title: "Avocado Toast",
    img: avocadoImg,
    categories: ["Breakfast", "Low Carb"],
    ingredients: [
      "2 slices whole-grain bread, toasted",
      "1 ripe avocado",
      "Salt & pepper to taste",
      "Optional: chili flakes, lemon juice",
    ],
    instructions: [
      "Mash avocado with a pinch of salt & pepper.",
      "Spread on toast; add lemon juice or chili flakes if you like.",
      "Serve immediately.",
    ],
  },
  {
    id: "mixed-green",
    title: "Mixed green with proteins",
    img: mixedGreenImg,
    categories: ["Lunch", "Low Carb"],
    ingredients: [
      "2 cups mixed greens",
      "1/2 cup grilled chicken or tofu",
      "Cherry tomatoes, sliced cucumbers",
      "Olive oil, lemon, salt & pepper",
    ],
    instructions: [
      "Toss greens with tomatoes & cucumbers.",
      "Add protein of choice.",
      "Dress with olive oil, lemon, salt & pepper.",
    ],
  },
  {
    id: "herb-chicken",
    title: "Herb Chicken and Veggies",
    img: herbChickenImg,
    categories: ["Dinner"],
    ingredients: [
      "2 chicken breasts",
      "1 cup mixed veggies (zucchini, peppers, carrots)",
      "1 tbsp olive oil",
      "1 tsp mixed herbs, salt & pepper",
    ],
    instructions: [
      "Preheat grill or skillet to medium-high.",
      "Season chicken & veggies with oil, herbs, salt & pepper.",
      "Cook chicken 4–6 min per side; sauté/roast veggies until tender.",
      "Serve hot.",
    ],
  },
];

export default function PlanMeals() {
    usePageTitle("Plan Meals");
  // Search + filters
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // Which meal is selected for the right-side detail panel
  const [selectedId, setSelectedId] = useState<string | null>(MEALS[0].id);

  // Filtered + searched meals
  const filteredMeals = useMemo(() => {
    let res = MEALS;

    if (activeFilters.length) {
      res = res.filter((m) =>
        activeFilters.every((f) => m.categories.includes(f as any))
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    return res;
  }, [query, activeFilters]);

  // Ensure selected stays valid when filters/search change
  const selectedMeal =
    filteredMeals.find((m) => m.id === selectedId) || filteredMeals[0] || null;

  // If nothing matches, clear selection
  if (selectedMeal && selectedMeal.id !== selectedId) {
    setSelectedId(selectedMeal.id);
  }

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <Sidebar />
      </aside>

      {/* Main content */}
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
                >
                  {cat} {active ? "×" : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-column content area */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 560px) 1fr",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* Left: Meal cards grid */}
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
                  >
                    <img
                      src={m.img}
                      alt={m.title}
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

          {/* Right: Details panel */}
          <section>
            {selectedMeal ? (
              <div>
                <img
                  src={selectedMeal.img}
                  alt={selectedMeal.title}
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

                <div style={{ display: "grid", gap: 16, marginTop: 12 }}>
                  <div>
                    <h4 style={{ marginBottom: 8 }}>Ingredient List</h4>
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {selectedMeal.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ marginBottom: 8 }}>Instructions</h4>
                    <ol style={{ paddingLeft: 18, margin: 0 }}>
                      {selectedMeal.instructions.map((step, i) => (
                        <li key={i} style={{ marginBottom: 6 }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
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