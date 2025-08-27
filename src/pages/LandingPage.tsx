// src/pages/LandingPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import hero from "../assets/hero-image.png";
import { usePageTitle } from "../hooks/usePageTitle";

export default function LandingPage() {
  
  usePageTitle("Landing");
  return (

    <main
      aria-label="Landing hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <img
        src={hero}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.65)",
        }}
      />

      {/* Top-right nav chips */}
      <nav
        aria-label="Top navigation"
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          display: "flex",
          gap: 12,
          zIndex: 1,
        }}
      >
        <Link to="/" className="chip">Home</Link>
        {/* Point Features/Contact anywhere you want; examples below */}
        <Link to="/dashboard" className="chip">Features</Link>
        <Link to="/dashboard" className="chip">Contact</Link>
        <Link to="/dashboard" className="chip">Login / Signup</Link>
      </nav>

      {/* Hero copy */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "96px 24px",
          maxWidth: 900,
        }}
      >
        <h1 style={{ fontSize: 64, lineHeight: 1.1, fontWeight: 800, marginBottom: 16 }}>
          Plan Your Meals. Stay Healthy.
        </h1>
        <p style={{ fontSize: 22, opacity: 0.95, marginBottom: 28 }}>
          Create custom meal plans that fit your lifestyle, health goals, and budget.
        </p>

        {/* CTA navigates into the app */}
        <Link
          to="/dashboard"
          style={{
            display: "inline-block",
            background: "#22c55e",
            color: "#0a0a0a",
            padding: "14px 22px",
            borderRadius: 12,
            fontWeight: 700,
          }}
        >
          Get Started
        </Link>
      </section>

      {/* Minimal chip styles to match your UI without a CSS file */}
      <style>
        {`
        .chip {
          display:inline-block;
          padding:10px 16px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.85);
          color:#0b1220;
          text-decoration:none;
          font-weight:600;
        }
        .chip:hover { background: white; }
        `}
      </style>
    </main>
  );
}