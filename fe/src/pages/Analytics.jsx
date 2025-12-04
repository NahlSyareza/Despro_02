import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, IS_MOCK } from "@/util/url";

// Import Komponen
import OverallRating from "@/components/charts/OverallRating";
import NutritionQuality from "@/components/charts/NutritionQuality";
import FoodIssues from "@/components/charts/FoodIssues";
import StudentFeedback from "@/components/feedback/StudentFeedback";
import TrayLog from "@/components/tables/TrayLog";

// Import Data Mock
import { MOCK_RATING_TREND, MOCK_QUALITY_TREND, MOCK_ISSUES } from "@/data/mockData";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  
  const [ratingTrend, setRatingTrend] = useState([]);
  const [qualityTrend, setQualityTrend] = useState([]);
  const [issueData, setIssueData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (IS_MOCK) {
        console.log(`🛠️ Analytics (Mock): Range ${dateRange} days`);
        setTimeout(() => {
            // GUNAKAN DATA IMPORT DI SINI
            setRatingTrend(MOCK_RATING_TREND);
            setQualityTrend(MOCK_QUALITY_TREND);
            setIssueData(MOCK_ISSUES);
            setLoading(false);
        }, 500);

      } else {
        console.log("Fetching Real Data...");
        try {
            const vendorData = JSON.parse(localStorage.getItem("vendor_data"));
            const vendorId = vendorData?.vendor_id;
            if (!vendorId) return;

            const [reviewRes, trayRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/review/vendor/${vendorId}?days=${dateRange}`),
                axios.get(`${API_BASE_URL}/tray/log/${vendorId}?days=${dateRange}`)
            ]);

            const reviews = reviewRes.data.payload || [];
            const trays = trayRes.data.payload || [];

            // --- 1. OLAH DATA ISSUES ---
            const issuesMap = {};
            reviews.forEach(r => {
                const issue = r.issue_id || "Other"; // Pastikan field ini sesuai DB
                if (issue) issuesMap[issue] = (issuesMap[issue] || 0) + 1;
            });
            const processedIssues = Object.entries(issuesMap)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value); // Urutkan terbanyak
            setIssueData(processedIssues);

            // --- 2. OLAH DATA TREND (RATING & QUALITY) ---
            // Note: Backend idealnya melakukan agregasi group by date.
            // Di sini kita lakukan simulasi mapping sederhana agar grafik tidak error.
            
            // Contoh Logic Frontend Sederhana: Ambil 5 data terakhir untuk grafik trend
            // (Untuk hasil akurat, backend harus kirim data per hari)
            
            setRatingTrend([
                { date: "Avg", thisWeek: calculateAvg(reviews, 'rating'), previousWeek: 0 }
            ]);
            
            setQualityTrend([
                { date: "Avg", thisWeek: calculateAvg(trays, 'compliance_score'), previousWeek: 0 }
            ]);
            
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
      }
    };

    fetchData();
  }, [dateRange]); // Efek dijalankan ulang saat dateRange berubah

  // Helper rata-rata
  const calculateAvg = (data, key) => {
      if (!data.length) return 0;
      const sum = data.reduce((acc, curr) => acc + parseFloat(curr[key] || 0), 0);
      return (sum / data.length).toFixed(1);
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-8xl mx-auto">
        <div className="mb-8">
          <select 
            className="px-4 py-2 border border-gray-400 rounded-sm text-foreground bg-background text-sm cursor-pointer hover:bg-gray-50"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <OverallRating data={ratingTrend} loading={loading} />
          <NutritionQuality data={qualityTrend} loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            <StudentFeedback />
            <FoodIssues data={issueData} loading={loading} />
          </div>

          <div className="lg:col-span-2">
            <TrayLog />
          </div>
        </div>
      </main>
    </div>
  );
}