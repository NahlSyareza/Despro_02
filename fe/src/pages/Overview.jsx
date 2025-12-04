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
    feedbackRate: 0,
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
        console.log("🛠️ Overview: Using Mock Data");
        
        if (!cancelled) {
          // GUNAKAN DATA IMPORT
          setKpis(MOCK_OVERVIEW_KPI);
          setRatings(MOCK_OVERVIEW_RATINGS);
          setQuality(MOCK_OVERVIEW_QUALITY);
        }
        return;
      }

      // --- LOGIKA REAL API ---
      console.log("🌍 Mode Real: Fetching KPI API");
      try {
          const date = new Date().toISOString().split('T')[0]; // Hari ini
          
          // Contoh pengambilan data KPI real (Pastikan endpoint backend sudah ada)
          // Jika belum ada endpoint spesifik, biarkan ini atau handle error
          const [ratingRes, overallRes] = await Promise.all([
             api_url.get(`/review/average_rating/${date}`),
             api_url.get(`/review/overall_rating_dy/${date}`)
          ]);

          if (!cancelled && ratingRes.data?.payload?.[0]) {
             const avg = parseFloat(ratingRes.data.payload[0].avg);
             setKpis(prev => ({
                 ...prev,
                 averageRating: isNaN(avg) ? 0 : avg.toFixed(1)
             }));
          }

          if (!cancelled && overallRes.data?.payload) {
             const fmtPayload = overallRes.data.payload.map(({ reting: rating, ...rest }) => ({
                rating,
                ...rest,
              }));
              setRatings(fmtPayload);
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