import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Awa Ndiaye",
    role: "Cliente · Dakar Plateau",
    initials: "AN",
    rating: 5,
    text: "Commande passée à 9h, camion sur place à 10h20. Le suivi sur la carte m'a évité d'appeler dix fois. Prix identique à celui affiché.",
  },
  {
    name: "Mamadou Diouf",
    role: "Prestataire · Pikine",
    initials: "MD",
    rating: 5,
    text: "Je remplis mon planning sans intermédiaire. Les missions arrivent directement, et les paiements sont clairs chaque semaine.",
  },
  {
    name: "Fatou Sarr",
    role: "Cliente · Guédiawaye",
    initials: "FS",
    rating: 4,
    text: "Paiement Wave en deux secondes et facture reçue tout de suite. C'est la première fois qu'une vidange se passe sans négociation.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />

      <div className="container relative">
        <motion.div
          className="max-w-2xl mb-16 flex flex-col gap-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-[0.2em]">
              Ils utilisent Link'eco
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.05]">
            Des vidanges{" "}
            <span className="text-aurora italic font-normal">sans surprise.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative flex flex-col gap-6 p-7 rounded-3xl bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-primary/20 group-hover:text-accent/50 transition-colors" />

              <blockquote className="text-[15px] text-foreground/80 leading-relaxed flex-1">
                {t.text}
              </blockquote>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s < t.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>

              <figcaption className="flex items-center gap-3 pt-5 border-t border-border">
                <div className="w-11 h-11 rounded-full bg-gradient-emerald flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
