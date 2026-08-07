import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "fr" | "wo";

type Dict = Record<string, { fr: string; wo: string }>;

const dict: Dict = {
  // Nav
  "nav.home": { fr: "Accueil", wo: "Kër gi" },
  "nav.tracking": { fr: "Suivi", wo: "Toppatoo" },
  "nav.messages": { fr: "Messages", wo: "Bataaxal" },
  "nav.profile": { fr: "Profil", wo: "Sama profil" },
  // Onboarding
  "onb.skip": { fr: "Passer", wo: "Weesu" },
  "onb.next": { fr: "Suivant", wo: "Topp" },
  "onb.start": { fr: "Commencer", wo: "Tàmbali" },
  "onb.1.title": { fr: "Besoin urgent de vidange ?", wo: "Dangay soxla vidange bu gaaw ?" },
  "onb.1.desc": {
    fr: "Trouver un prestataire fiable n'est pas toujours simple.",
    wo: "Gis kuy liggéey bu wóor du yomb lu bare.",
  },
  "onb.2.title": { fr: "Link'eco vous connecte", wo: "Link'eco dafay boole" },
  "onb.2.desc": {
    fr: "Citoyens et professionnels, pour un service rapide et transparent.",
    wo: "Askan wi ak liggéeykat yi, ngir liggéey bu gaaw te leer.",
  },
  "onb.3.title": { fr: "Un service clair", wo: "Liggéey bu leer" },
  "onb.3.desc": {
    fr: "Un environnement sain. Commandez en quelques clics.",
    wo: "Wërsëg wu set. Komande ci ay klik.",
  },
  // Settings
  "set.title": { fr: "Paramètres", wo: "Tëraliin" },
  "set.appearance": { fr: "Apparence", wo: "Melokaan" },
  "set.dark": { fr: "Mode sombre", wo: "Anam bu lëndëm" },
  "set.darkDesc": { fr: "Thème foncé pour l'application", wo: "Melokaan bu lëndëm" },
  "set.language": { fr: "Langue", wo: "Làkk" },
  "set.languageDesc": { fr: "Langue de l'application", wo: "Làkku aplikaasioŋ bi" },
  "set.referral": { fr: "Parrainage", wo: "Woote xarit" },
  "set.referralDesc": { fr: "Invitez vos proches et gagnez des réductions", wo: "Woo say xarit te am wàññi" },
  "set.install": { fr: "Installer l'application", wo: "Samp aplikaasioŋ bi" },
  "set.installDesc": { fr: "Ajouter Link'eco à l'écran d'accueil", wo: "Yokk Link'eco ci ekraan bi" },
  // Referral
  "ref.title": { fr: "Parrainage", wo: "Woote xarit" },
  "ref.headline": { fr: "Invitez, économisez", wo: "Woo, denc xaalis" },
  "ref.sub": {
    fr: "Chaque ami qui commande grâce à votre code vous offre 2 000 FCFA de réduction sur votre prochaine vidange.",
    wo: "Bu sa xarit komande ak sa kod, dinga am 2 000 FCFA ci sa vidange bu topp.",
  },
  "ref.yourCode": { fr: "Votre code", wo: "Sa kod" },
  "ref.copy": { fr: "Copier le code", wo: "Kopie kod bi" },
  "ref.copied": { fr: "Code copié !", wo: "Kod bi kopie na !" },
  "ref.share": { fr: "Partager", wo: "Séddoo" },
  "ref.how": { fr: "Comment ça marche", wo: "Naka la doxe" },
  "ref.step1": { fr: "Partagez votre code à vos proches", wo: "Séddoo sa kod ak say xarit" },
  "ref.step2": { fr: "Ils commandent leur première vidange", wo: "Ñu komande seen vidange bu njëkk" },
  "ref.step3": { fr: "Vous recevez 2 000 FCFA de réduction", wo: "Nga jot 2 000 FCFA wàññi" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx>({ lang: "fr", setLang: () => {}, t: (k) => k });

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("linkeco-lang") : null;
    return stored === "wo" ? "wo" : "fr";
  });

  useEffect(() => {
    localStorage.setItem("linkeco-lang", lang);
    document.documentElement.lang = lang === "wo" ? "wo" : "fr";
  }, [lang]);

  const t = (key: string) => dict[key]?.[lang] ?? dict[key]?.fr ?? key;

  return <Ctx.Provider value={{ lang, setLang: setLangState, t }}>{children}</Ctx.Provider>;
};

export const useI18n = () => useContext(Ctx);

export const LANGUAGES: { value: Lang; label: string; native: string; flag: string }[] = [
  { value: "fr", label: "Français", native: "Français", flag: "🇫🇷" },
  { value: "wo", label: "Wolof", native: "Wolof", flag: "🇸🇳" },
];
