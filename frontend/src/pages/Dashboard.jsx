import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPICards } from "@/components/dashboard/KPICards";
import { WaterSavingsChart } from "@/components/dashboard/WaterSavingsChart";
import { CertificatesTable } from "@/components/dashboard/CertificatesTable";
import { supabase } from "../supabase";
import WaterMap from "@/components/water/WaterMap";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("Cargando...");
  const [user, setUser] = useState(null);

  const [projects, setProjects] = useState([]);
  const [chartHistory, setChartHistory] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
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

        // 1. Fetch Proyectos
        const { data: projectsData, error: pError } = await supabase
          .from('projects')
          .select('*');
        if (pError) throw pError;

        // 2. Fetch Transacciones para la curva acumulada
        const { data: transData, error: tError } = await supabase
          .from('transactions')
          .select('amount_paid, timestamp')
          .order('timestamp', { ascending: true });
        if (tError) throw tError;

        // --- LÓGICA DE PROCESAMIENTO PARA LA GRÁFICA ---
        let acumuladorDinero = 0;
        let acumuladorAgua = 0;
        const M3_FACTOR = 0.5; // Factor de conversión: 1 USD = 0.5 m3 (Ajustable)

        const processedHistory = (transData || []).map(t => {
          acumuladorDinero += Number(t.amount_paid);
          acumuladorAgua += (Number(t.amount_paid) * M3_FACTOR);
          
          return {
            // Generamos varias llaves para asegurar compatibilidad con el componente Chart
            name: new Date(t.timestamp).toLocaleDateString('es-MX', { month: 'short' }),
            month: new Date(t.timestamp).toLocaleDateString('es-MX', { month: 'short' }),
            total: acumuladorDinero,
            m3: acumuladorAgua,
            value: acumuladorAgua // Por si el chart usa 'value'
          };
        });

        setChartHistory(processedHistory);

        // --- KPIs Y PROYECTOS ---
        if (projectsData) {
          const formattedProjects = projectsData.map(p => ({
            ...p,
            waterSaved: `${(p.water_savings_m3 || 0).toLocaleString()} m³`,
            co2Avoided: `${Math.floor((p.water_savings_m3 || 0) * 0.14)} ton`
          }));

          setKpiStats({
            totalWater: acumuladorAgua, // Ahora el KPI de agua viene de transacciones reales
            totalInvestment: acumuladorDinero,
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

                  <section aria-label="Mapa de riesgo hídrico" className="h-[400px] bg-card rounded-xl border border-border overflow-hidden shadow-lg relative">
                    <WaterMap
                      projects={projects}
                      onProjectSelect={setSelectedProject}
                      selectedId={selectedProject?.id}
                    />
                  </section>

                  <section aria-label="Evolución del agua ahorrada">
                    {/* chartHistory ahora lleva m3, total y value */}
                    <WaterSavingsChart data={chartHistory} />
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