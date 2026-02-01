import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Download, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const timeRanges = [
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1A", label: "1A" },
];

// Mock data for different time ranges
const generateData = (range) => {
  const months = {
    "1M": ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    "3M": ["Oct", "Nov", "Dic"],
    "6M": ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    "1A": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  };

  return months[range].map((name, i) => ({
    name,
    agua: Math.floor(800 + Math.random() * 400 + i * 50),
  }));
};

export function WaterSavingsChart() {
  const [selectedRange, setSelectedRange] = useState("6M");
  const data = generateData(selectedRange);

  const totalSaved = data.reduce((acc, item) => acc + item.agua, 0);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-col gap-4 space-y-0 pb-4 md:flex-row md:items-center md:justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Evolución del agua ahorrada
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border bg-secondary/50 p-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={selectedRange === range.value ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setSelectedRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Descargar reporte</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `${value} m³`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--primary))" }}
                formatter={(value) => [`${value} m³`, "Agua ahorrada"]}
              />
              <Area
                type="monotone"
                dataKey="agua"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#waterGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-border bg-secondary/30 p-4 sm:grid-cols-3">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">Total verificado</p>
            <p className="text-xl font-bold text-foreground">
              {totalSaved.toLocaleString()} m³
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Última verificación</p>
            <p className="flex items-center justify-center gap-1 text-lg font-semibold text-foreground sm:justify-start">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              15 Ene 2026
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-muted-foreground">CO₂e evitado estimado</p>
            <p className="text-xl font-bold text-water-low">
              {Math.floor(totalSaved * 0.3).toLocaleString()} kg
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
