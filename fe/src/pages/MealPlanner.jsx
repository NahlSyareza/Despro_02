import { useState, useEffect } from "react";
import api_url, { IS_MOCK } from "@/util/url"; // Pastikan path ini sesuai
import MenuVariants from "@/components/MenuVariants";
import SelectedMenu from "@/components/SelectedMenu";
import WeeklyMenuPlan from "@/components/WeeklyMenuPlan";
import { Button } from "@/components/ui/button";

import { MOCK_MENU_RECOMMENDATIONS } from "@/data/mockData";

export default function MealPlanner() {
  // --- STATE ---
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedPlan, setSelectedPlan] = useState("Plan 1");
  
  // Data dari API / Backend
  const [menuItems, setMenuItems] = useState({}); 
  
  // Data Lokal untuk UI
  const [selectedMenuData, setSelectedMenuData] = useState({});
  const [weeklyMenuData, setWeeklyMenuData] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- 1. FETCH DATA REKOMENDASI DARI API ---
  useEffect(() => {
    async function fetchMenu() {
      setLoading(true);
      try {
        if (IS_MOCK) {
            // ... mock logic
            setMenuItems(MOCK_MENU_RECOMMENDATIONS);
            setLoading(false);
            return; 
        }

        const res = await api_url.get("/menu/recommendations");
        if (res.data && res.data.payload) {
            setMenuItems(res.data.payload);
        }
        
        // --- BAGIAN INI YANG PERLU DIPERBAIKI ---
        // Cek apakah user sudah punya menu aktif sebelumnya
        const vendorData = JSON.parse(localStorage.getItem("vendor_data"));
        if(vendorData?.vendor_id) {
           try {
             const activeRes = await api_url.get(`/menu/${vendorData.vendor_id}/active`);
             
             // HAPUS KOMENTAR PADA BARIS DI BAWAH INI:
             if(activeRes.data.payload) {
                 setWeeklyMenuData(activeRes.data.payload); 
             }
             
           } catch(err) {
             console.log("Belum ada menu aktif");
           }
        }
      } catch (e) {
        console.error("Failed to fetch menu:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // --- 2. HELPER: TRANSFORM ARRAY KE OBJECT KATEGORI ---
  function getSelectedMenuObject(menuArr) {
    const categories = ["Carbohydrate", "Protein", "Vegetables", "Fruit", "Drink"];
    const obj = {};
    categories.forEach((cat, idx) => {
      // Pastikan ada data di index tersebut
      obj[cat] = menuArr && menuArr[idx] ? [menuArr[idx]] : [];
    });
    return obj;
  }

  // --- 3. UPDATE TAMPILAN SAAT HARI / PLAN BERUBAH ---
  useEffect(() => {
    // Ambil array menu berdasarkan hari & plan yang dipilih
    // Fallback ke array kosong [] jika data belum siap
    const currentMenuArr = menuItems[selectedDay]?.[selectedPlan] || [];
    setSelectedMenuData(getSelectedMenuObject(currentMenuArr));
  }, [selectedDay, selectedPlan, menuItems]);

  // --- 4. HANDLER: KONFIRMASI MENU KE JADWAL MINGGUAN ---
  function handleConfirmSelectedMenu() {
    // Validasi sederhana: jangan simpan jika menu kosong
    const hasItems = Object.values(selectedMenuData).some(arr => arr.length > 0);
    if (!hasItems) {
      alert("Menu is empty/loading. Please wait or select another plan.");
      return;
    }

    setWeeklyMenuData(prev => ({
      ...prev,
      [selectedDay]: {
        day: selectedDay,
        ...selectedMenuData
      }
    }));
  }

  // --- 5. HANDLER: SIMPAN KE DATABASE ---
  async function handleSave() {
    const vendorData = JSON.parse(localStorage.getItem("vendor_data"));
    if (!vendorData?.vendor_id) {
        alert("Please login first as a vendor.");
        return;
    }

    // Validasi: Pastikan ada minimal 1 hari yang terisi
    if (Object.keys(weeklyMenuData).length === 0) {
        alert("Your weekly plan is empty. Please confirm a menu for at least one day.");
        return;
    }

    setSaving(true);
    try {
        await api_url.post("/menu/save", {
            vendor_id: vendorData.vendor_id,
            weeklyPlan: weeklyMenuData
        });
        alert("Weekly Menu successfully saved to database!");
    } catch (e) {
        console.error(e);
        alert("Failed to save menu. Please try again.");
    } finally {
        setSaving(false);
    }
  }

  // --- RENDER UI ---
  return (
    <div className="min-h-screen p-6 bg-gray-50/50 space-y-8 font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Meal Planner</h1>
           <p className="text-gray-500 text-sm mt-1">Select and arrange nutritional menus for the week.</p>
        </div>
        <Button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="bg-[#7B5EEA] hover:bg-[#6a4fea] text-white px-6 py-2 rounded-xl shadow-md transition-all font-semibold"
        >
            {saving ? "Saving..." : "Save Weekly Plan"}
        </Button>
      </div>

      {/* Main Content Area: Split View */}
      {/* Menggunakan Flexbox responsive: Column di HP, Row di Desktop */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Kiri: Menu Variants (Pilihan) */}
        <div className="w-full lg:w-1/2">
          <MenuVariants
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            menuItems={menuItems}
          />
        </div>
        
        {/* Kanan: Selected Menu (Preview & Confirm) */}
        <div className="w-full lg:w-1/2">
          <SelectedMenu 
            items={selectedMenuData}
            onConfirm={handleConfirmSelectedMenu} 
          />
        </div>
      </div>
      
      {/* Bottom Area: Weekly Plan Overview */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
        <WeeklyMenuPlan weeklyPlan={weeklyMenuData} />
      </div>

    </div>
  );
}