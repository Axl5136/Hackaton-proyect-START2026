import { useState, useMemo } from "react";
import { Search, ArrowUpDown, Droplets, Shield, AlertTriangle, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

function RiskBadge({ risk }) {
  const config = {
    "Bajo": { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30", icon: "🟢" },
    "Medio": { color: "bg-amber-500/10 text-amber-500 border-amber-500/30", icon: "🟠" },
    "Alto": { color: "bg-red-500/10 text-red-500 border-red-500/30", icon: "🔴" },
    "Crítico": { color: "bg-red-900/20 text-red-600 border-red-600/50", icon: "🔥" },
    "Desconocido": { color: "bg-gray-500/10 text-gray-500", icon: "❓" }
  };

  const status = config[risk] || config["Desconocido"];

  return (
    <Badge variant="outline" className={`${status.color} font-medium whitespace-nowrap`}>
      {status.icon} {risk}
    </Badge>
  );
}

function VerificationBadge({ level }) {
  const colors = {
    "Muy alta": "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    "Alta": "bg-blue-500/10 text-blue-500 border-blue-500/30",
    "Verificada (IA)": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    "Media": "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    "Básica": "bg-muted text-muted-foreground border-border",
    "En Proceso": "bg-gray-800 text-gray-400 border-dashed border-gray-600",
  };

  const style = colors[level] || colors["Básica"];

  return (
    <Badge variant="outline" className={`${style} font-medium whitespace-nowrap`}>
      {level.includes("IA") ? "🤖 " : "✅ "} {level}
    </Badge>
  );
}

export function CompanyTable({ companies, selectedCompany, onSelectCompany }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("marketValue");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  const industries = [...new Set(companies.map(c => c.industry))];
  const regions = [...new Set(companies.map(c => c.region))];

  const filteredAndSortedCompanies = useMemo(() => {
    let result = companies.filter((company) => {
      // Validación segura por si acaso company.name viene undefined
      const safeName = company.name || "";
      const matchesSearch = safeName.toLowerCase().includes(search.toLowerCase());
      const matchesIndustry = industryFilter === "all" || company.industry === industryFilter;
      const matchesRegion = regionFilter === "all" || company.region === regionFilter;
      return matchesSearch && matchesIndustry && matchesRegion;
    });

    // Sort Logic
    result.sort((a, b) => {
      // Helper: Limpia "$", ",", "m³" y devuelve número float. Si falla, devuelve 0.
      const getNum = (str) => {
        if (!str) return 0;
        return parseFloat(str.replace(/[^0-9.-]+/g, "")) || 0;
      };

      if (sortBy === "waterSaved") {
        return getNum(b.waterSaved) - getNum(a.waterSaved);
      } else if (sortBy === "marketValue") {
        // CORRECCIÓN 1: Ordenamos por el campo 'marketCap' que trae el dinero
        return getNum(b.marketCap) - getNum(a.marketCap);
      } else if (sortBy === "risk") {
        const riskOrder = { "Crítico": 4, "Alto": 3, "Medio": 2, "Bajo": 1 };
        return (riskOrder[b.risk] || 0) - (riskOrder[a.risk] || 0);
      } else if (sortBy === "verification") {
        const verOrder = { "Verificada (IA)": 5, "Muy alta": 4, "Alta": 3, "Media": 2, "Básica": 1, "En Proceso": 0 };
        return (verOrder[b.verification] || 0) - (verOrder[a.verification] || 0);
      } else if (sortBy === "cost") {
        return getNum(a.avgCost) - getNum(b.avgCost);
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
            Ranking de Oportunidades
          </h2>
          <p className="text-sm text-muted-foreground">
            Mercado secundario de activos hídricos verificados.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyecto o empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary/50"
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
              <SelectTrigger className="w-48 bg-card/50 border-border/50 text-sm">
                <ArrowUpDown className="h-3 w-3 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketValue">💰 Valor de Mercado</SelectItem>
                <SelectItem value="waterSaved">💧 Agua verificada</SelectItem>
                <SelectItem value="risk">⚠️ Riesgo hídrico</SelectItem>
                <SelectItem value="verification">🛡️ Nivel de verificación</SelectItem>
                <SelectItem value="cost">💲 Costo unitario</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table with Scroll */}
        <div className="rounded-lg border border-border bg-card/30 overflow-hidden shadow-sm">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-muted-foreground text-xs font-semibold">EMPRESA / PROYECTO</TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold">SECTOR</TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        <Droplets className="h-3 w-3" /> VOLUMEN
                      </TooltipTrigger>
                      <TooltipContent>Agua ahorrada y lista para transaccionar</TooltipContent>
                    </Tooltip>
                  </TableHead>

                  <TableHead className="text-muted-foreground text-xs font-semibold hidden lg:table-cell">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 text-emerald-500">
                        <DollarSign className="h-3 w-3" /> VALOR DE MERCADO
                      </TooltipTrigger>
                      <TooltipContent>Capitalización total del lote de créditos disponibles</TooltipContent>
                    </Tooltip>
                  </TableHead>

                  <TableHead className="text-muted-foreground text-xs font-semibold">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> RIESGO
                      </TooltipTrigger>
                      <TooltipContent>Score de estrés hídrico regional</TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        <Shield className="h-3 w-3" /> VERIFICACIÓN
                      </TooltipTrigger>
                      <TooltipContent>Certificación por IA y Satélite</TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold hidden xl:table-cell">CO₂e</TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold hidden xl:table-cell">ACTUALIZACIÓN</TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold hidden xl:table-cell">PRECIO UNITARIO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCompanies.map((company) => (
                  <TableRow
                    key={company.id}
                    className={`cursor-pointer border-border transition-all ${selectedCompany?.id === company.id
                        ? "bg-primary/5 border-l-4 border-l-primary"
                        : "hover:bg-muted/50"
                      }`}
                    onClick={() => onSelectCompany(company)}
                  >
                    <TableCell className="font-medium text-sm text-foreground">{company.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-xs bg-secondary/50">
                        {company.industry}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-sm text-blue-400">{company.waterSaved}</TableCell>

                    {/* CORRECCIÓN 2: Renderizamos marketCap (dinero) en lugar de creditsSupported */}
                    <TableCell className="hidden lg:table-cell text-sm font-mono text-emerald-400 font-bold tracking-tight">
                      {company.marketCap}
                    </TableCell>

                    <TableCell><RiskBadge risk={company.risk} /></TableCell>
                    <TableCell><VerificationBadge level={company.verification} /></TableCell>
                    <TableCell className="hidden xl:table-cell text-muted-foreground text-sm">{company.co2Avoided}</TableCell>
                    <TableCell className="hidden xl:table-cell text-muted-foreground text-xs">{company.lastUpdate}</TableCell>
                    <TableCell className="hidden xl:table-cell text-sm text-foreground/80">{company.avgCost}</TableCell>
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