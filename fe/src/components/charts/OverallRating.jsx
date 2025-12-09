import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverallRating({ data, loading }) {
  // Tampilkan Skeleton saat loading
  if (loading) {
    return (
      <Card className="col-span-1 shadow-sm border-gray-100 h-full">
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-sm">
          <p className="font-semibold text-gray-700 mb-1">{label}</p>
          <p className="text-[#8b5cf6] font-medium">
            Rating: {payload[0].value} / 5.0
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 shadow-sm border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">
            Overall Rating Trend
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#8b5cf6]"></span>
            <span className="text-xs text-gray-500 font-medium">Average Rating</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                {/* Gradient Fill Ungu */}
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#f0f0f0" 
              />
              
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6b7280", fontSize: 12 }} 
                dy={10}
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6b7280", fontSize: 12 }} 
                domain={[0, 5]} // Skala Rating 0 sampai 5
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#8b5cf6", strokeWidth: 1, strokeDasharray: "4 4" }} />
              
              <Area
                type="monotone"
                dataKey="thisWeek"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRating)"
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}