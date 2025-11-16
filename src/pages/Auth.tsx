import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Zap, AlertTriangle } from "lucide-react";
import connectaLogo from "@/assets/connecta-logo.png";
import Footer from "@/components/Footer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Connexion réussie !");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;
        toast.success("Compte créé ! Vous pouvez maintenant vous connecter.");
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Hero Section */}
          <div className="hidden md:flex flex-col space-y-6 animate-fade-in">
            <div className="space-y-4">
              <img 
                src={connectaLogo} 
                alt="Connecta" 
                className="h-20 w-auto drop-shadow-2xl animate-scale-in" 
              />
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                Bienvenue sur Connecta
              </h1>
              <p className="text-xl text-white/90 drop-shadow-md">
                Gérez votre ville intelligente en temps réel
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fade-in">
                <MapPin className="w-8 h-8 text-white flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1 text-white">Localisation en temps réel</h3>
                  <p className="text-sm text-white/80">
                    Suivez tous les équipements et ressources de votre ville
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fade-in delay-200">
                <Zap className="w-8 h-8 text-white flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1 text-white">Mobilité électrique</h3>
                  <p className="text-sm text-white/80">
                    Réservez des véhicules et bornes de recharge facilement
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-fade-in delay-300">
                <AlertTriangle className="w-8 h-8 text-white flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1 text-white">Alertes intelligentes</h3>
                  <p className="text-sm text-white/80">
                    Système d'alerte et maintenance automatisé
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="w-full shadow-2xl backdrop-blur-sm bg-background/95 border-2 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-2xl">{isLogin ? "Connexion" : "Inscription"}</CardTitle>
              <CardDescription>
                {isLogin
                  ? "Connectez-vous à votre compte"
                  : "Créez votre compte pour accéder à l'application"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Jean Dupont"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                  disabled={loading}
                >
                  {loading
                    ? "Chargement..."
                    : isLogin
                    ? "Se connecter"
                    : "S'inscrire"}
                </Button>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline transition-all duration-200 hover:scale-105 inline-block"
                  >
                    {isLogin
                      ? "Pas de compte ? Inscrivez-vous"
                      : "Déjà un compte ? Connectez-vous"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
