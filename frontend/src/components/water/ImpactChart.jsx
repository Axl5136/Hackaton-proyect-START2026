import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Activity, DollarSign, AlignVerticalJustifyCenter, BalloonIcon } from "lucide-react";
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

// --- GENERADOR DE HISTORIAL DINÁMICO (VERSIÓN DRAMÁTICA) ---
function generateChartData(company, metric) {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const moneyTotal = parseValue(company.marketCap);
  const riskLabel = company.risk || "Bajo";
  
  // Volatilidad para la línea de peligro
  const volatility = riskLabel === "Alto" ? 0.8 : 0.5;

  return months.map((month, i) => {
    const progress = (i + 1) / 12;
    
    // ESCENARIO DE RIESGO (Roja): Caída constante + picos de inestabilidad
    // Simula que sin Aquax, el valor del lote se degrada por falta de agua
    const downwardTrend = 1 - (progress * 0.4); // Pierde hasta el 40% de valor
    const aggressiveNoise = (Math.sin(i * 2.5) * 0.15) * volatility;
    const actual = Math.round(moneyTotal * (downwardTrend + aggressiveNoise));

    // ESCENARIO DE ÉXITO (Azul): Curva de crecimiento logarítmico
    // Simula plusvalía por regeneración hídrica y créditos de agua
    const successTrend = 0.8 + (Math.log10(i + 1) * 0.8); 
    const stableGrowth = 1 + (progress * 0.5); // Gana un 50% de valor sobre el inicial
    const proyectado = Math.round(moneyTotal * stableGrowth * (1 + Math.random() * 0.05)); 

    return { 
      name: month, 
      actual: Math.max(actual, moneyTotal * 0.2), // No baja de un suelo mínimo
      proyectado,
      value: metric === "financial" ? proyectado : (metric === "water" ? proyectado : actual)
    };
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

export function ImpactChart({ company }) {
  const [activeMetric, setActiveMetric] = useState("financial");

  if (!company) return null;

  const chartData = useMemo(() => generateChartData(company, activeMetric), [company, activeMetric]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur border border-border rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs text-muted-foreground mb-1 font-bold">{label}</p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center gap-2 py-0.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <p className="text-sm font-bold text-foreground">
                {p.name}: {activeMetric === "financial" ? formatCurrency(p.value) : p.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card/50 border-border/50 shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-bold tracking-tight">{company.name}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {activeMetric === "financial" ? "Proyección de Valor: Impacto vs. Desgaste" : "Análisis de métricas críticas"}
            </CardDescription>
          </div>
          <Activity className="h-4 w-4 text-muted-foreground animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-6 space-y-6">
        <div className="h-[320px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProyectado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} vertical={false} />
              <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
              
              <RechartsTooltip content={<CustomTooltip />} />
              
              {/* LÍNEA DE RIESGO (ROJA): Sólida, agresiva y con ruido marcado */}
              {(activeMetric === "financial" || activeMetric === "risk") && (
                <Area
                  name="Escenario de Riesgo"
                  type="monotone"
                  dataKey="actual"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  fill="url(#colorActual)"
                  animationDuration={1000}
                />
              )}

              {/* LÍNEA AQUAX (AZUL): Sólida, estable y superior */}
              {(activeMetric === "financial" || activeMetric === "water") && (
                <Area
                  name="Impacto Aquax"
                  type="monotone"
                  dataKey="proyectado"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fill="url(#colorProyectado)"
                  animationDuration={1500}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KpiCard
            icon={BalloonIcon}
            title="Valor de Mercado"
            value={company.marketCap}
            subtext="Vista Comparativa"
            color="emerald"
            isActive={activeMetric === "financial"}
            onClick={() => setActiveMetric("financial")}
          />
          <KpiCard
            icon={Droplets}
            title="Agua Verificada"
            value={company.waterSaved}
            subtext="Recuperación Hídrica"
            color="blue"
            isActive={activeMetric === "water"}
            onClick={() => setActiveMetric("water")}
          />
          <KpiCard
            icon={Activity}
            title="Nivel de Riesgo"
            value={company.risk}
            subtext="Estrés del Acuífero"
            color="rose"
            isActive={activeMetric === "risk"}
            onClick={() => setActiveMetric("risk")}
          />
        </div>
      </CardContent>
    </Card>
  );
}