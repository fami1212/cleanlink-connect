import { MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/linkeco-logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <img src={logo} alt="Link'eco" className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm text-background/40 leading-relaxed">
              Services d'assainissement intelligents et écologiques pour le Sénégal.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-background mb-4">Services</h4>
            <ul className="space-y-2.5">
              {["Vidange fosse septique", "Vidange latrines", "Urgence débordement", "Curage canalisations"].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-sm text-background/40 hover:text-accent transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-background mb-4">Entreprise</h4>
            <ul className="space-y-2.5">
              {["À propos", "Devenir prestataire", "Partenaires", "Blog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-background/40 hover:text-accent transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-background mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-background/40">
                <MapPin className="w-4 h-4 text-accent shrink-0" /> Dakar, Sénégal
              </li>
              <li className="flex items-center gap-3 text-sm text-background/40">
                <Phone className="w-4 h-4 text-accent shrink-0" /> +221 77 XXX XX XX
              </li>
              <li className="flex items-center gap-3 text-sm text-background/40">
                <Mail className="w-4 h-4 text-accent shrink-0" /> contact@linkeco.sn
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-background/30">© 2026 Link'eco. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-background/30 hover:text-accent transition-colors">Conditions</a>
            <a href="#" className="text-xs text-background/30 hover:text-accent transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
