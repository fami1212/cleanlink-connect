import { Button } from "@/components/ui/button";
import { MapPin, Clock, Shield } from "lucide-react";
import heroImage from "@/assets/hero-dakar.jpg";

const Hero = () => {
  const features = [
    { icon: MapPin, text: "Service à domicile" },
    { icon: Clock, text: "Intervention rapide" },
    { icon: Shield, text: "Prestataires certifiés" },
  ];

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
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">
              Services disponibles à Dakar et banlieue
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Vidange de fosse septique{" "}
            <span className="text-accent">en quelques clics</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Liggéey bu leer, suuf bu set.
          </p>
          <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Commandez une vidange en quelques minutes. Prix transparent, suivi en temps réel, 
            paiement Mobile Money. Le tout dans le respect de l'environnement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button  onClick={() => window.location.href = "/app/onboarding"} variant="hero" size="xl">
              Commander une vidange
            </Button>
            <Button onClick={() => window.location.href = "/app/onboarding"} variant="heroOutline" size="xl">
              Devenir prestataire
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {features.map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2"
              >
                <feature.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-primary-foreground">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
