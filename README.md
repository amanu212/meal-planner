# Diabetes-friendly Meal Planner

A React + Vite app that helps users plan meals with diabetes-friendly options.

## Tech Stack
- React + TypeScript
- React Router
- CSS (custom) / Tailwind-ready structure
- LocalStorage for profile/settings persistence

## Features (current)
- Public Landing → App Dashboard
- Sidebar navigation (Dashboard, Plan, Saved, Profile, Settings, Logout)
- Plan Meals: search, tag filters, meal selection w/ details
- Saved Meals: cards with time & calories
- Profile: identity, health metrics, diet tags, avatar (localStorage)
- Settings: theme, units, notifications, dietary defaults, export/clear data
- Logout: clears session/profile

## Project Setup
```bash
npm install
npm run dev

Folder Structure
src/
  assets/
  components/
  pages/
  App.tsx
  main.tsx

  Add screenshots (Landing, Dashboard, Plan, Saved, Profile, Settings) under a **Screenshots** section.

---

# Google Doc outline (copy/paste)

**Title:** FE Capstone – Part 4 Progress (Meal Planner)

**1) What I built this week**
- Routing & navigation…
- Plan Meals filters/selection…
- Profile with localStorage…
- Settings with theme/units…
- Saved Meals grid…
- (Attach 3–6 screenshots or a short Loom/GIF)

**2) Challenges & how I handled them**
- Router path issues → fixed by…
- TypeScript props error in PlanMeals → solved by…
- Missing CSS import (Vite) → resolved by…

**3) Next steps (coming week)**
- Persist Saved Meals + “Save” button from Plan
- Small accessibility tweaks (alt text, focus styles)
- Deploy preview to Netlify/Vercel
- Write simple unit tests for utils (optional)

**Links**
- GitHub: <your repo URL>
- Live preview (if any): <url>

Set sharing to “Anyone with the link can view”.

---

# Final submission checklist

- [ ] Repo is **public**, pushed, with README + screenshots.
- [ ] Google Doc created, link share enabled.
- [ ] Submit **both links** in the portal (GitHub + Google Doc).
- [ ] Request **Manual QA** when ready (per the portal).
- [ ] Optional: Deploy to Netlify/Vercel and add the URL to both README and Doc.

If you want, send me your repo URL—I'll do a fast pre-QA sweep (README, broken links, basic lint, and any UI nits) before you submit.