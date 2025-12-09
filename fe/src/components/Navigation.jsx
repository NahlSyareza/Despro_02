import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Navigation() {
  const navigate = useNavigate();

  // Ambil data user
  const vendorData = JSON.parse(localStorage.getItem("vendor_data") || "{}");
  const username = vendorData.username || "Vendor";

  // Helper: Ambil 2 huruf pertama untuk inisial (cth: "Kantin Sehat" -> "KS")
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("vendor_data");
    navigate("/signin", { replace: true });
    toast.success("Logout Berhasil!");
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

        {/* RIGHT SECTION: Profile & Logout */}
        <div className="nav-right flex items-center gap-3">
          
          {/* 1. Profile Avatar (Acronym) */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
             <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-bold text-gray-700 leading-none">{username}</span>
                <span className="text-[10px] text-gray-400 font-medium">Vendor</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B5EEA] to-[#6a4fea] flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-purple-50 border-2 border-white select-none">
                {getInitials(username)}
             </div>
          </div>

          {/* 2. Tombol Logout (Sebelah Kanan Profile) */}
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
            title="Keluar / Logout"
          >
            <LogOut size={20} color="#7b5eea" />
          </button>

        </div>

      </div>
    </nav>
  );
}