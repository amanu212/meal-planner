// src/pages/Logout.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Logout() {
  usePageTitle("Logout");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Remove anything you'd consider "session/auth" data.
      // Keep settings so theme/unit prefs persist across visits.
      const keysToRemove = ["mp_auth", "mp_profile_v1"]; // add more if needed
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // Clear any session-scoped data
      sessionStorage.removeItem("mp_session");
    } finally {
      // Redirect to landing after a short pause so the message renders
      const REDIRECT_TO = "/"; // landing page
      const delayMs = 400;
      const t = setTimeout(() => navigate(REDIRECT_TO, { replace: true }), delayMs);
      return () => clearTimeout(t);
    }
  }, [navigate]);

  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <div
        style={{
          padding: 24,
          borderRadius: 16,
          background: "#fff",
          boxShadow: "0 1px 2px rgba(16, 24, 40, 0.06)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Signing you out…
        </h1>
        <p style={{ color: "#4b5563" }}>You’ll be redirected shortly.</p>
      </div>
    </div>
  );
}