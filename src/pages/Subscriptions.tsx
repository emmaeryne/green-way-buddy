import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, Building2, Users, Sparkles, CreditCard, Download } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Subscriptions = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [generatedCard, setGeneratedCard] = useState<any>(null);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    checkAuth();
    fetchPlans();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des plans");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const processPayment = async () => {
    if (!userId || !selectedPlan) return;

    // Validate card details
    if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setShowPaymentDialog(false);
      toast.loading("Traitement du paiement...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlan.duration_days);

      // Create subscription
      const { data: subscription, error: subError } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: userId,
          plan_id: selectedPlan.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          payment_status: "paid",
          is_active: true,
        })
        .select()
        .single();

      if (subError) throw subError;

      // Generate loyalty card
      const cardNumber = `CONN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${cardNumber}`;

      const { data: card, error: cardError } = await supabase
        .from("loyalty_cards")
        .insert({
          user_id: userId,
          subscription_id: subscription.id,
          card_number: cardNumber,
          qr_code: qrCode,
          issued_at: startDate.toISOString(),
          expires_at: endDate.toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (cardError) throw cardError;

      toast.dismiss();
      toast.success("Paiement réussi !");
      
      // Show loyalty card
      setGeneratedCard({ ...card, plan_name: selectedPlan.name });
      setShowCardDialog(true);
      
      // Reset form
      setCardDetails({ number: "", name: "", expiry: "", cvv: "" });
    } catch (error: any) {
      toast.dismiss();
      toast.error("Erreur lors du traitement de l'abonnement");
      console.error(error);
    }
  };

  const getPlanIcon = (name: string) => {
    if (name.toLowerCase().includes("événement")) return Calendar;
    if (name.toLowerCase().includes("café") || name.toLowerCase().includes("commercial")) return Building2;
    return Users;
  };

  const getPlanBadge = (name: string) => {
    if (name.toLowerCase().includes("événement")) return { text: "Jour", variant: "secondary" as const };
    if (name.toLowerCase().includes("café") || name.toLowerCase().includes("commercial")) return { text: "Année", variant: "default" as const };
    return { text: "Mois", variant: "outline" as const };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choisissez votre abonnement</h1>
          <p className="text-lg text-muted-foreground">
            Des plans adaptés à tous vos besoins
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = getPlanIcon(plan.name);
            const badge = getPlanBadge(plan.name);
            const features = Array.isArray(plan.features) ? plan.features : [];

            return (
              <Card key={plan.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                {plan.name.toLowerCase().includes("commercial") && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-primary to-accent">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant={badge.variant}>{badge.text}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{plan.price}€</span>
                      <span className="text-muted-foreground ml-2">
                        /{badge.text.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.includes_parking && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 mr-2 text-primary" />
                        <span>Accès parkings</span>
                      </div>
                    )}
                    {plan.includes_charging && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 mr-2 text-primary" />
                        <span>Bornes de recharge</span>
                      </div>
                    )}
                    {plan.includes_vehicles && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 mr-2 text-primary" />
                        <span>Véhicules électriques</span>
                      </div>
                    )}
                    {plan.includes_revision && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 mr-2 text-primary" />
                        <span>Espaces de révision</span>
                      </div>
                    )}
                    {plan.max_reservations && (
                      <div className="flex items-center text-sm">
                        <Check className="w-4 h-4 mr-2 text-primary" />
                        <span>{plan.max_reservations} réservations max</span>
                      </div>
                    )}
                    {features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 mr-2 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    variant={plan.name.toLowerCase().includes("commercial") ? "default" : "outline"}
                    onClick={() => handlePlanSelection(plan)}
                  >
                    Choisir ce plan
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {plans.length === 0 && (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <p className="text-lg">Aucun plan d'abonnement disponible pour le moment</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Paiement sécurisé
            </DialogTitle>
            <DialogDescription>
              {selectedPlan?.name} - {selectedPlan?.price}€
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Numéro de carte</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-name">Nom sur la carte</Label>
              <Input
                id="card-name"
                placeholder="JEAN DUPONT"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Date d'expiration</Label>
                <Input
                  id="expiry"
                  placeholder="MM/AA"
                  maxLength={5}
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  maxLength={3}
                  type="password"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={processPayment} className="flex-1">
              Payer {selectedPlan?.price}€
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loyalty Card Dialog */}
      <Dialog open={showCardDialog} onOpenChange={setShowCardDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Votre carte de fidélité
            </DialogTitle>
            <DialogDescription>
              Félicitations ! Votre abonnement a été activé
            </DialogDescription>
          </DialogHeader>
          {generatedCard && (
            <div className="space-y-4 py-4">
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs opacity-80">Plan</p>
                      <p className="font-bold text-lg">{generatedCard.plan_name}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">Numéro de carte</p>
                      <p className="font-mono text-sm">{generatedCard.card_number}</p>
                    </div>
                    <div className="flex justify-center py-4 bg-white rounded-lg">
                      <img 
                        src={generatedCard.qr_code} 
                        alt="QR Code" 
                        className="w-32 h-32"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="opacity-80">Émise le</p>
                        <p>{new Date(generatedCard.issued_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="opacity-80">Expire le</p>
                        <p>{new Date(generatedCard.expires_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setShowCardDialog(false);
                    navigate("/dashboard");
                  }}
                >
                  Voir mon tableau de bord
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Subscriptions;
