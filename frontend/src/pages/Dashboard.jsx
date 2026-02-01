import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPICards } from "@/components/dashboard/KPICards";
import { MapPlaceholder } from "@/components/dashboard/MapPlaceholder";
import { WaterSavingsChart } from "@/components/dashboard/WaterSavingsChart";
import { CertificatesTable } from "@/components/dashboard/CertificatesTable";

export default function Dashboard() {
  return (
    <div className="dark">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <SidebarInset>
            <DashboardHeader companyName="AguaCorp México" />
            
            <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
              {/* KPI Cards */}
              <section aria-label="Indicadores clave">
                <KPICards />
              </section>

              {/* Map Section */}
              <section aria-label="Mapa de riesgo hídrico">
                <MapPlaceholder />
              </section>

              {/* Water Savings Chart */}
              <section aria-label="Evolución del agua ahorrada">
                <WaterSavingsChart />
              </section>

              {/* Certificates Table */}
              <section aria-label="Certificados">
                <CertificatesTable />
              </section>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
