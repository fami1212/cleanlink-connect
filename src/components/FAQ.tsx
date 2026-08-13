import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Combien coûte une vidange ?",
    a: "À partir de 15 000 FCFA pour des latrines et 25 000 FCFA pour une fosse septique. Le prix est affiché avant la commande et n'évolue pas après l'intervention, sauf volume supérieur constaté et validé par vous.",
  },
  {
    q: "En combien de temps un prestataire intervient-il ?",
    a: "En moyenne moins de 2 heures sur Dakar et sa banlieue. En cas d'urgence (débordement), un service 24h/24 mobilise le prestataire disponible le plus proche.",
  },
  {
    q: "Comment puis-je payer ?",
    a: "Wave, Orange Money, Free Money ou espèces à la fin de l'intervention. Une facture est générée automatiquement dans votre historique de commandes.",
  },
  {
    q: "Où sont déversées les matières collectées ?",
    a: "Uniquement dans les sites de traitement agréés. Chaque mission est tracée du point de collecte au point de dépotage, ce qui alimente le suivi de traçabilité destiné aux collectivités.",
  },
  {
    q: "Comment devenir prestataire sur Link'eco ?",
    a: "Créez un compte prestataire, déposez vos documents (pièce d'identité, carte grise du camion, agrément). Après vérification, vous recevez les missions correspondant à votre zone.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 md:py-32 bg-muted/30 relative">
      <div className="container relative grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
        <motion.div
          className="flex flex-col gap-5 lg:sticky lg:top-28"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-[0.2em]">
              Questions fréquentes
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.05]">
            Tout ce qu'il faut{" "}
            <span className="text-aurora italic font-normal">savoir.</span>
          </h2>
          <p className="text-muted-foreground">
            Une question qui n'est pas ici ? Léa, notre assistante, répond dans l'application 24h/24.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f) => (
              <AccordionItem
                key={f.q}
                value={f.q}
                className="border-b border-border last:border-b-0"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-foreground text-base md:text-lg hover:no-underline py-6">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-[15px]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
