"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface LeadsChartProps {
  data: any[];
}

export function LeadsChart({ data }: LeadsChartProps) {
  return (
    <div className="admin-card h-full flex flex-col">
      <div className="admin-card-header mb-6">
        <div className="admin-card-title">
          <span className="title-dot" /> Leads Overview
        </div>
      </div>
      <div className="h-[420px] min-h-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))", 
                borderColor: "hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "var(--shadow-card)"
              }}
              itemStyle={{ fontSize: 14, fontWeight: 500 }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }} />
            <Line 
              type="monotone" 
              dataKey="leads" 
              name="Total Leads"
              stroke="#ff5a1f" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="consultations" 
              name="Consultations"
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="conversions" 
              name="Conversions"
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
