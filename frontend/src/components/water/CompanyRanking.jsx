import { useState } from "react";
import { Search, ArrowUpDown, Eye, Droplets, Shield, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CompanyDrawer } from "./CompanyDrawer";
import { UrgencyBlock } from "./UrgencyBlock";

const mockCompanies = [
  {
    id: 1,
    name: "AgroVerde MX",
    industry: "Agricultura",
    waterSaved: "4,230 m³",
    creditsSupported: "3,500 m³",
    projects: 8,
    risk: "Bajo",
    verification: "Muy alta",
    co2Avoided: "890 ton",
    lastUpdate: "Hace 2 días",
    avgCost: "$78 MXN/m³",
    region: "Bajío",
  },
  {
    id: 2,
    name: "Cervecería Agua Clara",
    industry: "Bebidas",
    waterSaved: "2,890 m³",
    creditsSupported: "2,200 m³",
    projects: 5,
    risk: "Medio",
    verification: "Alta",
    co2Avoided: "560 ton",
    lastUpdate: "Hace 5 días",
    avgCost: "$92 MXN/m³",
    region: "Norte",
  },
  {
    id: 3,
    name: "TechnoAgua Systems",
    industry: "Tecnología",
    waterSaved: "1,450 m³",
    creditsSupported: "1,100 m³",
    projects: 3,
    risk: "Bajo",
    verification: "Media",
    co2Avoided: "340 ton",
    lastUpdate: "Hace 1 semana",
    avgCost: "$85 MXN/m³",
    region: "Centro",
  },
  {
    id: 4,
    name: "Industrias del Valle",
    industry: "Manufactura",
    waterSaved: "3,670 m³",
    creditsSupported: "3,000 m³",
    projects: 6,
    risk: "Alto",
    verification: "Muy alta",
    co2Avoided: "720 ton",
    lastUpdate: "Hace 3 días",
    avgCost: "$68 MXN/m³",
    region: "Sur",
  },
  {
    id: 5,
    name: "Alimentos Sustentables",
    industry: "Agricultura",
    waterSaved: "2,100 m³",
    creditsSupported: "1,800 m³",
    projects: 4,
    risk: "Medio",
    verification: "Alta",
    co2Avoided: "480 ton",
    lastUpdate: "Hace 4 días",
    avgCost: "$82 MXN/m³",
    region: "Bajío",
  },
];

function RiskBadge({ risk }) {
  const config = {
    Bajo: { color: "bg-water-low/10 text-water-low border-water-low/30", icon: "🟢" },
    Medio: { color: "bg-water-medium/10 text-water-medium border-water-medium/30", icon: "🟠" },
    Alto: { color: "bg-water-high/10 text-water-high border-water-high/30", icon: "🔴" },
  };
  
  return (
    <Badge variant="outline" className={`${config[risk].color} font-medium`}>
      {config[risk].icon} {risk}
    </Badge>
  );
}

function VerificationBadge({ level }) {
  const colors = {
    "Muy alta": "bg-water-low/10 text-water-low border-water-low/30",
    "Alta": "bg-primary/10 text-primary border-primary/30",
    "Media": "bg-water-medium/10 text-water-medium border-water-medium/30",
    "Básica": "bg-muted text-muted-foreground border-border",
  };
  
  return (
    <Badge variant="outline" className={`${colors[level]} font-medium`}>
      ✅ {level}
    </Badge>
  );
}

export function CompanyRanking() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("waterSaved");
  const [simpleView, setSimpleView] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const filteredCompanies = mockCompanies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <UrgencyBlock />

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Ranking de Empresas que Protegen el Agua
          </h2>
          <p className="text-muted-foreground">
            Créditos de agua = inversión en proyectos agrícolas que ahorran agua. Datos con evidencia.
          </p>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <span>Impacto (💧), Confianza (✅) y Riesgo (🔴) en un solo ranking.</span>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card/50 border-border/50"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-card/50 border-border/50">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waterSaved">Agua verificada</SelectItem>
                <SelectItem value="risk">Riesgo hídrico</SelectItem>
                <SelectItem value="verification">Nivel de verificación</SelectItem>
                <SelectItem value="cost">Costo promedio</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Switch
                id="view-mode"
                checked={simpleView}
                onCheckedChange={setSimpleView}
              />
              <Label htmlFor="view-mode" className="text-sm text-muted-foreground">
                Vista simple
              </Label>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger>Empresa</TooltipTrigger>
                    <TooltipContent>Nombre legal de la empresa</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-muted-foreground">Industria</TableHead>
                <TableHead className="text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" /> Agua verificada
                    </TooltipTrigger>
                    <TooltipContent>Metros cúbicos de agua ahorrados y verificados</TooltipContent>
                  </Tooltip>
                </TableHead>
                {!simpleView && (
                  <>
                    <TableHead className="text-muted-foreground">Créditos apoyados</TableHead>
                    <TableHead className="text-muted-foreground">Proyectos</TableHead>
                  </>
                )}
                <TableHead className="text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Riesgo
                    </TooltipTrigger>
                    <TooltipContent>Nivel de riesgo hídrico en la región de operación</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Verificación
                    </TooltipTrigger>
                    <TooltipContent>Nivel de verificación de datos (Satélite/IA/Docs)</TooltipContent>
                  </Tooltip>
                </TableHead>
                {!simpleView && (
                  <>
                    <TableHead className="text-muted-foreground">CO₂e evitado</TableHead>
                    <TableHead className="text-muted-foreground">Actualización</TableHead>
                    <TableHead className="text-muted-foreground">Costo prom.</TableHead>
                  </>
                )}
                <TableHead className="text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow 
                  key={company.id} 
                  className="cursor-pointer hover:bg-secondary/50 border-border transition-colors"
                  onClick={() => setSelectedCompany(company)}
                >
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {company.industry}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-primary font-semibold">{company.waterSaved}</TableCell>
                  {!simpleView && (
                    <>
                      <TableCell>{company.creditsSupported}</TableCell>
                      <TableCell>{company.projects}</TableCell>
                    </>
                  )}
                  <TableCell><RiskBadge risk={company.risk} /></TableCell>
                  <TableCell><VerificationBadge level={company.verification} /></TableCell>
                  {!simpleView && (
                    <>
                      <TableCell className="text-water-low">{company.co2Avoided}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{company.lastUpdate}</TableCell>
                      <TableCell>{company.avgCost}</TableCell>
                    </>
                  )}
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Drawer */}
      {selectedCompany && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setSelectedCompany(null)}
          />
          <CompanyDrawer 
            company={selectedCompany} 
            onClose={() => setSelectedCompany(null)} 
          />
        </>
      )}
    </TooltipProvider>
  );
}
