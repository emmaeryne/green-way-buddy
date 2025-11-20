import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plane, Battery, MapPin, Play, Square, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DroneManager = () => {
  const [drones, setDrones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDrone, setNewDrone] = useState({
    name: "",
    model: "",
  });

  useEffect(() => {
    fetchDrones();
  }, []);

  const fetchDrones = async () => {
    try {
      const { data, error } = await supabase
        .from("drones")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDrones(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des drones");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addDrone = async () => {
    if (!newDrone.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }

    try {
      const { error } = await supabase.from("drones").insert({
        name: newDrone.name,
        model: newDrone.model || null,
        status: "idle",
        battery_level: 100,
      });

      if (error) throw error;

      toast.success("Drone ajouté avec succès");
      setShowAddDialog(false);
      setNewDrone({ name: "", model: "" });
      fetchDrones();
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout du drone");
      console.error(error);
    }
  };

  const deleteDrone = async (id: string) => {
    try {
      const { error } = await supabase.from("drones").delete().eq("id", id);

      if (error) throw error;

      toast.success("Drone supprimé");
      fetchDrones();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const startPatrol = async (droneId: string) => {
    try {
      // Update drone status to patrolling
      const { error: updateError } = await supabase
        .from("drones")
        .update({ 
          status: "patrolling",
          last_patrol_at: new Date().toISOString()
        })
        .eq("id", droneId);

      if (updateError) throw updateError;

      // Start patrol record
      const { data: patrolData, error: patrolError } = await supabase
        .from("drone_patrols")
        .insert({ 
          drone_id: droneId,
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (patrolError) throw patrolError;

      toast.success("Patrouille lancée");
      fetchDrones();

      // Simulate patrol detecting issues after 5 seconds
      setTimeout(() => detectIssues(droneId, patrolData.id), 5000);
    } catch (error: any) {
      toast.error("Erreur lors du lancement de la patrouille");
      console.error(error);
    }
  };

  const detectIssues = async (droneId: string, patrolId: string) => {
    try {
      // Random chance to detect an issue (70% chance)
      const hasIssue = Math.random() > 0.3;
      
      if (hasIssue) {
        // Random location near center (adjust these coordinates to your area)
        const lat = 48.8566 + (Math.random() - 0.5) * 0.1;
        const lng = 2.3522 + (Math.random() - 0.5) * 0.1;

        const issueTypes = [
          "Borne de recharge défectueuse",
          "Place de parking endommagée",
          "Obstacle sur la voie",
          "Éclairage défaillant",
          "Véhicule abandonné"
        ];
        const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];

        // Create alert
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error: alertError } = await supabase.from("alerts").insert({
          title: `${issueType} - Panne détectée par drone`,
          description: `Détection automatique par drone lors d'une patrouille. Intervention requise.`,
          type: "maintenance",
          latitude: lat,
          longitude: lng,
          status: "open",
          created_by: user?.id,
        });

        if (alertError) throw alertError;

        // Update patrol record
        await supabase
          .from("drone_patrols")
          .update({ 
            issues_detected: 1,
            end_time: new Date().toISOString()
          })
          .eq("id", patrolId);

        toast.success("⚠️ Panne détectée par drone !");
      }

      // Update drone back to idle
      await supabase
        .from("drones")
        .update({ status: "idle" })
        .eq("id", droneId);

      fetchDrones();
    } catch (error: any) {
      console.error("Erreur lors de la détection:", error);
    }
  };

  const stopPatrol = async (droneId: string) => {
    try {
      const { error } = await supabase
        .from("drones")
        .update({ status: "idle" })
        .eq("id", droneId);

      if (error) throw error;

      toast.success("Patrouille arrêtée");
      fetchDrones();
    } catch (error: any) {
      toast.error("Erreur lors de l'arrêt");
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      idle: { variant: "secondary", label: "En attente" },
      patrolling: { variant: "default", label: "En patrouille" },
      charging: { variant: "outline", label: "En charge" },
      maintenance: { variant: "destructive", label: "Maintenance" },
    };

    const config = variants[status] || variants.idle;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Drones</h2>
          <p className="text-muted-foreground">Surveillez et gérez vos drones de patrouille</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un drone
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drones.map((drone) => (
          <Card key={drone.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{drone.name}</CardTitle>
                </div>
                {getStatusBadge(drone.status)}
              </div>
              {drone.model && (
                <CardDescription>{drone.model}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Battery className="w-4 h-4" />
                  <span>{drone.battery_level}%</span>
                </div>
                {drone.last_patrol_at && (
                  <div className="text-xs text-muted-foreground">
                    Dernière patrouille:{" "}
                    {new Date(drone.last_patrol_at).toLocaleDateString("fr-FR")}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {drone.status === "patrolling" ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => stopPatrol(drone.id)}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Arrêter
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => startPatrol(drone.id)}
                    disabled={drone.status !== "idle"}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Patrouiller
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteDrone(drone.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {drones.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Plane className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Aucun drone configuré</p>
            <p className="text-muted-foreground mb-4">
              Ajoutez votre premier drone pour commencer les patrouilles
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un drone
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un drone</DialogTitle>
            <DialogDescription>
              Configurez un nouveau drone pour les patrouilles automatiques
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drone-name">Nom du drone *</Label>
              <Input
                id="drone-name"
                placeholder="Drone Alpha"
                value={newDrone.name}
                onChange={(e) => setNewDrone({ ...newDrone, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drone-model">Modèle</Label>
              <Input
                id="drone-model"
                placeholder="DJI Mavic 3"
                value={newDrone.model}
                onChange={(e) => setNewDrone({ ...newDrone, model: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={addDrone}>Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DroneManager;
