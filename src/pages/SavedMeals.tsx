import React from "react";
import Sidebar from "../components/Sidebar";
import MealCard from "../components/MealCard";

import imgDinner from "../assets/Herb Chicken with veggies.png";
import imgLunch from "../assets/Mixed green with protein.png";
import imgBreakfast from "../assets/Avocado Toast.png";
import imgSnack from "../assets/Saved Meals.png"; // placeholder icon, swap later

type Saved = {
  id: string;
  title: string;
  tag: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  time: string;   // e.g., "25 min"
  calories: number;
  img: string;
};

const savedMeals: Saved[] = [
  { id: "1", title: "Herb Chicken and Veggies", tag: "Dinner", time: "25 min", calories: 350, img: imgDinner },
  { id: "2", title: "Mixed green with proteins", tag: "Lunch",  time: "15 min", calories: 500, img: imgLunch },
  { id: "3", title: "Avocado Toast",            tag: "Breakfast", time: "10 min", calories: 280, img: imgBreakfast },
  { id: "4", title: "Greek Yogurt & Berries",   tag: "Snack",  time: "5 min",  calories: 190, img: imgSnack },
];

export default function SavedMeals() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <main className="content">
        <h2 className="page-title">Saved Meals</h2>
        <p className="page-subtitle">Your favorite meals, all in one place.</p>

        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
          }}
        >
          {savedMeals.map((m) => (
            <div
              key={m.id}
              className="rounded-xl bg-white"
              style={{ padding: 16, boxShadow: "0 1px 2px rgba(16,24,40,.06)" }}
            >
              <MealCard img={m.img} title={m.title} />
              <div style={{ marginTop: 8, fontSize: 14, color: "#374151" }}>
                <div>Tag: <strong>{m.tag}</strong></div>
                <div>Details: {m.time} · {m.calories} cal</div>
              </div>
              <button
                style={{
                  marginTop: 12,
                  borderRadius: 10,
                  padding: "8px 12px",
                  background: "#111827",
                  color: "white",
                  fontSize: 14,
                }}
                onClick={() => alert(`Open details for: ${m.title}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}