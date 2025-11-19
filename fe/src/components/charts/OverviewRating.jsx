import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Label,
} from "recharts";
import { DashboardCard } from "@/components/cards/DashboardCard";

const COLORS = {
  primary: "#7B5EEA",
  grayText: "#928E95",
  grid: "#E4E4EF",
};

export function OverviewRating({ ratings }) {
  return (
    <DashboardCard
      title="OVERALL RATING"
      description="Distribution of user ratings for MBG meals based on feedback."
    >
      <div className="h-[280px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ratings}
            margin={{ top: 30, left: 10, right: 10, bottom: 30 }}
          >
            <CartesianGrid
              strokeDasharray="3 6"
              stroke={COLORS.grid}
              vertical={false}
              yAxisId="left"
            />

            <XAxis
              dataKey="rating"
              type="category"
              tick={{ fill: COLORS.grayText, fontSize: 14 }}
              tickLine={false}
              axisLine={false}
            >
              <Label
                value="Ratings"
                position="insideBottom"
                offset={-10}
                style={{ fill: COLORS.grayText, fontSize: 14 }}
              />
            </XAxis>

            <YAxis
              yAxisId="left"
              type="number"
              domain={[50, 200]}
              ticks={[50, 100, 150, 200]}
              tick={{ fill: COLORS.grayText, fontSize: 14 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              yAxisId="rightLabel"
              orientation="right"
              type="number"
              domain={[50, 200]}
              tick={false}
              axisLine={false}
            >
              <Label
                value="Number of Reviews"
                angle={-90}
                position="insideRight"
                offset={20}
                style={{
                  fill: COLORS.grayText,
                  fontSize: 14,
                  textAnchor: "middle",
                }}
              />
            </YAxis>

            <Tooltip
              cursor={{ fill: "rgba(123,94,234,0.06)" }}
              contentStyle={{
                borderRadius: 12,
                borderColor: COLORS.grid,
                fontSize: 12,
              }}
              labelFormatter={(value) => `Rating ${value}`}
            />

            <Bar
              dataKey="count"
              yAxisId="left"
              radius={[4, 4, 0, 0]}
              fill={COLORS.primary}
              barSize={48}
            >
              <LabelList
                dataKey="count"
                position="top"
                offset={12}
                fill={COLORS.grayText}
                fontSize={16}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}