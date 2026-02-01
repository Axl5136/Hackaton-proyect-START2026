import { Droplets, LogIn, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ onLoginClick, onRegisterClick }) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center glow-water">
            <Droplets className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">AquaCredits</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Mercado de Agua</p>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" onClick={onLoginClick} className="gap-1">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Iniciar sesión</span>
          </Button>
          <Button size="sm" onClick={onRegisterClick} className="glow-water gap-1">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Registrarse como empresa</span>
            <span className="sm:hidden">Registro</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
