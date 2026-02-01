import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/water/Header";
import { ImpactChart } from "@/components/water/ImpactChart";
import { CompanyTable } from "@/components/water/CompanyTable";
import { LoginModal } from "@/components/water/LoginModal";
import { RegisterModal } from "@/components/water/RegisterModal";

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

  // Sort companies by water saved (descending) and select first by default
  const sortedCompanies = useMemo(() => {
    return [...mockCompanies].sort((a, b) => {
      const aVal = parseInt(a.waterSaved.replace(/[^0-9]/g, ""));
      const bVal = parseInt(b.waterSaved.replace(/[^0-9]/g, ""));
      return bVal - aVal;
    });
  }, []);

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
    <div className="min-h-screen bg-background">
      <Header 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Top Section: Chart + KPIs */}
        <ImpactChart company={selectedCompany} />

        {/* Bottom Section: Company Ranking Table */}
        <CompanyTable 
          companies={sortedCompanies}
          selectedCompany={selectedCompany}
          onSelectCompany={setSelectedCompany}
        />
      </main>

      {/* Modals */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
};

export default Index;
