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
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import "./App.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./ProtectedRoute";

function Layout() {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const hideNav =
    location.pathname === "/feedback" ||
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname === "/";

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/signin";
    }, 10 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [user]);

  const showToastSignUp = () => {
    toast.success(
      "Success create account, please sign in using your new account!",
      {
        position: "bottom-right",
      }
    );
  };

  const showToastSignIn = () => {
    toast.success("Success sign in, welcome!", {
      position: "bottom-right",
    });
  };
  return (
    <div className="app">
      <ToastContainer />
      {!hideNav && <Navigation user={user} />}

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <SignInPage
                onSignInSuccess={(data) => {
                  setUser(data);
                  localStorage.setItem("user", JSON.stringify(data));
                  showToastSignIn();
                }}
                onGoToSignUp={() => (window.location.href = "/signup")}
              />
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute user={user}>
                {" "}
                <Overview />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute user={user}>
                {" "}
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meal-planner"
            element={
              <ProtectedRoute user={user}>
                {" "}
                <MealPlanner user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/feedback" element={<Feedback />} />
          <Route
            path="/signin"
            element={
              <SignInPage
                onSignInSuccess={(data) => {
                  setUser(data);
                  showToastSignIn();
                  localStorage.setItem("user", JSON.stringify(data));
                }}
                onGoToSignUp={() => (window.location.href = "/signup")}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUpPage
                onSignUpSuccess={() => showToastSignUp()}
                onGoToSignIn={() => (window.location.href = "/signin")}
              />
            }
          />
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
