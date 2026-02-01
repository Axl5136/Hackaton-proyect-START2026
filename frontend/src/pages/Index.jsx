import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/water/Header";
import { ImpactChart } from "@/components/water/ImpactChart";
import { CompanyTable } from "@/components/water/CompanyTable";
import { LoginModal } from "@/components/water/LoginModal";
import { RegisterModal } from "@/components/water/RegisterModal";
import { supabase } from "../supabase";

// Mock data as fallback when Supabase fails or returns empty
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
  {
    id: 6,
    name: "Hidroponía del Norte",
    industry: "Agricultura",
    waterSaved: "1,890 m³",
    creditsSupported: "1,500 m³",
    projects: 4,
    risk: "Bajo",
    verification: "Alta",
    co2Avoided: "420 ton",
    lastUpdate: "Hace 1 día",
    avgCost: "$75 MXN/m³",
    region: "Norte",
  },
  {
    id: 7,
    name: "Textiles Ecológicos SA",
    industry: "Manufactura",
    waterSaved: "980 m³",
    creditsSupported: "800 m³",
    projects: 2,
    risk: "Alto",
    verification: "Media",
    co2Avoided: "210 ton",
    lastUpdate: "Hace 1 semana",
    avgCost: "$95 MXN/m³",
    region: "Centro",
  },
];

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to calculate risk level
  const calculateLegacyRisk = (score) => {
    if (!score) return "Bajo";
    if (score >= 80) return "Alto";
    if (score >= 50) return "Medio";
    return "Bajo";
  };

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('projects').select('*');

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedData = data.map(project => {
            const waterVolume = Number(project.water_savings_m3) || 0;
            const pricePerCredit = Number(project.price_per_credit) || 0;
            const totalValue = waterVolume * pricePerCredit;

            // 🛰️ INTEGRACIÓN DE TENDENCIAS SATELITALES (El "Factor Wow")
            const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
            const rawNdwi = project.historical_ndwi || [0, 0, 0, 0, 0, 0];

            const chartTrends = rawNdwi.map((val, i) => ({
              month: months[i] || `M${i + 1}`,
              actual: val,
              proyectado: val * 1.15 // Simulación de mejora hídrica
            }));

            return {
              id: project.id,
              name: project.name || "Proyecto Sin Nombre",
              industry: project.crop || "Agricultura",
              waterSaved: `${waterVolume.toLocaleString()} m³`,
              creditsSupported: `${waterVolume.toLocaleString()} m³`,
              marketCap: `$${totalValue.toLocaleString('es-MX')} MXN`,
              historical_ndwi: chartTrends,
              risk: calculateLegacyRisk(project.risk_score),
              verification: project.verified_by_ai ? "Muy alta" : "Media",
              projects: 1,
              co2Avoided: `${Math.floor(waterVolume * 0.14)} ton`,
              lastUpdate: "Hace 1 día",
              avgCost: `$${pricePerCredit} MXN/m³`,
              region: project.region
            };
          });

          setCompanies(formattedData);
        } else {
          // Use mock data as fallback
          setCompanies(mockCompanies);
        }
      } catch (error) {
        console.error('Error supabase:', error.message);
        // Use mock data on error
        setCompanies(mockCompanies);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Sort companies by marketCap or waterSaved (descending)
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      // Try marketCap first (from Supabase data)
      if (a.marketCap && b.marketCap) {
        const valA = parseFloat(a.marketCap?.replace(/[^0-9.-]+/g, "")) || 0;
        const valB = parseFloat(b.marketCap?.replace(/[^0-9.-]+/g, "")) || 0;
        return valB - valA;
      }
      // Fallback to waterSaved (for mock data)
      const aVal = parseInt(a.waterSaved.replace(/[^0-9]/g, ""));
      const bVal = parseInt(b.waterSaved.replace(/[^0-9]/g, ""));
      return bVal - aVal;
    });
  }, [companies]);

  // Select first company on mount
  useEffect(() => {
    if (sortedCompanies.length > 0 && !selectedCompany) {
      setSelectedCompany(sortedCompanies[0]);
    }
  }, [sortedCompanies, selectedCompany]);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse">
            Cargando mercado de agua...
          </div>
        ) : (
          <>
            {/* IMPACT CHART: Con datos satelitales integrados */}
            {selectedCompany && <ImpactChart company={selectedCompany} />}

            {/* COMPANY TABLE */}
            <CompanyTable
              companies={sortedCompanies}
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedCompany}
            />
          </>
        )}
      </main>

      {/* MODALES CON NAVEGACIÓN PRO */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
    </div>
  );
};

export default Index;
