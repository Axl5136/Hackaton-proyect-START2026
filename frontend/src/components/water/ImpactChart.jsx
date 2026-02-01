import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Droplets, AlertTriangle, FolderOpen, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

// Mock chart data generator based on company
function generateChartData(company, metric) {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const baseValue = parseInt(company.waterSaved.replace(/[^0-9]/g, "")) || 1000;
  
  if (metric === "water") {
    return months.map((month, i) => ({
      name: month,
      value: Math.round((baseValue / 12) * (0.5 + Math.random() * 0.8) * (1 + i * 0.05)),
    }));
  } else if (metric === "risk") {
    const riskBase = company.risk === "Alto" ? 75 : company.risk === "Medio" ? 50 : 25;
    return months.map((month) => ({
      name: month,
      value: Math.round(riskBase + (Math.random() - 0.5) * 20),
    }));
  } else {
    return months.map((month, i) => ({
      name: month,
      value: Math.round(company.projects * (0.3 + (i / 12) * 0.7)),
    }));
  }
}

function KpiCard({ icon: Icon, title, value, trend, color, tooltip, isActive, onClick }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`flex-1 p-4 rounded-lg border transition-all hover:scale-[1.02] text-left ${
              isActive 
                ? "border-primary bg-primary/10 ring-1 ring-primary/50" 
                : "border-border/50 bg-card/50 hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-sm text-muted-foreground">{title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">{value}</span>
              {trend && (
                <span className={`flex items-center gap-1 text-xs ${
                  trend > 0 ? "text-water-low" : trend < 0 ? "text-water-high" : "text-muted-foreground"
                }`}>
                  {trend > 0 ? <TrendingUp className="h-3 w-3" /> : 
                   trend < 0 ? <TrendingDown className="h-3 w-3" /> : 
                   <Minus className="h-3 w-3" />}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function RiskIndicator({ risk }) {
  const config = {
    Bajo: { color: "text-water-low", bg: "bg-water-low", label: "🟢 Bajo" },
    Medio: { color: "text-water-medium", bg: "bg-water-medium", label: "🟠 Medio" },
    Alto: { color: "text-water-high", bg: "bg-water-high", label: "🔴 Alto" },
  };
  return <span className={config[risk].color}>{config[risk].label}</span>;
}

export function ImpactChart({ company }) {
  const [timeRange, setTimeRange] = useState("1A");
  const [activeMetric, setActiveMetric] = useState("water");

  if (!company) return null;

  const chartData = generateChartData(company, activeMetric);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const unit = activeMetric === "water" ? " m³" : activeMetric === "risk" ? "%" : "";
      return (
        <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold text-foreground">
            {payload[0].value.toLocaleString()}{unit}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    if (activeMetric === "water") {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <RechartsTooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#waterGradient)"
          />
        </AreaChart>
      );
    } else if (activeMetric === "risk") {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--water-high))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--water-high))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
          <RechartsTooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--water-high))"
            strokeWidth={2}
            fill="url(#riskGradient)"
          />
        </AreaChart>
      );
    } else {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <RechartsTooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }
  };

  // Generate data for mini charts
  const waterData = generateChartData(company, "water");
  const riskData = generateChartData(company, "risk");
  const projectsData = generateChartData(company, "projects");

  const MiniChart = ({ data, color, type = "area" }) => (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === "area" ? (
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`mini-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`hsl(var(--${color}))`} stopOpacity={0.4} />
                <stop offset="95%" stopColor={`hsl(var(--${color}))`} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={`hsl(var(--${color}))`}
              strokeWidth={1.5}
              fill={`url(#mini-${color})`}
            />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Bar dataKey="value" fill={`hsl(var(--${color}))`} radius={[2, 2, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">
              Evolución de Impacto — {company.name}
            </CardTitle>
            <CardDescription>
              Créditos de agua = inversión en proyectos agrícolas que ahorran agua.
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Range */}
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
              {["1M", "3M", "6M", "1A"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
            
            {/* Metric Tabs */}
            <Tabs value={activeMetric} onValueChange={setActiveMetric}>
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="water" className="text-xs">
                  <Droplets className="h-3 w-3 mr-1" /> Agua
                </TabsTrigger>
                <TabsTrigger value="risk" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Riesgo
                </TabsTrigger>
                <TabsTrigger value="projects" className="text-xs">
                  <FolderOpen className="h-3 w-3 mr-1" /> Proyectos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Chart + Mini Charts Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Chart */}
          <div className="flex-1 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
          
          {/* Mini Charts Sidebar */}
          <div className="lg:w-48 flex flex-row lg:flex-col gap-3">
            {/* Mini Agua */}
            <button
              onClick={() => setActiveMetric("water")}
              className={`flex-1 p-3 rounded-lg border transition-all hover:scale-[1.02] ${
                activeMetric === "water"
                  ? "border-primary bg-primary/10 ring-1 ring-primary/50"
                  : "border-border/50 bg-card/50 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">Agua</span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-2">{company.waterSaved}</p>
              <MiniChart data={waterData} color="primary" />
            </button>

            {/* Mini Riesgo */}
            <button
              onClick={() => setActiveMetric("risk")}
              className={`flex-1 p-3 rounded-lg border transition-all hover:scale-[1.02] ${
                activeMetric === "risk"
                  ? "border-water-high bg-water-high/10 ring-1 ring-water-high/50"
                  : "border-border/50 bg-card/50 hover:border-water-high/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-3 w-3 text-water-medium" />
                <span className="text-xs text-muted-foreground">Riesgo</span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-2">
                <RiskIndicator risk={company.risk} />
              </p>
              <MiniChart data={riskData} color="water-high" />
            </button>

            {/* Mini Proyectos */}
            <button
              onClick={() => setActiveMetric("projects")}
              className={`flex-1 p-3 rounded-lg border transition-all hover:scale-[1.02] ${
                activeMetric === "projects"
                  ? "border-water-low bg-water-low/10 ring-1 ring-water-low/50"
                  : "border-border/50 bg-card/50 hover:border-water-low/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FolderOpen className="h-3 w-3 text-water-low" />
                <span className="text-xs text-muted-foreground">Proyectos</span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-2">{company.projects}</p>
              <MiniChart data={projectsData} color="water-low" type="bar" />
            </button>
          </div>
        </div>
        
        {/* KPIs Row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/30">
          <KpiCard
            icon={AlertTriangle}
            title="Riesgo hídrico"
            value={<RiskIndicator risk={company.risk} />}
            color="text-water-medium"
            tooltip="Qué tan vulnerable es la zona a estrés hídrico."
            isActive={activeMetric === "risk"}
            onClick={() => setActiveMetric("risk")}
          />
          <KpiCard
            icon={Droplets}
            title="Agua verificada"
            value={company.waterSaved}
            trend={12}
            color="text-primary"
            tooltip="Ahorro confirmado con evidencia."
            isActive={activeMetric === "water"}
            onClick={() => setActiveMetric("water")}
          />
          <KpiCard
            icon={FolderOpen}
            title="Proyectos activos"
            value={company.projects}
            trend={5}
            color="text-water-low"
            tooltip="Proyectos disponibles o en ejecución."
            isActive={activeMetric === "projects"}
            onClick={() => setActiveMetric("projects")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
