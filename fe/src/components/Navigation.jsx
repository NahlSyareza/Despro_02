import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";

export default function Navigation() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const vendorData = JSON.parse(localStorage.getItem("vendor_data") || "{}");
  const username = vendorData.username || "Vendor";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("vendor_data");
    navigate("/signin", { replace: true });
  };

  return (
    <nav className="navigation">
      <div className="nav-container">

        {/* LEFT LOGO */}
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon">MBG</span>
            <span className="logo-text -ml-1">NUTRITION DATA</span>
          </div>
        </div>

        {/* NAV TABS */}
        <div className="nav-tabs">
          <NavLink
            to="/overview"
            className={({ isActive }) =>
              `nav-tab ${isActive ? "active" : ""}`
            }
          >
            Overview
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `nav-tab ${isActive ? "active" : ""}`
            }
          >
            Analytics
          </NavLink>

          {/* --- TAB BARU: REVIEWS --- */}
          {/* Ini adalah pintu masuk ke halaman Review.jsx */}
          <NavLink
            to="/reviews"
            className={({ isActive }) =>
              `nav-tab ${isActive ? "active" : ""}`
            }
          >
            Reviews
          </NavLink>

          <NavLink
            to="/meal-planner"
            className={({ isActive }) =>
              `nav-tab ${isActive ? "active" : ""}`
            }
          >
            Meal Planner
          </NavLink>

          <NavLink
            to="/qr"
            className={({ isActive }) =>
              `nav-tab ${isActive ? "active" : ""}`
            }
          >
            QR Code
          </NavLink>
        </div>

        {/* RIGHT ICONS */}
        <div className="nav-right">
          <button className="icon-button">
            <Bell color="#7b5eea" fill="#7b5eea" />
          </button>

          <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full overflow-hidden w-12 h-12 border-2 border-transparent hover:border-[#7b5eea] transition-all focus:outline-none block"
            >
              <img
                src="/prabowo.jpg"
                alt="profile"
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=" + username}
              />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 py-1 z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Signed in as</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{username}</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}