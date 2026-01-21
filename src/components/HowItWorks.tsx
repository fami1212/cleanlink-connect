import { MapPin, Clock, CreditCard, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: MapPin,
      title: "Localisez-vous",
      description: "Entrez votre adresse ou activez la géolocalisation. Link'eco trouve les prestataires près de chez vous.",
    },
    {
      number: "02",
      icon: Clock,
      title: "Choisissez le service",
      description: "Sélectionnez le type de vidange et le créneau qui vous convient. Le prix est affiché immédiatement.",
    },
    {
      number: "03",
      icon: CreditCard,
      title: "Payez simplement",
      description: "Payez via Wave, Orange Money ou Free Money. Facture numérique envoyée automatiquement.",
    },
    {
      number: "04",
      icon: CheckCircle,
      title: "Suivez en temps réel",
      description: "Suivez l'arrivée du camion sur la carte. Notez le prestataire après l'intervention.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
            Simple & Rapide
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comment{" "}
            <span className="text-gradient-blue">ça marche ?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            En quelques étapes simples, réservez votre vidange et profitez d'un service professionnel.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - hidden on mobile */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative"
              >
                {/* Step card */}
                <div className="relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-linkeco rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground shadow-green z-10">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 mt-2 group-hover:bg-secondary/20 transition-colors">
                    <step.icon className="w-8 h-8 text-secondary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 w-8 h-8 items-center justify-center z-20">
                    <div className="w-3 h-3 border-r-2 border-t-2 border-primary rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
