// src/pages/Dashboard.tsx

import Sidebar from "../components/Sidebar";
import WelcomeBanner from "../components/WelcomeBanner";
import QuickAccessSection from "../components/QuickAccessSection";
import RecentMeals from "../components/RecentMeals";
import "./Dashboard.css";
// Quick access images
import planMealsImg from "../assets/Plan Meals.png";
import savedMealsImg from "../assets/Saved Meals.png";
import myProfileImg from "../assets/My profile.png";

// Banner avatar
import avatarImg from "../assets/Welcome banner Avatar.png";

// Recent meals images
import avocadoImg from "../assets/Avocado Toast.png";
import mixedGreenImg from "../assets/Mixed green with protein.png";
import herbChickenImg from "../assets/Herb Chicken with veggies.png";

const Dashboard = () => {
  const quickCards = [
    { img: planMealsImg, title: "Plan Meal" },
    { img: savedMealsImg, title: "Saved Meals" },
    { img: myProfileImg, title: "My Profile" },
  ];

  const recentMeals = [
    { img: avocadoImg, title: "Avocado Toast" },
    { img: mixedGreenImg, title: "Mixed green with proteins" },
    { img: herbChickenImg, title: "Herb Chicken and Veggies" },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <main className="content">
        <h2 className="page-title">Dashboard</h2>

        <WelcomeBanner
          greeting="Welcome back, Guys😊"
          subtext="Let’s plan your next healthy meal!"
          avatar={avatarImg}
        />

        <QuickAccessSection title="Quick Access Meals" cards={quickCards} />

        <RecentMeals title="Recent Meals" meals={recentMeals} />
      </main>
    </div>
  );
};

export default Dashboard;