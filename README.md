# Dice and Card

Un roguelike de deck-building avec combats au tour par tour dans un univers post-apocalyptique gothique industriel.

## Vue d'ensemble

Dice and Card est un jeu de stratégie où chaque carte de votre deck représente une vie. Les survivants forgent leurs armes dans les ruines urbaines d'un monde hostile. Chaque décision compte, car la mort est permanente.

## Règles du jeu

### Système de Combat

Le combat utilise un système de réduction de dégâts en pourcentage :

**Formule :**
```
Dégâts finaux = Dégâts bruts × (1 - réduction)
Réduction = défense × 10%
Réduction maximum = 60%
Dégâts minimum = 1 (garanti)
```

**Exemples de calcul :**
- Attaque de 10 dégâts contre 2 de défense → 10 × (1 - 0.20) = **8 dégâts**
- Attaque de 10 dégâts contre 4 de défense → 10 × (1 - 0.40) = **6 dégâts**
- Attaque de 10 dégâts contre 6 de défense → 10 × (1 - 0.60) = **4 dégâts**
- Attaque de 10 dégâts contre 8 de défense → 10 × (1 - 0.60) = **4 dégâts** (plafond à 60%)
- Attaque de 1 dégât contre 6 de défense → **1 dégât** (minimum garanti)

Les combats durent en moyenne 8-12 rounds, rendant chaque affrontement dynamique.

### Système de Draft

- **Deck maximum** : 5 cartes
- **Après une victoire** : 3 cartes vous sont proposées, vous en choisissez 1
- **Si votre deck a 5 cartes** : vous devez remplacer une carte existante
- **Si votre deck a moins de 5 cartes** : la carte est ajoutée directement
- Chaque carte se voit assigner une position de combat (1 à 5)

### Règles de Mort

- **Vos cartes = vos vies**
- Quand une carte meurt en combat, elle **disparaît définitivement** de votre deck
- **Game Over** : toutes vos cartes sont mortes
- **Après une défaite** : retour à l'écran de sélection avec vos cartes restantes

### Adversaire

L'adversaire est révélé **APRÈS** que vous ayez sélectionné votre carte. Vous jouez à l'aveugle, ce qui rend le reroll critique pour s'adapter à la situation.

## Flow d'un run

```
Menu principal
    ↓
Sélection initiale du deck
    ↓
    ┌─────────────────┐
    │     Combat      │
    └─────────────────┘
         ↓         ↓
      Victoire   Défaite
         ↓         ↓
      Draft    Retour à sélection
         ↓      (cartes restantes)
    Prochain         ↓
     combat      Game Over ?
         ↓            ↓
        ...        Fin
```

## Stack technique

- **React 19** + **TypeScript**
- **Vite** (avec Rolldown)
- **React Three Fiber** + **Three.js** pour le rendu 3D
- **SASS** pour le styling
- Architecture organisée par features

## Architecture du projet

```
src/
├── core/              # État global du jeu (hooks, types)
├── features/          # Écrans organisés par fonctionnalité
│   ├── combat/        # Écran de combat
│   ├── deckSelection/ # Sélection des cartes
│   ├── deckManagement/# Gestion du deck (remplacement)
│   ├── reward/        # Écran de draft après victoire
│   ├── gameOver/      # Game Over
│   └── menu/          # Menu principal
├── shared/            # Composants et utilitaires réutilisables
│   ├── components/    # CardDisplay, DiceDisplay, etc.
│   ├── constants/     # Cartes et dés disponibles
│   ├── utils/         # Calculs de combat, génération d'ennemis
│   └── hooks/         # Hooks partagés
├── external_lib/      # Système de navigation gamepad interne
├── types/             # Définitions TypeScript globales
└── enums/             # Énumérations (GameState, Rarity)
```

## Démarrage

```bash
npm install
npm run dev
```

Pour build :
```bash
npm run build
```

## Public cible

- Fans de roguelikes (Dead Cells, Hades)
- Joueurs de deck-builders (Slay the Spire, Monster Train)
- Amateurs de jeux de stratégie au tour par tour

## Licence

À définir
