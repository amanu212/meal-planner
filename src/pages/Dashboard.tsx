// src/pages/Dashboard.tsx
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import WelcomeBanner from "../components/WelcomeBanner";
import QuickAccessSection from "../components/QuickAccessSection";
import RecentMeals from "../components/RecentMeals";
import "./Dashboard.css";
import { usePageTitle } from "../hooks/usePageTitle";

// Quick Access images
import planMealsImg from "../assets/Plan Meals.png";
import savedMealsImg from "../assets/Saved Meals.png";
import myProfileImg from "../assets/My profile.png";

// Banner avatar
import avatarImg from "../assets/Welcome banner Avatar.png";

// Recent meals images
import avocadoImg from "../assets/Avocado Toast.png";
import mixedGreenImg from "../assets/Mixed green with protein.png";
import herbChickenImg from "../assets/Herb Chicken with veggies.png";

export default function Dashboard() {
  usePageTitle("Dashboard");
  const navigate = useNavigate();

  // Quick access cards → route to pages
  const quickCards = [
    { img: planMealsImg,  title: "Plan Meal",   onClick: () => navigate("/plan") },
    { img: savedMealsImg, title: "Saved Meals", onClick: () => navigate("/saved") },
    { img: myProfileImg,  title: "My Profile",  onClick: () => navigate("/profile") },
  ];

  // Recent meals (include ids so we can deep-link to PlanMeals)
  const recentMeals = [
    { id: "avocado-toast", img: avocadoImg,    title: "Avocado Toast" },
    { id: "mixed-green",   img: mixedGreenImg, title: "Mixed green with proteins" },
    { id: "herb-chicken",  img: herbChickenImg, title: "Herb Chicken and Veggies" },
  ];

  return (
    <div className="layout">
      {/* Left nav */}
      <aside className="sidebar">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="content">
        <h2 className="page-title">Dashboard</h2>

        {/* Greeting banner */}
        <WelcomeBanner
          greeting="Welcome back, Guys😊"
          subtext="Let’s plan your next healthy meal!"
          avatar={avatarImg}
        />

        {/* Quick access section (now clickable) */}
        <QuickAccessSection title="Quick Access Meals" cards={quickCards} />

        {/* Recent meals → deep-link to PlanMeals with ?id=<mealId> */}
        <RecentMeals
          title="Recent Meals"
          meals={recentMeals}
          onSelect={(meal) => navigate(`/plan?id=${meal.id}`)}
        />
      </main>
    </div>
  );
}