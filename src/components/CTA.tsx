import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

const CTA = () => {
  return (
    <section id="contact" className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-linkeco-green-light p-8 md:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Prêt à commander votre première vidange ?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Rejoignez les centaines de Dakarois qui font confiance à Link'eco pour leurs services d'assainissement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="heroOutline" 
                size="xl"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Phone className="w-5 h-5 mr-2" />
                Appelez-nous
              </Button>
              <Button 
                size="xl"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Commander maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <p className="mt-8 text-sm text-primary-foreground/70">
              📍 Dakar • Pikine • Guédiawaye • Rufisque • Thiès
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
