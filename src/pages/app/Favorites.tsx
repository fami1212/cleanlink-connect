import { Heart, Star, Phone, Truck } from "lucide-react";
import BottomNav from "@/components/app/BottomNav";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const favorites = [
    {
      id: 1,
      name: "Boubacar Camara",
      rating: 4.8,
      reviews: 156,
      specialty: "Vidange fosse septique",
      certified: true,
    },
    {
      id: 2,
      name: "Amadou Sow",
      rating: 4.6,
      reviews: 89,
      specialty: "Curage canalisations",
      certified: true,
    },
    {
      id: 3,
      name: "Moussa Diop",
      rating: 4.5,
      reviews: 67,
      specialty: "Urgence débordement",
      certified: false,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border safe-area-top">
        <div className="p-4">
          <h1 className="font-display text-xl font-bold text-foreground">
            Mes favoris
          </h1>
          <p className="text-sm text-muted-foreground">
            Prestataires que vous avez sauvegardés
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {favorites.length > 0 ? (
          favorites.map((provider) => (
            <div
              key={provider.id}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-primary-foreground">
                    {provider.name.split(" ").map((n) => n[0]).join("")}
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
                      {provider.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({provider.reviews} avis)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    <span>{provider.specialty}</span>
                  </div>
                </div>
                <button className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-destructive fill-destructive" />
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="soft" size="sm" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler
                </Button>
                <Button variant="gradient" size="sm" className="flex-1">
                  Commander
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Aucun favori
            </h3>
            <p className="text-sm text-muted-foreground">
              Sauvegardez vos prestataires préférés ici
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Favorites;
