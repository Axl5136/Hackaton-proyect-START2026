import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Droplets, ShoppingCart, Award, AlertTriangle, Info, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const riskColors = {
  low: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    indicator: "bg-emerald-500",
    label: "🟢 Bajo",
  },
  medium: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    indicator: "bg-amber-500",
    label: "🟠 Medio",
  },
  high: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    indicator: "bg-red-500",
    label: "🔴 Alto",
  },
};

export function KPICards({ stats }) {
  // Valores por defecto para evitar errores si stats viene vacío
  const {
    totalWater = 0,
    totalInvestment = 0,
    activeProjects = 0
  } = stats || {};

  // Construimos la data dinámicamente con los props
  const kpiData = [
    {
      id: "risk",
      title: "Riesgo hídrico ponderado",
      // En un hackathon, si no tenemos el cálculo complejo, lo dejamos en "Medio" o "Bajo" para no asustar
      value: "Medio",
      icon: AlertTriangle,
      riskLevel: "medium",
      tooltip: "Nivel promedio de estrés hídrico en tus proyectos actuales.",
    },
    {
      id: "saved",
      title: "Agua ahorrada verificada",
      // Formato de número con comas (15,000)
      value: totalWater.toLocaleString(),
      unit: "m³",
      icon: Droplets,
      tooltip: "Total acumulado de agua ahorrada en todos tus proyectos.",
    },
    {
      id: "investment",
      title: "Valor de Cartera", // Cambio Fintech: Dinero, no solo volumen
      // Formato de moneda ($15,000)
      value: `$${totalInvestment.toLocaleString()}`,
      unit: "MXN",
      icon: ShoppingCart, // O TrendingUp si prefieres verlo como inversión
      tooltip: "Valor actual de mercado de tus créditos de agua adquiridos.",
    },
    {
      id: "projects",
      title: "Proyectos Activos",
      value: activeProjects.toString(),
      unit: "Sitios",
      icon: Award,
      tooltip: "Número de ranchos o proyectos que estás financiando.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => {
        const riskStyle = kpi.riskLevel ? riskColors[kpi.riskLevel] : null;

        return (
          <Card
            key={kpi.id}
            className="border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                    riskStyle ? riskStyle.bg : "bg-primary/10"
                  )}
                >
                  <kpi.icon
                    className={cn(
                      "h-5 w-5",
                      riskStyle ? riskStyle.text : "text-primary"
                    )}
                  />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground transition-colors hover:text-foreground">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="max-w-xs text-sm">{kpi.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  {kpi.riskLevel ? (
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-3 w-3 rounded-full animate-pulse",
                          riskStyle.indicator
                        )}
                      />
                      <span
                        className={cn("text-2xl font-bold tracking-tight", riskStyle.text)}
                      >
                        {kpi.label}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-foreground tracking-tight">
                        {kpi.value}
                      </span>
                      {kpi.unit && (
                        <span className="text-sm font-medium text-muted-foreground ml-1">
                          {kpi.unit}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}