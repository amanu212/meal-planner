// src/pages/SavedMeals.tsx
import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MealCard from "../components/MealCard";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  loadSavedMeals,
  removeMeal,
  clearMeals,
  type SavedMeal,
} from "../utils/savedMeals";

const Chip: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span
    style={{
      borderRadius: 999,
      padding: "6px 10px",
      background: "#f3f4f6",
      fontWeight: 700,
      fontSize: 12,
    }}
  >
    {children}
  </span>
);

export default function SavedMeals() {
  usePageTitle("Saved Meals");

  const [saved, setSaved] = React.useState<SavedMeal[]>(() => loadSavedMeals());

  const onRemove = (id: string) => {
    removeMeal(id);
    setSaved(loadSavedMeals());
  };

  const onClearAll = () => {
    if (confirm("Remove all saved meals?")) {
      clearMeals();
      setSaved([]);
    }
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
              onClick={onClearAll}
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

                {/* Chips / badges */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 8,
                    alignItems: "center",
                  }}
                >
                  {m.tag && <Chip>{m.tag}</Chip>}
                  {m.time && <Chip>{m.time}</Chip>}
                  {typeof m.calories === "number" && (
                    <Chip>{Math.round(m.calories)} cal</Chip>
                  )}
                  {typeof m.carbs === "number" && (
                    <Chip>{Math.round(m.carbs)} g carbs</Chip>
                  )}
                  {typeof m.fiber === "number" && (
                    <Chip>{Math.round(m.fiber)} g fiber</Chip>
                  )}
                </div>

                {/* Source link if available */}
                {m.url && (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      fontWeight: 700,
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                  >
                    Open recipe →
                  </a>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    style={{
                      borderRadius: 10,
                      padding: "8px 12px",
                      background: "#f3f4f6",
                      color: "#111827",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                    onClick={() => onRemove(m.id)}
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