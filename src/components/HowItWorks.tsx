import { MapPin, Clock, CreditCard, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    { icon: MapPin, title: "Localisez-vous", description: "Activez la géolocalisation ou entrez votre adresse.", color: "primary" },
    { icon: Clock, title: "Choisissez", description: "Sélectionnez le service et le créneau idéal.", color: "secondary" },
    { icon: CreditCard, title: "Payez", description: "Wave, Orange Money ou Free Money. Simple et sécurisé.", color: "accent" },
    { icon: CheckCircle, title: "Suivez", description: "Suivez l'arrivée du camion en direct sur la carte.", color: "primary" },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-muted/50 relative">
      <div className="container">
        <motion.div
          className="text-center max-w-xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-widest mb-3 block">
            Simple & rapide
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            4 étapes, <span className="text-gradient-blue">c'est tout.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-border" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center relative"
            >
              <motion.div
                className={`w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center relative z-10 ${
                  step.color === "primary" ? "bg-primary/10" :
                  step.color === "secondary" ? "bg-secondary/10" : "bg-accent/15"
                }`}
                whileHover={{ scale: 1.05, rotate: 3 }}
              >
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-foreground text-background rounded-lg flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <step.icon className={`w-10 h-10 ${
                  step.color === "primary" ? "text-primary" :
                  step.color === "secondary" ? "text-secondary" : "text-accent"
                }`} />
              </motion.div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
