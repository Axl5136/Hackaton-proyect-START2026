import { useState, useEffect, useMemo } from "react";
// Ajusta la ruta si tu supabase.js está en otra carpeta (ej: '../supabase')
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

  // Estado para los datos reales de Supabase
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CARGA DE DATOS (Modo Fintech)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // Traemos todos los proyectos
        const { data, error } = await supabase
          .from('projects')
          .select('*');

        if (error) throw error;

        // TRANSFORMACIÓN DE DATOS
        const formattedData = data.map(project => {
          // Extraemos valores base para cálculos
          const waterVolume = project.water_savings_m3 || 0;
          const pricePerCredit = project.price_per_credit || 0;
          const totalValue = waterVolume * pricePerCredit; // Valor total del lote

          return {
            id: project.id,
            // Si el nombre viene vacío, ponemos un placeholder
            name: project.name || "Proyecto Sin Nombre",
            industry: project.crop || "Agricultura", // En el dashboard mostramos el Cultivo como industria

            // COLUMNA 1: El Activo Físico (Lo que se ahorró)
            waterSaved: `${waterVolume.toLocaleString()} m³`,

            // COLUMNA 2: El Valor Financiero (La "carne" para el inversionista)
            // En lugar de repetir los créditos, mostramos cuánto vale ese ahorro en dinero.
            creditsSupported: `$${totalValue.toLocaleString('es-MX')} MXN`,

            // Lógica de Riesgo (Score alto = Riesgo alto de sequía = Mayor urgencia)
            risk: calculateRiskLabel(project.risk_score),

            // Verificación
            verification: project.verified_by_ai ? "Verificada (IA)" : "En Proceso",

            // Datos adicionales para la tabla y gráficas
            projects: 1, // Un lote = 1 Proyecto
            co2Avoided: `${Math.floor(waterVolume * 0.2)} ton`, // Estimación CO2
            lastUpdate: "En tiempo real",
            avgCost: `$${pricePerCredit} MXN/m³`, // Precio unitario visible
            region: project.region
          };
        });

        setCompanies(formattedData);
      } catch (error) {
        console.error('Error conectando a Supabase:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Función auxiliar para etiquetar el riesgo hídrico
  const calculateRiskLabel = (score) => {
    if (!score) return "N/A";
    if (score >= 80) return "Crítico"; // Rojo: Urge inversión
    if (score >= 50) return "Alto";    // Naranja
    return "Medio";                    // Amarillo/Verde
  };

  // 2. ORDENAMIENTO (Business Logic)
  // Ordenamos por "Oportunidad Financiera" (Valor total del lote) descendente
  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      // Limpiamos el string de dinero para obtener el número puro
      const valA = parseFloat(a.creditsSupported.replace(/[^0-9.-]+/g, ""));
      const valB = parseFloat(b.creditsSupported.replace(/[^0-9.-]+/g, ""));
      return valB - valA;
    });
  }, [companies]);

  // Selección automática del primer proyecto (el más valioso) al cargar
  useEffect(() => {
    if (sortedCompanies.length > 0 && !selectedCompany) {
      setSelectedCompany(sortedCompanies[0]);
    }
  }, [sortedCompanies, selectedCompany]);

  // Forzar modo oscuro (Estética "Bloomberg Terminal")
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl font-mono text-primary animate-pulse">
              Cargando Mercado de Agua...
            </div>
          </div>
        ) : (
          <>
            {/* Top Section: KPIs y Gráficas del Proyecto Seleccionado */}
            <ImpactChart company={selectedCompany} />

            {/* Bottom Section: La "Bolsa" de Proyectos */}
            <CompanyTable
              companies={sortedCompanies}
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedCompany}
            />
          </>
        )}
      </main>

      {/* Modals */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
};

export default Index;