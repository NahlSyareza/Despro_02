import { OverallRating } from "@/components/charts/OverallRating";
import { NutritionQuality } from "@/components/charts/NutritionQuality";
import { StudentFeedback } from "@/components/feedback/StudentFeedback";
import { TrayLog } from "@/components/tables/TrayLog";
import { FoodIssues } from "@/components/charts/FoodIssues";
import { useEffect, useState} from "react";
import api_url from "../util/url";

export default function Analytics() {
  const [studentFeedback, setStudentFeedback] = useState([
    {
        id: 1,
        name: "Tray_ID 1",
        rating: 5,
        date: "25/10/2025",
        text: "Makanannya enak, bumbu ayamnya meresap tapi nasinya kebanyakan jadi lauknya habis duluan.",
    },
    {
        id: 2,
        name: "Tray_ID 2",
        rating: 5,
        date: "25/10/2025",
        text: "Makanannya enak, bumbu ayamnya meresap tapi nasinya kebanyakan jadi lauknya habis duluan. Sayurnya enak, buahnya kurang fresh. Next ikan ya wok",
    },
    {
        id: 3,
        name: "Tray_ID 3",
        rating: 3,
        date: "25/08/2025",
        text: "Lauknya sedikit pelit bat ini",
    },
    {
        id: 4,
        name: "Tray_ID 3",
        rating: 3,
        date: "25/08/2025",
        text: "Lauknya sedikit",
    },
    {
        id: 5,
        name: "Tray_ID 3",
        rating: 3,
        date: "25/08/2025",
        text: "Lauknya sedikit",
    },
    {
        id: 6,
        name: "Tray_ID 3",
        rating: 3,
        date: "25/08/2025",
        text: "Lauknya sedikit",
    },]);

  const [trayLog, setTrayLog] = useState ([ { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD47", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD37", menuId: "B-12345", calories: "950", fat: "33.0", protein: "45.0", carbs: "50.0" }, { date: "20/10/2025", trayId: "ARD36", menuId: "C-56789", calories: "980", fat: "39.0", protein: "42.0", carbs: "47.0" }, { date: "20/10/2025", trayId: "ARD35", menuId: "D-11223", calories: "1010", fat: "41.0", protein: "43.0", carbs: "46.0" }, { date: "20/10/2025", trayId: "ARD34", menuId: "E-44556", calories: "1020", fat: "42.0", protein: "44.0", carbs: "45.0" }, { date: "20/10/2025", trayId: "ARD33", menuId: "F-77889", calories: "1040", fat: "43.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD32", menuId: "G-99001", calories: "1030", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD47", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD37", menuId: "B-12345", calories: "950", fat: "33.0", protein: "45.0", carbs: "50.0" }, { date: "20/10/2025", trayId: "ARD36", menuId: "C-56789", calories: "980", fat: "39.0", protein: "42.0", carbs: "47.0" }, { date: "20/10/2025", trayId: "ARD35", menuId: "D-11223", calories: "1010", fat: "41.0", protein: "43.0", carbs: "46.0" }, { date: "20/10/2025", trayId: "ARD34", menuId: "E-44556", calories: "1020", fat: "42.0", protein: "44.0", carbs: "45.0" }, { date: "20/10/2025", trayId: "ARD33", menuId: "F-77889", calories: "1040", fat: "43.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD32", menuId: "G-99001", calories: "1030", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD47", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD37", menuId: "B-12345", calories: "950", fat: "33.0", protein: "45.0", carbs: "50.0" }, { date: "20/10/2025", trayId: "ARD36", menuId: "C-56789", calories: "980", fat: "39.0", protein: "42.0", carbs: "47.0" }, { date: "20/10/2025", trayId: "ARD35", menuId: "D-11223", calories: "1010", fat: "41.0", protein: "43.0", carbs: "46.0" }, { date: "20/10/2025", trayId: "ARD34", menuId: "E-44556", calories: "1020", fat: "42.0", protein: "44.0", carbs: "45.0" }, { date: "20/10/2025", trayId: "ARD33", menuId: "F-77889", calories: "1040", fat: "43.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD32", menuId: "G-99001", calories: "1030", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD47", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD37", menuId: "B-12345", calories: "950", fat: "33.0", protein: "45.0", carbs: "50.0" }, { date: "20/10/2025", trayId: "ARD36", menuId: "C-56789", calories: "980", fat: "39.0", protein: "42.0", carbs: "47.0" }, { date: "20/10/2025", trayId: "ARD35", menuId: "D-11223", calories: "1010", fat: "41.0", protein: "43.0", carbs: "46.0" }, { date: "20/10/2025", trayId: "ARD34", menuId: "E-44556", calories: "1020", fat: "42.0", protein: "44.0", carbs: "45.0" }, { date: "20/10/2025", trayId: "ARD33", menuId: "F-77889", calories: "1040", fat: "43.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD32", menuId: "G-99001", calories: "1030", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD47", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD37", menuId: "B-12345", calories: "950", fat: "33.0", protein: "45.0", carbs: "50.0" }, { date: "20/10/2025", trayId: "ARD36", menuId: "C-56789", calories: "980", fat: "39.0", protein: "42.0", carbs: "47.0" }, { date: "20/10/2025", trayId: "ARD35", menuId: "D-11223", calories: "1010", fat: "41.0", protein: "43.0", carbs: "46.0" }, { date: "20/10/2025", trayId: "ARD34", menuId: "E-44556", calories: "1020", fat: "42.0", protein: "44.0", carbs: "45.0" }, { date: "20/10/2025", trayId: "ARD33", menuId: "F-77889", calories: "1040", fat: "43.0", protein: "44.0", carbs: "44.0" }, { date: "20/10/2025", trayId: "ARD32", menuId: "G-99001", calories: "1030", fat: "44.0", protein: "44.0", carbs: "44.0" }, ])

  useEffect(() => {
    // Fot student feedback
    api_url
      .get("/review/get_recent")
      .then((r) => {
        const res = r.data;
        console.log("response recent reviews:", res.payload);

        const formattedFeedback = res.payload.map((item) => ({
          id: item.id,
          name: `Tray_ID ${item.vendor_id}`,
          rating: Math.round(item.rating),
          date: new Date(item.date).toLocaleDateString("en-GB"),
          text: item.review,
        }));

        setStudentFeedback(formattedFeedback);

      })
      .catch((e) => {
        console.error(e);
      });

      //For tray list log
      // Vendor ID still hardcode
      api_url
      .get("/tray/log/11dd10a9-af8d-4ffc-ab6f-01a2c84ad068")
      .then((r) => {
        const res = r.data;
        console.log("response tray:", res.payload);

        const formattedResponse = res.payload.map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-GB"),
          trayId: item.tray_id,
          menuId: "-",
          calories: item.calories,
          fat: item.fat ,
          protein: item.protein,
          carbs: item.carbohydrate,
          //image still not mapped yet
        }));

        setTrayLog(formattedResponse);

      })
      .catch((e) => {
        console.error(e);
      });

  }, []);

  return (
    <div className="min-h-screen ">
      <main className="max-w-8xl mx-auto ">
        <div className="mb-8">
          <select className="px-4 py-2 border border-gray-400 rounded-sm text-foreground bg-background text-sm">
            <option>Last 7 Days</option>
            <option>Last 14 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <OverallRating />
          <NutritionQuality />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            <StudentFeedback feedbacks={studentFeedback}/>
            <FoodIssues />
          </div>

          <div className="lg:col-span-2">
            <TrayLog logs={trayLog}/>
          </div>
        </div>
      </main>
    </div>
  );
}
