import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Zap, Car, AlertTriangle, Users, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Connecta</h1>
          </div>
          <Button onClick={() => navigate("/auth")}>Connexion</Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in">
            Gérez votre ville intelligente
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète pour la gestion urbaine moderne : mobilité électrique, 
            maintenance intelligente et réservations en temps réel.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Commencer maintenant
            </Button>
            <Button size="lg" variant="outline">
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Parkings Intelligents</h3>
            <p className="text-muted-foreground">
              Visualisez et réservez des places de parking en temps réel avec navigation GPS intégrée.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bornes de Recharge</h3>
            <p className="text-muted-foreground">
              Trouvez et réservez des bornes de recharge électrique disponibles près de vous.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Véhicules Électriques</h3>
            <p className="text-muted-foreground">
              Réservez des véhicules électriques en libre-service pour vos déplacements urbains.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Alertes Automatiques</h3>
            <p className="text-muted-foreground">
              Système d'alerte intelligent pour signaler les déchets et équipements en panne.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-warning" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestion d'Équipe</h3>
            <p className="text-muted-foreground">
              Attribuez et suivez les interventions des ouvriers en temps réel avec géolocalisation.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tableau de Bord</h3>
            <p className="text-muted-foreground">
              Visualisez toutes les statistiques et métriques importantes de votre ville.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-border/50">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à moderniser votre ville ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez les villes intelligentes qui utilisent déjà notre plateforme 
            pour améliorer leur gestion urbaine.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")}>
            Commencer gratuitement
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 Connecta. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;