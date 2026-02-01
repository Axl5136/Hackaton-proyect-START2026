import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { regions, technologies, verificationLevels, sortOptions } from "@/data/mockProjects";

export function FilterBar({ filters, onFiltersChange, onSortChange, sortBy }) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount =
    (filters.region ? 1 : 0) +
    (filters.technology ? 1 : 0) +
    (filters.verification ? 1 : 0);

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      region: "",
      technology: "",
      verification: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Main filter row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por rancho o ubicación..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-background border-border"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter button for mobile */}
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Filtros</h4>

                {/* Region */}
                <div className="space-y-2">
                  <Label>Región</Label>
                  <Select
                    value={filters.region}
                    onValueChange={(value) => onFiltersChange({ ...filters, region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las regiones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las regiones</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Technology */}
                <div className="space-y-2">
                  <Label>Tecnología</Label>
                  <Select
                    value={filters.technology}
                    onValueChange={(value) => onFiltersChange({ ...filters, technology: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las tecnologías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las tecnologías</SelectItem>
                      {technologies.map((tech) => (
                        <SelectItem key={tech.value} value={tech.value}>
                          {tech.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Verification Level */}
                <div className="space-y-2">
                  <Label>Nivel de verificación</Label>
                  <Select
                    value={filters.verification}
                    onValueChange={(value) => onFiltersChange({ ...filters, verification: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los niveles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los niveles</SelectItem>
                      {verificationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          {filters.region && filters.region !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filters.region}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, region: "" })}
              />
            </Badge>
          )}
          {filters.technology && filters.technology !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {technologies.find((t) => t.value === filters.technology)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, technology: "" })}
              />
            </Badge>
          )}
          {filters.verification && filters.verification !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filters.verification}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, verification: "" })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
