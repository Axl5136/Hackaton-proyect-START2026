import { AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function UrgencyBlock() {
  return (
    <Card className="bg-gradient-to-r from-water-high/10 via-water-medium/10 to-transparent border-water-high/30 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-water-high/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-water-high" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Riesgo hídrico en aumento
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              En algunas zonas el agua disponible está bajando. Invertir en eficiencia agrícola reduce presión y mejora resiliencia.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-water-high/30 text-water-high hover:bg-water-high/10 flex-shrink-0"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Ver mapa de riesgo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
