// src/pages/Settings.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

type Theme = "light" | "dark" | "system";
type Units = "metric" | "imperial";

type SettingsData = {
  theme: Theme;
  units: Units;
  timezone: string;
  // Notifications
  notifyEmail: boolean;
  notifyPush: boolean;
  weeklySummary: boolean;
  mealReminders: boolean;
  // Dietary defaults (for diabetes-friendly planning)
  defaultLowGI: boolean;
  defaultLowCarb: boolean;
  defaultHighFiber: boolean;
  // Privacy
  telemetry: boolean; // anonymous usage analytics
};

const STORAGE_KEY = "mp_settings_v1";

// helper: apply theme to document root
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const shouldDark = theme === "dark" || (theme === "system" && prefersDark);
  root.classList.toggle("dark", shouldDark);
}

const DEFAULTS: SettingsData = {
  theme: "light",
  units: "metric",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  notifyEmail: true,
  notifyPush: false,
  weeklySummary: true,
  mealReminders: true,
  defaultLowGI: true,
  defaultLowCarb: false,
  defaultHighFiber: true,
  telemetry: false,
};

export default function Settings() {
  const [s, setS] = useState<SettingsData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SettingsData) : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => applyTheme(s.theme), [s.theme]);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2500);
  };

  const reset = () => setS(DEFAULTS);

  const clearAllAppData = () => {
    // remove all app keys that start with "mp_"
    const toDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("mp_")) toDelete.push(k);
    }
    toDelete.forEach((k) => localStorage.removeItem(k));
    alert("All Meal Planner data cleared from this browser.");
  };

  const exportData = () => {
    // Try to export both settings + profile if present
    const blob = new Blob(
      [
        JSON.stringify(
          {
            settings: s,
            profile:
              JSON.parse(localStorage.getItem("mp_profile_v1") || "null") ??
              null,
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meal-planner-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // small styles (aligns with your existing classes)
  const sectionCard =
    "rounded-2xl bg-white shadow p-5 md:p-6 border border-gray-100";
  const groupTitle = { fontSize: 16, fontWeight: 700, marginBottom: 8 };
  const label = "text-sm font-medium text-gray-800";
  const row = { display: "flex", alignItems: "center", gap: 10 };

  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <main className="content">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>
          Configure appearance, units, notifications, and privacy.
        </p>

        <div
          className="grid"
          style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }}
        >
          {/* Appearance */}
          <section className={sectionCard}>
            <h3 style={groupTitle}>Appearance</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label className={label}>Theme</label>
                <div style={{ ...row, marginTop: 6 }}>
                  {(["light", "dark", "system"] as Theme[]).map((t) => (
                    <label key={t} style={row}>
                      <input
                        type="radio"
                        name="theme"
                        checked={s.theme === t}
                        onChange={() => setS((x) => ({ ...x, theme: t }))}
                      />
                      {t[0].toUpperCase() + t.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={label}>Units</label>
                <div style={{ ...row, marginTop: 6 }}>
                  {(["metric", "imperial"] as Units[]).map((u) => (
                    <label key={u} style={row}>
                      <input
                        type="radio"
                        name="units"
                        checked={s.units === u}
                        onChange={() => setS((x) => ({ ...x, units: u }))}
                      />
                      {u === "metric" ? "Metric (kg, cm)" : "Imperial (lb, in)"}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={label}>Timezone</label>
                <input
                  className="rounded-xl border border-gray-300 px-3 py-2"
                  value={s.timezone}
                  onChange={(e) =>
                    setS((x) => ({ ...x, timezone: e.target.value }))
                  }
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className={sectionCard}>
            <h3 style={groupTitle}>Notifications</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <label style={row}>
                <input
                  type="checkbox"
                  checked={s.notifyEmail}
                  onChange={(e) =>
                    setS((x) => ({ ...x, notifyEmail: e.target.checked }))
                  }
                />
                Email updates
              </label>
              <label style={row}>
                <input
                  type="checkbox"
                  checked={s.notifyPush}
                  onChange={(e) =>
                    setS((x) => ({ ...x, notifyPush: e.target.checked }))
                  }
                />
                Push notifications
              </label>
              <label style={row}>
                <input
                  type="checkbox"
                  checked={s.weeklySummary}
                  onChange={(e) =>
                    setS((x) => ({ ...x, weeklySummary: e.target.checked }))
                  }
                />
                Weekly summary
              </label>
              <label style={row}>
                <input
                  type="checkbox"
                  checked={s.mealReminders}
                  onChange={(e) =>
                    setS((x) => ({ ...x, mealReminders: e.target.checked }))
                  }
                />
                Meal reminders
              </label>
            </div>
          </section>

          {/* Dietary defaults */}
          <section className={sectionCard}>
            <h3 style={groupTitle}>Dietary Defaults</h3>
            <p className="text-sm text-gray-600" style={{ marginBottom: 8 }}>
              Used as preselected filters in your meal planner.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              <label style={row}>
                <input
                  type="checkbox"
                  checked={s.defaultLowGI}
                  onChange={(e) =>
                    setS((x) => ({ ...x, defaultLowGI: e.target.checked }))
                  }
                />
                Prefer Low GI meals
              </label>
              <label style={row}>
                <input
                  type="checkbox"
                  checked={s.defaultHighFiber}
                  onChange={(e) =>
                    setS((x) => ({ ...x, defaultHighFiber: e.target.checked }))
                  }
                />
                Prefer High Fiber meals
              </label>
              <label style={row}>
                <input
                  type="checkbox"
                  checked={s.defaultLowCarb}
                  onChange={(e) =>
                    setS((x) => ({ ...x, defaultLowCarb: e.target.checked }))
                  }
                />
                Prefer Low Carb meals
              </label>
            </div>
          </section>

          {/* Privacy & Tools */}
          <section className={sectionCard}>
            <h3 style={groupTitle}>Privacy & Tools</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <label style={row}>
                <input
                  type="checkbox"
                  checked={s.telemetry}
                  onChange={(e) =>
                    setS((x) => ({ ...x, telemetry: e.target.checked }))
                  }
                />
                Allow anonymous usage analytics
              </label>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={exportData}
                  style={{
                    borderRadius: 12,
                    padding: "10px 14px",
                    background: "#111827",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  Export data
                </button>
                <button
                  onClick={clearAllAppData}
                  style={{
                    borderRadius: 12,
                    padding: "10px 14px",
                    background: "#fee2e2",
                    color: "#991b1b",
                    fontWeight: 700,
                  }}
                >
                  Clear ALL app data
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={save}
            style={{
              borderRadius: 12,
              padding: "10px 14px",
              background: "#111827",
              color: "white",
              fontWeight: 700,
            }}
          >
            Save Settings
          </button>
          <button
            onClick={reset}
            style={{
              borderRadius: 12,
              padding: "10px 14px",
              background: "#f3f4f6",
              color: "#111827",
              fontWeight: 700,
            }}
          >
            Reset to defaults
          </button>

          {savedAt && (
            <div
              role="status"
              style={{
                marginLeft: "auto",
                padding: "8px 12px",
                borderRadius: 12,
                background: "#dcfce7",
                color: "#065f46",
                fontWeight: 700,
              }}
            >
              Saved!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}