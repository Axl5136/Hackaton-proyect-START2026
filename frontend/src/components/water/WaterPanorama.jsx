import { TrendingUp, TrendingDown, Droplets, FolderKanban, Leaf, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const metrics = [
  {
    title: "Riesgo Hídrico",
    value: "Alto",
    icon: AlertTriangle,
    trend: "up",
    trendValue: "+12%",
    status: "high",
    sparkline: [40, 55, 48, 62, 70, 78, 85],
  },
  {
    title: "Agua Verificada",
    value: "12,450 m³",
    icon: Droplets,
    trend: "up",
    trendValue: "+8.2%",
    status: "positive",
    sparkline: [20, 35, 42, 38, 52, 58, 65],
  },
  {
    title: "Proyectos Activos",
    value: "24",
    icon: FolderKanban,
    trend: "up",
    trendValue: "+3",
    status: "neutral",
    sparkline: [15, 18, 20, 19, 22, 23, 24],
  },
  {
    title: "CO₂e Evitado",
    value: "2,340 ton",
    icon: Leaf,
    trend: "up",
    trendValue: "+15%",
    status: "positive",
    sparkline: [30, 38, 45, 52, 58, 62, 70],
  },
];

function MiniSparkline({ data, status }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - ((value - min) / range) * 18;
    return `${x},${y}`;
  }).join(" ");

  const strokeColor = status === "high" 
    ? "hsl(var(--water-high))" 
    : status === "positive" 
    ? "hsl(var(--water-low))" 
    : "hsl(var(--primary))";

  return (
    <svg width="60" height="24" className="ml-auto">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WaterPanorama() {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
        Panorama del Agua
      </h2>
      
      <div className="space-y-3">
        {metrics.map((metric) => (
          <Card key={metric.title} className="bg-card/50 border-border/50 hover:bg-card transition-colors">
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-4 w-4 ${
                    metric.status === "high" ? "text-water-high" :
                    metric.status === "positive" ? "text-water-low" :
                    "text-primary"
                  }`} />
                  <span className="text-xs text-muted-foreground">{metric.title}</span>
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  metric.status === "high" ? "text-water-high" :
                  metric.status === "positive" ? "text-water-low" :
                  "text-muted-foreground"
                }`}>
                  {metric.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {metric.trendValue}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className={`text-lg font-bold ${
                  metric.status === "high" ? "text-water-high" :
                  metric.status === "positive" ? "text-water-low" :
                  "text-foreground"
                }`}>
                  {metric.value}
                </span>
                <MiniSparkline data={metric.sparkline} status={metric.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
          Filtros
        </h3>
        
        <div className="space-y-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-full bg-card/50 border-border/50">
              <SelectValue placeholder="Región" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las regiones</SelectItem>
              <SelectItem value="norte">Norte</SelectItem>
              <SelectItem value="centro">Centro</SelectItem>
              <SelectItem value="sur">Sur</SelectItem>
              <SelectItem value="bajio">Bajío</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-full bg-card/50 border-border/50">
              <SelectValue placeholder="Industria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las industrias</SelectItem>
              <SelectItem value="agricultura">Agricultura</SelectItem>
              <SelectItem value="manufactura">Manufactura</SelectItem>
              <SelectItem value="tecnologia">Tecnología</SelectItem>
              <SelectItem value="bebidas">Bebidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
