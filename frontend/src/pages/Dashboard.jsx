import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPICards } from "@/components/dashboard/KPICards";
import { MapPlaceholder } from "@/components/dashboard/MapPlaceholder";
import { WaterSavingsChart } from "@/components/dashboard/WaterSavingsChart";
import { CertificatesTable } from "@/components/dashboard/CertificatesTable";
// Asegúrate de que la ruta a supabase sea correcta (ajusta ../ o ./ según tu estructura)
import { supabase } from "../supabase";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("Cargando...");
  const [user, setUser] = useState(null);

  // Estado para los datos que bajamos de la BD
  const [projects, setProjects] = useState([]);
  const [kpiStats, setKpiStats] = useState({
    totalWater: 0,
    totalInvestment: 0,
    activeProjects: 0
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        // 1. OBTENER USUARIO ACTUAL (Para el Header)
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user && user.user_metadata?.company_name) {
          setCompanyName(user.user_metadata.company_name);
        } else {
          setCompanyName("Panel Corporativo");
        }

        // 2. OBTENER PROYECTOS (Para Gráficas y Tablas)
        // Nota: En un futuro aquí filtraríamos por .eq('owner_id', user.id)
        // Por ahora en el Hackathon mostramos todos para que se vea lleno.
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('*');

        if (error) throw error;

        // 3. CALCULAR KPIs EN TIEMPO REAL
        if (projectsData) {
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

          setProjects(projectsData);
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
    <div className="dark min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Pasamos el usuario al sidebar por si quieres poner su foto/email ahí */}
          <DashboardSidebar user={user} />

          <SidebarInset>
            {/* Header dinámico con el nombre de la empresa real */}
            <DashboardHeader companyName={companyName} user={user} />

            <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
              {loading ? (
                <div className="flex h-full items-center justify-center pt-20">
                  <p className="text-muted-foreground animate-pulse">Sincronizando satélites...</p>
                </div>
              ) : (
                <>
                  {/* KPI Cards: Le pasamos los números calculados */}
                  <section aria-label="Indicadores clave">
                    <KPICards stats={kpiStats} />
                  </section>

                  {/* Map Section: Podríamos pasarle las coordenadas de los proyectos */}
                  <section aria-label="Mapa de riesgo hídrico">
                    <MapPlaceholder projects={projects} />
                  </section>

                  {/* Water Savings Chart: Le pasamos la data para que grafique historia */}
                  <section aria-label="Evolución del agua ahorrada">
                    <WaterSavingsChart data={projects} />
                  </section>

                  {/* Certificates Table: La tabla llena con datos reales */}
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