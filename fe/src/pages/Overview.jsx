import { useEffect, useState } from "react";

import { StatCard } from "@/components/cards/StatCard";
import { OverviewRating } from "@/components/charts/OverviewRating";
import { OverviewNutrition } from "@/components/charts/OverviewNutrition";

const USE_MOCK = true;

export default function OverviewPage() {
  const [kpis, setKpis] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [quality, setQuality] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      if (USE_MOCK) {
        const mockKpis = {
          mealsAnalyzed: 1234,
          feedbackRate: 73.8,
          averageRating: 4.6,
          nutritionCompliance: 71.6,
          deltas: {
            mealsAnalyzed: 1.47,
            feedbackRate: -0.59,
            averageRating: -3.4,
            nutritionCompliance: 11.22,
          },
        };

        const mockRatings = [
          { rating: 1, count: 115 },
          { rating: 2, count: 164 },
          { rating: 3, count: 145 },
          { rating: 4, count: 123 },
          { rating: 5, count: 112 },
        ];

        const mockQuality = [
          { label: "Good", value: 46 },
          { label: "Fair", value: 36 },
          { label: "Poor", value: 18 },
        ];

        if (!cancelled) {
          setKpis(mockKpis);
          setRatings(mockRatings);
          setQuality(mockQuality);
        }
        return;
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
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
