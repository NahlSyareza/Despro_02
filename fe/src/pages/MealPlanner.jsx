import { useState, useEffect } from "react"
import MenuVariants from "@/components/MenuVariants"
import SelectedMenu from "@/components/SelectedMenu"
import WeeklyMenuPlan from "@/components/WeeklyMenuPlan"

export default function MealPlanner() {
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [selectedPlan, setSelectedPlan] = useState("Plan 1")
  const [selectedMenuData, setSelectedMenuData] = useState({})
  const [weeklyMenuData, setWeeklyMenuData] = useState({})

  function getSelectedMenuObject(menu) {
    const categories = ["Carbohydrate", "Protein", "Vegetables", "Fruit", "Drink"]
    const obj = {}
    categories.forEach((cat, idx) => {
      obj[cat] = menu && menu[idx] ? [menu[idx]] : []
    })
    return obj
  }

  console.log("selecte dmenu :", selectedMenuData)
  console.log("selected weekly :", weeklyMenuData)

  const menuItems = {
    Monday: {
      "Plan 1": ["Nasi", "Ayam Goreng Telur", "Orak-Arik Buncis Wortel", "Papaya", "Susu"],
      "Plan 2": ["Nasi", "Ayam Bakar", "Sayur Asem", "Jeruk", "Air Putih"],
      "Plan 3": ["Nasi Goreng", "Telur Dadar", "Tumis Kangkung", "Semangka", "Teh Manis"],
      "Plan 4": ["Nasi", "Tempe Orek", "Capcay", "Melon", "Susu Kedelai"]
    },
    Tuesday: {
      "Plan 1": ["Nasi", "Sempol Telur", "Capcay Bakso", "Papaya", "Tahu"],
      "Plan 2": ["Nasi Uduk", "Ayam Goreng", "Sambal Goreng Kentang", "Pisang", "Air Putih"],
      "Plan 3": ["Nasi", "Ikan Goreng", "Sayur Lodeh", "Melon", "Susu"],
      "Plan 4": ["Nasi Goreng", "Sosis", "Tumis Bayam", "Jeruk", "Teh"]
    },
    Wednesday: {
      "Plan 1": ["Nasi", "Ikan Kembung Goreng", "Tumis Kangkung", "Jeruk", "Susu"],
      "Plan 2": ["Nasi Uduk", "Ayam Geprek", "Sayur Sop", "Semangka", "Air Putih"],
      "Plan 3": ["Nasi", "Telur Ceplok", "Capcay", "Melon", "Teh Tawar"],
      "Plan 4": ["Nasi Goreng", "Tempe Mendoan", "Sayur Bayam", "Pisang", "Susu"]
    },
    Thursday: {
      "Plan 1": ["Nasi", "Telur Dadar", "Sayur Lodeh", "Jeruk", "Air Putih"],
      "Plan 2": ["Nasi Goreng", "Sosis", "Tumis Kangkung", "Melon", "Susu"],
      "Plan 3": ["Nasi", "Ayam Bakar", "Sayur Sop", "Pisang", "Teh"],
      "Plan 4": ["Nasi Uduk", "Ikan Goreng", "Capcay", "Semangka", "Susu"]
    },
    Friday: {
      "Plan 1": ["Nasi", "Telur Codok", "Tumis Labu Siam Wortel", "Melon", "Susu"],
      "Plan 2": ["Nasi Goreng", "Sosis", "Tumis Bayam", "Jeruk", "Teh Manis"],
      "Plan 3": ["Nasi", "Ayam Goreng", "Sayur Asem", "Semangka", "Air Putih"],
      "Plan 4": ["Nasi Uduk", "Tempe Orek", "Sayur Sop", "Pisang", "Susu"]
    }
  }



  useEffect(() => {
    const arr = menuItems[selectedDay]?.[selectedPlan] || []
    setSelectedMenuData(getSelectedMenuObject(arr))
  }, [selectedDay, selectedPlan])


  function handleConfirmSelectedMenu() {
    setWeeklyMenuData(prev => ({
      ...prev,
      [selectedDay]: {
        day: selectedDay,
        ...selectedMenuData
      }
    }))
  }


  // const selectedMenuData = {
  //   Carbohydrate: ["Nasi"],
  //   Protein: ["Ayam Goreng Telur"],
  //   Vegetables: ["Orak-Arik Buncis Wortel"],
  //   Fruit: ["Papaya"],
  //   Drink: ["Susu"],
  // }

  return (
    <div className="meal-planner">
      <div className="planner-container">
        <div className="planner-left">
          <MenuVariants
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            menuItems={menuItems}
          />
        </div>
        <div >
          <SelectedMenu items={selectedMenuData}
            onConfirm={handleConfirmSelectedMenu} />
        </div>
      </div>
      <WeeklyMenuPlan weeklyPlan={weeklyMenuData} />
    </div>
  )
}
