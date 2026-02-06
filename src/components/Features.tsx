import { 
  Smartphone, 
  Leaf, 
  Shield, 
  Zap, 
  Star, 
  TrendingUp 
} from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Paiement Mobile",
      description: "Wave, Orange Money, Free Money. Payez comme vous voulez, en toute sécurité.",
      color: "primary",
      gradient: "from-primary/20 to-primary/5",
    },
    {
      icon: Leaf,
      title: "Éco-responsable",
      description: "Traçabilité des déchets jusqu'aux sites agréés ONAS. Un score écologique pour chaque prestataire.",
      color: "primary",
      gradient: "from-green-500/20 to-green-500/5",
    },
    {
      icon: Shield,
      title: "Prestataires certifiés",
      description: "Tous nos partenaires sont vérifiés et évalués par la communauté Link'eco.",
      color: "secondary",
      gradient: "from-secondary/20 to-secondary/5",
    },
    {
      icon: Zap,
      title: "Intervention rapide",
      description: "Service d'urgence 24h/24. Un prestataire disponible en moins de 2 heures.",
      color: "secondary",
      gradient: "from-yellow-500/20 to-yellow-500/5",
    },
    {
      icon: Star,
      title: "Notation transparente",
      description: "Consultez les avis des autres utilisateurs pour choisir le meilleur prestataire.",
      color: "accent",
      gradient: "from-accent/20 to-accent/5",
    },
    {
      icon: TrendingUp,
      title: "Tarifs clairs",
      description: "Prix affichés à l'avance. Pas de surprise, pas de frais cachés.",
      color: "accent",
      gradient: "from-orange-500/20 to-orange-500/5",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.5 }
    },
  };

  return (
    <section id="features" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative">
        {/* Section header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-4 bg-primary/10 px-4 py-2 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Pourquoi Link'eco
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            L'assainissement{" "}
            <span className="text-gradient">nouvelle génération</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Une plateforme pensée pour les réalités africaines, avec des fonctionnalités innovantes.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative bg-card rounded-3xl p-7 shadow-lg border border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <motion.div 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
                    feature.color === "primary" 
                      ? "bg-primary/10 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30" 
                      : feature.color === "secondary"
                      ? "bg-secondary/10 group-hover:bg-secondary group-hover:shadow-lg group-hover:shadow-secondary/30"
                      : "bg-accent/10 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/30"
                  }`}
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                >
                  <feature.icon 
                    className={`w-7 h-7 transition-colors duration-300 ${
                      feature.color === "primary" 
                        ? "text-primary group-hover:text-white" 
                        : feature.color === "secondary"
                        ? "text-secondary group-hover:text-white"
                        : "text-accent group-hover:text-white"
                    }`} 
                  />
                </motion.div>

                <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
