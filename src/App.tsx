import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import PlanMeals from "./pages/PlanMeals";
import SavedMeals from "./pages/SavedMeals";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Default: Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* App pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/plan" element={<PlanMeals />} />
      <Route path="/saved" element={<SavedMeals />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/logout" element={<Logout />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}