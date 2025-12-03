import { Info } from "lucide-react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WeeklyMenuPlan({ weekMenus, weekRange, setWeekOffset, weekOffset }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  console.log("weekly menu plan weekMenus: ", weekMenus);
  console.log("weekly menu plan weekRange: ", weekRange);
  console.log("weekly menu plan weekOffset: ", weekOffset);
  // const length = Object.keys(weeklyPlan).length
   const menuByDate = {};
  weekMenus.forEach(menu => {
    const dateObj = new Date(menu.date);
    const dateStr = dateObj.toISOString().split("T")[0];
    menuByDate[dateStr] = menu;
  });

  // Get all dates for the current week
  const weekDates = [];
  const mondayDate = new Date(weekRange.monday);
  for (let i = 0; i < 5; i++) {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    weekDates.push(d.toISOString().split("T")[0]);
  }

  return (
    <section className="weekly-menu">
       <div className="flex items-center justify-between mb-4">
      <h2 className="section-title">WEEKLY MENU PLAN</h2>
      <div className="flex gap-2">
      <Button onClick={() => setWeekOffset(weekOffset - 1)} className="h-10 w-10 bg-white border border-[#7b5eea] font-bold hover:bg-[#f3eaff] text-[#7b5eea] w-35 justify-center">
        <ChevronLeft  className="h-6 w-6 text-[#7b5eea] -mr-2 -ml-1" />
        Previous Week
      </Button>
      <Button onClick={() => setWeekOffset(weekOffset + 1)} className="h-10 w-10 bg-white border text-[#7b5eea] font-bold border-[#7b5eea] hover:bg-[#f3eaff] w-35 justify-center">
        Next Week
        <ChevronRight className="h-6 w-6 text-[#7b5eea] -ml-2 -mr-2" />
      </Button>
    </div>
  </div>
  <h2 className="-mt-10 mb-5 text-gray-600 text-sm">
        {weekRange.monday} - {weekRange.friday}
      </h2>
      <div className="week-grid">
        {days.map((day, idx) => {
           const dateStr = weekDates[idx];
          const menu = menuByDate[dateStr];
         return (
            <div key={day} className={`day-card${!menu ? " empty" : ""}`}>
              <div className="flex gap-2">
                <h4 className="day-header">{day.toUpperCase()}</h4>
                <h4 className="text-gray-500 text-sm">({dateStr})</h4>
              </div>
              {menu ? (
                <ul className="day-menu-items">
                  {menu.foods && menu.foods.length > 0 ? (
                    menu.foods.map((foodItem, foodIdx) => (
                      <p className="capitalize-text" key={foodIdx}>{foodItem}</p>
                    ))
                  ) : (
                    <li>No foods available</li>
                  )}
                </ul>
              ) : (
                <div className="empty-state">
                  <p>No menu selected</p>
                  <small>Choose a variant menu above for {day} menu</small>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
