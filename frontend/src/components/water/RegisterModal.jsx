import { X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RegisterModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Registra tu empresa</h2>
          <p className="text-muted-foreground mt-1">Únete al mercado de créditos de agua</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="company-name">Nombre legal de la empresa</Label>
            <Input 
              id="company-name" 
              placeholder="Mi Empresa S.A. de C.V."
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industria</Label>
            <Select>
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue placeholder="Selecciona una industria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agricultura">Agricultura</SelectItem>
                <SelectItem value="manufactura">Manufactura</SelectItem>
                <SelectItem value="tecnologia">Tecnología</SelectItem>
                <SelectItem value="bebidas">Bebidas</SelectItem>
                <SelectItem value="alimentos">Alimentos</SelectItem>
                <SelectItem value="textil">Textil</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Región / Ubicación</Label>
            <Select>
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue placeholder="Selecciona una región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="norte">Norte</SelectItem>
                <SelectItem value="centro">Centro</SelectItem>
                <SelectItem value="sur">Sur</SelectItem>
                <SelectItem value="bajio">Bajío</SelectItem>
                <SelectItem value="occidente">Occidente</SelectItem>
                <SelectItem value="peninsula">Península</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="corporate-email">Correo corporativo</Label>
            <Input 
              id="corporate-email" 
              type="email" 
              placeholder="contacto@empresa.com"
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <Button type="submit" className="w-full glow-water mt-6">
            Crear cuenta
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </form>
      </div>
    </div>
  );
}
