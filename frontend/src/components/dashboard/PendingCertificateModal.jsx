import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Copy,
  Droplets,
  Award,
  Shield,
  CheckCircle2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PendingCertificateModal({ certificate, open, onConfirm, onCancel }) {
  const { toast } = useToast();

  if (!certificate) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.hash);
    toast({
      title: "Hash copiado",
      description: "El hash del certificado se ha copiado al portapapeles",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-primary/20 bg-card p-0">
        <div className="relative overflow-hidden">
          {/* Decorative header */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />

          {/* Certificate content */}
          <div className="relative p-4 md:p-6">
            <DialogHeader className="mb-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-center text-xl md:text-2xl">
                  Generar Certificado
                </DialogTitle>
              </div>
            </DialogHeader>

            {/* Certificate frame */}
            <div className="relative rounded-xl border-2 border-primary/30 bg-gradient-to-b from-secondary/50 to-secondary/30 p-4 md:p-6">
              {/* Corner decorations */}
              <div className="absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-primary/50" />
              <div className="absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-primary/50" />
              <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-primary/50" />
              <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-primary/50" />

              {/* Header with seal */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Droplets className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      HydroCredits
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Plataforma de Créditos de Agua
                    </p>
                  </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
              </div>

              <Separator className="mb-6 bg-primary/20" />

              {/* Main info */}
              <div className="mb-6 text-center">
                <p className="mb-1 text-sm text-muted-foreground">
                  Se certifica que la empresa
                </p>
                <p className="mb-4 text-xl font-bold text-foreground md:text-2xl">
                  {certificate.company}
                </p>
                <p className="text-sm text-muted-foreground">
                  ha verificado el ahorro de
                </p>
                <p className="mt-2 text-4xl font-bold text-primary md:text-5xl">
                  {certificate.m3.toLocaleString()} m³
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  de agua durante el periodo
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {certificate.period}
                </p>
              </div>

              <Separator className="mb-6 bg-primary/20" />

              {/* Details grid */}
              <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-background/30 p-3">
                  <p className="text-xs text-muted-foreground">Folio</p>
                  <p className="font-medium">{certificate.folio}</p>
                </div>
                <div className="rounded-lg bg-background/30 p-3">
                  <p className="text-xs text-muted-foreground">Fecha de emisión</p>
                  <p className="font-medium">{certificate.date}</p>
                </div>
                <div className="rounded-lg bg-background/30 p-3">
                  <p className="text-xs text-muted-foreground">CO₂e evitado</p>
                  <p className="font-medium text-water-low">
                    {certificate.co2.toLocaleString()} kg
                  </p>
                </div>
                <div className="rounded-lg bg-background/30 p-3">
                  <p className="text-xs text-muted-foreground">Estatus</p>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-water-low" />
                    <p className="font-medium text-water-low">
                      {certificate.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hash */}
              <div className="mb-6 rounded-lg bg-background/50 p-3">
                <p className="mb-1 text-xs text-muted-foreground">
                  Hash de verificación blockchain
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate text-xs text-primary">
                    {certificate.hash}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={handleCopyHash}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Signature footer */}
              <div className="flex items-end justify-between">
                <div className="text-center">
                  <div className="mb-2 h-10 w-28 border-b border-dashed border-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Firma del verificador
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2 h-10 w-28 border-b border-dashed border-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Sello oficial
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" className="gap-2" onClick={onCancel}>
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button className="gap-2" onClick={onConfirm}>
                <CheckCircle2 className="h-4 w-4" />
                Confirmar certificado
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
