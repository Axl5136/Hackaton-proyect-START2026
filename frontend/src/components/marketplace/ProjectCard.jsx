import { MapPin, Droplets, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const riskColors = {
  low: "text-green-500",
  medium: "text-orange-500",
  high: "text-red-500",
};

const riskIndicators = {
  low: "🟢",
  medium: "🟠",
  high: "🔴",
};

const verificationColors = {
  "Básica": "bg-muted text-muted-foreground",
  "Media": "bg-blue-500/20 text-blue-400",
  "Alta": "bg-green-500/20 text-green-400",
  "Muy alta": "bg-primary/20 text-primary",
};

export function ProjectCard({ project, onViewDetail, onBuy }) {
  const isSold = project.status === "sold";

  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
      isSold && "opacity-75"
    )}>
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={project.image}
          alt={project.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges overlay */}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {project.badges.map((badge) => (
            <Badge
              key={badge}
              className={cn(
                "text-xs",
                badge === "En tendencia" && "bg-orange-500/90 text-white",
                badge === "Alta verificación" && "bg-green-500/90 text-white",
                badge === "Mejor valor" && "bg-blue-500/90 text-white",
                badge === "Mejor impacto" && "bg-purple-500/90 text-white"
              )}
            >
              {badge}
            </Badge>
          ))}
        </div>

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge className="bg-muted text-muted-foreground text-lg px-4 py-2">
              Vendido
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="space-y-3 p-4">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-foreground line-clamp-1">
            {project.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{project.location}</span>
          </div>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {project.technology}
          </Badge>
          <Badge className={cn("text-xs", verificationColors[project.verificationLevel])}>
            <Shield className="mr-1 h-3 w-3" />
            {project.verificationLevel}
          </Badge>
          <span className="text-sm" title="Riesgo hídrico">
            {riskIndicators[project.riskLevel]}
          </span>
        </div>

        {/* Price and savings - CRITICAL INFO */}
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">Precio</p>
            <p className="text-lg font-bold text-primary">
              ${project.pricePerM3} <span className="text-xs font-normal">MXN/m³</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ahorro proyectado</p>
            <p className="text-lg font-bold text-foreground">
              {project.projectedSavings.toLocaleString()} <span className="text-xs font-normal">m³</span>
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 p-4 pt-0">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetail(project)}
        >
          Ver detalle
        </Button>
        <Button
          className="flex-1"
          disabled={isSold}
          onClick={() => onBuy(project)}
        >
          {isSold ? "Vendido" : "Comprar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
