import { NavLink } from "react-router-dom";
import { Bell } from "lucide-react";

export default function Navigation({user}) {
  console.log("Navigation user:", user?.email);
  return (
    <nav className="navigation">
      <div className="nav-container">

        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon">MBG</span>
            <span className="logo-text -ml-1">NUTRITION DATA</span>
          </div>
        </div>

        <div className="nav-tabs">
          <NavLink to="/overview" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>Overview</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>Analytics</NavLink>
          <NavLink to="/meal-planner" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>Meal Planner</NavLink>
        </div>

        <div className="nav-right flex items-center gap-4">
          <button className="icon-button">
            <Bell color="#7b5eea" fill="#7b5eea" />
          </button>

          <div className="relative group">
            <button className="rounded-full overflow-hidden w-12 h-12 border border-gray-300">
              <img
                src="/prabowo.jpg"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </button>

            <div className="
              absolute right-0 mt-2
              w-60 rounded-lg shadow-lg
              bg-white border-[#7b5eea] border text-[#7b5eea]
              opacity-0 invisible
              group-hover:opacity-100 group-hover:visible
              transition-all duration-200
            ">
              <ul className="py-2">
                <li className="px-4 py-2 ">{user?.email ?? "-"}</li>
                <li className="px-4 py-2 hover:bg-[#dad1ffff] cursor-pointer">Log out</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </nav>
  );
}
