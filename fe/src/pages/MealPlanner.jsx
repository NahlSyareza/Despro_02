import { useState, useEffect } from "react"
import MenuVariants from "@/components/MenuVariants"
import SelectedMenu from "@/components/SelectedMenu"
import WeeklyMenuPlan from "@/components/WeeklyMenuPlan"
import api_url from "@/util/url"


function formatUTCDateToYMD(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}


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

function getWeekRange(dateArg, offset = 0) {
  const d = dateArg instanceof Date ? new Date(dateArg.getTime()) : new Date(dateArg);

  // work in UTC to avoid local timezone shifts
  const utcYear = d.getUTCFullYear();
  const utcMonth = d.getUTCMonth();
  const utcDate = d.getUTCDate();

  // create a UTC-only Date at 00:00 UTC of that day
  const base = new Date(Date.UTC(utcYear, utcMonth, utcDate));

  // Convert JS getUTCDay() so Monday = 0 ... Sunday = 6
  const dayIndex = (base.getUTCDay() + 6) % 7;

  // Move to Monday (UTC), apply week offset
  const mondayUtc = new Date(base.getTime());
  mondayUtc.setUTCDate(base.getUTCDate() - dayIndex + offset * 7);

  const fridayUtc = new Date(mondayUtc.getTime());
  fridayUtc.setUTCDate(mondayUtc.getUTCDate() + 4);

  return {
    monday: formatUTCDateToYMD(mondayUtc),
    friday: formatUTCDateToYMD(fridayUtc),
  };
}

function groupMenusByWeek(menus) {
  // menus: array of menu objects, each with a .date property (YYYY-MM-DD)
  const weeks = {};
  menus.forEach(menu => {
    // const date = new Date(menu.date);
    const { monday, friday } = getWeekRange(menu.date);

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
const todayDate = new Date();
const todayIdx = todayDate.getDay() - 1; // Monday=0, ..., Friday=4
const defaultDay = todayIdx >= 0 && todayIdx < 5 ? days[todayIdx] : "Monday";
const [selectedDay, setSelectedDay] = useState(defaultDay);
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
  if (idx < todayIdx) return true; // Disable days before today
  if (idx === todayIdx) return false; // Today is always enabled
  // For days after today, enable only if previous day is selected in weeklyMenuData
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
const { monday, friday } = getWeekRange(today, weekOffset);
const currentWeekKey = `${monday}_${friday}`;
const currentWeekMenus = groupedMenus[currentWeekKey] || [];
console.log("current week blue: ", groupedMenus);
console.log("current week menus: ", currentWeekMenus);
console.log("current week key: ", currentWeekKey);

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
