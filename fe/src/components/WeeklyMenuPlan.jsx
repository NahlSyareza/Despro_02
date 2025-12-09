import { Info, Calendar } from "lucide-react";

export default function WeeklyMenuPlan({ weeklyPlan }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const length = Object.keys(weeklyPlan).length;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
         <h2 className="text-lg font-bold text-gray-800">WEEKLY PLAN OVERVIEW</h2>
         <div className="h-px flex-1 bg-gray-200"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {days.map((day) => {
          const dayData = weeklyPlan?.[day];
          const isFilled = !!dayData;

          return (
            <div 
                key={day} 
                className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                    isFilled 
                    ? "bg-white border-gray-200 shadow-sm hover:shadow-md" 
                    : "bg-gray-50 border-dashed border-gray-300 opacity-70"
                }`}
            >
              <h4 className={`text-sm font-bold mb-3 uppercase tracking-wider flex items-center gap-2 ${isFilled ? "text-[#7B5EEA]" : "text-gray-400"}`}>
                <Calendar size={14} />
                {day}
              </h4>

              {isFilled ? (
                 <ul className="space-y-2">
                    {Object.entries(dayData).map(([category, items]) => {
                        if (category === "day") return null;
                        if (!items || items.length === 0) return null;
                        return (
                            <li key={category} className="text-xs text-gray-600 line-clamp-1">
                                <span className="font-semibold text-gray-800 mr-1">{category.slice(0,3)}:</span> 
                                {items.join(", ")}
                            </li>
                        );
                    })}
                 </ul>
              ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Info size={20} className="text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">No menu selected</p>
                  </div>
              )}
              
              {/* Status Indicator */}
              <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${isFilled ? "bg-green-400" : "bg-gray-300"}`} />
            </div>
          );
        })}
      </div>

      {length < 5 && (
        <div className="mt-6 flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-700 text-sm">
          <Info className="h-5 w-5 shrink-0" />
          <p>
            You haven't completed the plan for all 5 days. Please ensure every day has a menu before saving.
          </p>
        </div>
      )}
    </section>
  );
}