import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/linkeco-logo.png";

const slides = [
  {
    title: "Besoin urgent de vidange ?",
    description: "Trouver un prestataire fiable n'est pas toujours simple.",
    image: "🏠",
  },
  {
    title: "Link'eco connecte",
    description: "Citoyens et professionnels pour des services rapides et transparents.",
    image: "📱",
  },
  {
    title: "Un service clair",
    description: "Un environnement sain. Commandez en quelques clics.",
    image: "✨",
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/app/role-select");
    }
  };

  const handleSkip = () => {
    navigate("/app/role-select");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4 safe-area-top">
        <button
          onClick={handleSkip}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Passer
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Illustration */}
            <div className="w-64 h-64 mx-auto mb-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
              {currentSlide === 1 ? (
                <img src={logo} alt="Link'eco" className="w-40 h-auto" />
              ) : (
                <span className="text-8xl">{slides[currentSlide].image}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">
              {slides[currentSlide].title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-base max-w-xs mx-auto">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-8 safe-area-bottom">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={handleNext}
        >
          {currentSlide < slides.length - 1 ? "Suivant" : "Commencer"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
