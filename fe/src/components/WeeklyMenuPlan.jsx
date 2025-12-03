import { Info } from "lucide-react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WeeklyMenuPlan({ weeklyPlan }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const length = Object.keys(weeklyPlan).length

  return (
    <section className="weekly-menu">
       <div className="flex items-center justify-between mb-4">
      <h2 className="section-title">WEEKLY MENU PLAN</h2>
      <div className="flex gap-2">
      <Button className="h-10 w-10 bg-white border border-[#7b5eea] font-bold hover:bg-[#f3eaff] text-[#7b5eea] w-35 justify-center">
        <ChevronLeft  className="h-6 w-6 text-[#7b5eea] -mr-2 -ml-1" />
        Previous Week
      </Button>
      <Button className="h-10 w-10 bg-white border text-[#7b5eea] font-bold border-[#7b5eea] hover:bg-[#f3eaff] w-35 justify-center">
        Next Week
        <ChevronRight className="h-6 w-6 text-[#7b5eea] -ml-2 -mr-2" />
      </Button>
    </div>
  </div>
  <h2 className="-mt-10 mb-5 text-gray-600 text-sm">1 December 2025 - 5 December 2025</h2>
      <div className="week-grid">
        {days.map((day) => {
          const dayData = weeklyPlan?.[day];
          if (!dayData) {
            return (
              <div key={day} className="day-card empty">
                <h4 className="day-header justify-between">
                  {day.toUpperCase()}
                  <Info size={15} className="text-orange-300 mt-1" />
                </h4>
                <div className="empty-state">
                  <p>No menu selected</p>
                  <small>Choose a variant menu above for {day} menu</small>
                </div>
              </div>
            );
          }

          return (
            <div key={day} className="day-card">
              <div className="flex gap-2">
              <h4 className="day-header">{day.toUpperCase()}</h4>
              <h4 className="text-gray-500 text-sm">(1 December 2025)</h4>
              </div>
              <ul className="day-menu-items ">
              {Object.entries(dayData).map(([category, items]) => {
  if (!Array.isArray(items)) return null; // only display food arrays

  return <p className="menu-item-weekly">{items.join(", ")}</p>;
})}

              </ul>
            </div>
          );
        })}
      </div>

      {length < 5 && (
        <div className="warning-banner mt-4 flex items-center gap-2">
          <Info className="h-6 w-6 text-orange-300" />
          <p className="text-yellow-500 font-semibold">
            Please select a menu for each day (Monday - Friday)
          </p>
        </div>
      )}

    </section>
  );
}
