import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import MealPlanner from "./pages/MealPlanner";
import Analytics from "./pages/Analytics";
import Overview from "./pages/Overview";
import Feedback from "./pages/Feedback";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import "./App.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Layout() {
  const location = useLocation();
  const [user, setUser] = useState();
  const hideNav = location.pathname === "/feedback" || location.pathname === "/signin" || location.pathname === "/signup" || location.pathname === "/";

  const showToastSignUp = () => {
    toast.success("Success create account, please sign in using your new account!", {
      position: "bottom-right"
    });
  };

  const showToastSignIn = () => {
    toast.success("Success sign in, welcome!", {
      position: "bottom-right"
    });
  };
  return (
    <div className="app">
         <ToastContainer />
      {!hideNav && <Navigation user={user} />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<SignInPage onGoToSignUp={() => window.location.href = '/signup'} />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/signin" element={<SignInPage onSignInSuccess={(data) => {setUser(data); showToastSignIn()}} onGoToSignUp={() => window.location.href = '/signup'} />} />
          <Route path="/signup" element={<SignUpPage onSignUpSuccess={() => showToastSignUp()} onGoToSignIn={() => window.location.href = '/signin'}/>} />
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
