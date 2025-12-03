import { ChevronLeft, ChevronRight } from "lucide-react"

export default function MenuVariants({ selectedDay, setSelectedDay, selectedPlan, setSelectedPlan, menuItems, isDayDisabled }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const nutrient = ["Carbs", "Protein 1", "Protein 2", "Vegetable", "Fruit"]

  return (
    <section className="menu-variants">
      <h2 className="section-title">MENU VARIANTS</h2>

      <div className="menu-plan-selector ">
        <label className="selector-label">Select Menu Plan</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            className={`plan-btn ${selectedPlan === "Plan 1" ? "active" : ""}`}
            onClick={() => setSelectedPlan("Plan 1")}
          >
            Plan 1
          </button>
          <button
            className={`plan-btn ${selectedPlan === "Plan 2" ? "active" : ""}`}
            onClick={() => setSelectedPlan("Plan 2")}
          >
            Plan 2
          </button>
          <button
            className={`plan-btn ${selectedPlan === "Plan 3" ? "active" : ""}`}
            onClick={() => setSelectedPlan("Plan 3")}
          >
            Plan 3
          </button>
          <button
            className={`plan-btn ${selectedPlan === "Plan 4" ? "active" : ""}`}
            onClick={() => setSelectedPlan("Plan 4")}
          >
            Plan 4
          </button>
        </div>
      </div>

      <div className="day-selector">
        <label className="selector-label">Select Day</label>
        <div className="day-buttons">
          <button className="arrow-btn">
            <ChevronLeft />
          </button>
          {days.map((day) => (
            <button
              key={day}
              className={`day-btn ${selectedDay === day ? "active" : ""}`}
              disabled={isDayDisabled(day)}
              onClick={() => !isDayDisabled(day) && setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
          <button className="arrow-btn">
            <ChevronRight></ChevronRight>
          </button>
        </div>

        <h3 className="menu-day-title">{selectedDay}'s Menu</h3>
        <div className="menu-display justify-between text-left">
          <ul className="space-y-2">
            {nutrient.map((nutrient, idx) => (
              <li key={idx} className="flex justify-between">
                <p className="font-medium text-gray-700 text-left w-1/2">{nutrient}:</p>
                <p className="text-gray-900 font-semibold text-left w-1/5 capitalize-text">
                  {menuItems && menuItems.length > 0
  ? (menuItems[parseInt(selectedPlan.split(" ")[1], 10) - 1]?.[idx]?.name || "-")
  : "-"
}

                </p>
              </li>
            ))}
          </ul>
        </div>


      </div>
    </section>
  )
}
