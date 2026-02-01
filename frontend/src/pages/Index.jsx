import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabase";

// IMPORTS DE COMPONENTES DE ARTURO
import { Header } from "@/components/water/Header";
import { ImpactChart } from "@/components/water/ImpactChart";
import { CompanyTable } from "@/components/water/CompanyTable";
import { LoginModal } from "@/components/water/LoginModal";
import { RegisterModal } from "@/components/water/RegisterModal";

// TU MOTOR GEOESPACIAL
import WaterMap from "@/components/water/WaterMap";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CARGA DE DATOS DESDE SUPABASE
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Traemos todo de la tabla 'projects'
        const { data, error } = await supabase
          .from('projects')
          .select('*');

        if (error) throw error;

        const formattedData = data.map(project => {
          const waterVolume = Number(project.water_savings_m3) || 0;
          const pricePerCredit = Number(project.price_per_credit) || 0;
          const totalValue = waterVolume * pricePerCredit;

          return {
            id: project.id,
            name: project.name || "Proyecto Sin Nombre",
            industry: project.crop || "Agricultura",

            // Datos para ImpactChart y CompanyTable
            waterSaved: `${waterVolume.toLocaleString()} m³`,
            creditsSupported: `${waterVolume.toLocaleString()} m³`,
            marketCap: `$${totalValue.toLocaleString('es-MX')} MXN`,
            risk: calculateLegacyRisk(project.risk_score),
            verification: project.verified_by_ai ? "Muy alta" : "Media",

            projects: 1,
            // Lógica de CO₂: 1m³ = 0.2 ton evitadas
            co2Avoided: `${Math.floor(waterVolume * 0.14)} ton`,
            lastUpdate: "Hace 1 día",
            avgCost: `$${pricePerCredit} MXN/m³`,
            region: project.region,

            // DATOS CRÍTICOS PARA EL MAPA Y CÁLCULOS
            coordinates: project.coordinates,
            historical_ndwi: project.historical_ndwi,
            price_per_credit: project.price_per_credit,
            water_savings_m3: project.water_savings_m3,
            risk_score: project.risk_score,
            status: project.status
          };
        });

        setCompanies(formattedData);
      } catch (error) {
        console.error('Error supabase:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 2. LÓGICA DE RIESGO PARA SEMÁFOROS
  const calculateLegacyRisk = (score) => {
    if (!score) return "Bajo";
    if (score >= 80) return "Alto";
    if (score >= 50) return "Medio";
    return "Bajo";
  };

  // 3. ORDENAMIENTO POR VALOR DE MERCADO
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      const valA = parseFloat(a.marketCap?.replace(/[^0-9.-]+/g, "")) || 0;
      const valB = parseFloat(b.marketCap?.replace(/[^0-9.-]+/g, "")) || 0;
      return valB - valA;
    });
  }, [companies]);

  // 4. SELECCIÓN INICIAL AUTOMÁTICA
  useEffect(() => {
    if (sortedCompanies.length > 0 && !selectedCompany) {
      setSelectedCompany(sortedCompanies[0]);
    }
  }, [sortedCompanies, selectedCompany]);

  // 5. MODO OSCURO POR DEFECTO
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Header
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground animate-pulse">Sincronizando con AquaNexus Satelital...</p>
          </div>
        ) : (
          <>
            {/* --- DASHBOARD DE MIEDO (GRID SUPERIOR) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[550px]">
              {/* Bloque de Gráfica de Impacto */}
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-2xl transition-all hover:border-primary/50">
                {selectedCompany && <ImpactChart company={selectedCompany} />}
              </div>

              {/* Bloque de Tu Mapa Geoespacial */}
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-2xl relative transition-all hover:border-primary/50">
                <WaterMap
                  projects={sortedCompanies}
                  onProjectSelect={setSelectedCompany}
                  selectedId={selectedCompany?.id}
                />
              </div>
            </div>

            {/* --- TABLA DE MERCADO FINTECH --- */}
            <div className="bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
              <CompanyTable
                companies={sortedCompanies}
                selectedCompany={selectedCompany}
                onSelectCompany={setSelectedCompany}
              />
            </div>
          </>
        )}
      </main>

      {/* --- CAPA DE MODALES --- */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
};

export default Index;