import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
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
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "Étapes" },
    { href: "#features", label: "Avantages" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.header
      className="fixed top-3 md:top-5 left-0 right-0 z-50 px-3 md:px-6 flex justify-center"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`w-full max-w-5xl rounded-2xl transition-all duration-500 ${
          isScrolled
            ? "glass-strong shadow-float"
            : "glass shadow-glass"
        }`}
      >
        <div className="flex items-center justify-between h-14 md:h-16 pl-4 pr-2 md:pl-5 md:pr-3">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <img src={logo} alt="Link'eco" className="h-8 md:h-9 w-auto transition-transform group-hover:scale-105" />
          </a>

          {/* Desktop nav pill */}
          <nav className="hidden md:flex items-center gap-1 bg-foreground/5 rounded-full px-1.5 py-1.5 border border-foreground/5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background/70 px-4 py-1.5 rounded-full transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Button
                onClick={() => navigate("/app")}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 h-10 font-semibold shadow-green"
              >
                Mon espace
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/app/auth", { state: { intendedRole: "provider" } })}
                  variant="ghost"
                  size="sm"
                  className="rounded-full h-10 text-muted-foreground hover:text-foreground"
                >
                  Prestataire
                </Button>
                <Button
                  onClick={() => navigate("/app/onboarding")}
                  size="sm"
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5 h-10 font-semibold gap-2 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent group-hover:rotate-12 transition-transform" />
                  Commander
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden border-t border-foreground/5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <nav className="p-3 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="text-base font-medium text-foreground py-3 px-4 rounded-xl hover:bg-foreground/5 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-foreground/5">
                  {user ? (
                    <Button onClick={() => { navigate("/app"); setIsMenuOpen(false); }} className="w-full bg-primary text-primary-foreground rounded-xl h-12">
                      Mon espace
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => { navigate("/app/auth", { state: { intendedRole: "provider" } }); setIsMenuOpen(false); }} variant="outline" className="w-full rounded-xl h-12 border-foreground/10">
                        Je suis prestataire
                      </Button>
                      <Button onClick={() => { navigate("/app/onboarding"); setIsMenuOpen(false); }} className="w-full bg-foreground text-background rounded-xl h-12 gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        Commander maintenant
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
