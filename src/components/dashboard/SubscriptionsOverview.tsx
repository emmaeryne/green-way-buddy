import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react";

const SubscriptionsOverview = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    newThisMonth: 0,
  });
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionsData();
  }, []);

  const fetchSubscriptionsData = async () => {
    try {
      const { data: subsData, error: subsError } = await supabase
        .from("user_subscriptions")
        .select(`
          *,
          subscription_plans (
            name,
            price
          ),
          profiles (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (subsError) throw subsError;

      const subs = subsData || [];
      setSubscriptions(subs);

      // Calculate stats
      const activeSubs = subs.filter((s) => s.is_active);
      const totalRevenue = subs
        .filter((s) => s.payment_status === "paid")
        .reduce((sum, s) => sum + (s.subscription_plans?.price || 0), 0);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const thisMonthSubs = subs.filter((s) => {
        const subDate = new Date(s.created_at);
        return (
          subDate.getMonth() === currentMonth &&
          subDate.getFullYear() === currentYear &&
          s.payment_status === "paid"
        );
      });

      const monthlyRevenue = thisMonthSubs.reduce(
        (sum, s) => sum + (s.subscription_plans?.price || 0),
        0
      );

      setStats({
        totalRevenue,
        activeSubscriptions: activeSubs.length,
        monthlyRevenue,
        newThisMonth: thisMonthSubs.length,
      });
    } catch (error: any) {
      toast.error("Erreur lors du chargement des abonnements");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Abonnements & Revenus</h2>
        <p className="text-muted-foreground">Vue d'ensemble de vos gains</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Depuis le début</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnements Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Actuellement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyRevenue.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newThisMonth} nouveau{stats.newThisMonth > 1 ? "x" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Abonnements récents</CardTitle>
          <CardDescription>Liste des derniers abonnements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.slice(0, 10).map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">
                    {sub.profiles?.full_name || sub.profiles?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {sub.subscription_plans?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sub.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold">{sub.subscription_plans?.price}€</p>
                  <Badge variant={sub.is_active ? "default" : "secondary"}>
                    {sub.is_active ? "Actif" : "Inactif"}
                  </Badge>
                  <p className="text-xs">
                    <Badge
                      variant={
                        sub.payment_status === "paid"
                          ? "default"
                          : sub.payment_status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {sub.payment_status}
                    </Badge>
                  </p>
                </div>
              </div>
            ))}
            {subscriptions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Aucun abonnement pour le moment
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsOverview;
