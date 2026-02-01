import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, Eye, Download, Copy, Check } from "lucide-react";
import { CertificateModal } from "./CertificateModal";
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
];

export function CertificatesTable() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();

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
    const variants = {
      Emitido: "default",
      Validado: "secondary",
    };
    return (
      <Badge
        variant={variants[status]}
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

  return (
    <>
      <Card id="certificados" className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-primary" />
            Certificados
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 md:p-6 md:pt-0">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="rounded-lg border border-border max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Folio</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">m³ verificados</TableHead>
                    <TableHead className="text-right">CO₂e evitado</TableHead>
                    <TableHead>Estatus</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificatesData.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">{cert.folio}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {cert.date}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {cert.m3.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
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
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyHash(cert)}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 md:hidden max-h-96 overflow-y-auto">
            {certificatesData.map((cert) => (
              <div
                key={cert.id}
                className="rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{cert.folio}</p>
                    <p className="text-sm text-muted-foreground">{cert.date}</p>
                  </div>
                  {getStatusBadge(cert.status)}
                </div>

                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">m³ verificados</p>
                    <p className="font-medium">{cert.m3.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CO₂e evitado</p>
                    <p className="font-medium">{cert.co2.toLocaleString()} kg</p>
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
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CertificateModal
        certificate={selectedCertificate}
        open={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </>
  );
}
