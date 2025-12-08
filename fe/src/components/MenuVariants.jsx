import { ChevronLeft, ChevronRight } from "lucide-react"

export default function MenuVariants({ selectedDay, setSelectedDay, selectedPlan, setSelectedPlan, menuItems }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const nutrient = ["Carbs", "Protein", "Vegetables", "Fruit", "Drink"]

  // Helper untuk pindah hari
  const changeDay = (direction) => {
    const currentIndex = days.indexOf(selectedDay);
    if (direction === 'next') {
        setSelectedDay(days[(currentIndex + 1) % days.length]);
    } else {
        setSelectedDay(days[(currentIndex - 1 + days.length) % days.length]);
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#7B5EEA] rounded-full"></span>
        MENU VARIANTS
      </h2>

      {/* Plan Selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">Select Menu Plan</label>
        <div className="grid grid-cols-4 gap-2">
          {["Plan 1", "Plan 2", "Plan 3", "Plan 4"].map((plan) => (
            <button
              key={plan}
              className={`py-2 px-1 rounded-lg text-sm font-medium transition-all duration-200 border ${
                selectedPlan === plan 
                ? "bg-[#7B5EEA] text-white border-[#7B5EEA] shadow-md" 
                : "bg-white text-gray-600 border-gray-200 hover:border-[#7B5EEA]/50 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan}
            </button>
          ))}
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex-1 flex flex-col">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">Select Day</label>
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between bg-gray-50 p-1 rounded-xl mb-6">
          <button onClick={() => changeDay('prev')} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-gray-800 w-24 text-center">{selectedDay}</span>
          <button onClick={() => changeDay('next')} className="p-2 hover:bg-white rounded-lg text-gray-500 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Menu List */}
        <div className="bg-gray-50/50 rounded-xl p-5 border border-dashed border-gray-200 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                Composition for {selectedDay}, {selectedPlan}
            </h3>
            <ul className="space-y-4">
                {nutrient.map((nutri, idx) => (
                <li key={idx} className="flex justify-between items-center group">
                    <span className="text-sm font-medium text-gray-500 group-hover:text-[#7B5EEA] transition-colors">{nutri}</span>
                    <span className="text-sm font-bold text-gray-800 text-right max-w-[60%] truncate">
                        {menuItems[selectedDay]?.[selectedPlan]?.[idx] ?? "-"}
                    </span>
                </li>
                ))}
            </ul>
        </div>
      </div>
    </section>
  )
}