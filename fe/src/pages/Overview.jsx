import { useEffect, useState } from "react";
import { StatCard } from "@/components/cards/StatCard";
import { OverviewRating } from "@/components/charts/OverviewRating";
import { OverviewNutrition } from "@/components/charts/OverviewNutrition";
import api_url, { IS_MOCK } from "../util/url";

// IMPORT DATA MOCK
import { MOCK_OVERVIEW_KPI, MOCK_OVERVIEW_RATINGS, MOCK_OVERVIEW_QUALITY } from "@/data/mockData";

export default function OverviewPage() {
  const [kpis, setKpis] = useState({
    mealsAnalyzed: 0,
    feedbackRate: 0, // Backend mengirim total_feedback (jumlah), bukan rate (%)
    averageRating: 0,
    nutritionCompliance: 0,
    deltas: {
      mealsAnalyzed: 0,
      feedbackRate: 0,
      averageRating: 0,
      nutritionCompliance: 0,
    },
  });
  const [ratings, setRatings] = useState([]);
  const [quality, setQuality] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      // --- LOGIKA MOCK ---
      if (IS_MOCK) {
        if (!cancelled) {
          setKpis(MOCK_OVERVIEW_KPI);
          setRatings(MOCK_OVERVIEW_RATINGS);
          setQuality(MOCK_OVERVIEW_QUALITY);
        }
        return;
      }

      // --- LOGIKA REAL API ---
      try {
          const vendorData = JSON.parse(localStorage.getItem("vendor_data"));
          const vendorId = vendorData?.vendor_id;

          if (!vendorId) return;

          // 1. Fetch KPI Stats & Charts sekaligus (Parallel)
          // Note: Backend Anda menggunakan method POST untuk stats sesuai route vendor.route.js
          const [statsRes, chartRes] = await Promise.all([
             api_url.post(`/vendor/${vendorId}/stats`), 
             api_url.get(`/vendor/${vendorId}/charts`)
          ]);

          if (!cancelled && statsRes.data) {
             const { meals_analyzed, nutrition_compliance, total_feedback, average_rating } = statsRes.data;
             
             setKpis(prev => ({
                 ...prev,
                 mealsAnalyzed: meals_analyzed,
                 nutritionCompliance: nutrition_compliance,
                 feedbackRate: total_feedback, // Menampilkan total count
                 averageRating: average_rating
             }));
          }

          if (!cancelled && chartRes.data) {
             // Mapping Distribusi Rating (Bar Chart)
             if (chartRes.data.rating_distribution) {
                // Format Backend: { star: 1, count: 5 } -> Frontend: { rating: 1, count: 5 }
                const fmtRatings = chartRes.data.rating_distribution.map(item => ({
                    rating: item.star,
                    count: item.count
                }));
                setRatings(fmtRatings);
             }

             // Mapping Kualitas Nutrisi (Donut Chart)
             if (chartRes.data.quality_distribution) {
                // Backend sudah mengirim format { name, value }, tinggal tambah warna jika perlu di komponen
                setQuality(chartRes.data.quality_distribution);
             }
          }

      } catch (e) {
          console.error("API Error Overview:", e);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen">
      <main className="max-w-8xl mx-auto">
        <div className="mb-6">
          <StatCard kpis={kpis} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OverviewRating ratings={ratings} />
          </div>
          <div>
            <OverviewNutrition quality={quality} />
          </div>
        </div>
      </main>
    </div>
  );
}