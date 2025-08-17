import React from "react";

type Item = { label: string; icon: React.ReactNode; href?: string };

const primary: Item[] = [
  { label: "Home",       icon: <span role="img" aria-label="home">🏠</span> },
  { label: "Plan Meals", icon: <span role="img" aria-label="leaf">🥗</span> },
  { label: "Saved Meals",icon: <span role="img" aria-label="disk">💾</span> },
  { label: "Profile",    icon: <span role="img" aria-label="person">👤</span> },
];

const secondary: Item[] = [
  { label: "Settings", icon: <span role="img" aria-label="gear">⚙️</span> },
  { label: "Logout",   icon: <span role="img" aria-label="lock">🔒</span> },
];

export default function Sidebar() {
  return (
    <aside className="sb">
      <div className="sb__title">Meal Planner</div>

      <nav className="sb__section">
        {primary.map((it) => (
          <a key={it.label} href="#" className="sb__item">
            <span className="sb__icon">{it.icon}</span>
            <span>{it.label}</span>
          </a>
        ))}
      </nav>

      <hr className="sb__line" />

      <nav className="sb__section">
        {secondary.map((it) => (
          <a key={it.label} href="#" className="sb__item">
            <span className="sb__icon">{it.icon}</span>
            <span>{it.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}