import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award, Eye, Download, Copy, Check, Search, Filter } from "lucide-react";
import { CertificateModal } from "@/components/dashboard/CertificateModal";
import { PendingCertificateModal } from "@/components/dashboard/PendingCertificateModal";
import { useToast } from "@/hooks/use-toast";

const certificatesData = [
  {
    id: "CERT-2026-001",
    folio: "HYD-MX-2026-00145",
    date: "15 Ene 2026",
    m3: 2500,
    co2: 750,
    status: "Emitido",
    hash: "0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
    period: "Oct 2025 - Dic 2025",
    company: "AguaCorp México",
  },
  {
    id: "CERT-2025-012",
    folio: "HYD-MX-2025-00892",
    date: "01 Oct 2025",
    m3: 3200,
    co2: 960,
    status: "Validado",
    hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    period: "Jul 2025 - Sep 2025",
    company: "AguaCorp México",
  },
  {
    id: "CERT-2025-008",
    folio: "HYD-MX-2025-00654",
    date: "01 Jul 2025",
    m3: 2100,
    co2: 630,
    status: "Validado",
    hash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e",
    period: "Abr 2025 - Jun 2025",
    company: "AguaCorp México",
  },
  {
    id: "CERT-2025-004",
    folio: "HYD-MX-2025-00321",
    date: "01 Abr 2025",
    m3: 1800,
    co2: 540,
    status: "Validado",
    hash: "0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d",
    period: "Ene 2025 - Mar 2025",
    company: "AguaCorp México",
  },
  {
    id: "CERT-2024-024",
    folio: "HYD-MX-2024-02156",
    date: "01 Ene 2025",
    m3: 2850,
    co2: 855,
    status: "Validado",
    hash: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
    period: "Oct 2024 - Dic 2024",
    company: "AguaCorp México",
  },
  {
    id: "CERT-2024-020",
    folio: "HYD-MX-2024-01823",
    date: "01 Oct 2024",
    m3: 2200,
    co2: 660,
    status: "Validado",
    hash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    period: "Jul 2024 - Sep 2024",
    company: "AguaCorp México",
  },
  {
    id: "CERT-2024-016",
    folio: "HYD-MX-2024-01567",
    date: "01 Jul 2024",
    m3: 1950,
    co2: 585,
    status: "Validado",
    hash: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    period: "Abr 2024 - Jun 2024",
    company: "AguaCorp México",
  },
];

export default function Certificates() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [certificates, setCertificates] = useState(certificatesData);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [pendingCertificate, setPendingCertificate] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Handle incoming certificate from purchase
  useEffect(() => {
    if (location.state?.pendingCertificate) {
      setPendingCertificate(location.state.pendingCertificate);
      // Clear the state to prevent re-opening on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleConfirmCertificate = () => {
    if (pendingCertificate) {
      // Add to certificates list
      const newCert = {
        id: `CERT-${Date.now()}`,
        ...pendingCertificate,
      };
      setCertificates((prev) => [newCert, ...prev]);
      setPendingCertificate(null);
      toast({
        title: "Certificado emitido",
        description: `Se ha emitido el certificado ${pendingCertificate.folio}`,
      });
    }
  };

  const handleCancelCertificate = () => {
    setPendingCertificate(null);
    toast({
      title: "Operación cancelada",
      description: "El certificado no fue emitido",
      variant: "destructive",
    });
  };

  const handleCopyHash = (cert) => {
    navigator.clipboard.writeText(cert.hash);
    setCopiedId(cert.id);
    toast({
      title: "Hash copiado",
      description: "El hash del certificado se ha copiado al portapapeles",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status) => {
    return (
      <Badge
        className={
          status === "Emitido"
            ? "bg-primary/20 text-primary hover:bg-primary/30"
            : "bg-water-low/20 text-water-low hover:bg-water-low/30"
        }
      >
        {status}
      </Badge>
    );
  };

  // Filter certificates
  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalM3 = filteredCertificates.reduce((sum, cert) => sum + cert.m3, 0);
  const totalCO2 = filteredCertificates.reduce((sum, cert) => sum + cert.co2, 0);

  return (
    <div className="dark">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <SidebarInset>
            <DashboardHeader companyName="AguaCorp México" title="Mis Certificados" />

            <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
              {/* Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">Total Certificados</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {filteredCertificates.length}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">m³ Verificados</p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {totalM3.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">CO₂e Evitado</p>
                  <p className="mt-1 text-2xl font-bold text-water-low">
                    {totalCO2.toLocaleString()} kg
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por folio o periodo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Estatus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Emitido">Emitido</SelectItem>
                      <SelectItem value="Validado">Validado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  {filteredCertificates.length} certificado{filteredCertificates.length !== 1 && "s"}
                </p>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block rounded-lg border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Folio</TableHead>
                      <TableHead>Periodo</TableHead>
                      <TableHead>Fecha Emisión</TableHead>
                      <TableHead className="text-right">m³ verificados</TableHead>
                      <TableHead className="text-right">CO₂e evitado</TableHead>
                      <TableHead>Estatus</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.length > 0 ? (
                      filteredCertificates.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell className="font-medium font-mono text-sm">
                            {cert.folio}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {cert.period}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {cert.date}
                          </TableCell>
                          <TableCell className="text-right font-medium text-primary">
                            {cert.m3.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-water-low">
                            {cert.co2.toLocaleString()} kg
                          </TableCell>
                          <TableCell>{getStatusBadge(cert.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setSelectedCertificate(cert)}
                                title="Ver certificado"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Descargar"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleCopyHash(cert)}
                                title="Copiar hash"
                              >
                                {copiedId === cert.id ? (
                                  <Check className="h-4 w-4 text-water-low" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Award className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              No se encontraron certificados
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 md:hidden">
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <p className="font-mono text-sm font-medium text-foreground">
                            {cert.folio}
                          </p>
                          <p className="text-sm text-muted-foreground">{cert.period}</p>
                        </div>
                        {getStatusBadge(cert.status)}
                      </div>

                      <div className="mb-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">m³ verificados</p>
                          <p className="font-medium text-primary">
                            {cert.m3.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">CO₂e evitado</p>
                          <p className="font-medium text-water-low">
                            {cert.co2.toLocaleString()} kg
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Fecha emisión</p>
                          <p className="font-medium">{cert.date}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedCertificate(cert)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Descargar
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handleCopyHash(cert)}
                        >
                          {copiedId === cert.id ? (
                            <Check className="h-4 w-4 text-water-low" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12">
                    <Award className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No se encontraron certificados</p>
                  </div>
                )}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <CertificateModal
        certificate={selectedCertificate}
        open={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <PendingCertificateModal
        certificate={pendingCertificate}
        open={!!pendingCertificate}
        onConfirm={handleConfirmCertificate}
        onCancel={handleCancelCertificate}
      />
    </div>
  );
}
