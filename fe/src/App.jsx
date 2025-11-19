import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import MealPlanner from "./pages/MealPlanner";
import Analytics from "./pages/Analytics";
import Overview from "./pages/Overview";
import Feedback from "./pages/Feedback";
import "./App.css";

function Layout() {
  const location = useLocation();
  const hideNav = location.pathname === "/feedback";

  return (
    <div className="app">
      {!hideNav && <Navigation />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
