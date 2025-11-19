import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navigation from "./components/Navigation";
import MealPlanner from "./pages/MealPlanner";
import Analytics from "./pages/Analytics";
import Overview from "./pages/Overview";
import Feedback from "./pages/Feedback";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import "./App.css";

function AppContent() {
  const [authStage, setAuthStage] = useState("signin"); // "signin" | "signup" | "app"
  const location = useLocation();

  const handleSignInSuccess = () => {
    setAuthStage("app");
  };

  const handleSignUpSuccess = () => {
    setAuthStage("signin");
  };

  if (authStage === "signin") {
    return (
      <SignIn
        onSignInSuccess={handleSignInSuccess}
        onGoToSignUp={() => setAuthStage("signup")}
      />
    );
  }

  if (authStage === "signup") {
    return (
      <SignUp
        onSignUpSuccess={handleSignUpSuccess}
        onGoToSignIn={() => setAuthStage("signin")}
      />
    );
  }

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
      <AppContent />
    </Router>
  );
}
