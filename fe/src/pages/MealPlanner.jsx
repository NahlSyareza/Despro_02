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

function getWeekRange(date, offset = 0) {
  // offset: 0 = current week, -1 = previous, 1 = next, etc.
  const d = new Date(date);
  // Find Monday of the week
  console.log("spicles 1: ", d)
  const day = (d.getDay() + 6) % 7;
  console.log("spicles 2: ", day)
  // const diffToMonday = (day === 0 ? -6 : 1) - day;
  // console.log("spicles 3: ", diffToMonday)
  d.setDate(d.getDate() - day + offset * 7);
  console.log("spicles 4: ", d)
  const monday = new Date(d);
  console.log("spicles 5: ", monday)
  const friday = new Date(d);
  console.log("spicles 6: ", friday)
  friday.setDate(friday.getDate() + 4);
  console.log("spicles 7: ", friday)
  return {
    monday: monday.toISOString().split("T")[0],
    friday: friday.toISOString().split("T")[0],
  };
}

function groupMenusByWeek(menus) {
  // menus: array of menu objects, each with a .date property (YYYY-MM-DD)
  const weeks = {};
  menus.forEach(menu => {
    const date = new Date(menu.date);
    const { monday, friday } = getWeekRange(date);

    const weekKey = `${monday}_${friday}`;
    if (!weeks[weekKey]) weeks[weekKey] = [];
    weeks[weekKey].push(menu);
  });
  console.log("grouped weeks: ", weeks);
  return weeks;
}


export default function MealPlanner({ user }) {
  console.log("user on meal planner: ", user.vendor_id)
   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [selectedDay, setSelectedDay] = useState("Monday")
  const [selectedPlan, setSelectedPlan] = useState("Plan 1")
  const [selectedMenuData, setSelectedMenuData] = useState({})
  const [weeklyMenuData, setWeeklyMenuData] = useState({})
  const [menuPlans, setMenuPlans] = useState([])
  const [groupedMenus, setGroupedMenus] = useState({})


  useEffect(() => {
  api_url
    .get(`menu/get_menu/${user.vendor_id}`)
    .then((r) => {
      const menus = r.data.payload;
      const grouped = groupMenusByWeek(menus);
      console.log("grouped menus from api: ", grouped);
      console.log("menus from api: ", menus);
      setGroupedMenus(grouped);
    })
    .catch((e) => {
      console.error(e);
    });
}, [user.vendor_id]);

console.log("let it go: ", groupedMenus)


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
    vendor_id: user.vendor_id
  };


       api_url
      .post("/menu/select_menu", body)
      .then((r) => {
        const res = r.data;
        console.log("response selected menu:", res.payload);
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

  const [weekOffset, setWeekOffset] = useState(0);
  const today = new Date();
const { monday, friday } = getWeekRange(today, 0);
const currentWeekKey = `${monday}_${friday}`;
const currentWeekMenus = groupedMenus[currentWeekKey] || [];
console.log("current week menus: ", currentWeekMenus);

const prevWeekKey = (() => {
  const { monday, friday } = getWeekRange(today, -1);
  return `${monday}_${friday}`;
})();
const prevWeekMenus = groupedMenus[prevWeekKey] || [];
console.log("previous week menus: ", prevWeekMenus);


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
      <WeeklyMenuPlan
  weekKey={currentWeekKey}
  weekMenus={currentWeekMenus}
  weekRange={{ monday, friday }}
  setWeekOffset={setWeekOffset}
  weekOffset={weekOffset}
/>
    </div>
  )
}
