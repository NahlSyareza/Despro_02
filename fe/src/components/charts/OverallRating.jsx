import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const CustomDot = (props) => {
  const { cx, cy, stroke, dataKey } = props;

  if (dataKey === 'thisWeek') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill={stroke} fillOpacity={0.3} />
        <circle cx={cx} cy={cy} r={3.5} stroke="white" strokeWidth={1} fill="#8b5cf6" />
      </g>
    );
  }
  return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill={stroke} fillOpacity={0.4} />
        <circle cx={cx} cy={cy} r={3.5} stroke="white" strokeWidth={1} fill="#61d2a5ff" />
      </g>
    );
};

export default function OverallRating({ data = [], loading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ color: "#73707D", fontWeight: "1000", fontSize: "15px" }}>
            OVERALL RATING
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <p className="text-center py-10 text-gray-400">Loading chart...</p> : (
            <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }} >
                    <CartesianGrid strokeDasharray="7 7" stroke="#d3d4d6ff" />
                    <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af" 
                    padding={{ left: 30, right: 30 }} 
                    tickLine={false} 
                    axisLine={false}
                    />
                    <YAxis 
                    stroke="#5a5c61ff" 
                    orientation="right" 
                    domain={[0, 5]} 
                    tickCount={6} 
                    tickLine={false} 
                    axisLine={false} 
                    />
                    <Tooltip />
                    <Line 
                    type="monotone" 
                    dataKey="thisWeek" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    dot={<CustomDot dataKey="thisWeek" />}
                    activeDot={{ r: 6 }} 
                    />
                    <Line 
                    type="monotone" 
                    dataKey="previousWeek" 
                    stroke="#6ee7b7" 
                    strokeWidth={2} 
                    dot={<CustomDot dataKey="previousWeek" />}
                    activeDot={{ r: 6 }} 
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
        )}
      </CardContent>
    </Card>
  )
}