import { Button } from "./ui/button"
import { Check } from "lucide-react"

export default function SelectedMenu({ items, onConfirm }) {
  // Warna background lembut untuk setiap kategori
  const categoryStyles = {
    Carbohydrate: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100" },
    Protein: { bg: "bg-red-50", text: "text-red-700", border: "border-red-100" },
    Vegetables: { bg: "bg-green-50", text: "text-green-700", border: "border-green-100" },
    Fruit: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-100" },
    Drink: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#7B5EEA] rounded-full"></span>
            SELECTED MENU
        </h3>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Preview</span>
      </div>

      <div className="flex-1 space-y-3 mb-6 overflow-y-auto">
        {Object.keys(items).length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                <p>No menu data available.</p>
            </div>
        ) : (
            Object.entries(items).map(([category, foods]) => {
                const style = categoryStyles[category] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
                
                return (
                    <div key={category} className="flex items-center gap-4 group">
                        {/* Label Kategori */}
                        <div className="w-28 text-sm font-semibold text-gray-500 capitalize">{category}</div>
                        
                        {/* Item Makanan */}
                        <div className="flex-1">
                            {foods.length > 0 ? foods.map((food, idx) => (
                                <div 
                                    key={idx} 
                                    className={`py-2 px-4 rounded-lg text-sm font-bold border ${style.bg} ${style.text} ${style.border} shadow-sm transition-transform group-hover:scale-[1.01]`}
                                >
                                    {food}
                                </div>
                            )) : (
                                <div className="py-2 px-4 rounded-lg text-sm text-gray-400 border border-gray-100 bg-gray-50 italic">
                                    Empty
                                </div>
                            )}
                        </div>
                    </div>
                )
            })
        )}
      </div>

      <Button 
        onClick={onConfirm} 
        className="w-full bg-[#7B5EEA] hover:bg-[#4e4085] text-white py-6 rounded-xl text-base font-bold shadow-lg shadow-green-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Check size={20} />
        Confirm Selection
      </Button>
    </section>
  )
}