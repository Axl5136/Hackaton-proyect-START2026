import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wallet, Target, Building2, Mail, Plus, Save, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mexicanStates = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México",
  "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

const industries = [
  "Agricultura", "Alimentos y Bebidas", "Automotriz", "Construcción", "Energía",
  "Farmacéutica", "Manufactura", "Minería", "Petroquímica", "Tecnología", "Textil", "Otra"
];

export default function Settings() {
  const { toast } = useToast();
  
  // Mock data - would come from backend
  const [formData, setFormData] = useState({
    available_balance_mxn: 1250000,
    total_budget: 2000000,
    co2_target_tons: 500,
    co2_achieved_tons: 187.5,
    company_name: "AguaCorp México",
    industry: "Manufactura",
    region: "Nuevo León",
    account_email: "admin@aguacorp.mx"
  });

  const co2Progress = (formData.co2_achieved_tons / formData.co2_target_tons) * 100;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Cambios guardados",
      description: "La configuración se ha actualizado correctamente.",
    });
  };

  const handleAddFunds = () => {
    toast({
      title: "Agregar fondos",
      description: "Esta función estará disponible próximamente.",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="dark">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <SidebarInset>
            <DashboardHeader companyName="AguaCorp México" title="Configuración" />
            
            <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
              {/* Page Header */}
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Configuración</h2>
                <p className="text-muted-foreground">
                  Administra tu cuenta, presupuesto y preferencias
                </p>
              </div>

              {/* Available Balance KPI */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Wallet className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Dinero disponible</span>
                      </div>
                      <p className="text-4xl font-bold text-primary">
                        {formatCurrency(formData.available_balance_mxn)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Saldo actual de tu cuenta
                      </p>
                    </div>
                    <Button onClick={handleAddFunds} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Agregar fondos
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Budget Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Saldo y presupuesto</CardTitle>
                        <CardDescription>Define tu límite interno de inversión</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="total_budget">Presupuesto total (MXN)</Label>
                      <Input
                        id="total_budget"
                        type="number"
                        value={formData.total_budget}
                        onChange={(e) => handleInputChange('total_budget', Number(e.target.value))}
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground">
                        El presupuesto define el límite interno de inversión.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Utilizado</span>
                        <span className="font-medium">
                          {formatCurrency(formData.total_budget - formData.available_balance_mxn)}
                        </span>
                      </div>
                      <Progress 
                        value={((formData.total_budget - formData.available_balance_mxn) / formData.total_budget) * 100} 
                        className="mt-2 h-2"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        {Math.round(((formData.total_budget - formData.available_balance_mxn) / formData.total_budget) * 100)}% del presupuesto utilizado
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* CO2 Impact Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                        <Leaf className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Metas de impacto (CO₂e)</CardTitle>
                        <CardDescription>Seguimiento de tu huella de carbono</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="co2_target">Meta CO₂e (toneladas)</Label>
                        <Input
                          id="co2_target"
                          type="number"
                          step="0.1"
                          value={formData.co2_target_tons}
                          onChange={(e) => handleInputChange('co2_target_tons', Number(e.target.value))}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="co2_achieved">CO₂e logrado (toneladas)</Label>
                        <Input
                          id="co2_achieved"
                          type="number"
                          step="0.1"
                          value={formData.co2_achieved_tons}
                          onChange={(e) => handleInputChange('co2_achieved_tons', Number(e.target.value))}
                          className="font-mono"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Avance hacia meta de CO₂e</span>
                        <span className="font-medium text-green-500">
                          {formData.co2_achieved_tons.toLocaleString()} / {formData.co2_target_tons.toLocaleString()} ton
                        </span>
                      </div>
                      <Progress 
                        value={co2Progress} 
                        className="h-3 [&>div]:bg-green-500"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        {co2Progress.toFixed(1)}% completado • CO₂e mitigado estimado por ahorro de agua (métrica informativa)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Profile Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Perfil de empresa</CardTitle>
                        <CardDescription>Información de tu organización</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Nombre de la empresa</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industria</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => handleInputChange('industry', value)}
                      >
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Selecciona una industria" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="region">Región</Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) => handleInputChange('region', value)}
                      >
                        <SelectTrigger id="region">
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {mexicanStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Cuenta</CardTitle>
                        <CardDescription>Configuración de acceso</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="account_email">Correo de la cuenta</Label>
                      <Input
                        id="account_email"
                        type="email"
                        value={formData.account_email}
                        onChange={(e) => handleInputChange('account_email', e.target.value)}
                      />
                    </div>
                    
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">
                        Este correo se utiliza para notificaciones y recuperación de cuenta.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} size="lg" className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
