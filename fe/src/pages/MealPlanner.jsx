import { useState, useEffect } from "react";
import api_url, { IS_MOCK } from "@/util/url";
import { MOCK_MENU_RECOMMENDATIONS } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Calendar, ChevronLeft, ChevronRight, X, ChevronRight as ChevronRightSmall, Plus, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function MealPlanner() {
  // --- STATE TANGGAL ---
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0); 
  
  // --- STATE DATA ---
  const [menuItems, setMenuItems] = useState({}); // Rekomendasi Plan (untuk Modal)
  const [weeklyMenuData, setWeeklyMenuData] = useState({}); // Data Menu Tersimpan/Aktif
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State baru untuk loading AI
  const [loadingAuto, setLoadingAuto] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // --- HELPER DATE ---
  const getWeekStartDate = (dateObj, weekIndex) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay(); 
    const diff = firstDayOfMonth.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
    const firstMonday = new Date(firstDayOfMonth.setDate(diff));
    const targetMonday = new Date(firstMonday);
    targetMonday.setDate(firstMonday.getDate() + (weekIndex * 7));
    return targetMonday;
  };

  const currentWeekStart = getWeekStartDate(currentDate, selectedWeekIndex);

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // --- 1. FETCH DATA ---
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setWeeklyMenuData({}); 

      try {
        if (IS_MOCK) {
          setMenuItems(MOCK_MENU_RECOMMENDATIONS);
          setLoading(false);
          return;
        }

        // 1. Ambil Opsi Plan (untuk Modal Manual)
        const recRes = await api_url.get("/menu/recommendations");
        if (recRes.data?.payload) setMenuItems(recRes.data.payload);

        // 2. Ambil Menu Tersimpan Minggu Ini
        const vendorData = JSON.parse(localStorage.getItem("vendor_data") || "{}");
        if (vendorData.vendor_id) {
            const startStr = formatDateLocal(currentWeekStart);
            const endObj = new Date(currentWeekStart);
            endObj.setDate(endObj.getDate() + 6); 
            const endStr = formatDateLocal(endObj);

            const menuRes = await api_url.get(`/menu/${vendorData.vendor_id}/week?startDate=${startStr}&endDate=${endStr}`);
            if (menuRes.data?.payload) {
                setWeeklyMenuData(menuRes.data.payload);
            }
        }
      } catch (e) {
        console.error("Error fetching menu:", e);
        toast.error("Gagal memuat data menu.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentDate, selectedWeekIndex]);

  // --- HANDLERS NAVIGASI ---
  const changeMonth = (dir) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + dir);
      setCurrentDate(newDate);
      setSelectedWeekIndex(0); 
  };

  // --- HANDLERS MENU ---
  const openSelectionModal = (day) => {
    setActiveDay(day);
    setIsModalOpen(true);
  };

  const handleSelectPlan = (day, planName, planItems) => {
    const formattedMenu = {
      Carbohydrate: [planItems[0]],
      Protein: [planItems[1]],
      Vegetables: [planItems[2]],
      Fruit: [planItems[3]],
      Drink: [planItems[4]]
    };

    setWeeklyMenuData(prev => ({
      ...prev,
      [day]: {
        day: day,
        selectedPlanName: planName,
        ...formattedMenu
      }
    }));
    setIsModalOpen(false);
    toast.success(`Menu ${day} berhasil dipilih!`);
  };

  const handleRemoveMenu = (day) => {
    setWeeklyMenuData(prev => {
      const newData = { ...prev };
      delete newData[day];
      return newData;
    });
    toast.info(`Menu ${day} dihapus.`);
  };

  // --- FITUR BARU: SMART AUTO-FILL ---
  const handleSmartAutoFill = async () => {
    setLoadingAuto(true);
    try {
        const vendorData = JSON.parse(localStorage.getItem("vendor_data") || "{}");
        if (!vendorData.vendor_id) return toast.error("Silakan login ulang.");

        // Panggil endpoint khusus Smart Fill
        const res = await api_url.get(`/menu/smart-fill/${vendorData.vendor_id}`);
        const smartMenu = res.data.payload; // Format: { Monday: {...}, Tuesday: {...} }

        // Update state weeklyMenuData (Timpa data yang ada atau gabungkan)
        // Di sini kita gabungkan: jika hari sudah ada isinya, kita timpa dengan rekomendasi baru
        setWeeklyMenuData(prev => ({
            ...prev,
            ...smartMenu
        }));

        const sourceMsg = res.data.source === "historical_best" 
            ? "Berdasarkan menu rating tinggi Anda!" 
            : "Menu gizi seimbang (Randomized)";
            
        toast.success("Menu Mingguan Terisi Otomatis! ✨", {
            description: sourceMsg
        });

    } catch (error) {
        console.error("Auto fill error:", error);
        toast.error("Gagal generate rekomendasi otomatis.");
    } finally {
        setLoadingAuto(false);
    }
  };

  // --- SAVE ---
  const handleSave = async () => {
    const vendorData = JSON.parse(localStorage.getItem("vendor_data") || "{}");
    if (!vendorData.vendor_id) return toast.error("Anda harus login terlebih dahulu.");;

    setSaving(true);
    const toastId = toast.loading("Menyimpan menu mingguan...");

    try {
      const startStr = formatDateLocal(currentWeekStart);
      
      await api_url.post("/menu/save", {
        vendor_id: vendorData.vendor_id,
        weeklyPlan: weeklyMenuData,
        startDate: startStr 
      });
      
      toast.success("Menu berhasil disimpan ke database!", { id: toastId });

    } catch (e) {
      toast.error("Gagal menyimpan menu. Coba lagi.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const monthLabel = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans relative">
      
      {/* HEADER UTAMA */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-[#7B5EEA]" />
            Meal Planner
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Jadwalkan menu harian siswa per minggu.
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            {/* TOMBOL AI SMART FILL (BARU) */}
            <Button 
                onClick={handleSmartAutoFill} 
                disabled={loadingAuto || loading}
                variant="outline"
                className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 shadow-sm transition-all gap-2 w-full md:w-auto"
            >
                {loadingAuto ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                )}
                AI Smart Fill
            </Button>

            {/* TOMBOL SAVE */}
            <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-[#7B5EEA] hover:bg-[#6a4fea] text-white gap-2 shadow-md w-full md:w-auto"
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Changes"}
            </Button>
        </div>
      </div>

      {/* --- 1. MONTH SCROLLER --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex items-center justify-between">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
            <ChevronLeft />
          </button>
          
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide min-w-[200px] text-center">
            {monthLabel}
          </h2>

          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
            <ChevronRight />
          </button>
      </div>

      {/* --- 2. WEEK BUTTONS --- */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
            {[0, 1, 2, 3, 4].map((idx) => {
                const weekStart = getWeekStartDate(currentDate, idx);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 4);
                
                const label = `${weekStart.getDate()} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('en-US', { month: 'short' })}`;
                const isActive = idx === selectedWeekIndex;

                return (
                    <button
                        key={idx}
                        onClick={() => setSelectedWeekIndex(idx)}
                        className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl border transition-all text-sm font-medium flex flex-col items-center gap-1 ${
                            isActive 
                            ? "bg-[#7B5EEA] text-white border-[#7B5EEA] shadow-lg shadow-purple-200" 
                            : "bg-white text-gray-500 border-gray-200 hover:border-purple-200 hover:bg-purple-50"
                        }`}
                    >
                        <span className={`text-xs uppercase tracking-wider ${isActive ? "text-purple-200" : "text-gray-400"}`}>Week {idx + 1}</span>
                        <span className="font-bold">{label}</span>
                    </button>
                )
            })}
        </div>
      </div>

      {/* --- 3. GRID 5 HARI --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {days.map((day, idx) => {
            const dayData = weeklyMenuData[day];
            const isFilled = !!dayData;
            
            const thisDate = new Date(currentWeekStart);
            thisDate.setDate(thisDate.getDate() + idx);
            const dateDisplay = thisDate.getDate();

            return (
                <div key={day} className="flex flex-col h-full">
                    {/* Header Hari */}
                    <div className={`p-3 rounded-t-xl text-center border-x border-t flex flex-col justify-center ${
                        isFilled ? "bg-[#7B5EEA] text-white border-[#7B5EEA]" : "bg-white text-gray-400 border-gray-200"
                    }`}>
                        <span className="text-xs font-bold uppercase tracking-wider">{day}</span>
                        <span className="text-lg font-black">{dateDisplay}</span>
                    </div>

                    {/* Body Hari */}
                    <div className={`flex-1 p-4 border-x border-b rounded-b-xl flex flex-col gap-4 transition-all bg-white ${
                        isFilled ? "border-[#7B5EEA] shadow-md" : "border-gray-200 border-dashed"
                    }`}>
                        {isFilled ? (
                            <>
                                <div className="space-y-3 flex-1">
                                    <Badge className="bg-purple-50 text-[#7B5EEA] hover:bg-purple-100 border-purple-100 w-full justify-center">
                                        {dayData.selectedPlanName || "Menu Siap"}
                                    </Badge>
                                    <ul className="text-xs space-y-2 text-gray-600">
                                        <li className="flex gap-2"><span className="font-semibold text-gray-800 w-12">Carbs:</span> <span className="truncate">{dayData.Carbohydrate?.[0]}</span></li>
                                        <li className="flex gap-2"><span className="font-semibold text-gray-800 w-12">Pro:</span> <span className="truncate">{dayData.Protein?.[0]}</span></li>
                                        <li className="flex gap-2"><span className="font-semibold text-gray-800 w-12">Veg:</span> <span className="truncate">{dayData.Vegetables?.[0]}</span></li>
                                        <li className="flex gap-2"><span className="font-semibold text-gray-800 w-12">Fruit:</span> <span className="truncate">{dayData.Fruit?.[0]}</span></li>
                                    </ul>
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => openSelectionModal(day)}>Edit</Button>
                                    <Button variant="ghost" size="sm" className="text-red-400 h-8 w-8 p-0" onClick={() => handleRemoveMenu(day)}><Trash2 size={14} /></Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer group" onClick={() => openSelectionModal(day)}>
                                <div className="w-12 h-12 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center mb-3 group-hover:border-[#7B5EEA] group-hover:text-[#7B5EEA]">
                                    <Plus size={24} />
                                </div>
                                <p className="text-sm font-medium text-gray-500 group-hover:text-[#7B5EEA]">Add Menu</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        })}
      </div>

      {/* MODAL MANUAL SELECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Select Menu for {activeDay}</h2>
                        <p className="text-sm text-gray-500">Choose one of the balanced meal recommendations.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-500" /></button>
                </div>
                <div className="p-6 overflow-y-auto bg-gray-50/30 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {menuItems[activeDay] && Object.entries(menuItems[activeDay]).map(([planName, items]) => (
                            <div key={planName} onClick={() => handleSelectPlan(activeDay, planName, items)} className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-[#7B5EEA] hover:shadow-lg transition-all group relative">
                                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800 group-hover:text-[#7B5EEA]">{planName}</h3><div className="w-6 h-6 rounded-full border border-gray-300 group-hover:bg-[#7B5EEA] group-hover:border-[#7B5EEA] flex items-center justify-center"><ChevronRightSmall size={14} className="text-white opacity-0 group-hover:opacity-100" /></div></div>
                                <div className="space-y-2">{items.map((food, i) => (<div key={i} className="flex items-center gap-3 text-sm text-gray-600"><div className={`w-1.5 h-1.5 rounded-full ${i===0?"bg-orange-400":i===1?"bg-red-400":i===2?"bg-green-400":i===3?"bg-yellow-400":"bg-blue-400"}`} /><span>{food}</span></div>))}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}