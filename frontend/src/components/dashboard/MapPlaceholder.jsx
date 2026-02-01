import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw, Map } from "lucide-react";

const regions = [
  { value: "all", label: "Todas las regiones" },
  { value: "norte", label: "Norte" },
  { value: "centro", label: "Centro" },
  { value: "sur", label: "Sur" },
  { value: "peninsula", label: "Península" },
];

export function MapPlaceholder() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-col gap-4 space-y-0 pb-4 md:flex-row md:items-center md:justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Map className="h-5 w-5 text-primary" />
          Mapa de riesgo hídrico — México
        </CardTitle>

        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Región" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Switch id="projects-toggle" />
            <Label
              htmlFor="projects-toggle"
              className="text-sm text-muted-foreground"
            >
              Ver proyectos cercanos
            </Label>
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar datos
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Map placeholder container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-secondary/50">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Map className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                Mapa placeholder (México)
              </p>
              <p className="text-sm text-muted-foreground">
                Integrar Mapbox aquí
              </p>
            </div>
          </div>

          {/* Grid overlay for visual effect */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-secondary/30 p-3">
          <span className="text-sm font-medium text-muted-foreground">
            Leyenda:
          </span>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-water-low" />
            <span className="text-sm text-muted-foreground">Bajo riesgo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-water-medium" />
            <span className="text-sm text-muted-foreground">Riesgo medio</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-water-high" />
            <span className="text-sm text-muted-foreground">Alto riesgo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
