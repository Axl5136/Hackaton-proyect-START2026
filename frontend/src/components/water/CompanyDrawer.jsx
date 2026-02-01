import { X, Droplets, Shield, AlertTriangle, Download, ExternalLink, Folder, Satellite, Bot, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const verificationMethods = [
  { icon: Satellite, label: "Satélite", active: true },
  { icon: Bot, label: "IA", active: true },
  { icon: FileText, label: "Documentos", active: false },
];

export function CompanyDrawer({ company, onClose }) {
  if (!company) return null;

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Bajo": return "text-water-low bg-water-low/10 border-water-low/30";
      case "Medio": return "text-water-medium bg-water-medium/10 border-water-medium/30";
      case "Alto": return "text-water-high bg-water-high/10 border-water-high/30";
      default: return "text-muted-foreground";
    }
  };

  const getVerificationColor = (level) => {
    switch (level) {
      case "Muy alta": return "text-water-low";
      case "Alta": return "text-water-low";
      case "Media": return "text-water-medium";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right overflow-y-auto">
      <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ficha de Empresa</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Resumen */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">{company.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{company.industry}</Badge>
            <span>•</span>
            <span>{company.region || "Centro"}</span>
          </div>
        </div>

        <Separator />

        {/* Impacto */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Impacto Hídrico</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Agua verificada</p>
              <p className="text-lg font-bold text-primary">{company.waterSaved}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Créditos apoyados</p>
              <p className="text-lg font-bold">{company.creditsSupported}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Proyectos financiados</p>
              <p className="text-lg font-bold">{company.projects}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">CO₂e evitado</p>
              <p className="text-lg font-bold text-water-low">{company.co2Avoided}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Confianza */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-water-low" />
            <h4 className="font-semibold">Nivel de Confianza</h4>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Verificación</span>
              <span className={`font-semibold ${getVerificationColor(company.verification)}`}>
                {company.verification}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Evidencia:</span>
              <div className="flex gap-2">
                {verificationMethods.map((method) => (
                  <div 
                    key={method.label}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      method.active 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <method.icon className="h-3 w-3" />
                    {method.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Última actualización</span>
              <span className="text-sm">{company.lastUpdate}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Riesgo Hídrico */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-water-medium" />
            <h4 className="font-semibold">Riesgo Hídrico</h4>
          </div>
          
          <div className={`rounded-lg p-4 border ${getRiskColor(company.risk)}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-3 w-3 rounded-full ${
                company.risk === "Bajo" ? "bg-water-low" :
                company.risk === "Medio" ? "bg-water-medium" : "bg-water-high"
              }`} />
              <span className="font-semibold">Riesgo {company.risk}</span>
            </div>
            <p className="text-sm opacity-80">
              {company.risk === "Bajo" && "La región donde opera tiene buena disponibilidad de agua."}
              {company.risk === "Medio" && "La región presenta estrés hídrico moderado. Se recomienda monitoreo."}
              {company.risk === "Alto" && "La región enfrenta escasez severa. Inversión prioritaria."}
            </p>
          </div>
        </div>

        <Separator />

        {/* Acciones */}
        <div className="space-y-3">
          <Button className="w-full glow-water">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver evidencia
          </Button>
          <Button variant="secondary" className="w-full">
            <Folder className="h-4 w-4 mr-2" />
            Explorar proyectos para invertir
          </Button>
          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Descargar certificado
          </Button>
        </div>
      </div>
    </div>
  );
}
