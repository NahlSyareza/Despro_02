import { Bell } from "lucide-react"

export default function Navigation({ currentPage, setCurrentPage }) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon ">MBG</span>
            <span className="logo-text -ml-1">NUTRITION DATA</span>
          </div>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${currentPage === "overview" ? "active" : ""}`}
            onClick={() => setCurrentPage("overview")}
          >
            Overview
          </button>
          <button
            className={`nav-tab ${currentPage === "analytics" ? "active" : ""}`}
            onClick={() => setCurrentPage("analytics")}
          >
            Analytics
          </button>
          <button
            className={`nav-tab ${currentPage === "meal-planner" ? "active" : ""}`}
            onClick={() => setCurrentPage("meal-planner")}
          >
            Meal Planner
          </button>
        </div>

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
  )
}
