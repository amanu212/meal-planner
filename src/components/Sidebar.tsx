// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

type NavItem = { to: string; label: string; icon?: string };

const MAIN: NavItem[] = [
  { to: "/dashboard", label: "Home",       icon: "🏠" },
  { to: "/plan",      label: "Plan Meals", icon: "🥗" },
  { to: "/saved",     label: "Saved Meals",icon: "💾" },
  { to: "/profile",   label: "Profile",    icon: "👤" },
];

const SECONDARY: NavItem[] = [
  { to: "/settings",  label: "Settings",   icon: "⚙️" },
  { to: "/logout",    label: "Logout",     icon: "🔒" },
];

export default function Sidebar() {
  // NavLink gives us isActive — append .active for styling
  const link = ({ isActive }: { isActive: boolean }) =>
    "nav-link" + (isActive ? " active" : "");

  return (
    <aside className="sidebar" aria-label="Primary">
      <h2 className="section-title" style={{ marginBottom: 12 }}>Meal Planner</h2>

      <nav className="nav" aria-label="Main">
        {MAIN.map((item) => (
          <NavLink key={item.to} to={item.to} end className={link}>
            <span aria-hidden="true" style={{ marginRight: 8 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <hr style={{ margin: "12px 0", border: 0, height: 1, background: "#e5e7eb" }} />

      <nav className="nav" aria-label="Secondary">
        {SECONDARY.map((item) => (
          <NavLink key={item.to} to={item.to} end className={link}>
            <span aria-hidden="true" style={{ marginRight: 8 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}