import { Smartphone, Leaf, Shield, Zap, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    { icon: Smartphone, title: "Paiement Mobile", description: "Wave, Orange Money, Free Money. Payez comme vous voulez." },
    { icon: Leaf, title: "Éco-responsable", description: "Traçabilité jusqu'aux sites agréés ONAS. Score écologique." },
    { icon: Shield, title: "Certifiés", description: "Tous nos prestataires sont vérifiés et évalués." },
    { icon: Zap, title: "Rapide", description: "Urgence 24h/24. Prestataire en moins de 2 heures." },
    { icon: Star, title: "Transparent", description: "Avis vérifiés pour choisir le meilleur prestataire." },
    { icon: TrendingUp, title: "Tarifs clairs", description: "Prix affichés. Pas de surprise, pas de frais cachés." },
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <div className="container relative">
        <motion.div
          className="max-w-2xl mb-20 flex flex-col gap-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-[0.2em]">
              Pourquoi Link'eco
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.05]">
            L'assainissement,<br />
            <span className="text-aurora italic font-normal">repensé.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="group relative p-8 bg-card hover:bg-muted/40 transition-colors duration-500"
            >
              <span className="absolute top-6 right-6 font-display text-xs text-muted-foreground/50 tabular-nums tracking-wider">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-primary/8 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center mb-6 transition-all duration-500">
                <feature.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
