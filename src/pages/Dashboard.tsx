import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Map, Car, AlertCircle, Settings } from "lucide-react";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import WorkerDashboard from "@/components/dashboard/WorkerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import connectaLogo from "@/assets/connecta-logo.png";
import Footer from "@/components/Footer";

type UserRole = "client" | "worker" | "admin";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (!session) {
        navigate("/auth");
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;
      
      // Si l'utilisateur a plusieurs rôles, prioriser: admin > worker > client
      if (data && data.length > 0) {
        const roles = data.map(r => r.role);
        if (roles.includes("admin")) {
          setUserRole("admin");
        } else if (roles.includes("worker")) {
          setUserRole("worker");
        } else {
          setUserRole("client");
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      toast.error("Erreur lors de la récupération du rôle utilisateur");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/auth");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = () => {
    switch (userRole) {
      case "client":
        return <Car className="w-5 h-5" />;
      case "worker":
        return <AlertCircle className="w-5 h-5" />;
      case "admin":
        return <Settings className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case "client":
        return "Client";
      case "worker":
        return "Ouvrier";
      case "admin":
        return "Administrateur";
      default:
        return "Utilisateur";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={connectaLogo} alt="Connecta" className="h-10 w-auto" />
            <div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {getRoleIcon()}
                <span>{getRoleLabel()}</span>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {userRole === "client" && <ClientDashboard userId={user!.id} />}
        {userRole === "worker" && <WorkerDashboard userId={user!.id} />}
        {userRole === "admin" && <AdminDashboard userId={user!.id} />}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;