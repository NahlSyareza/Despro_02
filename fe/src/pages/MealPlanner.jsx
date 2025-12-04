import { useState, useEffect } from "react";
import MenuVariants from "@/components/MenuVariants";
import SelectedMenu from "@/components/SelectedMenu";
import WeeklyMenuPlan from "@/components/WeeklyMenuPlan";
import api_url from "@/util/url";
import { toast } from "react-toastify";

function formatUTCDateToYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getCurrentWeekdays(date = new Date()) {
  // Find Monday of the current week
  const dayOfWeek = date.getDay(); // Sunday=0, Monday=1, ..., Saturday=6
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((dayOfWeek + 6) % 7));
  // Get dates for Monday to Friday
  const weekdays = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekdays.push(d.toISOString().split("T")[0]);
  }
  return weekdays;
}

function getWeekRange(dateArg, offset = 0) {
  const d =
    dateArg instanceof Date ? new Date(dateArg.getTime()) : new Date(dateArg);
  const utcYear = d.getUTCFullYear();
  const utcMonth = d.getUTCMonth();
  const utcDate = d.getUTCDate();

  const base = new Date(Date.UTC(utcYear, utcMonth, utcDate));
  const dayIndex = (base.getUTCDay() + 6) % 7;
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
  const weeks = {};
  menus.forEach((menu) => {
    const { monday, friday } = getWeekRange(menu.date);

    const weekKey = `${monday}_${friday}`;
    if (!weeks[weekKey]) weeks[weekKey] = [];
    weeks[weekKey].push(menu);
  });
  console.log("grouped weeks: ", weeks);
  return weeks;
}

export default function MealPlanner({ user }) {
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const todayDate = new Date();
  const todayIdx = todayDate.getDay() - 1;
  const defaultDay = todayIdx >= 0 && todayIdx < 5 ? days[todayIdx] : "Monday";
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [selectedPlan, setSelectedPlan] = useState("Plan 1");
  const [selectedMenuData, setSelectedMenuData] = useState({});
  const [weeklyMenuData, setWeeklyMenuData] = useState({});
  const [menuPlans, setMenuPlans] = useState([]);
  const [groupedMenus, setGroupedMenus] = useState({});
  const [menuExistenceMap, setMenuExistenceMap] = useState({});

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

  console.log("let it go: ", groupedMenus);

  const weekdayDates = getCurrentWeekdays(todayDate);
  const dayToDate = {
    Monday: weekdayDates[0],
    Tuesday: weekdayDates[1],
    Wednesday: weekdayDates[2],
    Thursday: weekdayDates[3],
    Friday: weekdayDates[4],
  };

  function isDayDisabled(day) {
    const idx = days.indexOf(day);
    if (idx < todayIdx) return true;
    if (idx === todayIdx) return false;
    const prev = days[idx - 1];
    return !weeklyMenuData[prev];
  }

  function getSelectedMenuObject(menu) {
    const categories = [
      "Carbohydrate",
      "Protein 1",
      "Protein 2",
      "Vegetables",
      "Fruit",
    ];
    const obj = {};
    categories.forEach((cat, idx) => {
      obj[cat] = menu && menu[idx] ? [menu[idx].name] : [];
    });
    return obj;
  }

  console.log("selecte dmenu :", selectedMenuData);
  console.log("selected weekly :", weeklyMenuData);

  useEffect(() => {
    const planIndex = parseInt(selectedPlan.split(" ")[1], 10) - 1;
    const menu = menuPlans[planIndex];
    setSelectedMenuData(getSelectedMenuObject(menu));
  }, [selectedPlan, menuPlans]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
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
  }, [selectedDay]);

  console.log("menu plans from api :", menuPlans);

  function handleConfirmSelectedMenu() {
    setLoadingConfirm(true);
    const date = dayToDate[selectedDay];

    const foods = Object.values(selectedMenuData).flat().filter(Boolean);

    const isExist = menuExistenceMap[date]?.exists;
    const menuID = menuExistenceMap[date]?.menuID;

    if (isExist && menuID !== 0) {
      const body = {
        menu_id: menuID,
        foods,
      };

      api_url
        .put("/menu/update_menu", body)
        .then(() => {
          api_url
            .get(`menu/get_menu/${user.vendor_id}`)
            .then((r) => {
              const menus = r.data.payload;
              const grouped = groupMenusByWeek(menus);
              console.log("grouped menus from api: ", grouped);
              console.log("menus from api: ", menus);
              setGroupedMenus(grouped);
              setLoadingConfirm(false);
            })
            .catch((e) => {
              console.error(e);
            });

          toast.success(`Success update menu for ${selectedDay}`, {
            position: "bottom-right",
          });

          setWeeklyMenuData((prev) => ({
            ...prev,
            [selectedDay]: {
              date: dayToDate[selectedDay],
              planIndex: selectedPlan,
              ...selectedMenuData,
            },
          }));
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => setLoadingConfirm(false));
    } else {
      const body = {
        date,
        foods,
        vendor_id: user.vendor_id,
      };

      api_url
        .post("/menu/select_menu", body)
        .then((r) => {
          const res = r.data;
          console.log("response selected menu:", res.payload);

          api_url
            .get(`menu/get_menu/${user.vendor_id}`)
            .then((r) => {
              const menus = r.data.payload;
              const grouped = groupMenusByWeek(menus);
              console.log("grouped menus from api: ", grouped);
              console.log("menus from api: ", menus);
              setGroupedMenus(grouped);
              setLoadingConfirm(false);
            })
            .catch((e) => {
              console.error(e);
            });
        })
        .catch((e) => {
          console.error(e);
        });

      console.log(
        "selected menu data to save :",
        selectedMenuData + " selected "
      );

      setWeeklyMenuData((prev) => ({
        ...prev,
        [selectedDay]: {
          date: dayToDate[selectedDay],
          planIndex: selectedPlan,
          ...selectedMenuData,
        },
      }));
    }
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

  function handleMenuStatusChange(day, dateStr, exists, menuID) {
    setMenuExistenceMap((prev) => {
      if (
        prev[dateStr]?.exists === exists &&
        prev[dateStr]?.menuID === menuID
      ) {
        return prev;
      }
      return {
        ...prev,
        [dateStr]: { exists, menuID },
      };
    });
  }

  console.log("orca: ", menuExistenceMap);
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
        <div>
          <SelectedMenu
            items={selectedMenuData}
            onConfirm={handleConfirmSelectedMenu}
            loading={loadingConfirm}
          />
        </div>
      </div>
      <WeeklyMenuPlan
        weekKey={currentWeekKey}
        weekMenus={currentWeekMenus}
        weekRange={{ monday, friday }}
        setWeekOffset={setWeekOffset}
        weekOffset={weekOffset}
        onMenuStatusChange={handleMenuStatusChange}
      />
    </div>
  );
}
