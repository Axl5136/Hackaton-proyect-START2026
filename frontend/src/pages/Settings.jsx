import { useState, useEffect } from "react";
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
import { Wallet, Target, Building2, Mail, Plus, Save, Leaf, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../supabase"; // Asegúrate de que la ruta sea correcta

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    available_balance_mxn: 0,
    total_budget: 0,
    co2_target_tons: 0,
    co2_achieved_tons: 0,
    company_name: "",
    industry: "",
    region: "",
    account_email: ""
  });

  // 1. Cargar datos desde Supabase
  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            setFormData({
              id: data.id,
              available_balance_mxn: data.available_balance_mxn || 0, // Ajusta según el nombre real en tu DB
              total_budget: data.total_budget || 0,
              co2_target_tons: data.co2_target_tons || 0,
              co2_achieved_tons: data.co2_achieved_tons || 0,
              company_name: data.name || "",
              industry: data.industry || "",
              region: data.region || "",
              account_email: user.email // El email suele venir de auth.users
            });
          }
        }
      } catch (error) {
        console.error("Error al cargar configuración:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanyData();
  }, []);

  const co2Progress = formData.co2_target_tons > 0
    ? (formData.co2_achieved_tons / formData.co2_target_tons) * 100
    : 0;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 2. Guardar cambios en Supabase
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.company_name,
          industry: formData.industry,
          region: formData.region,
          total_budget: formData.total_budget,
          co2_target_tons: formData.co2_target_tons,
        })
        .eq('id', formData.id);

      if (error) throw error;

      toast({
        title: "Configuración actualizada",
        description: "Los cambios se han guardado en la base de datos.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1120] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#0B1120] text-slate-50">
        <DashboardSidebar />

        {/* ⬇️ CAMBIO CLAVE AQUÍ */}
        <SidebarInset className="bg-[#0B1120] border-none">
          <DashboardHeader
            companyName={formData.company_name}
            title="Configuración"
          />

          <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Configuración
              </h2>
              <p className="text-slate-400">
                Administra tu cuenta, presupuesto y preferencias
              </p>
            </div>

            {/* Dinero disponible */}
            <Card className="border-slate-800 bg-[#111827] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Wallet className="h-5 w-5 text-sky-400" />
                      <span className="text-sm font-medium">
                        Dinero disponible
                      </span>
                    </div>
                    <p className="text-4xl font-bold">
                      {formatCurrency(formData.available_balance_mxn)}
                    </p>
                  </div>
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar fondos
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Presupuesto */}
              <Card className="border-slate-800 bg-[#111827] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-sky-400" />
                    Saldo y presupuesto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Label>Presupuesto total (MXN)</Label>
                  <Input
                    type="number"
                    value={formData.total_budget}
                    onChange={(e) =>
                      handleInputChange(
                        "total_budget",
                        Number(e.target.value)
                      )
                    }
                    className="bg-[#0B1120] border-slate-700"
                  />

                  <div className="rounded-lg bg-slate-900 p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Utilizado</span>
                      <span>
                        {formatCurrency(
                          formData.total_budget -
                          formData.available_balance_mxn
                        )}
                      </span>
                    </div>
                    <Progress
                      value={
                        (formData.total_budget -
                          formData.available_balance_mxn) /
                        formData.total_budget *
                        100
                      }
                      className="h-2 bg-slate-800"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Impacto CO2 */}
              <Card className="border-slate-800 bg-[#111827] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-emerald-400" />
                    Metas de impacto (CO₂e)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Meta CO₂e (tons)</Label>
                      <Input
                        type="number"
                        value={formData.co2_target_tons}
                        onChange={(e) =>
                          handleInputChange(
                            "co2_target_tons",
                            Number(e.target.value)
                          )
                        }
                        className="bg-[#0B1120] border-slate-700"
                      />
                    </div>
                    <div>
                      <Label>Logrado (tons)</Label>
                      <Input
                        value={formData.co2_achieved_tons}
                        readOnly
                        className="bg-slate-800 border-slate-700 opacity-60"
                      />
                    </div>
                  </div>

                  <Progress
                    value={co2Progress}
                    className="h-2 bg-slate-800 [&>div]:bg-emerald-500"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-sky-500 hover:bg-sky-600 text-white px-8"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar cambios
              </Button>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
