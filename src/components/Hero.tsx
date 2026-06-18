import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, MapPin, Sparkles, Star, Play } from "lucide-react";
import { motion } from "framer-motion";
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
    <section className="relative isolate overflow-hidden pt-28 md:pt-32 pb-16 md:pb-24">
      {/* Solid dark emerald background */}
      <div className="absolute inset-0 -z-10 bg-[hsl(160_75%_7%)]" />

      {/* Mesh / glow layers */}
      <div className="absolute inset-0 -z-10 bg-gradient-mesh opacity-70" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(160_70%_25%/.55),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_30%_at_85%_30%,hsl(43_85%_60%/.18),transparent_70%)]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent 80%)",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 right-[8%] w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 left-[3%] w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl -z-10"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 11, repeat: Infinity }}
      />

      <div className="container relative grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-10 items-center">
        {/* Left: content */}
        <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full pl-2 pr-4 py-1.5 mb-6 shadow-glass"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground">
              <Sparkles className="w-3 h-3" />
            </span>
            <span className="text-xs font-semibold text-white tracking-wide">
              N°1 de l'assainissement digital · Sénégal
            </span>
          </motion.div>

          {/* Heading — solid white with one gold accent word for guaranteed contrast */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white leading-[1.02] tracking-tight mb-5"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
          >
            Vidange pro,{" "}
            <span className="relative inline-block">
              <span className="text-aurora">livrée chez vous.</span>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-accent via-accent/60 to-transparent rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 mb-2 leading-relaxed"
          >
            Commandez en 3 clics. Tarif affiché, prestataire certifié, intervention suivie en direct sur la carte.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-accent italic mb-8 font-medium tracking-wide"
          >
            « Liggéey bu leer, suuf bu set. »
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 mb-8 justify-center lg:justify-start"
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="relative overflow-hidden bg-gradient-gold text-accent-foreground hover:opacity-95 shadow-gold font-semibold px-7 h-14 text-base rounded-2xl group"
            >
              <span className="relative z-10 flex items-center">
                {user ? "Mon espace" : "Commander maintenant"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
            </Button>
            <Button
              onClick={handleBecomeProvider}
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white backdrop-blur-md h-14 text-base rounded-2xl gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Devenir prestataire
            </Button>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start"
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
                <span className="text-sm text-white/75 font-medium">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: floating preview card (lg+) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="hidden lg:block relative"
        >
          <div className="relative animate-float">
            <div className="absolute -inset-8 bg-gradient-to-br from-accent/30 to-primary-glow/30 blur-3xl rounded-full" />

            <div className="relative bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl p-5 shadow-float">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Mission en cours</span>
                </div>
                <span className="text-[10px] text-muted-foreground">#LK-2841</span>
              </div>

              <div className="relative h-40 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-primary/15 to-accent/15">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160" fill="none">
                  <path d="M20 130 Q 80 80, 140 100 T 280 30" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
                  <circle cx="20" cy="130" r="6" fill="hsl(var(--accent))" />
                  <circle cx="280" cy="30" r="6" fill="hsl(var(--primary))" />
                </svg>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 shadow-md">
                  <p className="text-[10px] text-muted-foreground font-medium">Arrivée</p>
                  <p className="text-sm font-bold text-foreground font-display">~ 12 min</p>
                </div>
              </div>

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

            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -left-6 -bottom-6 bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl p-3 shadow-gold flex items-center gap-3"
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

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </section>
  );
};

export default Hero;
