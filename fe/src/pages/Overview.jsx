import { useEffect, useState } from "react";

import { StatCard } from "@/components/cards/StatCard";
import { OverviewRating } from "@/components/charts/OverviewRating";
import { OverviewNutrition } from "@/components/charts/OverviewNutrition";
import api_url from "../util/url";

const USE_MOCK = true;

export default function OverviewPage() {
  const [kpis, setKpis] = useState({
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
  });
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

  useEffect(() => {
    api_url
      // HARDCODED DATE FIRST!
      .get("/review/average_rating/2025-11-17")
      .then((r) => {
        const res = r.data;
        const avg = res.payload[0].avg;
        console.log(res.payload[0].avg);

        setKpis((p) => ({
          ...p,
          averageRating: Math.round(avg * 10) / 10,
        }));
      })
      .catch((e) => {
        console.error(e);
      });

    api_url
      .get("/review/overall_rating_dy/2025-11-17")
      .then((r) => {
        const res = r.data;
        const payload = res.payload;
        const fmtPayload = payload.map(({ reting: rating, ...rest }) => ({
          rating,
          ...rest,
        }));
        console.log(fmtPayload);
        setRatings(fmtPayload);
      })
      .catch((e) => {
        console.error(e);
      });
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
