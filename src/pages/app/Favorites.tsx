import { useNavigate } from "react-router-dom";
import { Heart, Star, Phone, Truck, RefreshCw, MapPin } from "lucide-react";
import BottomNav from "@/components/app/BottomNav";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useProviders } from "@/hooks/useProviders";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Favorites = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading: favLoading, removeFavorite, addFavorite, isFavorite } = useFavorites();
  const { providers, loading: provLoading } = useProviders();

  const loading = authLoading || favLoading || provLoading;

  const handleToggleFavorite = async (providerId: string) => {
    if (!user) {
      toast.error("Connectez-vous pour ajouter aux favoris");
      navigate("/app/auth");
      return;
    }

    if (isFavorite(providerId)) {
      const { error } = await removeFavorite(providerId);
      if (!error) {
        toast.success("Favori supprimé");
      }
    } else {
      const { error } = await addFavorite(providerId);
      if (!error) {
        toast.success("Ajouté aux favoris");
      }
    }
  };

  const handleOrder = (providerId: string) => {
    navigate("/app/order", { state: { preferredProviderId: providerId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30 pb-20">
        <div className="bg-card border-b border-border safe-area-top">
          <div className="p-4">
            <h1 className="font-display text-xl font-bold text-foreground">
              Mes favoris
            </h1>
          </div>
        </div>
        <div className="p-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Connectez-vous
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pour voir vos prestataires favoris
            </p>
            <Button variant="hero" onClick={() => navigate("/app/auth")}>
              Se connecter
            </Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Display favorites if available, otherwise show available providers
  const displayProviders = favorites.length > 0 
    ? favorites.map(f => ({
        id: f.provider_id,
        name: f.provider?.company_name || "Prestataire",
        rating: f.provider?.rating || 0,
        missions: f.provider?.total_missions || 0,
        specialty: f.provider?.vehicle_type || "Vidange fosse septique",
        certified: f.provider?.is_verified || false,
        isFav: true,
      }))
    : providers.slice(0, 5).map(p => ({
        id: p.id,
        name: p.company_name || "Prestataire certifié",
        rating: p.rating || 4.5,
        missions: p.total_missions || 0,
        specialty: p.vehicle_type || "Service général",
        certified: p.is_verified || false,
        isFav: isFavorite(p.id),
      }));

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border safe-area-top">
        <div className="p-4">
          <h1 className="font-display text-xl font-bold text-foreground">
            {favorites.length > 0 ? "Mes favoris" : "Prestataires disponibles"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {favorites.length > 0 
              ? `${favorites.length} prestataire${favorites.length > 1 ? 's' : ''} sauvegardé${favorites.length > 1 ? 's' : ''}`
              : `${providers.length} prestataire${providers.length > 1 ? 's' : ''} en ligne`
            }
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {displayProviders.length > 0 ? (
          displayProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-primary-foreground">
                    {provider.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-foreground truncate">
                      {provider.name}
                    </h3>
                    {provider.certified && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full shrink-0">
                        Certifié
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-foreground">
                      {provider.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({provider.missions} missions)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    <span>{provider.specialty}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggleFavorite(provider.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    provider.isFav 
                      ? "bg-destructive/10" 
                      : "bg-muted hover:bg-destructive/10"
                  }`}
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      provider.isFav 
                        ? "text-destructive fill-destructive" 
                        : "text-muted-foreground"
                    }`} 
                  />
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="soft" size="sm" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler
                </Button>
                <Button 
                  variant="gradient" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleOrder(provider.id)}
                >
                  Commander
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Aucun prestataire disponible
            </h3>
            <p className="text-sm text-muted-foreground">
              Les prestataires apparaîtront ici une fois en ligne
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Favorites;
