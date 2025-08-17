import React from "react";
import heroImage from "../assets/hero-image.png"; // or your long filename

const LandingPage: React.FC = () => {
  return (
    <main style={styles.hero} aria-label="Landing hero">
      {/* dark gradient overlay for readability */}
      <div style={styles.overlay} />

      {/* simple nav chips (static for now) */}
      <nav style={styles.nav}>
        {["Home", "Features", "Contact", "Login / Signup"].map((label) => (
          <a key={label} href="#" style={styles.navLink}>
            {label}
          </a>
        ))}
      </nav>

      {/* hero content */}
      <section style={styles.content}>
        <h1 style={styles.title}>Plan Your Meals. Stay Healthy.</h1>
        <p style={styles.sub}>
          Create custom meal plans that fit your lifestyle, health goals, and budget.
        </p>
        <button style={styles.cta}>Get Started</button>
      </section>
    </main>
  );
};

export default LandingPage;

const styles = {
  hero: {
    position: "relative" as const,
    backgroundImage: `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    color: "#fff",
  },
  overlay: {
    position: "absolute" as const,
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.35) 40%, rgba(0,0,0,.15) 100%)",
  },
  nav: {
    position: "absolute" as const,
    top: 24,
    right: 24,
    display: "flex",
    gap: 16,
    zIndex: 2,
  },
  navLink: {
    background: "rgba(255,255,255,0.9)",
    color: "#2e7d32",
    padding: "6px 12px",
    borderRadius: 9999,
    textDecoration: "none",
    fontWeight: 600,
  },
  content: {
    position: "relative" as const,
    zIndex: 2,
    maxWidth: 720,
    padding: "0 24px",
    paddingTop: 120,
    marginLeft: 24,
  },
  title: {
    fontSize: 48,
    lineHeight: 1.1,
    margin: "0 0 16px",
  },
  sub: {
    fontSize: 18,
    lineHeight: 1.6,
    maxWidth: 600,
    margin: "0 0 24px",
  },
  cta: {
    padding: "12px 20px",
    backgroundColor: "#66BB6A",
    color: "#103b22",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(20,84,42,.2)",
  },
} as const;