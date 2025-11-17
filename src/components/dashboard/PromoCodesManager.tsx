import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Copy, Trash2, Tag } from "lucide-react";

const PromoCodesManager = () => {
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxUses: "",
    validUntil: "",
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des codes promo");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData({ ...formData, code });
  };

  const createPromoCode = async () => {
    if (!formData.code || !formData.discountValue) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const { error } = await supabase.from("promo_codes").insert({
        code: formData.code.toUpperCase(),
        discount_type: formData.discountType,
        discount_value: parseFloat(formData.discountValue),
        max_uses: formData.maxUses ? parseInt(formData.maxUses) : null,
        valid_until: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
      });

      if (error) throw error;

      toast.success("Code promo créé avec succès !");
      setShowDialog(false);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        maxUses: "",
        validUntil: "",
      });
      fetchPromoCodes();
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("Ce code promo existe déjà");
      } else {
        toast.error("Erreur lors de la création du code promo");
      }
      console.error(error);
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      const { error } = await supabase.from("promo_codes").delete().eq("id", id);

      if (error) throw error;
      toast.success("Code promo supprimé");
      fetchPromoCodes();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copié !");
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("promo_codes")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("Statut mis à jour");
      fetchPromoCodes();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Codes Promo</h2>
          <p className="text-muted-foreground">Gérez vos codes promotionnels</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un code promo</DialogTitle>
              <DialogDescription>
                Générez un nouveau code promotionnel pour vos clients
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    placeholder="PROMO2024"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                  <Button variant="outline" onClick={generateRandomCode}>
                    Générer
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountType">Type de réduction</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="fixed">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Valeur ({formData.discountType === "percentage" ? "%" : "€"})
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  placeholder={formData.discountType === "percentage" ? "10" : "5"}
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUses">Nombre d'utilisations max (optionnel)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  placeholder="100"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Date d'expiration (optionnel)</Label>
                <Input
                  id="validUntil"
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>
              <Button onClick={createPromoCode} className="w-full">
                Créer le code promo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {promoCodes.map((promo) => (
          <Card key={promo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-mono">{promo.code}</CardTitle>
                    <CardDescription>
                      {promo.discount_type === "percentage"
                        ? `${promo.discount_value}% de réduction`
                        : `${promo.discount_value}€ de réduction`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={promo.is_active ? "default" : "secondary"}>
                    {promo.is_active ? "Actif" : "Inactif"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(promo.code)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePromoCode(promo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Utilisations</p>
                  <p className="font-medium">
                    {promo.current_uses} / {promo.max_uses || "∞"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expire le</p>
                  <p className="font-medium">
                    {promo.valid_until
                      ? new Date(promo.valid_until).toLocaleDateString("fr-FR")
                      : "Jamais"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Créé le</p>
                  <p className="font-medium">
                    {new Date(promo.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActiveStatus(promo.id, promo.is_active)}
                  >
                    {promo.is_active ? "Désactiver" : "Activer"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {promoCodes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aucun code promo créé</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PromoCodesManager;
