import { NavLink } from "react-router-dom";
import { Bell } from "lucide-react";

export default function Navigation() {
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
        </div>

        {/* RIGHT ICONS */}
        <div className="nav-right">
          <button className="icon-button">
            <Bell color="#7b5eea" fill="#7b5eea" />
          </button>

          <button className="rounded-full overflow-hidden w-12 h-12">
            <img
              src="/prabowo.jpg"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

      </div>
    </nav>
  );
}
