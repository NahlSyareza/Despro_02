import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Bell } from "lucide-react"; // Import icon Bell
import { useNotification } from "../context/NotificationContext"; // Import Context

export default function Navigation() {
  const navigate = useNavigate();
  // Ambil data notifikasi dari Context Global
  const { notifications, unreadCount, markAsRead } = useNotification(); 
  const [showNotif, setShowNotif] = useState(false);

  // Ambil data user dari localStorage
  const vendorData = JSON.parse(localStorage.getItem("vendor_data") || "{}");
  const username = vendorData.username || "Vendor";

  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("vendor_data");
    navigate("/signin", { replace: true });
  };

  const toggleNotif = () => {
    if (!showNotif) {
      markAsRead(); // Reset counter jadi 0 saat dibuka
    }
    setShowNotif(!showNotif);
  };

  return (
    <nav className="navigation relative"> 
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
          <NavLink to="/overview" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>Overview</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>Analytics</NavLink>
          <NavLink to="/meal-planner" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>Meal Planner</NavLink>
          <NavLink to="/qr" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>QR Code</NavLink>
        </div>

        {/* RIGHT SECTION */}
        <div className="nav-right flex items-center gap-4">
          
          {/* --- NOTIFICATION BELL --- */}
          <div className="relative">
            <button 
              onClick={toggleNotif}
              className="p-2 rounded-full hover:bg-gray-100 transition relative outline-none"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* DROPDOWN MENU */}
            {showNotif && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                  <span className="font-semibold text-sm text-gray-700">Notifikasi</span>
                  <span className="text-xs text-gray-400">{notifications.length} riwayat</span>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      Belum ada notifikasi baru
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-3 border-b hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            notif.type === 'WARNING' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {notif.type === 'WARNING' ? 'PERINGATAN' : 'INFO'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Skor Gizi: {notif.data.compliance_score}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          {/* ------------------------- */}

          {/* PROFILE */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
             <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-bold text-gray-700 leading-none">{username}</span>
                <span className="text-[10px] text-gray-400 font-medium">Vendor</span>
             </div>
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7B5EEA] to-[#6a4fea] flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-purple-50 border-2 border-white select-none">
                {getInitials(username)}
             </div>
          </div>

          <button onClick={handleLogout} className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}