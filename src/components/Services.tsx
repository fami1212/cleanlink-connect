import { Droplets, Home, AlertTriangle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: Droplets,
      title: "Vidange fosse septique",
      description: "Service complet de vidange pour maisons et concessions. Intervention rapide et professionnelle.",
      price: "À partir de 25 000 FCFA",
      popular: true,
    },
    {
      icon: Home,
      title: "Vidange latrines",
      description: "Nettoyage et vidange de latrines traditionnelles avec équipements adaptés.",
      price: "À partir de 15 000 FCFA",
      popular: false,
    },
    {
      icon: AlertTriangle,
      title: "Urgence débordement",
      description: "Intervention d'urgence 24h/24 en cas de débordement ou de situation critique.",
      price: "Sur devis",
      popular: false,
    },
    {
      icon: Wrench,
      title: "Curage canalisations",
      description: "Débouchage et curage de vos canalisations pour un assainissement optimal.",
      price: "À partir de 20 000 FCFA",
      popular: false,
    },
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Nos Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Des solutions pour{" "}
            <span className="text-gradient">chaque besoin</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Des services professionnels d'assainissement adaptés aux réalités sénégalaises, 
            avec des tarifs transparents.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 ${
                service.popular ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-linkeco text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Plus demandé
                  </span>
                </div>
              )}

              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm font-semibold text-primary">
                  {service.price}
                </span>
                <Button variant="soft" size="sm">
                  Commander
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
