import { useState, useMemo } from "react";
import { Search, ArrowUpDown, Droplets, Shield, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export function CompanyTable({ companies, selectedCompany, onSelectCompany }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("waterSaved");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  const industries = [...new Set(companies.map(c => c.industry))];
  const regions = [...new Set(companies.map(c => c.region))];

  const filteredAndSortedCompanies = useMemo(() => {
    let result = companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase());
      const matchesIndustry = industryFilter === "all" || company.industry === industryFilter;
      const matchesRegion = regionFilter === "all" || company.region === regionFilter;
      return matchesSearch && matchesIndustry && matchesRegion;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "waterSaved") {
        return parseInt(b.waterSaved.replace(/[^0-9]/g, "")) - parseInt(a.waterSaved.replace(/[^0-9]/g, ""));
      } else if (sortBy === "risk") {
        const riskOrder = { Alto: 3, Medio: 2, Bajo: 1 };
        return riskOrder[b.risk] - riskOrder[a.risk];
      } else if (sortBy === "verification") {
        const verOrder = { "Muy alta": 4, Alta: 3, Media: 2, Básica: 1 };
        return verOrder[b.verification] - verOrder[a.verification];
      } else if (sortBy === "cost") {
        return parseInt(a.avgCost.replace(/[^0-9]/g, "")) - parseInt(b.avgCost.replace(/[^0-9]/g, ""));
      }
      return 0;
    });

    return result;
  }, [companies, search, sortBy, industryFilter, regionFilter]);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            Ranking de Empresas
          </h2>
          <p className="text-sm text-muted-foreground">
            Información para comparar impacto, riesgo y evidencia.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card/50 border-border/50"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-36 bg-card/50 border-border/50 text-sm">
                <SelectValue placeholder="Industria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {industries.map(ind => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-32 bg-card/50 border-border/50 text-sm">
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {regions.map(reg => (
                  <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 bg-card/50 border-border/50 text-sm">
                <ArrowUpDown className="h-3 w-3 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waterSaved">Agua verificada</SelectItem>
                <SelectItem value="risk">Riesgo hídrico</SelectItem>
                <SelectItem value="verification">Nivel de verificación</SelectItem>
                <SelectItem value="cost">Costo promedio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table with Scroll */}
        <div className="rounded-lg border border-border bg-card/30 overflow-hidden">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-muted-foreground text-xs">Empresa</TableHead>
                  <TableHead className="text-muted-foreground text-xs">Industria</TableHead>
                  <TableHead className="text-muted-foreground text-xs">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        <Droplets className="h-3 w-3" /> Agua verificada
                      </TooltipTrigger>
                      <TooltipContent>Metros cúbicos de agua ahorrados y verificados</TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs hidden lg:table-cell">Créditos</TableHead>
                  <TableHead className="text-muted-foreground text-xs hidden lg:table-cell">Proyectos</TableHead>
                  <TableHead className="text-muted-foreground text-xs">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Riesgo
                      </TooltipTrigger>
                      <TooltipContent>Nivel de riesgo hídrico en la región</TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Verificación
                      </TooltipTrigger>
                      <TooltipContent>Nivel de verificación de datos</TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs hidden xl:table-cell">CO₂e evitado</TableHead>
                  <TableHead className="text-muted-foreground text-xs hidden xl:table-cell">Actualización</TableHead>
                  <TableHead className="text-muted-foreground text-xs hidden xl:table-cell">Costo prom.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCompanies.map((company) => (
                  <TableRow 
                    key={company.id} 
                    className={`cursor-pointer border-border transition-all ${
                      selectedCompany?.id === company.id 
                        ? "bg-primary/10 border-l-2 border-l-primary" 
                        : "hover:bg-secondary/50"
                    }`}
                    onClick={() => onSelectCompany(company)}
                  >
                    <TableCell className="font-medium text-sm">{company.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-xs">
                        {company.industry}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-primary font-semibold text-sm">{company.waterSaved}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{company.creditsSupported}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{company.projects}</TableCell>
                    <TableCell><RiskBadge risk={company.risk} /></TableCell>
                    <TableCell><VerificationBadge level={company.verification} /></TableCell>
                    <TableCell className="hidden xl:table-cell text-water-low text-sm">{company.co2Avoided}</TableCell>
                    <TableCell className="hidden xl:table-cell text-muted-foreground text-xs">{company.lastUpdate}</TableCell>
                    <TableCell className="hidden xl:table-cell text-sm">{company.avgCost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  );
}
