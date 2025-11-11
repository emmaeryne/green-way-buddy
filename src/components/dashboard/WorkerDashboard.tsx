import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Wrench, MapPin, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface WorkerDashboardProps {
  userId: string;
}

const WorkerDashboard = ({ userId }: WorkerDashboardProps) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .or(`assigned_to.eq.${userId},assigned_to.is.null`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des alertes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (alertId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === "assigned") {
        updates.assigned_to = userId;
      } else if (newStatus === "resolved") {
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("alerts")
        .update(updates)
        .eq("id", alertId);

      if (error) throw error;
      
      toast.success("Statut mis à jour avec succès !");
      fetchAlerts();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour du statut");
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      open: "default",
      assigned: "secondary",
      in_progress: "default",
      resolved: "outline",
    };

    const labels: any = {
      open: "Ouvert",
      assigned: "Assigné",
      in_progress: "En cours",
      resolved: "Résolu",
    };

    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
  };

  const getAlertIcon = (type: string) => {
    if (type.toLowerCase().includes("déchet") || type.toLowerCase().includes("waste")) {
      return <AlertTriangle className="w-5 h-5 text-accent" />;
    }
    return <Wrench className="w-5 h-5 text-secondary" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const openAlerts = alerts.filter(a => a.status !== "resolved");
  const resolvedAlerts = alerts.filter(a => a.status === "resolved");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Ouvertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openAlerts.length}</div>
            <p className="text-xs text-muted-foreground">nécessitent votre attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Interventions</CardTitle>
            <Wrench className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alerts.filter(a => a.assigned_to === userId && a.status !== "resolved").length}
            </div>
            <p className="text-xs text-muted-foreground">en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolues</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Alertes Actives</h2>
        <div className="grid gap-4">
          {openAlerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <CardDescription>{alert.type}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(alert.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  Position: {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                </div>

                <div className="flex items-center space-x-2">
                  {alert.status === "open" && !alert.assigned_to && (
                    <Button onClick={() => updateAlertStatus(alert.id, "assigned")}>
                      Prendre en charge
                    </Button>
                  )}
                  
                  {alert.assigned_to === userId && alert.status === "assigned" && (
                    <Button onClick={() => updateAlertStatus(alert.id, "in_progress")}>
                      Démarrer l'intervention
                    </Button>
                  )}
                  
                  {alert.assigned_to === userId && alert.status === "in_progress" && (
                    <Button 
                      onClick={() => updateAlertStatus(alert.id, "resolved")}
                      className="bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marquer comme résolu
                    </Button>
                  )}

                  <Button variant="outline" size="sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    Voir sur la carte
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {openAlerts.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <p className="text-lg font-medium">Aucune alerte active</p>
                <p className="text-sm text-muted-foreground">Excellent travail !</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;