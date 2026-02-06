import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/linkeco-logo.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-foreground text-background/90 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="container relative py-16 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <motion.img 
              src={logo} 
              alt="Link'eco" 
              className="h-14 w-auto mb-5 brightness-0 invert"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            />
            <p className="text-lg font-medium text-background/90 mb-3 italic">
              Liggéey bu leer, suuf bu set.
            </p>
            <p className="text-sm text-background/60 mb-6 leading-relaxed">
              Services d'assainissement intelligents et écologiques pour le Sénégal.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5 text-background">Services</h4>
            <ul className="space-y-3">
              {["Vidange fosse septique", "Vidange latrines", "Urgence débordement", "Curage canalisations"].map((item) => (
                <li key={item}>
                  <a 
                    href="#services" 
                    className="text-sm text-background/60 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5 text-background">Entreprise</h4>
            <ul className="space-y-3">
              {["À propos", "Devenir prestataire", "Partenaires", "Blog", "Carrières"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-sm text-background/60 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5 text-background">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-background/90">Adresse</p>
                  <p className="text-sm text-background/60">Dakar, Sénégal</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-background/90">Téléphone</p>
                  <p className="text-sm text-background/60">+221 77 XXX XX XX</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-background/90">Email</p>
                  <p className="text-sm text-background/60">contact@linkeco.sn</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © 2026 Link'eco. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-background/50 hover:text-primary transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-sm text-background/50 hover:text-primary transition-colors">
              Politique de confidentialité
            </a>
            <motion.button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
