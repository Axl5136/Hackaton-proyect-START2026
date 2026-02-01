import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ShoppingCart,
  Award,
  Settings,
  Droplets,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  {
    title: "Inicio",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: ShoppingCart,
  },
  {
    title: "Certificados",
    url: "/certificates",
    icon: Award,
  },
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const isActive = (url) => {
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  return (
    // SOLUCIÓN DEFINITIVA:
    // Usamos el prop 'style' para sobrescribir las variables CSS de shadcn.
    // Esto hace que el borde sea invisible y el fondo transparente a nivel de raíz.
    <Sidebar
      collapsible="offcanvas"
      className="border-none"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Droplets className="h-6 w-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                HydroCredits
              </span>
              <span className="text-xs text-muted-foreground">
                Plataforma de Agua
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className={cn(
                        "transition-colors hover:bg-primary/10 hover:text-primary",
                        isActive(item.url) &&
                        "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <NavLink to={item.url}>
                        <item.icon className="h-5 w-5" />
                      </NavLink>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              ) : (
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className={cn(
                    "transition-colors hover:bg-primary/10 hover:text-primary",
                    isActive(item.url) &&
                    "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <NavLink to={item.url}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarTrigger className="w-full justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary">
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )}
          />
          {!isCollapsed && <span className="ml-2">Ocultar</span>}
        </SidebarTrigger>
      </SidebarFooter>
    </Sidebar>
  );
}