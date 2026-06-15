import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, MapPin, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-dakar.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

const Hero = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { roles, loading: roleLoading } = useUserRole();

  const handleGetStarted = () => {
    if (!authLoading && !roleLoading && user) {
      if (roles.includes("provider")) navigate("/app/provider");
      else navigate("/app");
    } else {
      navigate("/app/onboarding");
    }
  };

  const handleBecomeProvider = () => {
    if (!authLoading && !roleLoading && user) navigate("/app/provider");
    else navigate("/app/auth", { state: { intendedRole: "provider", redirectTo: "/app/provider" } });
  };

  const highlights = [
    "Paiement Mobile Money",
    "Suivi GPS temps réel",
    "Prestataires certifiés",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 md:pt-28 md:pb-0 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
          src={heroImage}
          alt="Services d'assainissement à Dakar"
          className="w-full h-full object-cover"
        />
        {/* Dark emerald overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(160_80%_6%)]/95 via-[hsl(160_60%_10%)]/85 to-[hsl(160_50%_15%)]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(160_80%_5%)]/90 via-transparent to-transparent" />
        {/* Mesh accents */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 right-[10%] w-72 h-72 bg-accent/20 rounded-full blur-3xl z-0"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 left-[5%] w-80 h-80 bg-primary-glow/20 rounded-full blur-3xl z-0"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        {/* Left: content */}
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass-dark rounded-full pl-2 pr-4 py-1.5 mb-8"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground">
              <Sparkles className="w-3 h-3" />
            </span>
            <span className="text-xs font-semibold text-white tracking-wide">
              N°1 de l'assainissement digital · Sénégal
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.02] mb-6"
          >
            Vidange pro,{" "}
            <span className="text-aurora">livrée chez vous.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-white/70 max-w-xl mb-3 leading-relaxed font-light"
          >
            Commandez en 3 clics. Tarif affiché, prestataire certifié, intervention suivie en direct sur la carte.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-accent/80 italic mb-10 font-medium tracking-wide"
          >
            « Liggéey bu leer, suuf bu set. »
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="relative overflow-hidden bg-gradient-gold text-accent-foreground hover:opacity-95 shadow-gold font-semibold px-8 h-14 text-base rounded-2xl group"
            >
              <span className="relative z-10 flex items-center">
                {user ? "Mon espace" : "Commander maintenant"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
            </Button>
            <Button
              onClick={handleBecomeProvider}
              variant="outline"
              size="lg"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 backdrop-blur-md h-14 text-base rounded-2xl"
            >
              Devenir prestataire
            </Button>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            {highlights.map((text, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm text-white/70 font-medium">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: floating preview card (desktop only) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="hidden lg:block relative"
        >
          <div className="relative animate-float">
            {/* Halo */}
            <div className="absolute -inset-8 bg-gradient-to-br from-accent/30 to-primary-glow/30 blur-3xl rounded-full" />

            {/* Main card */}
            <div className="relative glass-strong rounded-3xl p-5 shadow-float">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Mission en cours</span>
                </div>
                <span className="text-[10px] text-muted-foreground">#LK-2841</span>
              </div>

              {/* Map mockup */}
              <div className="relative h-40 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-primary/15 to-accent/15">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160" fill="none">
                  <path d="M20 130 Q 80 80, 140 100 T 280 30" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
                  <circle cx="20" cy="130" r="6" fill="hsl(var(--accent))" />
                  <circle cx="280" cy="30" r="6" fill="hsl(var(--primary))" />
                </svg>
                <div className="absolute top-3 right-3 glass rounded-xl px-3 py-1.5">
                  <p className="text-[10px] text-muted-foreground font-medium">Arrivée</p>
                  <p className="text-sm font-bold text-foreground font-display">~ 12 min</p>
                </div>
              </div>

              {/* Provider row */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-foreground/5">
                <div className="w-11 h-11 rounded-full bg-gradient-emerald flex items-center justify-center text-primary-foreground font-bold font-display">
                  MD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">Mamadou Diouf</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    <span className="font-semibold text-foreground">4.9</span>
                    <span>·</span>
                    <span>286 vidanges</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Prix</p>
                  <p className="font-bold text-foreground font-display text-sm">25 000 F</p>
                </div>
              </div>
            </div>

            {/* Floating mini card */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -left-8 -bottom-6 glass-strong rounded-2xl p-3 shadow-gold flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">GPS live</p>
                <p className="text-sm font-bold text-foreground font-display">Dakar, Plateau</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
    </section>
  );
};

export default Hero;
