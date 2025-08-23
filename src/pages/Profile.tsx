// src/pages/Profile.tsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";

type Activity = "Sedentary" | "Light" | "Moderate" | "Active";
type Condition = "None" | "Prediabetes" | "Type 1" | "Type 2";

type ProfileData = {
  name: string;
  email: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  activity: Activity;
  condition: Condition;
  dailyCalories?: number;      // target kcal/day
  carbPerMeal?: number;        // grams/meal target
  dietTags: string[];          // e.g., ["Low GI", "High Fiber"]
  allergies: string;           // comma-separated
  avatarDataUrl?: string;      // persisted preview
};

const DEFAULT_PROFILE: ProfileData = {
  name: "",
  email: "",
  age: undefined,
  heightCm: undefined,
  weightKg: undefined,
  activity: "Light",
  condition: "None",
  dailyCalories: undefined,
  carbPerMeal: undefined,
  dietTags: ["Low GI", "High Fiber"],
  allergies: "",
  avatarDataUrl: undefined,
};

const STORAGE_KEY = "mp_profile_v1";

export default function Profile() {
  const [data, setData] = useState<ProfileData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ProfileData) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    // clear saved toast after 2.5s
    if (!savedAt) return;
    const t = setTimeout(() => setSavedAt(null), 2500);
    return () => clearTimeout(t);
  }, [savedAt]);

  const bmi = useMemo(() => {
    if (!data.heightCm || !data.weightKg) return null;
    const m = data.heightCm / 100;
    return +(data.weightKg / (m * m)).toFixed(1);
  }, [data.heightCm, data.weightKg]);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setData((d) => ({ ...d, avatarDataUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const toggleTag = (tag: string) =>
    setData((d) => ({
      ...d,
      dietTags: d.dietTags.includes(tag)
        ? d.dietTags.filter((t) => t !== tag)
        : [...d.dietTags, tag],
    }));

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSavedAt(Date.now());
  };

  const reset = () => setData(DEFAULT_PROFILE);

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(DEFAULT_PROFILE);
  };

  // small helpers
  const input =
    "w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400";
  const label = "text-sm font-medium text-gray-800";
  const sectionCard =
    "rounded-2xl bg-white shadow p-5 md:p-6 border border-gray-100";

  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <main className="content">
        <h2 className="page-title">Profile</h2>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>
          Personal details & dietary preferences used across your meal planner.
        </p>

        {/* Grid: left form, right summary */}
        <div className="grid" style={{ display: "grid", gap: 20, gridTemplateColumns: "1.2fr 0.8fr" }}>
          {/* Left: Form */}
          <div className={sectionCard}>
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "120px 1fr" }}>
              {/* Avatar */}
              <div>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#eef2f7",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {data.avatarDataUrl ? (
                    <img
                      src={data.avatarDataUrl}
                      alt="Avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        color: "#6b7280",
                        fontSize: 12,
                        textAlign: "center",
                        padding: 8,
                      }}
                    >
                      No photo
                    </div>
                  )}
                </div>

                <label
                  htmlFor="avatar"
                  className="nav-link"
                  style={{
                    display: "inline-block",
                    marginTop: 10,
                    borderRadius: 10,
                    padding: "8px 12px",
                    background: "#111827",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Upload
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>

              {/* Identity */}
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <label className={label}>Full name</label>
                  <input
                    className={input}
                    value={data.name}
                    onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                    placeholder="e.g., Habtamu Gashaw"
                  />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input
                    className={input}
                    type="email"
                    value={data.email}
                    onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

            {/* Health */}
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div>
                <label className={label}>Age</label>
                <input
                  className={input}
                  type="number"
                  min={0}
                  value={data.age ?? ""}
                  onChange={(e) =>
                    setData((d) => ({ ...d, age: e.target.value ? +e.target.value : undefined }))
                  }
                  placeholder="25"
                />
              </div>
              <div>
                <label className={label}>Height (cm)</label>
                <input
                  className={input}
                  type="number"
                  min={0}
                  value={data.heightCm ?? ""}
                  onChange={(e) =>
                    setData((d) => ({ ...d, heightCm: e.target.value ? +e.target.value : undefined }))
                  }
                  placeholder="180"
                />
              </div>
              <div>
                <label className={label}>Weight (kg)</label>
                <input
                  className={input}
                  type="number"
                  min={0}
                  value={data.weightKg ?? ""}
                  onChange={(e) =>
                    setData((d) => ({ ...d, weightKg: e.target.value ? +e.target.value : undefined }))
                  }
                  placeholder="74"
                />
              </div>
              <div>
                <label className={label}>Activity level</label>
                <select
                  className={input}
                  value={data.activity}
                  onChange={(e) => setData((d) => ({ ...d, activity: e.target.value as Activity }))}
                >
                  <option>Sedentary</option>
                  <option>Light</option>
                  <option>Moderate</option>
                  <option>Active</option>
                </select>
              </div>
              <div>
                <label className={label}>Condition</label>
                <select
                  className={input}
                  value={data.condition}
                  onChange={(e) => setData((d) => ({ ...d, condition: e.target.value as Condition }))}
                >
                  <option>None</option>
                  <option>Prediabetes</option>
                  <option>Type 1</option>
                  <option>Type 2</option>
                </select>
              </div>
              <div>
                <label className={label}>Daily calories (kcal)</label>
                <input
                  className={input}
                  type="number"
                  min={0}
                  value={data.dailyCalories ?? ""}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      dailyCalories: e.target.value ? +e.target.value : undefined,
                    }))
                  }
                  placeholder="2200"
                />
              </div>
              <div>
                <label className={label}>Carbs per meal (g)</label>
                <input
                  className={input}
                  type="number"
                  min={0}
                  value={data.carbPerMeal ?? ""}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      carbPerMeal: e.target.value ? +e.target.value : undefined,
                    }))
                  }
                  placeholder="45"
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className={label}>Allergies (comma-separated)</label>
                <input
                  className={input}
                  value={data.allergies}
                  onChange={(e) => setData((d) => ({ ...d, allergies: e.target.value }))}
                  placeholder="e.g., peanuts, shellfish"
                />
              </div>
            </div>

            <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

            {/* Diet tags */}
            <div>
              <label className={label} style={{ display: "block", marginBottom: 8 }}>
                Diet preferences
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  "Low GI",
                  "High Fiber",
                  "Low Carb",
                  "Mediterranean",
                  "Vegetarian",
                  "Vegan",
                  "Gluten Free",
                  "Dairy Free",
                  "Halal",
                ].map((tag) => {
                  const active = data.dietTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 999,
                        border: "1px solid",
                        borderColor: active ? "#10b981" : "#d1d5db",
                        background: active ? "rgba(16,185,129,.1)" : "white",
                        color: active ? "#065f46" : "#111827",
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
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
                Save Profile
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
                Reset
              </button>
              <button
                onClick={clear}
                style={{
                  borderRadius: 12,
                  padding: "10px 14px",
                  background: "#fee2e2",
                  color: "#991b1b",
                  fontWeight: 700,
                }}
              >
                Clear Saved
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
          </div>

          {/* Right: Summary */}
          <aside className={sectionCard}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
              Summary
            </h3>
            <ul style={{ lineHeight: 1.8, color: "#374151" }}>
              <li>
                <strong>Name:</strong> {data.name || "—"}
              </li>
              <li>
                <strong>Email:</strong> {data.email || "—"}
              </li>
              <li>
                <strong>Condition:</strong> {data.condition}
              </li>
              <li>
                <strong>Activity:</strong> {data.activity}
              </li>
              <li>
                <strong>Calories target:</strong>{" "}
                {data.dailyCalories ? `${data.dailyCalories} kcal/day` : "—"}
              </li>
              <li>
                <strong>Carbs/meal:</strong>{" "}
                {data.carbPerMeal ? `${data.carbPerMeal} g` : "—"}
              </li>
              <li>
                <strong>Preferences:</strong>{" "}
                {data.dietTags.length ? data.dietTags.join(", ") : "—"}
              </li>
              <li>
                <strong>Allergies:</strong> {data.allergies || "—"}
              </li>
              <li>
                <strong>BMI:</strong> {bmi ?? "—"}
              </li>
            </ul>

            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>
              * Health calculations are informational only and not medical advice.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}