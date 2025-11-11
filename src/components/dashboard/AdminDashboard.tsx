import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, AlertCircle, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface AdminDashboardProps {
  userId: string;
}

const AdminDashboard = ({ userId }: AdminDashboardProps) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    workers: 0,
    clients: 0,
    activeAlerts: 0,
    pendingReservations: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profilesRes, rolesRes, alertsRes, reservationsRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("user_roles").select("*"),
        supabase.from("alerts").select("*").order("created_at", { ascending: false }),
        supabase.from("reservations").select("*").order("created_at", { ascending: false }),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (alertsRes.error) throw alertsRes.error;
      if (reservationsRes.error) throw reservationsRes.error;

      const profiles = profilesRes.data || [];
      const roles = rolesRes.data || [];
      const alertsData = alertsRes.data || [];
      const reservationsData = reservationsRes.data || [];

      // Merge profiles with roles
      const usersWithRoles = profiles.map(profile => {
        const userRole = roles.find(r => r.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "client"
        };
      });

      setUsers(usersWithRoles);
      setAlerts(alertsData);
      setReservations(reservationsData);

      setStats({
        totalUsers: profiles.length,
        workers: roles.filter(r => r.role === "worker").length,
        clients: roles.filter(r => r.role === "client").length,
        activeAlerts: alertsData.filter(a => a.status !== "resolved").length,
        pendingReservations: reservationsData.filter(r => r.status === "pending").length,
      });
    } catch (error: any) {
      toast.error("Erreur lors du chargement des données");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const assignAlertToWorker = async (alertId: string, workerId: string) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({ assigned_to: workerId, status: "assigned" })
        .eq("id", alertId);

      if (error) throw error;
      toast.success("Alerte assignée avec succès !");
      fetchDashboardData();
    } catch (error: any) {
      toast.error("Erreur lors de l'assignation");
      console.error(error);
    }
  };

  const updateReservationStatus = async (reservationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: status as any })
        .eq("id", reservationId);

      if (error) throw error;
      toast.success("Statut mis à jour avec succès !");
      fetchDashboardData();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      // First delete existing roles
      await supabase.from("user_roles").delete().eq("user_id", userId);
      
      // Then insert new role
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole as any });

      if (error) throw error;
      toast.success("Rôle modifié avec succès !");
      fetchDashboardData();
    } catch (error: any) {
      toast.error("Erreur lors de la modification du rôle");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const workers = users.filter(u => u.role === "worker");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ouvriers</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Actives</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAlerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReservations}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>Gérez les rôles des utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.full_name || "Sans nom"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        user.role === "admin" ? "default" :
                        user.role === "worker" ? "secondary" : "outline"
                      }>
                        {user.role}
                      </Badge>
                      <select
                        value={user.role}
                        onChange={(e) => changeUserRole(user.id, e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        <option value="client">Client</option>
                        <option value="worker">Ouvrier</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <CardDescription>{alert.type}</CardDescription>
                    </div>
                    <Badge variant={alert.status === "resolved" ? "outline" : "default"}>
                      {alert.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                  </div>

                  {alert.status !== "resolved" && !alert.assigned_to && (
                    <div className="flex items-center space-x-2">
                      <p className="text-sm">Assigner à :</p>
                      {workers.map((worker) => (
                        <Button
                          key={worker.id}
                          size="sm"
                          variant="outline"
                          onClick={() => assignAlertToWorker(alert.id, worker.id)}
                        >
                          {worker.full_name || worker.email}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <div className="grid gap-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {reservation.resource_type.replace("_", " ")}
                    </CardTitle>
                    <Badge variant={
                      reservation.status === "confirmed" ? "default" :
                      reservation.status === "pending" ? "secondary" :
                      "outline"
                    }>
                      {reservation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(reservation.start_time).toLocaleString("fr-FR")}
                  </div>

                  {reservation.status === "pending" && (
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateReservationStatus(reservation.id, "confirmed")}
                      >
                        Confirmer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                      >
                        Annuler
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;