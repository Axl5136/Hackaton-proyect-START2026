import { useState, useEffect } from "react";
import { LayoutGrid, Droplets, LogOut, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "../../supabase"; // Ajusta la ruta si es necesario

export function Header({ onLoginClick, onRegisterClick }) {
  const [user, setUser] = useState(null);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    // 1. Verificar sesión actual al cargar
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user?.user_metadata?.company_name) {
        setCompanyName(session.user.user_metadata.company_name);
      }
    };

    checkSession();

    // 2. Suscribirse a cambios (Login, Logout, Registro automático)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      // Intentar sacar el nombre de la empresa de los metadatos
      if (session?.user?.user_metadata?.company_name) {
        setCompanyName(session.user.user_metadata.company_name);
      } else {
        setCompanyName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // Force reload/redirect to home
    // El listener de arriba (onAuthStateChange) actualizará el estado automáticamente
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Droplets className="h-6 w-6 text-primary" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              AquaCredits
            </h1>
            <p className="text-xs text-muted-foreground leading-none">Mercado de Agua</p>
          </div>
        </div>

        {/* Navigation / User Section */}
        <div className="flex items-center gap-4">

          {user ? (
            // --- ESTADO: LOGUEADO ---
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-foreground">
                  {companyName || "Mi Empresa"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {user.email}
                </span>
              </div>

              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Building2 className="h-4 w-4 text-primary" />
              </div>

              <div className="w-px h-8 bg-border mx-1" />

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            // --- ESTADO: SIN SESIÓN ---
            <>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hidden sm:flex"
                onClick={onLoginClick}
              >
                Iniciar sesión
              </Button>
              <Button
                className="glow-water bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                onClick={onRegisterClick}
              >
                <LayoutGrid className="mr-2 h-4 w-4" /> Registrar Empresa
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}