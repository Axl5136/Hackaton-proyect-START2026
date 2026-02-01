import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Shield,
  Satellite,
  Bot,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const verificationColors = {
  "Básica": "bg-muted text-muted-foreground",
  "Media": "bg-blue-500/20 text-blue-400",
  "Alta": "bg-green-500/20 text-green-400",
  "Muy alta": "bg-primary/20 text-primary",
};

const riskIndicators = {
  low: "🟢",
  medium: "🟠",
  high: "🔴",
};

export function ProjectDetailModal({ project, open, onOpenChange, onPurchase }) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(100);
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!project) return null;

  const maxQuantity = project.projectedSavings;
  const totalPrice = quantity * project.pricePerM3;
  const isSold = project.status === "sold";

  const handlePurchase = async () => {
    setIsPurchasing(true);
    
    // Simulate purchase delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const hash = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
    
    onPurchase(project.id, quantity, hash);
    setIsPurchasing(false);
    onOpenChange(false);
    
    toast({
      title: "¡Compra exitosa!",
      description: (
        <div className="space-y-1">
          <p>Has adquirido {quantity.toLocaleString()} m³ de créditos de agua.</p>
          <p className="text-xs font-mono text-muted-foreground">Hash: {hash}</p>
        </div>
      ),
    });
  };

  const Content = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <img
          src={project.image}
          alt={project.name}
          className="h-full w-full object-cover"
        />
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge className="bg-muted text-muted-foreground text-lg px-4 py-2">
              Vendido
            </Badge>
          </div>
        )}
      </div>

      {/* Header info */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{project.technology}</Badge>
          <Badge className={verificationColors[project.verificationLevel]}>
            <Shield className="mr-1 h-3 w-3" />
            {project.verificationLevel}
          </Badge>
          <span title="Riesgo hídrico">{riskIndicators[project.riskLevel]}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {project.location}
        </div>
      </div>

      {/* Story */}
      <div className="space-y-2">
        <h4 className="font-medium text-foreground">Historia del agricultor</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>

      <Separator />

      {/* Details table */}
      <div className="space-y-2">
        <h4 className="font-medium text-foreground">Detalles del proyecto</h4>
        <div className="grid gap-3 rounded-lg bg-muted/50 p-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Precio por m³</span>
            <span className="font-semibold text-primary">${project.pricePerM3} MXN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Ahorro proyectado</span>
            <span className="font-semibold">{project.projectedSavings.toLocaleString()} m³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tiempo de verificación</span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {project.estimatedVerificationTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tecnología</span>
            <span className="font-medium">{project.technology}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Región</span>
            <span className="font-medium">{project.region}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Evidence block */}
      <div className="space-y-2">
        <h4 className="font-medium text-foreground">Evidencia</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className={cn(
            "flex flex-col items-center gap-1 rounded-lg p-3",
            project.evidence.satellite ? "bg-green-500/10" : "bg-muted/50"
          )}>
            <Satellite className={cn(
              "h-5 w-5",
              project.evidence.satellite ? "text-green-500" : "text-muted-foreground"
            )} />
            <span className="text-xs text-center">Satélite</span>
            {project.evidence.satellite ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className={cn(
            "flex flex-col items-center gap-1 rounded-lg p-3",
            project.evidence.aiAuditor ? "bg-green-500/10" : "bg-muted/50"
          )}>
            <Bot className={cn(
              "h-5 w-5",
              project.evidence.aiAuditor ? "text-green-500" : "text-muted-foreground"
            )} />
            <span className="text-xs text-center">Auditor IA</span>
            {project.evidence.aiAuditor ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className={cn(
            "flex flex-col items-center gap-1 rounded-lg p-3",
            project.evidence.documents ? "bg-green-500/10" : "bg-muted/50"
          )}>
            <FileText className={cn(
              "h-5 w-5",
              project.evidence.documents ? "text-green-500" : "text-muted-foreground"
            )} />
            <span className="text-xs text-center">Documentos</span>
            {project.evidence.documents ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* AI Verdict */}
      <div className="space-y-2">
        <h4 className="flex items-center gap-2 font-medium text-foreground">
          <Cpu className="h-4 w-4 text-primary" />
          Veredicto del Auditor Hidrológico IA
        </h4>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm text-foreground">{project.aiVerdict}</p>
        </div>
      </div>

      <Separator />

      {/* Purchase section */}
      {!isSold && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Comprar Créditos</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cantidad (m³)</span>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 0)))}
                className="w-32 text-right"
                min={1}
                max={maxQuantity}
              />
            </div>
            
            <Slider
              value={[quantity]}
              onValueChange={([value]) => setQuantity(value)}
              max={maxQuantity}
              min={1}
              step={100}
              className="py-4"
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>1 m³</span>
              <span>{maxQuantity.toLocaleString()} m³</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total estimado</span>
              <span className="text-2xl font-bold text-primary">
                ${totalPrice.toLocaleString()} MXN
              </span>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handlePurchase}
            disabled={isPurchasing}
          >
            {isPurchasing ? "Procesando..." : "Confirmar Compra"}
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{project.name}</DrawerTitle>
            <DrawerDescription>Proyecto de créditos de agua</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>Proyecto de créditos de agua</DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
