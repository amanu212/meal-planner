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
      {/* Background image (decorative) */}
      <img
        src={hero}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
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
      <header
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
        <Link to="/" className="chip" aria-current="page">
          Home
        </Link>
        <Link to="/dashboard" className="chip">
          Features
        </Link>
        <Link to="/dashboard" className="chip">
          Contact
        </Link>
        <Link to="/dashboard" className="chip">
          Login / Signup
        </Link>
      </header>

      {/* Hero copy */}
      <section
        aria-label="Intro"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "96px 24px",
          maxWidth: 900,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            lineHeight: 1.1,
            fontWeight: 800,
            marginBottom: 16,
            letterSpacing: -0.5,
          }}
        >
          Plan Your Meals. Stay Healthy.
        </h1>
        <p style={{ fontSize: 22, opacity: 0.95, marginBottom: 28 }}>
          Create custom meal plans that fit your lifestyle, health goals, and
          budget.
        </p>

        {/* CTA navigates into the app */}
        <Link
          to="/dashboard"
          className="cta"
          style={{
            display: "inline-block",
            background: "#22c55e",
            color: "#0a0a0a",
            padding: "14px 22px",
            borderRadius: 12,
            fontWeight: 700,
            textDecoration: "none",
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
            transition: transform .06s ease, background .12s ease;
          }
          .chip:hover { background: #fff; transform: translateY(-1px); }
          .chip:focus-visible { outline: 3px solid #22c55e; outline-offset: 2px; }

          .cta:focus-visible { outline: 3px solid #22c55e; outline-offset: 2px; }
          @media (max-width: 640px) {
            h1 { font-size: 40px !important; }
          }
        `}
      </style>
    </main>
  );
}