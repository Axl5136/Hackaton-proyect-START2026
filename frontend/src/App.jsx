import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Certificates from "./pages/Certificates";
import CertificateSuccess from "./pages/CertificateSuccess";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/certificate-success" element={<CertificateSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;