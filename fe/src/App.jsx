import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import MealPlanner from "./pages/MealPlanner";
import Analytics from "./pages/Analytics";
import Overview from "./pages/Overview";
import Feedback from "./pages/Feedback";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Review from "./pages/Review"; // Jangan lupa import halaman Review
import QRCodePage from "./pages/QRCodePage"; // <--- IMPORT INI
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function Layout() {
  const location = useLocation();
  
  // Daftar halaman di mana Navigation TIDAK BOLEH MUNCUL
  const hideNavPaths = ["/feedback", "/signin", "/signup"];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    // STRUKTUR ASLI ANDA (div.app & main.main-content) DIPERTAHANKAN
    <div className="app">
      {!shouldHideNav && <Navigation />}

      <main className="main-content">
        <Routes>
          {/* --- PUBLIC ROUTES (Bebas Akses) --- */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/feedback" element={<Feedback />} />

          {/* --- PRIVATE ROUTES (Dijaga Satpam) --- */}
          <Route element={<ProtectedRoute />}>
            {/* Redirect root ke overview */}
            <Route path="/" element={<Navigate to="/overview" replace />} />
            
            <Route path="/overview" element={<Overview />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/reviews" element={<Review />} />
            <Route path="/qr" element={<QRCodePage />} />
          </Route>

          {/* Catch-all: Redirect ke Login jika halaman tidak ditemukan */}
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