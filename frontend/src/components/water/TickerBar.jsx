import { AlertTriangle, Droplets, FolderKanban, DollarSign } from "lucide-react";

const tickerItems = [
  { icon: AlertTriangle, label: "Riesgo hídrico región:", value: "Alto", status: "high" },
  { icon: Droplets, label: "Agua verificada este mes:", value: "+12,450 m³", status: "positive" },
  { icon: FolderKanban, label: "Proyectos disponibles:", value: "24", status: "neutral" },
  { icon: DollarSign, label: "Costo promedio:", value: "$85 MXN/m³", status: "neutral" },
];

export function TickerBar() {
  return (
    <div className="bg-secondary/50 border-b border-border overflow-hidden">
      <div className="flex items-center ticker-scroll whitespace-nowrap py-2">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className="flex items-center gap-2 px-6 border-r border-border/50">
            <item.icon className={`h-4 w-4 ${
              item.status === "high" ? "text-water-high" :
              item.status === "positive" ? "text-water-low" :
              "text-muted-foreground"
            }`} />
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className={`text-sm font-semibold ${
              item.status === "high" ? "text-water-high" :
              item.status === "positive" ? "text-water-low" :
              "text-foreground"
            }`}>
              {item.status === "high" && "🔴 "}
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
