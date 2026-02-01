import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Copy,
  Droplets,
  Award,
  Shield,
  CheckCircle2,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CertificateSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get certificate data from navigation state or use defaults
  const certificate = location.state?.certificate || {
    company: "AguaCorp México",
    m3: 2500,
    period: "Oct 2025 - Dic 2025",
    folio: "HYD-MX-2026-00145",
    date: "15 Ene 2026",
    co2: 750,
    status: "Emitido",
    hash: "0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.hash);
    toast({
      title: "Hash copiado",
      description: "El hash del certificado se ha copiado al portapapeles",
    });
  };

  const handleCopyFolio = () => {
    navigator.clipboard.writeText(certificate.folio);
    toast({
      title: "Folio copiado",
      description: "El folio del certificado se ha copiado al portapapeles",
    });
  };

  return (
    <div className="dark min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
            Compra exitosa ✅
          </h1>
          <p className="text-muted-foreground">
            Se generó tu certificado de agua verificada
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/marketplace")}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Marketplace
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/certificates")}
          >
            <FileText className="h-4 w-4" />
            Ver mis certificados
          </Button>
        </div>

        {/* Certificate Document */}
        <div className="relative rounded-xl border-2 border-primary/30 bg-gradient-to-b from-secondary/50 to-secondary/30 p-6 md:p-8">
          {/* Corner decorations */}
          <div className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-primary/50" />
          <div className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-primary/50" />
          <div className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-primary/50" />
          <div className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-primary/50" />

          {/* Header with logo and seal */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-primary">
                  HydroCredits
                </p>
                <p className="text-sm text-muted-foreground">
                  Plataforma de Créditos de Agua
                </p>
              </div>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>

          <Separator className="mb-8 bg-primary/20" />

          {/* Certificate Title */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <Award className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              Certificado de Agua Verificada
            </h2>
          </div>

          {/* Main Content - Centered */}
          <div className="mb-8 text-center">
            <p className="mb-2 text-muted-foreground">
              Se certifica que la empresa
            </p>
            <p className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
              {certificate.company}
            </p>
            <p className="text-muted-foreground">
              ha verificado el ahorro de
            </p>
            <p className="my-4 text-5xl font-bold text-primary md:text-6xl">
              {certificate.m3.toLocaleString()} m³
            </p>
            <p className="text-muted-foreground">
              de agua durante el periodo
            </p>
            <p className="mt-2 text-xl font-semibold text-foreground">
              {certificate.period}
            </p>
          </div>

          <Separator className="mb-8 bg-primary/20" />

          {/* Details Grid (2x2) */}
          <div className="mb-8 grid grid-cols-2 gap-6 text-sm md:text-base">
            <div className="rounded-lg bg-background/30 p-4">
              <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">
                Folio
              </p>
              <p className="font-semibold text-foreground">{certificate.folio}</p>
            </div>
            <div className="rounded-lg bg-background/30 p-4">
              <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">
                Fecha de emisión
              </p>
              <p className="font-semibold text-foreground">{certificate.date}</p>
            </div>
            <div className="rounded-lg bg-background/30 p-4">
              <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">
                CO₂e evitado
              </p>
              <p className="font-semibold text-water-low">
                {certificate.co2.toLocaleString()} kg
              </p>
            </div>
            <div className="rounded-lg bg-background/30 p-4">
              <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">
                Estatus
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-water-low" />
                <p className="font-semibold text-water-low">
                  {certificate.status}
                </p>
              </div>
            </div>
          </div>

          {/* Hash Block */}
          <div className="mb-8 rounded-lg bg-background/50 p-4">
            <p className="mb-2 text-xs text-muted-foreground uppercase tracking-wide">
              Hash de verificación blockchain
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 truncate font-mono text-sm text-primary md:text-base">
                {certificate.hash}
              </code>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-2"
                onClick={handleCopyHash}
              >
                <Copy className="h-4 w-4" />
                Copiar
              </Button>
            </div>
          </div>

          <Separator className="mb-8 bg-primary/20" />

          {/* Signature Footer */}
          <div className="flex items-end justify-between gap-8">
            <div className="flex-1 text-center">
              <div className="mb-2 h-16 border-b border-dashed border-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Firma del verificador
              </p>
            </div>
            <div className="flex-1 text-center">
              <div className="mb-2 h-16 border-b border-dashed border-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Sello oficial
              </p>
            </div>
          </div>
        </div>

        {/* Actions below certificate */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Descargar certificado
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleCopyFolio}>
            <Copy className="h-4 w-4" />
            Copiar folio
          </Button>
        </div>
      </div>
    </div>
  );
}
