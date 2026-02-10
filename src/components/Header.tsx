import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/linkeco-logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "Comment ça marche" },
    { href: "#features", label: "Avantages" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20">
        <a href="#" className="flex items-center">
          <img src={logo} alt="Link'eco" className="h-9 md:h-11 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button onClick={() => navigate("/app")} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
              Mon espace
            </Button>
          ) : (
            <>
              <Button
                onClick={() => navigate("/app/auth", { state: { intendedRole: "provider" } })}
                variant="ghost"
                size="sm"
                className={!isScrolled ? "text-white/80 hover:text-white hover:bg-white/10" : ""}
              >
                Prestataire
              </Button>
              <Button
                onClick={() => navigate("/app/onboarding")}
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl font-semibold"
              >
                Commander
              </Button>
            </>
          )}
        </div>

        <button
          className={`md:hidden p-2 rounded-xl ${isScrolled ? "text-foreground" : "text-white"}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-background border-b border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="container py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-muted-foreground hover:text-foreground py-3 px-4 rounded-xl hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-border">
                {user ? (
                  <Button onClick={() => { navigate("/app"); setIsMenuOpen(false); }} className="w-full bg-primary text-primary-foreground rounded-xl">
                    Mon espace
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => { navigate("/app/auth", { state: { intendedRole: "provider" } }); setIsMenuOpen(false); }} variant="outline" className="w-full rounded-xl">
                      Je suis prestataire
                    </Button>
                    <Button onClick={() => { navigate("/app/onboarding"); setIsMenuOpen(false); }} className="w-full bg-accent text-accent-foreground rounded-xl">
                      Commander maintenant
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
