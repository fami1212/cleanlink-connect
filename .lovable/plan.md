
# Plan: Flux Complet Prestataire avec Navigation GPS

## Objectif
Créer une expérience complète pour les prestataires de vidange, incluant la gestion des missions en temps réel, la navigation GPS vers les clients, et tous les outils necessaires pour leur activite quotidienne.

---

## Nouvelles Pages a Creer

### 1. Page Mission Active (`ProviderMission.tsx`)
- Carte plein ecran avec position du prestataire et destination client
- Bouton "Demarrer la navigation" qui ouvre Google Maps/Waze
- Etapes de mission: En route > Arrive > En cours > Termine
- Informations client (nom, telephone, adresse)
- Timer de mission et estimation des gains

### 2. Page Inscription Prestataire (`ProviderRegister.tsx`)
- Formulaire d'inscription: nom entreprise, type vehicule, capacite
- Upload de documents (permis, carte grise)
- Validation des informations avant activation

### 3. Page Revenus (`ProviderEarnings.tsx`)
- Historique des gains par jour/semaine/mois
- Graphique des revenus
- Liste detaillee des missions completees
- Total des gains en attente de paiement

### 4. Page Avis Clients (`ProviderReviews.tsx`)
- Liste des avis recus avec notes
- Note moyenne globale
- Statistiques de satisfaction

### 5. Page Profil Prestataire (`ProviderProfile.tsx`)
- Informations du vehicule
- Documents et certifications
- Parametres de disponibilite

---

## Hooks a Creer/Modifier

### `useProviderOrders.tsx` (Nouveau)
- Recuperer les commandes `pending` sans provider_id (missions disponibles)
- Recuperer les commandes assignees au provider (missions en cours)
- Fonctions: accepter, refuser, mettre a jour le statut
- Abonnement temps reel aux nouvelles commandes

### `useProviderStats.tsx` (Nouveau)
- Calcul des gains journaliers/hebdomadaires/mensuels
- Nombre de missions completees
- Note moyenne des avis

### `useGeolocation.tsx` (Nouveau)
- Suivi de position GPS en temps reel
- Mise a jour de la position du provider dans la base
- Calcul de distance vers destination

---

## Mise a Jour du Dashboard Prestataire

### `ProviderDashboard.tsx` - Modifications
- Connecter aux vraies donnees via `useProviderOrders`
- Toggle online/offline qui met a jour `is_online` en base
- Liste des missions en attente avec distance calculee
- Notification sonore pour nouvelles missions
- Acces rapide aux revenus et avis

---

## Composants a Creer

### `ProviderBottomNav.tsx`
Navigation specifique prestataire:
- Missions (dashboard)
- Revenus
- Avis
- Profil

### `MissionCard.tsx`
Carte reusable pour afficher une mission:
- Infos client, adresse, service
- Distance et temps estime
- Prix de la mission
- Boutons accepter/refuser

### `MissionStatusStepper.tsx`
Indicateur d'etape de mission:
- Acceptee > En route > Arrive > En cours > Terminee

---

## Flux de Navigation GPS

### Integration Navigation Native
```text
1. Provider accepte mission
2. Redirection vers ProviderMission
3. Affichage carte avec itineraire
4. Bouton "Naviguer" ouvre app GPS externe
   - Android: google.navigation ou waze
   - iOS: maps.apple.com ou waze
5. Boutons d'etape pour mettre a jour statut
```

### Schema du Flux
```text
Dashboard
    |
    v
[Nouvelle Mission] --> Accepter --> Mission Active
    |                                     |
    v                                     v
 Refuser                           [Navigation GPS]
                                          |
                                          v
                                   [Arrive sur site]
                                          |
                                          v
                                   [Travail en cours]
                                          |
                                          v
                                   [Mission terminee]
                                          |
                                          v
                                    Dashboard + Paiement
```

---

## Migration Base de Donnees

### Nouvelles Colonnes pour `providers`
- `device_token`: pour les notifications push (futur)
- `last_location_at`: timestamp derniere position

### Activation Realtime
- Activer realtime sur table `orders` pour les providers

---

## Routes a Ajouter

```text
/app/provider                -> Dashboard
/app/provider/mission        -> Mission active
/app/provider/register       -> Inscription
/app/provider/earnings       -> Revenus
/app/provider/reviews        -> Avis
/app/provider/profile        -> Profil prestataire
```

---

## Details Techniques

### Calcul de Distance
Utilisation de la formule Haversine pour calculer la distance entre le provider et le client:
```text
distance = 2 * R * arcsin(sqrt(
  sin((lat2-lat1)/2)^2 +
  cos(lat1) * cos(lat2) * sin((lng2-lng1)/2)^2
))
```

### Mise a Jour Position GPS
- Intervalle: toutes les 30 secondes quand en mission
- Intervalle: toutes les 2 minutes quand en ligne (hors mission)
- Arret quand hors ligne

### Liens de Navigation Externe
```text
Android: geo:${lat},${lng}?q=${lat},${lng}
iOS: maps://maps.apple.com/?daddr=${lat},${lng}
Waze: https://waze.com/ul?ll=${lat},${lng}&navigate=yes
Google Maps: https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}
```

---

## Fichiers a Creer

| Fichier | Description |
|---------|-------------|
| `src/pages/app/ProviderMission.tsx` | Page mission active avec GPS |
| `src/pages/app/ProviderRegister.tsx` | Inscription prestataire |
| `src/pages/app/ProviderEarnings.tsx` | Revenus et historique |
| `src/pages/app/ProviderReviews.tsx` | Avis clients |
| `src/pages/app/ProviderProfile.tsx` | Profil et vehicule |
| `src/hooks/useProviderOrders.tsx` | Gestion commandes provider |
| `src/hooks/useProviderStats.tsx` | Statistiques provider |
| `src/hooks/useGeolocation.tsx` | Suivi GPS |
| `src/components/app/ProviderBottomNav.tsx` | Navigation provider |
| `src/components/app/MissionCard.tsx` | Carte mission |
| `src/components/app/MissionStatusStepper.tsx` | Etapes mission |

---

## Fichiers a Modifier

| Fichier | Modifications |
|---------|---------------|
| `src/pages/app/ProviderDashboard.tsx` | Connecter donnees reelles |
| `src/App.tsx` | Ajouter nouvelles routes |
| `src/components/app/Map.tsx` | Support navigation GPS |
| `src/hooks/useProviders.tsx` | Ajouter fonction position |

---

## Ordre d'Implementation

1. Migration base de donnees (si necessaire)
2. Hooks: `useProviderOrders`, `useGeolocation`, `useProviderStats`
3. Composants: `ProviderBottomNav`, `MissionCard`, `MissionStatusStepper`
4. Pages: `ProviderMission`, `ProviderRegister`, `ProviderEarnings`, `ProviderReviews`, `ProviderProfile`
5. Mise a jour: `ProviderDashboard`, `App.tsx`, `Map.tsx`
6. Tests sur Android avec `npx cap sync`
