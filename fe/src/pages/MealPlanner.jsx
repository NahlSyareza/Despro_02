import { useState, useEffect } from "react"
import MenuVariants from "@/components/MenuVariants"
import SelectedMenu from "@/components/SelectedMenu"
import WeeklyMenuPlan from "@/components/WeeklyMenuPlan"
import api_url from "@/util/url"

function getNextWeekdays(startDate, count = 5) {
  const result = [];
  const day = new Date(startDate);

  while (result.length < count) {
    const dow = day.getDay();
    if (dow !== 0 && dow !== 6) {
      result.push(day.toISOString().split("T")[0]);
    }
    day.setDate(day.getDate() + 1);
  }
  return result;
}

export default function MealPlanner() {
   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [selectedDay, setSelectedDay] = useState("Monday")
  const [selectedPlan, setSelectedPlan] = useState("Plan 1")
  const [selectedMenuData, setSelectedMenuData] = useState({})
  const [weeklyMenuData, setWeeklyMenuData] = useState({})
  const [menuPlans, setMenuPlans] = useState([])

  const weekdayDates = getNextWeekdays(new Date());
  const dayToDate = {
    Monday: weekdayDates[0],
    Tuesday: weekdayDates[1],
    Wednesday: weekdayDates[2],
    Thursday: weekdayDates[3],
    Friday: weekdayDates[4],
  };

  function isDayDisabled(day) {
    const idx = days.indexOf(day);
    if (idx === 0) return false;

    const prev = days[idx - 1];
    return !weeklyMenuData[prev];
  }

  async function fetchDailyMenus() {
    try {
      const date = dayToDate[selectedDay];

      const requests = Array.from({ length: 4 }, () =>
        api_url.get(`/menu/create_menu?date=${date}`)
      );

      const responses = await Promise.all(requests);
      const menus = responses.map((r) => r.data.payload);

      setMenuPlans(menus);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDailyMenus();
  }, [selectedDay]);

  function getSelectedMenuObject(menu) {
    const categories = ["Carbohydrate", "Protein 1", "Protein 2", "Vegetables", "Fruit"]
    const obj = {}
    categories.forEach((cat, idx) => {
      obj[cat] = menu && menu[idx] ? [menu[idx].name] : [];
    })
    return obj
  }

  console.log("selecte dmenu :", selectedMenuData)
  console.log("selected weekly :", weeklyMenuData)


    useEffect(() => {
    const planIndex = parseInt(selectedPlan.split(" ")[1], 10) - 1;
    const menu = menuPlans[planIndex];
    setSelectedMenuData(getSelectedMenuObject(menu));
  }, [selectedPlan, menuPlans]);

  // const menuItems = {
  //   Monday: {
  //     "Plan 1": ["Nasi", "Ayam Goreng Telur", "Orak-Arik Buncis Wortel", "Papaya", "Susu"],
  //     "Plan 2": ["Nasi", "Ayam Bakar", "Sayur Asem", "Jeruk", "Air Putih"],
  //     "Plan 3": ["Nasi Goreng", "Telur Dadar", "Tumis Kangkung", "Semangka", "Teh Manis"],
  //     "Plan 4": ["Nasi", "Tempe Orek", "Capcay", "Melon", "Susu Kedelai"]
  //   },
  //   Tuesday: {
  //     "Plan 1": ["Nasi", "Sempol Telur", "Capcay Bakso", "Papaya", "Tahu"],
  //     "Plan 2": ["Nasi Uduk", "Ayam Goreng", "Sambal Goreng Kentang", "Pisang", "Air Putih"],
  //     "Plan 3": ["Nasi", "Ikan Goreng", "Sayur Lodeh", "Melon", "Susu"],
  //     "Plan 4": ["Nasi Goreng", "Sosis", "Tumis Bayam", "Jeruk", "Teh"]
  //   },
  //   Wednesday: {
  //     "Plan 1": ["Nasi", "Ikan Kembung Goreng", "Tumis Kangkung", "Jeruk", "Susu"],
  //     "Plan 2": ["Nasi Uduk", "Ayam Geprek", "Sayur Sop", "Semangka", "Air Putih"],
  //     "Plan 3": ["Nasi", "Telur Ceplok", "Capcay", "Melon", "Teh Tawar"],
  //     "Plan 4": ["Nasi Goreng", "Tempe Mendoan", "Sayur Bayam", "Pisang", "Susu"]
  //   },
  //   Thursday: {
  //     "Plan 1": ["Nasi", "Telur Dadar", "Sayur Lodeh", "Jeruk", "Air Putih"],
  //     "Plan 2": ["Nasi Goreng", "Sosis", "Tumis Kangkung", "Melon", "Susu"],
  //     "Plan 3": ["Nasi", "Ayam Bakar", "Sayur Sop", "Pisang", "Teh"],
  //     "Plan 4": ["Nasi Uduk", "Ikan Goreng", "Capcay", "Semangka", "Susu"]
  //   },
  //   Friday: {
  //     "Plan 1": ["Nasi", "Telur Codok", "Tumis Labu Siam Wortel", "Melon", "Susu"],
  //     "Plan 2": ["Nasi Goreng", "Sosis", "Tumis Bayam", "Jeruk", "Teh Manis"],
  //     "Plan 3": ["Nasi", "Ayam Goreng", "Sayur Asem", "Semangka", "Air Putih"],
  //     "Plan 4": ["Nasi Uduk", "Tempe Orek", "Sayur Sop", "Pisang", "Susu"]
  //   }
  // }


 useEffect(() => {
  const fetchMenus = async () => {
    try {
      // Run the same request 4 times in parallel
      const requests = [
        api_url.get("/menu/create_menu"),
        api_url.get("/menu/create_menu"),
        api_url.get("/menu/create_menu"),
        api_url.get("/menu/create_menu"),
      ];

      const responses = await Promise.all(requests);

      const menuPlans = responses.map((res) => res.data.payload);

      console.log("All 4 menu plans:", menuPlans);

      setMenuPlans(menuPlans);

    } catch (error) {
      console.error(error);
    }
  };

  fetchMenus();
}, []);


console.log("menu plans from api :", menuPlans);

  // useEffect(() => {
  //   const arr = menuItems[selectedDay]?.[selectedPlan] || []
  //   setSelectedMenuData(getSelectedMenuObject(arr))
  // }, [selectedDay, selectedPlan])


  // function handleConfirmSelectedMenu() {
  //   setWeeklyMenuData(prev => ({
  //     ...prev,
  //     [selectedDay]: {
  //       day: selectedDay,
  //       ...selectedMenuData
  //     }
  //   }))
  // }

   function handleConfirmSelectedMenu() {
    const date = dayToDate[selectedDay];

     const foods = Object.values(selectedMenuData)
    .flat()
    .filter(Boolean);

    const body = {
    date,
    foods,
  };


       api_url
      .post("/menu/select_menu", body)
      .then((r) => {
        const res = r.data;
        console.log("response tray:", res.payload);
      })
      .catch((e) => {
        console.error(e);
      });

    console.log("selected menu data to save :", selectedMenuData + " selected ")


    setWeeklyMenuData((prev) => ({
      ...prev,
      [selectedDay]: {
        date: dayToDate[selectedDay],
        planIndex: selectedPlan,
        ...selectedMenuData,
      },
    }));
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
            menuItems={menuPlans}
            isDayDisabled={isDayDisabled}
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
