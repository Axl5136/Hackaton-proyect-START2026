import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabase";

import { Header } from "@/components/water/Header";
import { ImpactChart } from "@/components/water/ImpactChart";
import { CompanyTable } from "@/components/water/CompanyTable";
import { LoginModal } from "@/components/water/LoginModal";
import { RegisterModal } from "@/components/water/RegisterModal";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
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

            // --- DATOS COMPATIBLES CON IMPACTCHART ---
            // Mantenemos el formato exacto "12,345 m³" que espera el chart
            waterSaved: `${waterVolume.toLocaleString()} m³`,
            creditsSupported: `${waterVolume.toLocaleString()} m³`,

            // --- DATO NUEVO PARA TU TABLA FINTECH ---
            marketCap: `$${totalValue.toLocaleString('es-MX')} MXN`,

            // --- PROTECCIÓN CONTRA CRASHES (RIESGO) ---
            // Forzamos solo 3 niveles para no romper gráficas que usen diccionarios de colores fijos
            risk: calculateLegacyRisk(project.risk_score),

            verification: project.verified_by_ai ? "Muy alta" : "Media", // Usamos valores estándar del mock

            projects: 1,
            co2Avoided: `${Math.floor(waterVolume * 0.2)} ton`,
            lastUpdate: "Hace 1 día",
            avgCost: `$${pricePerCredit} MXN/m³`,
            region: project.region
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

  // FUNCIÓN SEGURA: Solo devuelve lo que el Mock original tenía
  const calculateLegacyRisk = (score) => {
    if (!score) return "Bajo";
    if (score >= 80) return "Alto"; // Quitamos "Crítico" para no romper el Chart
    if (score >= 50) return "Medio";
    return "Bajo";
  };

  // Ordenamos por dinero (marketCap)
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      const valA = parseFloat(a.marketCap?.replace(/[^0-9.-]+/g, "")) || 0;
      const valB = parseFloat(b.marketCap?.replace(/[^0-9.-]+/g, "")) || 0;
      return valB - valA;
    });
  }, [companies]);

  // Selección inicial automática
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
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse">
            Cargando datos...
          </div>
        ) : (
          <>
            {/* Validamos que selectedCompany exista antes de renderizar el chart */}
            {selectedCompany && <ImpactChart company={selectedCompany} />}

            <CompanyTable
              companies={sortedCompanies}
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedCompany}
            />
          </>
        )}
      </main>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
};

export default Index;