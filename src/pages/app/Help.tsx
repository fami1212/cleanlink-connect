import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Help = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      question: "Comment commander une vidange ?",
      answer: "Depuis l'accueil, cliquez sur 'Commander', sélectionnez votre service et votre adresse.",
    },
    {
      question: "Comment suivre ma commande ?",
      answer: "Une fois la commande acceptée, vous pouvez suivre le prestataire en temps réel sur la carte.",
    },
    {
      question: "Quels sont les modes de paiement ?",
      answer: "Nous acceptons Wave, Orange Money, Free Money et les espèces.",
    },
    {
      question: "Comment annuler une commande ?",
      answer: "Vous pouvez annuler une commande en attente depuis la page de suivi.",
    },
    {
      question: "Comment devenir prestataire ?",
      answer: "Activez le mode prestataire depuis votre profil pour recevoir des missions.",
    },
  ];

  const contactOptions = [
    { icon: Phone, label: "Appeler le support", value: "+221 33 XXX XX XX", action: "tel:+221330000000" },
    { icon: MessageCircle, label: "WhatsApp", value: "+221 77 XXX XX XX", action: "https://wa.me/221770000000" },
    { icon: Mail, label: "Email", value: "support@linkeco.sn", action: "mailto:support@linkeco.sn" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border safe-area-top">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">
            Aide et support
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Quick help */}
        <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="font-display text-lg font-bold text-primary-foreground mb-2">
            Comment pouvons-nous vous aider ?
          </h2>
          <p className="text-sm text-primary-foreground/80 mb-4">
            Notre équipe est disponible 7j/7 de 8h à 20h
          </p>
        </div>

        {/* Contact options */}
        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">
            Nous contacter
          </h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {contactOptions.map((option, index) => (
              <a
                key={option.label}
                href={option.action}
                className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                  index !== contactOptions.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <option.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{option.label}</h4>
                  <p className="text-sm text-muted-foreground">{option.value}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">
            Questions fréquentes
          </h3>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="bg-card border border-border rounded-xl overflow-hidden group"
              >
                <summary className="flex items-center gap-3 p-4 cursor-pointer list-none">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground flex-1">{item.question}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-muted-foreground ml-11">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
