import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/water/Header";
import { ImpactChart } from "@/components/water/ImpactChart";
import { CompanyTable } from "@/components/water/CompanyTable";
import { LoginModal } from "@/components/water/LoginModal";
import { RegisterModal } from "@/components/water/RegisterModal";
import { supabase } from "../supabase";

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