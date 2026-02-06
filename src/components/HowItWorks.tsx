import { MapPin, Clock, CreditCard, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: MapPin,
      title: "Localisez-vous",
      description: "Entrez votre adresse ou activez la géolocalisation. Link'eco trouve les prestataires près de chez vous.",
      color: "primary",
    },
    {
      number: "02",
      icon: Clock,
      title: "Choisissez le service",
      description: "Sélectionnez le type de vidange et le créneau qui vous convient. Le prix est affiché immédiatement.",
      color: "secondary",
    },
    {
      number: "03",
      icon: CreditCard,
      title: "Payez simplement",
      description: "Payez via Wave, Orange Money ou Free Money. Facture numérique envoyée automatiquement.",
      color: "accent",
    },
    {
      number: "04",
      icon: CheckCircle,
      title: "Suivez en temps réel",
      description: "Suivez l'arrivée du camion sur la carte. Notez le prestataire après l'intervention.",
      color: "primary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    },
  };

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative">
        {/* Section header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary uppercase tracking-wider mb-4 bg-secondary/10 px-4 py-2 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Simple & Rapide
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Comment{" "}
            <span className="text-gradient-blue">ça marche ?</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            En quelques étapes simples, réservez votre vidange et profitez d'un service professionnel.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Connection line - hidden on mobile */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-1 -translate-y-1/2">
            <div className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full opacity-20" />
            <motion.div 
              className="absolute inset-0 h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={stepVariants}
                className="relative"
              >
                {/* Step card */}
                <motion.div 
                  className="relative bg-card rounded-3xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                >
                  {/* Number badge */}
                  <motion.div 
                    className={`absolute -top-5 left-6 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-lg z-10 ${
                      step.color === "primary" ? "bg-gradient-to-br from-primary to-linkeco-green-light" :
                      step.color === "secondary" ? "bg-gradient-to-br from-secondary to-accent" :
                      "bg-gradient-to-br from-accent to-secondary"
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Icon */}
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 mt-3 transition-colors ${
                      step.color === "primary" ? "bg-primary/10 group-hover:bg-primary/20" :
                      step.color === "secondary" ? "bg-secondary/10 group-hover:bg-secondary/20" :
                      "bg-accent/10 group-hover:bg-accent/20"
                    }`}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <step.icon className={`w-8 h-8 ${
                      step.color === "primary" ? "text-primary" :
                      step.color === "secondary" ? "text-secondary" :
                      "text-accent"
                    }`} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="hidden lg:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center z-20"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                  >
                    <div className="w-3 h-3 border-r-2 border-t-2 border-primary rotate-45" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
