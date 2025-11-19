// src/App.jsx
import { useState } from "react";
import Navigation from "./components/Navigation";
import MealPlanner from "./pages/MealPlanner";
import Analytics from "./pages/Analytics";
import Review from "./pages/Review";
import Overview from "./pages/Overview";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("overview");
  const [authStage, setAuthStage] = useState("signin");

  const handleSignInSuccess = () => {
    setAuthStage("app");
    setCurrentPage("overview");
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

  return (
    <div className="app">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="main-content">
        {currentPage === "meal-planner" ? (
          <MealPlanner />
        ) : currentPage === "analytics" ? (
          <Analytics />
        ) : currentPage === "review" ? (
          <Review />
        ) : (
          <Overview />
        )}
      </main>
    </div>
  );
}

export default App;
