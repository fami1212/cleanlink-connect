import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container">
        <motion.div
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-hero-dark p-10 md:p-20 noise"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Mesh + orbs */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
          <div className="absolute -top-32 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-glow/20 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 glass-dark rounded-full pl-2 pr-4 py-1.5 mb-7"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground">
                <Sparkles className="w-3 h-3" />
              </span>
              <span className="text-xs font-semibold text-white tracking-wide">Disponible 24h/24 à Dakar</span>
            </motion.div>

            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight leading-[1.05]">
              Prêt pour une vidange{" "}
              <span className="text-aurora">sans stress ?</span>
            </h2>
            <p className="text-lg text-white/65 mb-10 max-w-xl mx-auto font-light">
              Rejoignez des centaines de Dakarois qui font confiance à Link'eco.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-gradient-gold text-accent-foreground hover:opacity-95 font-semibold h-14 px-8 rounded-2xl text-base shadow-gold"
                onClick={() => navigate("/app/onboarding")}
              >
                Commander maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10 backdrop-blur-md h-14 px-8 rounded-2xl text-base"
              >
                <Phone className="w-5 h-5 mr-2" />
                Appelez-nous
              </Button>
            </div>

            <p className="mt-10 text-sm text-white/40 font-medium tracking-wide">
              Dakar · Pikine · Guédiawaye · Rufisque · Thiès
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
