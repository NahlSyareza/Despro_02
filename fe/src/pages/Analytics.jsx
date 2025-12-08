import { useEffect, useState } from "react";
import api_url, { IS_MOCK } from "@/util/url";

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

            // Panggil 2 Endpoint Utama:
            // 1. Charts (Trend & Distribusi)
            // 2. Issue Stats (Statistik Masalah Makanan)
            const [chartRes, issueRes] = await Promise.all([
                api_url.get(`/vendor/${vendorId}/charts`),
                api_url.get(`/review/stats/issues/${vendorId}`)
            ]);

            // 1. Set Rating Trend (Grafik Ungu)
            if (chartRes.data?.rating_trend) {
                setRatingTrend(chartRes.data.rating_trend);
            }

            // 2. Set Nutrition Trend (Grafik Hijau)
            if (chartRes.data?.nutrition_trend) {
                setQualityTrend(chartRes.data.nutrition_trend);
            }

            // 3. Set Food Issues (List Masalah)
            if (issueRes.data) {
                // Backend sudah mengirim format [{name: "Asin", value: 10}, ...]
                // Kita urutkan dari yang terbesar
                const sortedIssues = issueRes.data.sort((a, b) => b.value - a.value);
                setIssueData(sortedIssues);
            }

            setLoading(false);
        } catch (err) {
            console.error("Gagal mengambil data analytics:", err);
            setLoading(false);
        }
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-8xl mx-auto p-6">
        
        {/* Filter Dropdown */}
        <div className="mb-8 flex justify-start">
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 bg-white text-sm cursor-pointer hover:border-[#7B5EEA] focus:outline-none focus:ring-2 focus:ring-[#7B5EEA]/20 shadow-sm transition-all"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Grafik Utama (Trend) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <OverallRating data={ratingTrend} loading={loading} />
          <NutritionQuality data={qualityTrend} loading={loading} />
        </div>

        {/* Detail Lainnya */}
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