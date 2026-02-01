import { useState } from "react";
import { X, Building2, Loader2 } from "lucide-react"; // Agregué Loader2
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Asegúrate de importar tu cliente supabase correctamente
import { supabase } from "../../supabase";

export function RegisterModal({ onClose, onSwitchToLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    region: "",
    email: "",
    password: "" // Campo nuevo necesario
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Crear usuario en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Guardamos los datos extra como metadata del usuario (Hackathon Friendly)
          data: {
            company_name: formData.companyName,
            industry: formData.industry,
            region: formData.region,
            role: 'company'
          }
        }
      });

      if (authError) throw authError;

      // Éxito
      alert("¡Cuenta creada con éxito! Revisa tu correo o inicia sesión.");
      onClose();

    } catch (err) {
      console.error(err);
      setError(err.message || "Error al registrar empresa");
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-2">
            <Label htmlFor="company-name">Nombre legal de la empresa</Label>
            <Input
              id="company-name"
              placeholder="Mi Empresa S.A. de C.V."
              className="bg-secondary/50 border-border/50"
              required
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Industria</Label>
              <Select onValueChange={(val) => handleChange("industry", val)}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agricultura">Agricultura</SelectItem>
                  <SelectItem value="Manufactura">Manufactura</SelectItem>
                  <SelectItem value="Tecnología">Tecnología</SelectItem>
                  <SelectItem value="Bebidas">Bebidas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Región</Label>
              <Select onValueChange={(val) => handleChange("region", val)}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Norte">Norte</SelectItem>
                  <SelectItem value="Centro">Centro</SelectItem>
                  <SelectItem value="Bajío">Bajío</SelectItem>
                  <SelectItem value="Sur">Sur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="corporate-email">Correo corporativo</Label>
            <Input
              id="corporate-email"
              type="email"
              placeholder="contacto@empresa.com"
              className="bg-secondary/50 border-border/50"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* CAMPO DE PASSWORD AGREGADO */}
          <div className="space-y-2">
            <Label htmlFor="password">Crear contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="bg-secondary/50 border-border/50"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full glow-water mt-6" disabled={loading}>
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando cuenta...</>
            ) : (
              "Crear cuenta"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al registrarte, aceptas nuestros términos de servicio.
          </p>

          {onSwitchToLogin && (
            <div className="text-center mt-4">
              <span className="text-sm text-muted-foreground">¿Ya tienes cuenta? </span>
              <button
                type="button"
                className="text-sm text-primary hover:underline font-semibold"
                onClick={onSwitchToLogin}
              >
                Inicia sesión
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}