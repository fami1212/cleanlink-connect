import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-dakar.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

const Hero = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { roles, loading: roleLoading } = useUserRole();

  const features = [
    { icon: MapPin, text: "Service à domicile" },
    { icon: Clock, text: "Intervention rapide" },
    { icon: Shield, text: "Prestataires certifiés" },
  ];

  const handleGetStarted = () => {
    if (!authLoading && !roleLoading && user) {
      // User is logged in, redirect based on role
      if (roles.includes("provider")) {
        navigate("/app/provider");
      } else {
        navigate("/app");
      }
    } else {
      // Not logged in, go through onboarding
      navigate("/app/onboarding");
    }
  };

  const handleBecomeProvider = () => {
    if (!authLoading && !roleLoading && user) {
      navigate("/app/provider");
    } else {
      navigate("/app/auth", { state: { intendedRole: "provider", redirectTo: "/app/provider" } });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Services d'assainissement à Dakar"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(21, 94, 117, 0.9) 0%, rgba(22, 101, 52, 0.85) 100%)"
          }}
        />
      </div>

      {/* Floating shapes */}
      <motion.div 
        className="absolute top-1/4 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6"
          >
            <span className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">
              Services disponibles à Dakar et banlieue
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Vidange de fosse septique{" "}
            <span className="text-accent">en quelques clics</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/90 mb-4"
          >
            Liggéey bu leer, suuf bu set.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mb-8"
          >
            Commandez une vidange en quelques minutes. Prix transparent, suivi en temps réel, 
            paiement Mobile Money. Le tout dans le respect de l'environnement.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Button 
              onClick={handleGetStarted} 
              variant="hero" 
              size="xl"
              className="group"
            >
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                {user ? "Accéder à l'application" : "Commander une vidange"}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </motion.span>
            </Button>
            <Button 
              onClick={handleBecomeProvider} 
              variant="heroOutline" 
              size="xl"
            >
              Devenir prestataire
            </Button>
          </motion.div>

          {/* Feature pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2"
              >
                <feature.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-primary-foreground">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
          <motion.div 
            className="w-1.5 h-3 bg-primary-foreground/50 rounded-full"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
