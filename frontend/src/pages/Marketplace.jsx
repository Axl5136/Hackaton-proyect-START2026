import { useState, useMemo } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterBar } from "@/components/marketplace/FilterBar";
import { ProjectCard } from "@/components/marketplace/ProjectCard";
import { ProjectDetailModal } from "@/components/marketplace/ProjectDetailModal";
import { mockProjects } from "@/data/mockProjects";

export default function Marketplace() {
  const [projects, setProjects] = useState(mockProjects);
  const [filters, setFilters] = useState({
    search: "",
    region: "",
    technology: "",
    verification: "",
  });
  const [sortBy, setSortBy] = useState("impact");
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.location.toLowerCase().includes(searchLower)
      );
    }

    // Apply region filter
    if (filters.region && filters.region !== "all") {
      result = result.filter((p) => p.region === filters.region);
    }

    // Apply technology filter
    if (filters.technology && filters.technology !== "all") {
      result = result.filter((p) => p.technologyType === filters.technology);
    }

    // Apply verification filter
    if (filters.verification && filters.verification !== "all") {
      result = result.filter((p) => p.verificationLevel === filters.verification);
    }

    // Apply sorting
    switch (sortBy) {
      case "impact":
        result.sort((a, b) => b.projectedSavings - a.projectedSavings);
        break;
      case "price":
        result.sort((a, b) => a.pricePerM3 - b.pricePerM3);
        break;
      case "verification":
        const verificationOrder = { "Muy alta": 4, "Alta": 3, "Media": 2, "Básica": 1 };
        result.sort(
          (a, b) => verificationOrder[b.verificationLevel] - verificationOrder[a.verificationLevel]
        );
        break;
      case "recent":
        // Mock: reverse order to simulate "recent"
        result.reverse();
        break;
    }

    return result;
  }, [projects, filters, sortBy]);

  const handleViewDetail = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleBuyClick = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handlePurchase = (projectId, quantity, hash) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, status: "sold", purchasedQuantity: quantity, purchaseHash: hash }
          : p
      )
    );
  };

  return (
    <div className="dark">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <SidebarInset>
            <DashboardHeader companyName="AguaCorp México" title="Marketplace de Proyectos" />

            <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
              {/* Filters */}
              <section aria-label="Filtros">
                <FilterBar
                  filters={filters}
                  onFiltersChange={setFilters}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </section>

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredProjects.length} proyecto{filteredProjects.length !== 1 && "s"} encontrado{filteredProjects.length !== 1 && "s"}
                </p>
              </div>

              {/* Projects Grid */}
              <section aria-label="Proyectos disponibles">
                {filteredProjects.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onViewDetail={handleViewDetail}
                        onBuy={handleBuyClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
                    <p className="text-lg font-medium text-muted-foreground">
                      No se encontraron proyectos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Intenta ajustar los filtros de búsqueda
                    </p>
                  </div>
                )}
              </section>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onPurchase={handlePurchase}
      />
    </div>
  );
}
