import { MapPin, Clock, CreditCard, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    { icon: MapPin, title: "Localisez-vous", description: "Activez la géolocalisation ou entrez votre adresse." },
    { icon: Clock, title: "Choisissez", description: "Sélectionnez le service et le créneau idéal." },
    { icon: CreditCard, title: "Payez", description: "Wave, Orange Money ou Free Money. Sécurisé." },
    { icon: CheckCircle, title: "Suivez", description: "Suivez l'arrivée du camion en direct sur la carte." },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-gradient-hero-dark relative overflow-hidden">
      <div className="absolute inset-0 noise opacity-50" />
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />

      <div className="container relative">
        <motion.div
          className="max-w-2xl mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-[0.2em]">
              Simple & rapide
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-background tracking-tight leading-[1.05]">
            4 étapes,<br />
            <span className="italic font-normal text-aurora">c'est tout.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-px bg-white/10 rounded-3xl overflow-hidden border border-white/10">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="group p-8 bg-emerald-950/60 backdrop-blur-sm hover:bg-emerald-900/60 transition-colors duration-500 relative"
              style={{ background: "hsl(160 80% 7% / 0.6)" }}
            >
              <span className="font-display text-6xl font-light text-accent/30 tabular-nums leading-none mb-6 block">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-accent/40 transition-colors">
                <step.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-lg font-bold text-background mb-2">{step.title}</h3>
              <p className="text-sm text-background/60 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
