import { Droplets, Home, AlertTriangle, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Droplets,
      title: "Vidange fosse septique",
      description: "Service complet de vidange pour maisons et concessions. Intervention rapide et professionnelle.",
      price: "À partir de 25 000 FCFA",
      popular: true,
      gradient: "from-primary to-linkeco-green-light",
    },
    {
      icon: Home,
      title: "Vidange latrines",
      description: "Nettoyage et vidange de latrines traditionnelles avec équipements adaptés.",
      price: "À partir de 15 000 FCFA",
      popular: false,
      gradient: "from-secondary to-accent",
    },
    {
      icon: AlertTriangle,
      title: "Urgence débordement",
      description: "Intervention d'urgence 24h/24 en cas de débordement ou de situation critique.",
      price: "Sur devis",
      popular: false,
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Wrench,
      title: "Curage canalisations",
      description: "Débouchage et curage de vos canalisations pour un assainissement optimal.",
      price: "À partir de 20 000 FCFA",
      popular: false,
      gradient: "from-accent to-secondary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  return (
    <section id="services" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

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
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Nos Services
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Des solutions pour{" "}
            <span className="text-gradient">chaque besoin</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Des services professionnels d'assainissement adaptés aux réalités sénégalaises, 
            avec des tarifs transparents.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group relative bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                service.popular ? "ring-2 ring-primary" : "border border-border"
              }`}
            >
              {service.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-accent py-1.5 text-center">
                  <span className="text-primary-foreground text-xs font-bold uppercase tracking-wider">
                    ⭐ Plus demandé
                  </span>
                </div>
              )}

              <div className={`p-6 ${service.popular ? "pt-10" : ""}`}>
                {/* Icon */}
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-5 leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">À partir de</p>
                    <p className="font-display font-bold text-primary">
                      {service.price}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="group/btn"
                    onClick={() => navigate("/app/order", { state: { service: service.title } })}
                  >
                    <span className="mr-1">Commander</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
