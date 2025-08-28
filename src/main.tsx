// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

/** ---------- Demo seed (optional, safe) ---------- */
(function seedDemoSaved() {
  const key = "mp_saved_v1";
  if (localStorage.getItem(key)) return; // don't overwrite user data
  const data = [
    {
      id: "seed-1",
      title: "Herb Chicken and Veggies",
      tag: "Dinner",
      time: "25 min",
      calories: 350,
      img: "/src/assets/Herb Chicken with veggies.png",
    },
    {
      id: "seed-2",
      title: "Mixed green with proteins",
      tag: "Lunch",
      time: "15 min",
      calories: 500,
      img: "/src/assets/Mixed green with protein.png",
    },
    {
      id: "seed-3",
      title: "Avocado Toast",
      tag: "Breakfast",
      time: "10 min",
      calories: 280,
      img: "/src/assets/Avocado Toast.png",
    },
  ];
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
})();

/** ---------- Theme bootstrap (matches Settings.tsx) ---------- */
(function bootstrapTheme() {
  type Theme = "light" | "dark" | "system";
  const root = document.documentElement;

  function shouldDark(theme: Theme) {
    if (theme === "dark") return true;
    if (theme === "light") return false;
    // system
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  try {
    const raw = localStorage.getItem("mp_settings_v1");
    const theme: Theme = raw ? (JSON.parse(raw).theme as Theme) : "light";
    root.classList.toggle("dark", shouldDark(theme));
  } catch {
    root.classList.remove("dark");
  }
})();

/** ---------- Mount app ---------- */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);