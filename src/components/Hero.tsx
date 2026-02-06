import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Shield, Play, Sparkles } from "lucide-react";
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
      if (roles.includes("provider")) {
        navigate("/app/provider");
      } else {
        navigate("/app");
      }
    } else {
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

  // Floating particles animation
  const particles = Array.from({ length: 20 });

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroImage}
          alt="Services d'assainissement à Dakar"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(21, 94, 117, 0.92) 0%, rgba(22, 101, 52, 0.88) 50%, rgba(21, 94, 117, 0.85) 100%)"
          }}
        />
        
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, hsl(var(--primary)/0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 70%, hsl(var(--primary)/0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 30%, hsl(var(--primary)/0.4) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Floating shapes */}
      <motion.div 
        className="absolute top-1/4 right-10 w-80 h-80 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-10 w-64 h-64 bg-gradient-to-tr from-accent/30 to-secondary/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-bl from-secondary/20 to-primary/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-6"
          >
            <motion.span 
              className="w-2 h-2 bg-primary-foreground rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-primary-foreground">
              Services disponibles à Dakar et banlieue
            </span>
            <Sparkles className="w-4 h-4 text-accent" />
          </motion.div>

          {/* Main heading with staggered animation */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Vidange de fosse septique
            </motion.span>{" "}
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative inline-block"
            >
              <span className="relative z-10 bg-gradient-to-r from-accent via-primary-foreground to-accent bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                en quelques clics
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-3 bg-accent/30 rounded-full -skew-x-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              />
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl md:text-2xl text-primary-foreground/90 mb-3 font-medium italic"
          >
            Liggéey bu leer, suuf bu set.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-base md:text-lg text-primary-foreground/75 max-w-2xl mb-10"
          >
            Commandez une vidange en quelques minutes. Prix transparent, suivi en temps réel, 
            paiement Mobile Money. Le tout dans le respect de l'environnement.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleGetStarted} 
                size="xl"
                className="group bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 font-semibold px-8"
              >
                <motion.span
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <Play className="w-5 h-5 fill-primary" />
                  {user ? "Accéder à l'application" : "Commander une vidange"}
                </motion.span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleBecomeProvider} 
                variant="heroOutline" 
                size="xl"
                className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Devenir prestataire
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature pills with staggered animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 cursor-default"
              >
                <div className="w-7 h-7 rounded-full bg-accent/30 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-primary-foreground">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-foreground/60 uppercase tracking-wider">Découvrir</span>
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-3 bg-foreground/50 rounded-full"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
