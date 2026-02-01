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

          // --- PREPARACIÓN DE DATOS PARA LAS CURVAS DEL CHART ---
          const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
          const rawNdwi = project.historical_ndwi || [0, 0, 0, 0, 0, 0]; // Fallback
          
          const chartTrends = rawNdwi.map((val, i) => ({
            month: months[i] || `M${i + 1}`,
            actual: val, // Curva de Riesgo
            proyectado: val * 1.15 // Curva de Impacto (Simulamos +15% de mejora hídrica)
          }));

          return {
            id: project.id,
            name: project.name || "Proyecto Sin Nombre",
            industry: project.crop || "Agricultura",

            // --- DATOS COMPATIBLES CON IMPACTCHART ---
            waterSaved: `${waterVolume.toLocaleString()} m³`,
            creditsSupported: `${waterVolume.toLocaleString()} m³`,
            
            // Pasamos las tendencias preparadas para las dos curvas
            historical_ndwi: chartTrends, 

            // --- DATO NUEVO PARA TU TABLA FINTECH ---
            marketCap: `$${totalValue.toLocaleString('es-MX')} MXN`,

            // --- PROTECCIÓN CONTRA CRASHES (RIESGO) ---
            risk: calculateLegacyRisk(project.risk_score),

            verification: project.verified_by_ai ? "Muy alta" : "Media",

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
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse">
            Cargando datos satelitales de Supabase...
          </div>
        ) : (
          <>
            {/* IMPORTANTE: Cambié 'company' por 'project' para que coincida 
                con la prop del ImpactChart que te pasé anteriormente. 
            */}
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