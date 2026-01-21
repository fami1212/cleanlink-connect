import { MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/linkeco-logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/90 py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src={logo} alt="Link'eco" className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm text-background/70 mb-4">
              Liggéey bu leer, suuf bu set.
            </p>
            <p className="text-sm text-background/60">
              Services d'assainissement intelligents et écologiques pour le Sénégal.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Vidange fosse septique
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Vidange latrines
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Urgence débordement
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Curage canalisations
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Entreprise</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Devenir prestataire
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Partenaires
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="w-4 h-4" />
                Dakar, Sénégal
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="w-4 h-4" />
                +221 77 XXX XX XX
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="w-4 h-4" />
                contact@linkeco.sn
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            © 2026 Link'eco. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-background/60 hover:text-background transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-sm text-background/60 hover:text-background transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
