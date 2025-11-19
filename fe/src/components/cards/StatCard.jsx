import mealsIcon from "../../assets/icons/meals_analyzed.svg";
import feedbackIcon from "../../assets/icons/total_feedback.svg";
import avgRatingIcon from "../../assets/icons/average_rating.svg";
import nutritionIcon from "../../assets/icons/nutrition_compliance.svg";

function SmallCard({ icon, label, value, delta }) {
  const isUp = delta > 0;
  const isZero = delta === 0;

  return (
    <div className="h-[119px] w-full rounded-[24px] bg-white px-5 pt-4 pb-4 shadow-[0_4px_24px_rgba(16,24,40,0.06)] border border-gray-100 flex flex-col justify-center">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1E9FF] shrink-0">
            <img src={icon} alt="" className="h-5 w-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-[#928E95] uppercase whitespace-nowrap">
              {label}
            </span>
            <span className="mt-2 text-[28px] md:text-[32px] leading-none font-extrabold tracking-tight text-gray-900">
              {value}
            </span>
          </div>
        </div>

        <span
          className={`ml-2 text-[11px] font-semibold ${
            isZero
              ? "text-gray-400"
              : isUp
              ? "text-[#00A651]"
              : "text-[#F90000]"
          }`}
        >
          {isUp ? "+" : ""}
          {delta?.toFixed?.(2)}%
        </span>
      </div>
    </div>
  );
}

export function StatCard({ kpis }) {
  const safeKpis = kpis ?? {};
  const deltas = safeKpis.deltas ?? {};

  const stats = [
    {
      icon: mealsIcon,
      label: "MEALS ANALYZED",
      value:
        safeKpis.mealsAnalyzed != null
          ? safeKpis.mealsAnalyzed.toLocaleString("id-ID")
          : "—",
      delta: deltas.mealsAnalyzed ?? 0,
    },
    {
      icon: feedbackIcon,
      label: "TOTAL FEEDBACK",
      value:
        safeKpis.feedbackRate != null
          ? `${safeKpis.feedbackRate.toLocaleString("id-ID")}%`
          : "—",
      delta: deltas.feedbackRate ?? 0,
    },
    {
      icon: avgRatingIcon,
      label: "AVERAGE RATING",
      value:
        safeKpis.averageRating != null
          ? `${safeKpis.averageRating}/5`
          : "—",
      delta: deltas.averageRating ?? 0,
    },
    {
      icon: nutritionIcon,
      label: "NUTRITION COMPLIANCE",
      value:
        safeKpis.nutritionCompliance != null
          ? `${safeKpis.nutritionCompliance.toLocaleString("id-ID")}%`
          : "—",
      delta: deltas.nutritionCompliance ?? 0,
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => (
        <SmallCard key={item.label} {...item} />
      ))}
    </section>
  );
}
