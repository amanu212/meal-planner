// src/pages/SavedMeals.tsx
import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MealCard from "../components/MealCard";
import { usePageTitle } from "../hooks/usePageTitle";

type Saved = {
  id: string;
  title: string;
  tag: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  time: string;        // e.g., "25 min"
  calories: number;    // e.g., 350
  img: string;         // can be imported asset path or remote URL
};

const STORAGE_KEY = "mp_saved_v1";

function loadSaved(): Saved[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved[]) : [];
  } catch {
    return [];
  }
}

export default function SavedMeals() {
  usePageTitle("Saved Meals");

  const [saved, setSaved] = React.useState<Saved[]>(() => loadSaved());

  // persist on change
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [saved]);

  const remove = (id: string) => setSaved((s) => s.filter((m) => m.id !== id));
  const clearAll = () => {
    if (confirm("Remove all saved meals?")) setSaved([]);
  };

  const isEmpty = saved.length === 0;

  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <main className="content">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 className="page-title" style={{ marginBottom: 0 }}>
            Saved Meals
          </h2>
          <span
            style={{
              background: "#eef2ff",
              color: "#3730a3",
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {saved.length}
          </span>

          {!isEmpty && (
            <button
              onClick={clearAll}
              style={{
                marginLeft: "auto",
                borderRadius: 10,
                padding: "8px 12px",
                background: "#fee2e2",
                color: "#991b1b",
                fontWeight: 700,
              }}
            >
              Clear all
            </button>
          )}
        </div>

        <p className="page-subtitle">Your favorite meals, all in one place.</p>

        {isEmpty ? (
          <div
            style={{
              marginTop: 20,
              border: "1px dashed #d1d5db",
              borderRadius: 16,
              padding: 24,
              background: "#f9fafb",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: 12 }}>
              You haven’t saved any meals yet.
            </p>
            <Link
              to="/plan"
              style={{
                background: "#111827",
                color: "white",
                padding: "10px 14px",
                borderRadius: 12,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Plan a meal
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 24,
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            }}
          >
            {saved.map((m) => (
              <div
                key={m.id}
                className="rounded-xl bg-white"
                style={{
                  padding: 16,
                  boxShadow: "0 1px 2px rgba(16,24,40,.06)",
                }}
              >
                <MealCard img={m.img} title={m.title} />
                <div style={{ marginTop: 8, fontSize: 14, color: "#374151" }}>
                  <div>
                    Tag: <strong>{m.tag}</strong>
                  </div>
                  <div>
                    Details: {m.time} · {m.calories} cal
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    style={{
                      borderRadius: 10,
                      padding: "8px 12px",
                      background: "#111827",
                      color: "white",
                      fontSize: 14,
                      fontWeight: 700,
                      flex: "0 0 auto",
                    }}
                    onClick={() => alert(`Open details for: ${m.title}`)}
                  >
                    View Details
                  </button>
                  <button
                    style={{
                      borderRadius: 10,
                      padding: "8px 12px",
                      background: "#f3f4f6",
                      color: "#111827",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                    onClick={() => remove(m.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}