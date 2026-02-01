import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Download, Calendar } from "lucide-react";
import {
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

export function WaterSavingsChart({ data = [] }) {
  const [selectedRange, setSelectedRange] = useState("6M");

  // El total real es simplemente el último valor de nuestra cadena de transacciones
  const currentTotal = data.length > 0 ? data[data.length - 1].m3 : 0;

  const today = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <Card className="border-border bg-card transition-all hover:border-primary/20">
      <CardHeader className="flex flex-col gap-4 space-y-0 pb-4 md:flex-row md:items-center md:justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Evolución de Activos Hídricos (Datos Reales)
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
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
            <Download className="h-4 w-4" />
            <span>Reporte</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data} // <--- ¡USAMOS LOS DATOS DIRECTOS DEL DASHBOARD!
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
              <XAxis
                dataKey="name" // El 'name' que creamos en Dashboard.jsx
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                width={40}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }}
                formatter={(value) => [`${value.toLocaleString()} m³`, "Agua Acumulada"]}
              />
              <Area
                type="monotone"
                dataKey="m3" // La llave que creamos en Dashboard.jsx
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#waterGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-border bg-secondary/30 p-4 sm:grid-cols-3">
          <div className="text-center sm:text-left">
            <p className="text-xs text-muted-foreground uppercase">Total Acumulado</p>
            <p className="text-xl font-bold text-primary">
              {currentTotal.toLocaleString()} m³
            </p>
          </div>
          <div className="text-center border-border/50 sm:border-l sm:border-r">
            <p className="text-xs text-muted-foreground uppercase">Última Transacción</p>
            <p className="flex items-center justify-center gap-2 text-lg font-semibold mt-0.5">
              <Calendar className="h-4 w-4 text-primary" />
              {today}
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs text-muted-foreground uppercase">Créditos de Impacto</p>
            <p className="text-xl font-bold text-emerald-500">
              {Math.floor(currentTotal * 0.2).toLocaleString()} tCO₂e
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}