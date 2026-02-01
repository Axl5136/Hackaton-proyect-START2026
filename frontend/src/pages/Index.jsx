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

  // Helper para determinar el riesgo basado en el texto de tu base de datos
  const formatRisk = (riskLevel) => {
    const levels = { 'high': 'Alto', 'medium': 'Medio', 'low': 'Bajo' };
    return levels[riskLevel?.toLowerCase()] || "Medio";
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        // 1. Cambiamos la consulta a la tabla 'companies'
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('total_budget', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedData = data.map(company => {
            // Calculamos valores basados en el esquema de tu imagen (image_23e097.png)
            const budget = Number(company.total_budget) || 0;
            const co2 = Number(company.co2_achieved_tons) || 0;

            return {
              id: company.id,
              name: company.name || "Empresa Anónima",
              industry: company.industry || "Varias",
              region: company.region || "México",
              // Mapeamos los datos para que la tabla los renderice correctamente
              waterSaved: `${(budget / 50).toLocaleString()} m³`, // Cálculo estimado basado en presupuesto
              creditsSupported: `${(budget / 60).toLocaleString()} m³`,
              marketCap: `$${budget.toLocaleString('es-MX')} MXN`,
              risk: formatRisk(company.water_risk_level),
              verification: "Verificada",
              co2Avoided: `${co2.toFixed(1)} ton`,
              lastUpdate: "Hace 1 día",
              // Datos para el gráfico (ImpactChart)
              historical_ndwi: [
                { month: "Ene", actual: 0.4 },
                { month: "Feb", actual: 0.45 },
                { month: "Mar", actual: 0.5 }
              ]
            };
          });

          setCompanies(formattedData);
        }
      } catch (error) {
        console.error('Error cargando compañías:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Ordenar por presupuesto (marketCap)
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      const valA = parseFloat(a.marketCap?.replace(/[^0-9.-]+/g, "")) || 0;
      const valB = parseFloat(b.marketCap?.replace(/[^0-9.-]+/g, "")) || 0;
      return valB - valA;
    });
  }, [companies]);

  useEffect(() => {
    if (sortedCompanies.length > 0 && !selectedCompany) {
      setSelectedCompany(sortedCompanies[0]);
    }
  }, [sortedCompanies, selectedCompany]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
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
            Cargando ranking de empresas...
          </div>
        ) : (
          <>
            {selectedCompany && <ImpactChart company={selectedCompany} />}
            <CompanyTable
              companies={sortedCompanies}
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedCompany}
            />
          </>
        )}
      </main>

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