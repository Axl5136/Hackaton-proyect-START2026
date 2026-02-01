import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Droplets, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

// --- HELPERS FINANCIEROS ---
const parseValue = (str) => {
  if (!str) return 0;
  return parseFloat(str.replace(/[^0-9.-]+/g, "")) || 0;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value);
};

// --- GENERADOR DE HISTORIAL "FAKE" (EL SECRETO) ---
function generateChartData(company, metric) {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  // Extraemos valores base reales
  const waterTotal = parseValue(company.waterSaved);
  const moneyTotal = parseValue(company.marketCap);

  // Determinamos factor de volatilidad basado en el riesgo
  const riskLabel = company.risk || "Bajo";
  const volatility = riskLabel === "Alto" || riskLabel === "Crítico" ? 0.4 : 0.1; // 40% vs 10% de ruido

  return months.map((month, i) => {
    const progress = (i + 1) / 12; // 0.1 a 1.0

    let value = 0;

    if (metric === "financial") {
      // Curva de crecimiento de inversión (Logarítmica suave + Ruido)
      // Empieza al 30% del valor y sube hasta el 100%
      const baseCurve = moneyTotal * (0.3 + (progress * 0.7));
      const noise = baseCurve * (Math.random() - 0.5) * volatility * 0.5;
      value = Math.round(baseCurve + noise);

    } else if (metric === "water") {
      // Acumulación de agua (Lineal con estacionalidad)
      const seasonalFactor = 1 + (Math.sin(i) * 0.1); // Lluvias simuladas
      value = Math.round((waterTotal * progress) * seasonalFactor);

    } else if (metric === "risk") {
      // Índice de Estrés Hídrico (0-100%)
      const baseRisk = riskLabel === "Alto" ? 75 : riskLabel === "Medio" ? 50 : 25;
      // Mucho ruido si es alto riesgo (picos de sequía)
      const riskNoise = (Math.random() - 0.5) * (volatility * 100);
      value = Math.max(0, Math.min(100, Math.round(baseRisk + riskNoise)));
    }

    return { name: month, value };
  });
}

// --- COMPONENTE DE TARJETA KPI ---
function KpiCard({ icon: Icon, title, value, subtext, color, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-3 rounded-lg border transition-all text-left relative overflow-hidden group ${isActive
          ? `border-${color}-500 bg-${color}-500/5 ring-1 ring-${color}-500/30`
          : "border-border/50 bg-card/40 hover:bg-card/80"
        }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`p-1.5 rounded-md bg-${color}-500/10 text-${color}-500`}>
          <Icon className="h-4 w-4" />
        </div>
        {isActive && <div className={`h-2 w-2 rounded-full bg-${color}-500 animate-pulse`} />}
      </div>

      <div className="space-y-0.5">
        <span className="text-xs text-muted-foreground font-medium block">{title}</span>
        <span className={`text-lg font-bold tracking-tight text-foreground group-hover:text-${color}-500 transition-colors`}>
          {value}
        </span>
        {subtext && <span className="text-[10px] text-muted-foreground">{subtext}</span>}
      </div>
    </button>
  );
}

// --- COMPONENTE PRINCIPAL ---
export function ImpactChart({ company }) {
  const [timeRange, setTimeRange] = useState("1A");
  const [activeMetric, setActiveMetric] = useState("financial"); // Default: Show me the money

  if (!company) return null;

  // Generamos datos al vuelo
  const chartData = useMemo(() => generateChartData(company, activeMetric), [company, activeMetric]);

  // Configuración de colores según métrica
  const config = {
    financial: { color: "#10b981", name: "Valor de Mercado", gradient: "emerald" }, // Verde Dinero
    water: { color: "#3b82f6", name: "Agua Ahorrada", gradient: "blue" },       // Azul Agua
    risk: { color: "#f43f5e", name: "Riesgo Hídrico", gradient: "rose" }        // Rojo Peligro
  };

  const currentConfig = config[activeMetric];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      let val = payload[0].value;
      let formatted = val;

      if (activeMetric === "financial") formatted = formatCurrency(val);
      if (activeMetric === "water") formatted = `${val.toLocaleString()} m³`;
      if (activeMetric === "risk") formatted = `${val}%`;

      return (
        <div className="bg-background/95 backdrop-blur border border-border rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: currentConfig.color }} />
            <p className="text-sm font-bold text-foreground">{formatted}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card/50 border-border/50 shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold">{company.name}</CardTitle>
              {company.risk === "Alto" && (
                <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded-full border border-red-500/20 font-mono">
                  VOLÁTIL
                </span>
              )}
            </div>
            <CardDescription className="text-xs mt-1">
              Análisis de rendimiento y riesgo en tiempo real.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg self-start sm:self-auto">
            {["1M", "3M", "6M", "1A"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                className={`h-7 px-3 text-xs ${timeRange === range ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-6 space-y-6">
        {/* GRÁFICA PRINCIPAL */}
        <div className="h-[300px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} vertical={false} />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  if (activeMetric === 'financial') return `$${value / 1000}k`;
                  if (activeMetric === 'water') return `${value / 1000}k`;
                  return `${value}%`;
                }}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: currentConfig.color, strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={currentConfig.color}
                strokeWidth={3}
                fill={`url(#gradient-${activeMetric})`}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* SELECTORES DE MÉTRICAS (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KpiCard
            icon={DollarSign}
            title="Valor de Mercado"
            value={company.marketCap}
            subtext="Capitalización del lote"
            color="emerald" // Tailwind: text-emerald-500
            isActive={activeMetric === "financial"}
            onClick={() => setActiveMetric("financial")}
          />

          <KpiCard
            icon={Droplets}
            title="Agua Verificada"
            value={company.waterSaved}
            subtext="Activo subyacente (m³)"
            color="blue" // Tailwind: text-blue-500
            isActive={activeMetric === "water"}
            onClick={() => setActiveMetric("water")}
          />

          <KpiCard
            icon={Activity}
            title="Nivel de Riesgo"
            value={company.risk}
            subtext="Volatilidad hídrica"
            color="rose" // Tailwind: text-rose-500
            isActive={activeMetric === "risk"}
            onClick={() => setActiveMetric("risk")}
          />
        </div>
      </CardContent>
    </Card>
  );
}