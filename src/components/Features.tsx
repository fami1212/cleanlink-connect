import { 
  Smartphone, 
  Leaf, 
  Shield, 
  Zap, 
  Star, 
  TrendingUp 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Paiement Mobile",
      description: "Wave, Orange Money, Free Money. Payez comme vous voulez, en toute sécurité.",
      color: "primary",
    },
    {
      icon: Leaf,
      title: "Éco-responsable",
      description: "Traçabilité des déchets jusqu'aux sites agréés ONAS. Un score écologique pour chaque prestataire.",
      color: "primary",
    },
    {
      icon: Shield,
      title: "Prestataires certifiés",
      description: "Tous nos partenaires sont vérifiés et évalués par la communauté Link'eco.",
      color: "secondary",
    },
    {
      icon: Zap,
      title: "Intervention rapide",
      description: "Service d'urgence 24h/24. Un prestataire disponible en moins de 2 heures.",
      color: "secondary",
    },
    {
      icon: Star,
      title: "Notation transparente",
      description: "Consultez les avis des autres utilisateurs pour choisir le meilleur prestataire.",
      color: "accent",
    },
    {
      icon: TrendingUp,
      title: "Tarifs clairs",
      description: "Prix affichés à l'avance. Pas de surprise, pas de frais cachés.",
      color: "accent",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Pourquoi Link'eco
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            L'assainissement{" "}
            <span className="text-gradient">nouvelle génération</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Une plateforme pensée pour les réalités africaines, avec des fonctionnalités innovantes.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  feature.color === "primary" 
                    ? "bg-primary/10 group-hover:bg-primary/20" 
                    : feature.color === "secondary"
                    ? "bg-secondary/10 group-hover:bg-secondary/20"
                    : "bg-accent/10 group-hover:bg-accent/20"
                }`}
              >
                <feature.icon 
                  className={`w-6 h-6 ${
                    feature.color === "primary" 
                      ? "text-primary" 
                      : feature.color === "secondary"
                      ? "text-secondary"
                      : "text-accent"
                  }`} 
                />
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
