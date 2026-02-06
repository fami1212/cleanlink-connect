import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight } from "lucide-react";
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" 
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20">
        <motion.a 
          href="#" 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <img src={logo} alt="Link'eco" className="h-10 md:h-12 w-auto" />
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors relative group ${
                isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/90 hover:text-white"
              }`}
              whileHover={{ y: -2 }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => navigate("/app")}
                variant="gradient"
                size="sm"
              >
                Mon espace
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => navigate("/app/auth", { state: { intendedRole: "provider" } })}
                  variant={isScrolled ? "soft" : "ghost"}
                  size="sm"
                  className={!isScrolled ? "text-white hover:bg-white/10" : ""}
                >
                  Je suis prestataire
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => navigate("/app/onboarding")}
                  variant="gradient"
                  size="sm"
                >
                  Commander maintenant
                </Button>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className={`md:hidden p-2 rounded-xl transition-colors ${
            isScrolled ? "text-foreground" : "text-white"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.95 }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-background border-b border-border shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="container py-6 flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-muted/50"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-border">
                {user ? (
                  <Button 
                    onClick={() => { navigate("/app"); setIsMenuOpen(false); }}
                    variant="gradient" 
                    className="w-full"
                  >
                    Mon espace
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={() => { navigate("/app/auth", { state: { intendedRole: "provider" } }); setIsMenuOpen(false); }}
                      variant="soft" 
                      className="w-full"
                    >
                      Je suis prestataire
                    </Button>
                    <Button 
                      onClick={() => { navigate("/app/onboarding"); setIsMenuOpen(false); }}
                      variant="gradient" 
                      className="w-full"
                    >
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
