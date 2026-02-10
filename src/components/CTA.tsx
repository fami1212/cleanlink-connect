import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] bg-primary p-10 md:p-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 max-w-xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
              Prêt pour une vidange sans stress ?
            </h2>
            <p className="text-lg text-white/70 mb-10">
              Rejoignez des centaines de Dakarois qui font confiance à Link'eco.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold h-14 px-8 rounded-2xl text-base"
                onClick={() => navigate("/app/onboarding")}
              >
                Commander maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-2xl text-base"
              >
                <Phone className="w-5 h-5 mr-2" />
                Appelez-nous
              </Button>
            </div>

            <p className="mt-10 text-sm text-white/40">
              📍 Dakar • Pikine • Guédiawaye • Rufisque • Thiès
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
