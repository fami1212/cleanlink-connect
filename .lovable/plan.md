## Refonte globale Link'eco — Awwwards level

### Direction visuelle (verrouillée)
- **Palette** : Emerald Prestige — `#064e3b` (primary deep), `#0d7a5f` (primary), `#c9a84c` (gold accent), `#f5f0e0` (cream surface), noir profond pour fonds dark.
- **Typo** : Sora (display/headlines, 600-800) + Manrope (body, 400-600). Tracking serré sur les headlines (-0.03em).
- **Style** : verre dépoli, micro-shadows douces, gros radius (16-24px), gold accents parcimonieux, animations Motion fluides (spring damping ~25), micro-interactions partout.

### 1. Design system (`src/index.css` + `tailwind.config.ts`)
- Mettre à jour tokens HSL : `--primary`, `--primary-glow`, `--accent` (gold), `--cream`, surfaces glass `--glass-bg`, `--glass-border`.
- Ajouter gradients : `--gradient-emerald`, `--gradient-gold-shine`, `--gradient-mesh`.
- Shadows premium : `--shadow-glass`, `--shadow-gold`, `--shadow-float`.
- Charger fonts Sora + Manrope dans `index.html`, mapper `font-display` / `font-sans`.
- Animations utilitaires : `shimmer`, `float`, `glow-pulse`.

### 2. Landing (`src/pages/Index.tsx` + composants)
- **Header** (`Header.tsx`) : refonte → barre flottante glassmorphism arrondie (max-w-5xl, mx-auto, mt-4, backdrop-blur-2xl, border subtile), logo gauche, nav pill centrée, CTA gold à droite. Mobile : sheet plein écran avec gros liens.
- **Hero** (`Hero.tsx`) : ajout mesh gradient background + meteors/particles, badge gold, headline Sora énorme avec aurora text sur l'accent, sous-titre Manrope, CTAs avec border beam sur le primary, stats inline en bas (4 chiffres), preview mockup carte/téléphone à droite (desktop).
- **Services / HowItWorks / Features** : passage en bento-grid mixte, magic-card hover, icônes dans badges gold/emerald, animations scroll-reveal staggered.
- **Stats** : compteurs animés sur view, fond emerald deep avec dot pattern.
- **CTA final** : section pleine largeur avec border-beam, dégradé emerald → gold subtle.
- **Footer** : refonte 4 colonnes, newsletter, social icons, fine line gold.

### 3. Pages app (mobile-first, garder Capacitor safe areas)
Polish unifié — header sticky glass, cards radius-2xl, états vides illustrés, skeleton loaders, transitions de page :

- **RoleSelect** : cards 3D tilt, gradients par rôle, icône dans halo gold.
- **Auth / Onboarding** : split visuel, inputs flottants, progress bar dorée.
- **Home (client)** : header glass, search bar premium, carte plein écran avec overlay bottom-sheet (drag handle), pills filtres scroll horizontal.
- **Order / Payment** : stepper élégant, résumé sticky, boutons gradient gold.
- **Tracking** : déjà refait — harmoniser tokens + timeline polish.
- **Profile / ProviderProfile** : déjà refaits — réaligner sur nouveau design system (gradients, fonts).
- **ProviderDashboard / Earnings / Mission / Reviews / Documents** : cards stats glass, graphes accent gold, headers cohérents.
- **Conversations / Chat** : bulles arrondies, header avatar large, input flottant.
- **Notifications / Settings / Help / Favorites / OrderHistory** : list items glass, section headers Sora, empty states illustrés.
- **BottomNav / ProviderBottomNav** : refonte glass flottante avec indicator pill animé sous l'item actif.

### 4. Composants partagés
- `MissionCard`, `ServiceCard`, `UserLocationCard`, `TrackingTimeline`, `NotificationBell`, `MissionStatusStepper` : mise à jour tokens, radius, ombres.

### Détails techniques
- Aucune logique métier touchée (hooks, Supabase, RLS inchangés).
- Ajout Magic UI : `meteors`, `border-beam`, `magic-card`, `aurora-text`, `animated-grid-pattern`, `number-ticker` (installés manuellement via composants locaux).
- Garder z-index : Header z-30, Map z-0, BottomNav z-40.
- Vérifier dark mode (fonds noir profond #0a1410, surfaces glass blanc/5).
- Plan exécuté en 4 vagues :
  1. Tokens + fonts + Header + Hero
  2. Sections landing + Footer
  3. Pages app core (Home, Order, Profile, Provider*)
  4. Pages secondaires + BottomNav + composants partagés

### Hors scope
- Pas de changement backend, routes, ou fonctionnalités.
- Pas de nouvelle dépendance lourde (Three.js, GSAP) — Motion + Magic UI suffisent.
