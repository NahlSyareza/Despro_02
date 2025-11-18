import { useState } from "react"
import Navigation from "./components/Navigation"
import MealPlanner from "./pages/MealPlanner"
import Analytics from "./pages/Analytics"
import Overview from "./pages/Overview"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("meal-planner")

  return (
    <div className="app">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">{currentPage === "meal-planner" ? <MealPlanner /> : currentPage === "analytics" ? <Analytics/> : <Overview />}</main>
    </div>
  )
}

export default App
