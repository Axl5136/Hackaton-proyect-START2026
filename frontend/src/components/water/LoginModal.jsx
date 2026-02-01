import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";

export function LoginModal({ onClose, onSwitchToRegister }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      // Login exitoso
      console.log("Usuario logueado:", data.user);
      onClose();
      navigate("/dashboard");
      // Opcional: Recargar página para actualizar Header si no usas Context
      // window.location.reload(); 

    } catch (err) {
      setError("Credenciales inválidas o error de conexión.");
      console.error(err.message);
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
          <h2 className="text-2xl font-bold text-foreground">Iniciar sesión</h2>
          <p className="text-muted-foreground mt-1">Accede a tu cuenta empresarial</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="empresa@ejemplo.com"
              className="bg-secondary/50 border-border/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-secondary/50 border-border/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="button" className="text-sm text-primary hover:underline">
              Olvidé mi contraseña
            </button>
            {onSwitchToRegister && (
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Registrarme
              </button>
            )}
          </div>

          <Button type="submit" className="w-full glow-water" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            o continúa con
          </span>
        </div>

        <Button variant="outline" className="w-full" disabled>
          {/* SVG Google icon here */}
          <span className="ml-2">Continuar con Google</span>
        </Button>
      </div>
    </div>
  );
}