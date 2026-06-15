import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin, ArrowUpRight } from "lucide-react";
import logo from "@/assets/linkeco-logo.png";

const Footer = () => {
  return (
    <footer className="relative bg-[hsl(160_80%_6%)] text-white/70 overflow-hidden">
      {/* Mesh accents */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <div className="absolute -top-40 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative py-20">
        {/* Top: brand & CTA */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 pb-12 border-b border-white/10">
          <div className="max-w-md">
            <img src={logo} alt="Link'eco" className="h-12 w-auto mb-5 brightness-0 invert" />
            <p className="font-display text-2xl md:text-3xl text-white leading-tight tracking-tight">
              L'assainissement <span className="text-aurora">repensé</span> pour le Sénégal.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 self-start md:self-end bg-accent text-accent-foreground font-semibold px-5 py-3 rounded-full hover:bg-accent/90 transition-colors group"
          >
            Nous parler
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </a>
        </div>

        {/* Columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <h4 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {["Vidange fosse septique", "Vidange latrines", "Urgence débordement", "Curage canalisations"].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-sm text-white/50 hover:text-accent transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Entreprise</h4>
            <ul className="space-y-2.5">
              {["À propos", "Devenir prestataire", "Partenaires ONAS", "Blog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/50 hover:text-accent transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-accent shrink-0" /> Dakar, Sénégal
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Phone className="w-4 h-4 text-accent shrink-0" /> +221 77 XXX XX XX
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Mail className="w-4 h-4 text-accent shrink-0" /> contact@linkeco.sn
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Suivez-nous</h4>
            <div className="flex gap-2 mb-5">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white/60 hover:text-accent hover:border-accent/30 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              Traçabilité ONAS · Score écologique · Certifié Sénégal
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">© 2026 Link'eco. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/30 hover:text-accent transition-colors">Conditions</a>
            <a href="#" className="text-xs text-white/30 hover:text-accent transition-colors">Confidentialité</a>
            <a href="#" className="text-xs text-white/30 hover:text-accent transition-colors">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
