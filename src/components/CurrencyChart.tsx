"use client";

import { useTheme } from "@/context/ThemeContext";
import { HistoricalRate } from "@/lib/api";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface CurrencyChartProps {
  data: HistoricalRate[];
  base: string;
  target: string;
}

export function CurrencyChart({ data, base, target }: CurrencyChartProps) {
  const { theme } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-[var(--foreground)]/30 bg-[var(--foreground)]/5 rounded-2xl border border-[var(--card-border)]">
        No historical data available
      </div>
    );
  }

  const chartColor = theme === 'light' ? '#8B5CF6' : '#A78BFA';
  const gridColor = theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
  const labelColor = theme === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';

  return (
    <div className="w-full h-[400px] bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[var(--foreground)]">
          {base} to {target} Trend
        </h3>
        <p className="text-sm text-[var(--foreground)]/40">Last 30 Days</p>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke={labelColor} 
            tickFormatter={(str) => {
              const date = new Date(str);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
            tick={{ fontSize: 12 }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke={labelColor} 
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
            tickFormatter={(val) => val.toFixed(3)}
            width={60}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'light' ? "rgba(255,255,255,0.9)" : "rgba(10,10,15,0.9)",
              border: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: "16px",
              color: theme === 'light' ? "#1A1A1A" : "#FFFFFF",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: theme === 'light' ? "#8B5CF6" : "#A78BFA", fontWeight: "bold" }}
            labelStyle={{ color: labelColor, marginBottom: "0.5rem", fontSize: "12px" }}
            formatter={(value: number) => [value.toFixed(4), "Rate"]}
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke={chartColor}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRate)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
