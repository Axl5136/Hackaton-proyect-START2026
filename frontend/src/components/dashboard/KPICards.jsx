import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Droplets, ShoppingCart, Award, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const kpiData = [
  {
    id: "risk",
    title: "Riesgo hídrico actual",
    value: "Bajo",
    icon: AlertTriangle,
    riskLevel: "low",
    tooltip: "Nivel de estrés hídrico en tu zona de operación",
  },
  {
    id: "saved",
    title: "Agua ahorrada verificada",
    value: "12,450",
    unit: "m³",
    icon: Droplets,
    tooltip: "Total de agua ahorrada verificada por terceros",
  },
  {
    id: "credits",
    title: "Créditos comprados",
    value: "8,200",
    unit: "m³",
    icon: ShoppingCart,
    tooltip: "Créditos de agua adquiridos en el marketplace",
  },
  {
    id: "certificates",
    title: "Certificados emitidos",
    value: "15",
    icon: Award,
    tooltip: "Número de certificados de verificación emitidos",
  },
];

const riskColors = {
  low: {
    bg: "bg-water-low/10",
    text: "text-water-low",
    indicator: "bg-water-low",
    label: "🟢 Bajo",
  },
  medium: {
    bg: "bg-water-medium/10",
    text: "text-water-medium",
    indicator: "bg-water-medium",
    label: "🟠 Medio",
  },
  high: {
    bg: "bg-water-high/10",
    text: "text-water-high",
    indicator: "bg-water-high",
    label: "🔴 Alto",
  },
};

export function KPICards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => {
        const riskStyle = kpi.riskLevel ? riskColors[kpi.riskLevel] : null;

        return (
          <Card
            key={kpi.id}
            className="border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
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
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{kpi.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  {kpi.riskLevel ? (
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-3 w-3 rounded-full",
                          riskStyle.indicator
                        )}
                      />
                      <span
                        className={cn("text-2xl font-bold", riskStyle.text)}
                      >
                        {kpi.value}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-foreground">
                        {kpi.value}
                      </span>
                      {kpi.unit && (
                        <span className="text-sm text-muted-foreground">
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
