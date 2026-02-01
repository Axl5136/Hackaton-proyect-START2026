import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPICards } from "@/components/dashboard/KPICards";
import { WaterSavingsChart } from "@/components/dashboard/WaterSavingsChart";
import { CertificatesTable } from "@/components/dashboard/CertificatesTable";
import { supabase } from "../supabase";

// ✅ IMPORTAMOS TU MAPA REAL Y QUITAMOS EL PLACEHOLDER
import WaterMap from "@/components/water/WaterMap";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("Cargando...");
  const [user, setUser] = useState(null);

  // Estado para los datos y selección
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // Para sincronía con el mapa
  const [kpiStats, setKpiStats] = useState({
    totalWater: 0,
    totalInvestment: 0,
    activeProjects: 0
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (currentUser && currentUser.user_metadata?.company_name) {
          setCompanyName(currentUser.user_metadata.company_name);
        } else {
          setCompanyName("Panel Corporativo");
        }

        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('*');

        if (error) throw error;

        if (projectsData) {
          // Formateamos para que el WaterMap reconozca las coordenadas y datos
          const formattedProjects = projectsData.map(p => ({
            ...p,
            waterSaved: `${(p.water_savings_m3 || 0).toLocaleString()} m³`,
            co2Avoided: `${Math.floor((p.water_savings_m3 || 0) * 0.14)} ton`
          }));

          const waterSum = projectsData.reduce((acc, curr) => acc + (Number(curr.water_savings_m3) || 0), 0);
          const totalValue = projectsData.reduce((acc, curr) => {
            const savings = Number(curr.water_savings_m3) || 0;
            const price = Number(curr.price_per_credit) || 0;
            return acc + (savings * price);
          }, 0);

          setKpiStats({
            totalWater: waterSum,
            totalInvestment: totalValue,
            activeProjects: projectsData.length
          });

          setProjects(formattedProjects);
          if (formattedProjects.length > 0) setSelectedProject(formattedProjects[0]);
        }

      } catch (error) {
        console.error("Error cargando dashboard:", error.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar user={user} />

          <SidebarInset>
            <DashboardHeader companyName={companyName} user={user} />

            <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
              {loading ? (
                <div className="flex h-full items-center justify-center pt-20">
                  <p className="text-muted-foreground animate-pulse">Sincronizando satélites...</p>
                </div>
              ) : (
                <>
                  <section aria-label="Indicadores clave">
                    <KPICards stats={kpiStats} />
                  </section>

                  {/* ✅ AQUÍ CAMBIAMOS EL PLACEHOLDER POR TU WATERMAP */}
                  <section aria-label="Mapa de riesgo hídrico" className="h-[400px] bg-card rounded-xl border border-border overflow-hidden shadow-lg relative">
                    <WaterMap
                      projects={projects}
                      onProjectSelect={setSelectedProject}
                      selectedId={selectedProject?.id}
                    />
                  </section>

                  <section aria-label="Evolución del agua ahorrada">
                    <WaterSavingsChart data={projects} />
                  </section>

                  <section aria-label="Certificados">
                    <CertificatesTable data={projects} />
                  </section>
                </>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}