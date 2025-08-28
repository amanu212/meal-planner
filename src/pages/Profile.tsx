// src/pages/Profile.tsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { usePageTitle } from "../hooks/usePageTitle";

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
  dailyCalories?: number; // target kcal/day
  carbPerMeal?: number;   // grams/meal target
  dietTags: string[];     // e.g., ["Low GI", "High Fiber"]
  allergies: string;      // comma-separated
  avatarDataUrl?: string; // persisted preview
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
  usePageTitle("Profile");

  const [data, setData] = useState<ProfileData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ProfileData) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!savedAt) return;
    const t = setTimeout(() => setSavedAt(null), 2500);
    return () => clearTimeout(t);
  }, [savedAt]);

  const bmi = useMemo(() => {
    if (!data.heightCm || !data.weightKg) return null;
    const m = data.heightCm / 100;
    return +(data.weightKg / (m * m)).toFixed(1);
  }, [data.heightCm, data.weightKg]);

  function handleFile(file?: File | null) {
    setErrorMsg(null);
    if (!file) return;

    const MAX_MB = 2;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setErrorMsg(`Image is too large (max ${MAX_MB}MB).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      setData((d) => ({ ...d, avatarDataUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  const removeAvatar = () =>
    setData((d) => ({ ...d, avatarDataUrl: undefined }));

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

        <div
          className="grid"
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "1.2fr 0.8fr",
          }}
        >
          {/* Left: Form */}
          <div className={sectionCard}>
            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: "120px 1fr",
              }}
            >
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
                  aria-label="Avatar preview"
                >
                  {data.avatarDataUrl ? (
                    <img
                      src={data.avatarDataUrl}
                      alt="Avatar"
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
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

                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <label
                    htmlFor="avatar"
                    className="nav-link"
                    style={{
                      display: "inline-block",
                      borderRadius: 10,
                      padding: "8px 12px",
                      background: "#111827",
                      color: "white",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Upload
                  </label>
                  {data.avatarDataUrl && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      style={{
                        borderRadius: 10,
                        padding: "8px 12px",
                        background: "#f3f4f6",
                        color: "#111827",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {errorMsg && (
                  <p
                    role="alert"
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: "#b91c1c",
                    }}
                  >
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Identity */}
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <label className={label} htmlFor="fullName">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    className={input}
                    value={data.name}
                    onChange={(e) =>
                      setData((d) => ({ ...d, name: e.target.value }))
                    }
                    placeholder="e.g., Habtamu Gashaw"
                  />
                </div>
                <div>
                  <label className={label} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    className={input}
                    type="email"
                    value={data.email}
                    onChange={(e) =>
                      setData((d) => ({ ...d, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

            {/* Health */}
            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              <div>
                <label className={label} htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  className={input}
                  type="number"
                  min={0}
                  max={120}
                  inputMode="numeric"
                  value={data.age ?? ""}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      age: e.target.value ? +e.target.value : undefined,
                    }))
                  }
                  placeholder="25"
                />
              </div>
              <div>
                <label className={label} htmlFor="height">
                  Height (cm)
                </label>
                <input
                  id="height"
                  className={input}
                  type="number"
                  min={0}
                  max={260}
                  inputMode="numeric"
                  value={data.heightCm ?? ""}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      heightCm: e.target.value ? +e.target.value : undefined,
                    }))
                  }
                  placeholder="180"
                />
              </div>
              <div>
                <label className={label} htmlFor="weight">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  className={input}
                  type="number"
                  min={0}
                  max={400}
                  inputMode="decimal"
                  value={data.weightKg ?? ""}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      weightKg: e.target.value ? +e.target.value : undefined,
                    }))
                  }
                  placeholder="74"
                />
              </div>
              <div>
                <label className={label} htmlFor="activity">
                  Activity level
                </label>
                <select
                  id="activity"
                  className={input}
                  value={data.activity}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      activity: e.target.value as Activity,
                    }))
                  }
                >
                  <option>Sedentary</option>
                  <option>Light</option>
                  <option>Moderate</option>
                  <option>Active</option>
                </select>
              </div>
              <div>
                <label className={label} htmlFor="condition">
                  Condition
                </label>
                <select
                  id="condition"
                  className={input}
                  value={data.condition}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      condition: e.target.value as Condition,
                    }))
                  }
                >
                  <option>None</option>
                  <option>Prediabetes</option>
                  <option>Type 1</option>
                  <option>Type 2</option>
                </select>
              </div>
              <div>
                <label className={label} htmlFor="calories">
                  Daily calories (kcal)
                </label>
                <input
                  id="calories"
                  className={input}
                  type="number"
                  min={0}
                  max={6000}
                  inputMode="numeric"
                  value={data.dailyCalories ?? ""}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      dailyCalories: e.target.value
                        ? +e.target.value
                        : undefined,
                    }))
                  }
                  placeholder="2200"
                />
              </div>
              <div>
                <label className={label} htmlFor="carbs">
                  Carbs per meal (g)
                </label>
                <input
                  id="carbs"
                  className={input}
                  type="number"
                  min={0}
                  max={300}
                  inputMode="numeric"
                  value={data.carbPerMeal ?? ""}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      carbPerMeal: e.target.value
                        ? +e.target.value
                        : undefined,
                    }))
                  }
                  placeholder="45"
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className={label} htmlFor="allergies">
                  Allergies (comma-separated)
                </label>
                <input
                  id="allergies"
                  className={input}
                  value={data.allergies}
                  onChange={(e) =>
                    setData((d) => ({ ...d, allergies: e.target.value }))
                  }
                  placeholder="e.g., peanuts, shellfish"
                />
              </div>
            </div>

            <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

            {/* Diet tags */}
            <div>
              <label
                className={label}
                style={{ display: "block", marginBottom: 8 }}
              >
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
                      aria-pressed={active}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 999,
                        border: "1px solid",
                        borderColor: active ? "#10b981" : "#d1d5db",
                        background: active
                          ? "rgba(16,185,129,.1)"
                          : "white",
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

              {/* Save toast */}
              <div
                aria-live="polite"
                style={{ marginLeft: "auto" }}
              >
                {savedAt && (
                  <div
                    role="status"
                    style={{
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
              * Health calculations are informational only and not medical
              advice.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}