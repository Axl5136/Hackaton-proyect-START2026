import { MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MapPreview({ projects }) {
  const availableCount = projects.filter((p) => p.status === "available").length;
  const soldCount = projects.filter((p) => p.status === "sold").length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Mapa de Proyectos
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            Ver mapa completo
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Map placeholder */}
        <div className="relative h-48 bg-muted/50">
          {/* Simulated map background */}
          <div className="absolute inset-0 opacity-30">
            <svg viewBox="0 0 400 200" className="h-full w-full">
              {/* Mexico outline placeholder */}
              <path
                d="M50,100 Q100,50 150,80 T250,70 T350,90 Q380,120 350,150 T250,160 T150,150 Q100,140 50,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
              />
            </svg>
          </div>

          {/* Mock pins */}
          <div className="absolute left-[20%] top-[30%]">
            <div className="relative">
              <MapPin className="h-6 w-6 fill-orange-500 text-orange-600" />
              <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white">
                2
              </span>
            </div>
          </div>
          <div className="absolute left-[35%] top-[45%]">
            <MapPin className="h-6 w-6 fill-orange-500 text-orange-600" />
          </div>
          <div className="absolute left-[50%] top-[35%]">
            <MapPin className="h-6 w-6 fill-orange-500 text-orange-600" />
          </div>
          <div className="absolute left-[65%] top-[50%]">
            <MapPin className="h-6 w-6 fill-primary text-primary" />
          </div>
          <div className="absolute left-[75%] top-[40%]">
            <MapPin className="h-6 w-6 fill-primary text-primary" />
          </div>
          <div className="absolute right-[15%] top-[25%]">
            <MapPin className="h-6 w-6 fill-orange-500 text-orange-600" />
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-md bg-background/90 px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-xs text-muted-foreground">
                Disponible ({availableCount})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">
                Vendido ({soldCount})
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
