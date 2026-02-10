import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
    "Prestataires vérifiés",
  ];

  return (
    <section className="relative min-h-screen flex items-end pb-20 pt-32 md:items-center md:pb-0 md:pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={heroImage}
          alt="Services d'assainissement à Dakar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-accent/40 bg-accent/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-accent rounded-full" />
            <span className="text-sm font-medium text-accent">
              N°1 de l'assainissement digital au Sénégal
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
          >
            Vidange professionnelle,{" "}
            <span className="text-accent">livrée chez vous.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg md:text-xl text-white/70 max-w-lg mb-4 leading-relaxed"
          >
            Commandez votre vidange en 3 clics. Tarif affiché, prestataire certifié, intervention suivie en direct.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base text-white/50 italic mb-10 font-medium"
          >
            « Liggéey bu leer, suuf bu set. »
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl font-semibold px-8 h-14 text-base rounded-2xl"
            >
              {user ? "Mon espace" : "Commander maintenant"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={handleBecomeProvider}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm h-14 text-base rounded-2xl"
            >
              Devenir prestataire
            </Button>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {highlights.map((text, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm text-white/70">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
