import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Zap, Car, BookOpen, Calendar, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ClientDashboardProps {
  userId: string;
}

const ClientDashboard = ({ userId }: ClientDashboardProps) => {
  const navigate = useNavigate();
  const [parkingSpots, setParkingSpots] = useState<any[]>([]);
  const [chargingStations, setChargingStations] = useState<any[]>([]);
  const [revisionSpaces, setRevisionSpaces] = useState<any[]>([]);
  const [electricVehicles, setElectricVehicles] = useState<any[]>([]);
  const [myReservations, setMyReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [parking, charging, revision, vehicles, reservations] = await Promise.all([
        supabase.from("parking_spots").select("*").eq("is_available", true),
        supabase.from("charging_stations").select("*").eq("is_available", true),
        supabase.from("revision_spaces").select("*").eq("is_available", true),
        supabase.from("electric_vehicles").select("*").eq("is_available", true),
        supabase.from("reservations").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);

      if (parking.error) throw parking.error;
      if (charging.error) throw charging.error;
      if (revision.error) throw revision.error;
      if (vehicles.error) throw vehicles.error;
      if (reservations.error) throw reservations.error;

      setParkingSpots(parking.data || []);
      setChargingStations(charging.data || []);
      setRevisionSpaces(revision.data || []);
      setElectricVehicles(vehicles.data || []);
      setMyReservations(reservations.data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des données");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (resourceType: string, resourceId: string) => {
    try {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

      const { error } = await supabase.from("reservations").insert({
        user_id: userId,
        resource_type: resourceType as any,
        resource_id: resourceId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: "pending",
      });

      if (error) throw error;
      
      toast.success("Réservation créée avec succès !");
      fetchData();
    } catch (error: any) {
      toast.error("Erreur lors de la création de la réservation");
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button onClick={() => navigate("/subscriptions")} variant="outline">
          <CreditCard className="w-4 h-4 mr-2" />
          Voir les abonnements
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parkings</CardTitle>
            <MapPin className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingSpots.length}</div>
            <p className="text-xs text-muted-foreground">places disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bornes</CardTitle>
            <Zap className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chargingStations.length}</div>
            <p className="text-xs text-muted-foreground">bornes disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules</CardTitle>
            <Car className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{electricVehicles.length}</div>
            <p className="text-xs text-muted-foreground">véhicules disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Révision</CardTitle>
            <BookOpen className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revisionSpaces.length}</div>
            <p className="text-xs text-muted-foreground">espaces disponibles</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="parking" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="parking">
            <MapPin className="w-4 h-4 mr-2" />
            Parkings
          </TabsTrigger>
          <TabsTrigger value="charging">
            <Zap className="w-4 h-4 mr-2" />
            Bornes
          </TabsTrigger>
          <TabsTrigger value="vehicles">
            <Car className="w-4 h-4 mr-2" />
            Véhicules
          </TabsTrigger>
          <TabsTrigger value="reservations">
            <Calendar className="w-4 h-4 mr-2" />
            Mes Réservations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parking" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parkingSpots.map((spot) => (
              <Card key={spot.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{spot.name}</CardTitle>
                  <CardDescription>{spot.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => createReservation("parking", spot.id)}
                  >
                    Réserver
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="charging" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chargingStations.map((station) => (
              <Card key={station.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <CardDescription>{station.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Zap className="w-4 h-4 mr-2" />
                      {station.power_kw} kW
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => createReservation("charging_station", station.id)}
                  >
                    Réserver
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {electricVehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                  <CardDescription>{vehicle.model}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Car className="w-4 h-4 mr-2" />
                      Année: {vehicle.year}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => createReservation("electric_vehicle", vehicle.id)}
                  >
                    Réserver
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <div className="grid gap-4">
            {myReservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {reservation.resource_type.replace("_", " ")}
                    </CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reservation.status === "confirmed" ? "bg-success/10 text-success" :
                      reservation.status === "pending" ? "bg-warning/10 text-warning" :
                      reservation.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(reservation.start_time).toLocaleString("fr-FR")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;