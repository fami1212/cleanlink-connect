import { Droplets, Home, AlertTriangle, Wrench, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Droplets,
      title: "Vidange fosse septique",
      description: "Service complet pour maisons et concessions. Intervention rapide par des professionnels certifiés.",
      price: "25 000 FCFA",
      popular: true,
    },
    {
      icon: Home,
      title: "Vidange latrines",
      description: "Nettoyage et vidange de latrines traditionnelles avec équipements adaptés.",
      price: "15 000 FCFA",
      popular: false,
    },
    {
      icon: AlertTriangle,
      title: "Urgence débordement",
      description: "Intervention d'urgence 24h/24 en cas de débordement ou situation critique.",
      price: "Sur devis",
      popular: false,
    },
    {
      icon: Wrench,
      title: "Curage canalisations",
      description: "Débouchage et curage complet pour un assainissement optimal.",
      price: "20 000 FCFA",
      popular: false,
    },
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-background relative">
      <div className="container">
        <motion.div
          className="max-w-xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-3 block">
            Nos Services
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Tout l'assainissement,{" "}
            <span className="text-gradient">simplifié.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Des tarifs affichés, des pros vérifiés, un suivi en direct.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <motion.button
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => navigate("/app/order", { state: { service: service.title } })}
              className={`group relative text-left p-6 rounded-3xl border transition-all duration-300 ${
                service.popular
                  ? "bg-primary text-primary-foreground border-primary shadow-elevated"
                  : "bg-card border-border hover:border-primary/30 hover:shadow-card-hover"
              }`}
            >
              {service.popular && (
                <span className="absolute top-4 right-4 text-xs font-bold uppercase bg-accent text-accent-foreground px-3 py-1 rounded-full">
                  Populaire
                </span>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                service.popular ? "bg-white/15" : "bg-primary/8"
              }`}>
                <service.icon className={`w-6 h-6 ${service.popular ? "text-white" : "text-primary"}`} />
              </div>

              <h3 className={`font-display text-xl font-bold mb-2 ${service.popular ? "" : "text-foreground"}`}>
                {service.title}
              </h3>
              <p className={`text-sm mb-6 leading-relaxed ${service.popular ? "text-white/70" : "text-muted-foreground"}`}>
                {service.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${service.popular ? "text-white/50" : "text-muted-foreground"}`}>À partir de</p>
                  <p className={`font-display font-bold text-lg ${service.popular ? "" : "text-foreground"}`}>
                    {service.price}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:translate-x-1 ${
                  service.popular ? "bg-white/15" : "bg-muted"
                }`}>
                  <ArrowRight className={`w-5 h-5 ${service.popular ? "text-white" : "text-muted-foreground"}`} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
