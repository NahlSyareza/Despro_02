import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const CustomDot = (props) => {
  const { cx, cy, stroke, payload, dataKey } = props;

  if (dataKey === 'thisWeek') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill={stroke} fillOpacity={0.3} />
        <circle cx={cx} cy={cy} r={3.5} stroke="white"  strokeWidth={1} fill="#8b5cf6" />
      </g>
    );
  }

  return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill={stroke} fillOpacity={0.4} />
        <circle cx={cx} cy={cy} r={3.5} stroke="white"  strokeWidth={1} fill="#61d2a5ff" />
      </g>
    );
};

const data = [
  { date: "20 Oct", thisWeek: 4.2, previousWeek: 3.8 },
  { date: "21 Oct", thisWeek: 4.5, previousWeek: 3.9 },
  { date: "22 Oct", thisWeek: 4.3, previousWeek: 4.1 },
  { date: "23 Oct", thisWeek: 4.6, previousWeek: 4.9 },
  { date: "24 Oct", thisWeek: 4.4, previousWeek: 4.2 },
]

export function OverallRating() {
  const legendPayload = [
    { value: 'This Week', type: 'circle', color: '#8b5cf6', id: 'thisWeek' },
    { value: 'Previous Week', type: 'circle', color: '#6ee7b7', id: 'previousWeek' },
  ];

  const CustomLegend = ({ payload }) => {
    return (
      <ul style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ marginRight: '10px', display: 'flex', alignItems: 'center', color: '#4b5563', fontSize: '12px' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: entry.color, 
              marginRight: '5px' 
            }}></span>
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>OVERALL RATING</CardTitle>
        <CardDescription>
          Summarizes the overall rating trends collected from student feedback to track changes in meal satisfaction over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}  margin={{ top: 5, right: 20, left: 20, bottom: 5 }} >
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
              domain={[1.0, 5.0]} 
              tickCount={5} 
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
            
            {/* Green Line - Previous Week (using a dashed stroke and simpler dot) */}
            <Line 
              type="monotone" 
              dataKey="previousWeek" 
              stroke="#6ee7b7" 
              strokeWidth={2} 
              dot={<CustomDot dataKey="thisWeek" />}
              activeDot={{ r: 6 }} 
            />
            
            
          </LineChart>
        </ResponsiveContainer>
        <CustomLegend payload={legendPayload} />
      </CardContent>
    </Card>
  )
}
