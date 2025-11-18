import { Info } from "lucide-react";

export default function WeeklyMenuPlan({ weeklyPlan }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const length = Object.keys(weeklyPlan).length

  return (
    <section className="weekly-menu">
      <h2 className="section-title">WEEKLY MENU PLAN</h2>

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
              <h4 className="day-header">{day.toUpperCase()}</h4>

              <ul className="day-menu-items ">
                {Object.entries(dayData).map(([category, items]) => {
                  if (category === "day") return null;
                  return (

                    <p>
                      {items.join(", ")}
                    </p>
                  );
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
