import { Smartphone, Leaf, Shield, Zap, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    { icon: Smartphone, title: "Paiement Mobile", description: "Wave, Orange Money, Free Money. Payez comme vous voulez.", color: "primary" },
    { icon: Leaf, title: "Éco-responsable", description: "Traçabilité jusqu'aux sites agréés ONAS. Score écologique.", color: "primary" },
    { icon: Shield, title: "Certifiés", description: "Tous nos prestataires sont vérifiés et évalués.", color: "secondary" },
    { icon: Zap, title: "Rapide", description: "Urgence 24h/24. Prestataire en moins de 2 heures.", color: "accent" },
    { icon: Star, title: "Transparent", description: "Avis vérifiés pour choisir le meilleur prestataire.", color: "accent" },
    { icon: TrendingUp, title: "Tarifs clairs", description: "Prix affichés. Pas de surprise, pas de frais cachés.", color: "secondary" },
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-background relative">
      <div className="container">
        <motion.div
          className="max-w-xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-3 block">
            Pourquoi Link'eco
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            L'assainissement <span className="text-gradient">repensé.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -3 }}
              className="group p-6 rounded-2xl border border-border bg-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                feature.color === "primary" ? "bg-primary/10 group-hover:bg-primary/15" :
                feature.color === "secondary" ? "bg-secondary/10 group-hover:bg-secondary/15" :
                "bg-accent/10 group-hover:bg-accent/15"
              }`}>
                <feature.icon className={`w-5 h-5 ${
                  feature.color === "primary" ? "text-primary" :
                  feature.color === "secondary" ? "text-secondary" : "text-accent"
                }`} />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1.5">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
