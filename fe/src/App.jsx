import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner"; // <--- IMPORT INI
import Navigation from "./components/Navigation";
import MealPlanner from "./pages/MealPlanner";
import Analytics from "./pages/Analytics";
import Overview from "./pages/Overview";
import Feedback from "./pages/Feedback";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import QRCodePage from "./pages/QRCodePage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function Layout() {
  const location = useLocation();
  
  const hideNavPaths = ["/feedback", "/signin", "/signup"];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <div className="app">
      {/* Pasang Toaster di sini agar muncul di atas semua elemen */}
      <Toaster position="top-center" richColors /> 
      
      {!shouldHideNav && <Navigation />}

      <main className="main-content">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/feedback" element={<Feedback />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/qr" element={<QRCodePage />} /> 
          </Route>

          <Route path="*" element={<Navigate to="/signin" replace />} />
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