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
        const { data, error } = await supabase.from('projects').select('*');

        if (error) throw error;

        const formattedData = data.map(project => {
          const waterVolume = Number(project.water_savings_m3) || 0;
          const pricePerCredit = Number(project.price_per_credit) || 0;
          const totalValue = waterVolume * pricePerCredit;

          // --- 🛰️ INTEGRACIÓN DE TENDENCIAS SATELITALES (El "Factor Wow") ---
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

            // Pasamos las tendencias ya procesadas para el ImpactChart
            historical_ndwi: chartTrends,

            risk: calculateLegacyRisk(project.risk_score),
            verification: project.verified_by_ai ? "Muy alta" : "Media",
            projects: 1,
            co2Avoided: `${Math.floor(waterVolume * 0.14)} ton`, // Factor oficial del backend
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

  const calculateLegacyRisk = (score) => {
    if (!score) return "Bajo";
    if (score >= 80) return "Alto";
    if (score >= 50) return "Medio";
    return "Bajo";
  };

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
            Cargando mercado de agua...
          </div>
        ) : (
          <>
            {/* ✅ IMPACT CHART: Con datos satelitales integrados */}
            {selectedCompany && <ImpactChart company={selectedCompany} />}

            {/* ✅ COMPANY TABLE: Sin títulos duplicados */}
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