import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardCard } from "@/components/cards/DashboardCard";

const COLORS = {
  primary: "#7B5EEA",
  fair: "#A693F0",
  poor: "#EDE8FF",
  grid: "#E4E4EF",
};

export function OverviewNutrition({ quality }) {
  const donutData = useMemo(() => {
    if (!quality || quality.length === 0) return [];

    const order = ["Good", "Fair", "Poor"];
    const colorMap = {
      Good: COLORS.primary,
      Fair: COLORS.fair,
      Poor: COLORS.poor,
    };

    return order
      .map((label) => quality.find((q) => q.label === label))
      .filter(Boolean)
      .map((q) => ({ ...q, fill: colorMap[q.label] }));
  }, [quality]);

  return (
    <DashboardCard
      title="NUTRITION QUALITY"
      description="Proportion of meals categorized as good, fair, or poor based on nutrition compliance."
    >
      <div className="h-[280px] md:h-[300px] flex items-center">
        <div className="flex-[3] min-w-[260px] h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="label"
                innerRadius={70}
                outerRadius={126}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                cornerRadius={4}
              >
                {donutData.map((entry) => (
                  <Cell key={entry.label} fill={entry.fill} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{
                  borderRadius: 12,
                  borderColor: COLORS.grid,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 ml-4 space-y-2">
          {donutData.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-[14px] text-[#928E95] whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
