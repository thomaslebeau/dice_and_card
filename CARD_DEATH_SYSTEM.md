# Système de Gestion des Cartes Mortes

## Vue d'ensemble

Le système de gestion des cartes mortes permet de marquer les cartes comme mortes lorsqu'elles atteignent 0 PV lors d'un combat, et de les exclure des combats suivants. Ce système maintient l'état de mort persistant entre les écrans du jeu.

## Architecture

### 1. Interface Card (mise à jour)

**Fichier:** `src/types/card.types.ts`

```typescript
export interface Card extends CardBase {
  currentHp: number;
  isDead?: boolean;  // Nouveau flag
}
```

Le flag `isDead` est optionnel et par défaut `undefined` (équivalent à `false`).

### 2. Utilitaires de Gestion des Cartes Mortes

**Fichier:** `src/shared/utils/cardDeathUtils.ts`

#### Fonctions principales:

- **`markCardAsDead(card: Card): Card`**
  Marque une carte comme morte (retourne une nouvelle instance).

- **`markCardAsDeadInDeck(deck: Card[], cardId: number): Card[]`**
  Marque une carte spécifique comme morte dans un deck (immutable).

- **`filterAliveCards(deck: Card[]): Card[]`**
  Retourne uniquement les cartes vivantes.

- **`filterDeadCards(deck: Card[]): Card[]`**
  Retourne uniquement les cartes mortes.

- **`getAliveCardsCount(deck: Card[]): number`**
  Compte le nombre de cartes vivantes.

- **`getDeadCardsCount(deck: Card[]): number`**
  Compte le nombre de cartes mortes.

- **`shouldCardDie(card: Card): boolean`**
  Vérifie si une carte devrait mourir (HP <= 0).

- **`markCardAsDeadIfNeeded(card: Card): Card`**
  Marque automatiquement une carte comme morte si HP <= 0.

- **`isCardAlive(card: Card): boolean`**
  Vérifie si une carte est vivante.

### 3. Hook useAliveCards

**Fichier:** `src/shared/hooks/useAliveCards.ts`

Hook personnalisé pour obtenir les statistiques sur les cartes vivantes/mortes.

```typescript
const {
  aliveCards,      // Card[] - cartes vivantes
  deadCards,       // Card[] - cartes mortes
  aliveCardsCount, // number - nombre de cartes vivantes
  deadCardsCount,  // number - nombre de cartes mortes
  totalCards,      // number - nombre total de cartes
  hasAliveCards,   // boolean - y a-t-il des cartes vivantes?
  hasDeadCards     // boolean - y a-t-il des cartes mortes?
} = useAliveCards(deck);
```

### 4. Intégration dans useGameState

**Fichier:** `src/core/hooks/useGameState.ts`

Le hook principal du jeu expose maintenant:

```typescript
const {
  // États existants
  gameState,
  currentCombat,
  playerCard,
  enemyCard,
  playerDeck,

  // Nouveaux états pour les cartes mortes
  aliveCards,       // Cartes vivantes du deck
  deadCards,        // Cartes mortes du deck
  aliveCardsCount,  // Nombre de cartes vivantes
  deadCardsCount,   // Nombre de cartes mortes

  // Actions existantes
  startNewRun,
  handleDeckConfirmed,
  handleCombatEnd,
  handleCardSelected,
  handleBackToMenu,

  // Nouvelle action
  markCardAsDead,   // Fonction pour marquer une carte comme morte
} = useGameState();
```

#### Comportement automatique:

**Quand `handleCombatEnd` est appelé:**
1. La carte du joueur est automatiquement marquée comme morte si HP <= 0
2. Le deck est mis à jour pour refléter l'état de mort
3. L'état persiste entre les écrans

## Utilisation

### Exemple 1: Afficher les statistiques de cartes

```typescript
import { useGameState } from '@/core/hooks/useGameState';

const MyComponent = () => {
  const { aliveCardsCount, deadCardsCount } = useGameState();

  return (
    <div>
      <p>Cartes vivantes: {aliveCardsCount}</p>
      <p>Cartes mortes: {deadCardsCount}</p>
    </div>
  );
};
```

### Exemple 2: Filtrer les cartes vivantes pour la sélection

```typescript
import { useGameState } from '@/core/hooks/useGameState';

const RewardScreen = () => {
  const { aliveCards, playerCard, handleCardSelected } = useGameState();

  // Exclure la carte active
  const availableCards = aliveCards.filter(card => card.id !== playerCard?.id);

  return (
    <div>
      {availableCards.map(card => (
        <button key={card.id} onClick={() => handleCardSelected(card)}>
          {card.name}
        </button>
      ))}
    </div>
  );
};
```

### Exemple 3: Afficher visuellement les cartes mortes

```typescript
import { useGameState } from '@/core/hooks/useGameState';

const DeckOverview = () => {
  const { playerDeck } = useGameState();

  return (
    <div>
      {playerDeck.map(card => (
        <div
          key={card.id}
          style={{
            opacity: card.isDead ? 0.5 : 1,
            textDecoration: card.isDead ? 'line-through' : 'none'
          }}
        >
          {card.name}
          {card.isDead && <span>☠️ MORT</span>}
        </div>
      ))}
    </div>
  );
};
```

### Exemple 4: Utiliser useAliveCards indépendamment

```typescript
import { useAliveCards } from '@/shared/hooks/useAliveCards';

const CustomComponent = ({ myDeck }: { myDeck: Card[] }) => {
  const { aliveCards, hasAliveCards } = useAliveCards(myDeck);

  if (!hasAliveCards) {
    return <div>Toutes les cartes sont mortes!</div>;
  }

  return (
    <div>
      {aliveCards.map(card => <div key={card.id}>{card.name}</div>)}
    </div>
  );
};
```

### Exemple 5: Marquer manuellement une carte comme morte

```typescript
import { useGameState } from '@/core/hooks/useGameState';

const AdminPanel = () => {
  const { playerDeck, markCardAsDead } = useGameState();

  return (
    <div>
      {playerDeck.map(card => (
        <div key={card.id}>
          {card.name}
          {!card.isDead && (
            <button onClick={() => markCardAsDead(card.id)}>
              Marquer comme morte
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
```

## Principes d'Implémentation

### Immutabilité

Toutes les fonctions respectent l'immutabilité du state React:

```typescript
// ❌ Mauvais - mutation directe
card.isDead = true;

// ✅ Bon - nouvelle instance
const deadCard = { ...card, isDead: true };

// ✅ Bon - utiliser les utilitaires
const deadCard = markCardAsDead(card);
```

### TypeScript Strict

Le système est entièrement typé avec TypeScript strict:
- Tous les paramètres et retours sont typés
- Le flag `isDead` est optionnel (`boolean | undefined`)
- Utilisation de `type` et `interface` pour les définitions

### Performance

- Utilisation de `useMemo` dans `useAliveCards` pour éviter les recalculs
- Les fonctions utilitaires sont pures et optimisables

## Flux de Données

```
Combat terminé
    ↓
handleCombatEnd appelé
    ↓
markCardAsDeadIfNeeded vérifie si HP <= 0
    ↓
Si oui: isDead = true
    ↓
Deck mis à jour avec markCardAsDeadInDeck
    ↓
useAliveCards recalcule automatiquement
    ↓
Composants re-rendus avec les nouvelles valeurs
```

## Tests Recommandés

### Tests unitaires pour les utilitaires

```typescript
import { markCardAsDead, filterAliveCards, shouldCardDie } from './cardDeathUtils';

test('markCardAsDead should set isDead to true', () => {
  const card = { id: 1, currentHp: 5, maxHp: 10 } as Card;
  const result = markCardAsDead(card);
  expect(result.isDead).toBe(true);
  expect(result.id).toBe(card.id); // Autres propriétés préservées
});

test('shouldCardDie returns true when HP is 0', () => {
  const card = { currentHp: 0, maxHp: 10 } as Card;
  expect(shouldCardDie(card)).toBe(true);
});

test('filterAliveCards removes dead cards', () => {
  const deck = [
    { id: 1, isDead: false } as Card,
    { id: 2, isDead: true } as Card,
    { id: 3 } as Card, // undefined = alive
  ];
  const result = filterAliveCards(deck);
  expect(result).toHaveLength(2);
  expect(result.map(c => c.id)).toEqual([1, 3]);
});
```

### Tests d'intégration

```typescript
test('handleCombatEnd marks card as dead when HP is 0', () => {
  const { result } = renderHook(() => useGameState());

  // Setup: deck with 5 cards
  act(() => {
    result.current.handleDeckConfirmed(mockDeck);
  });

  // Simulate combat loss
  act(() => {
    result.current.handleCombatEnd({
      victory: false,
      playerCard: { ...mockCard, currentHp: 0 }
    });
  });

  // Assert: card is marked as dead
  expect(result.current.deadCardsCount).toBe(1);
  expect(result.current.aliveCardsCount).toBe(4);
});
```

## Exemples Complets

Des exemples complets d'utilisation sont disponibles dans:
`src/examples/CardDeathSystemExample.tsx`

## Compatibilité

- ✅ Compatible avec le système de combat existant
- ✅ Fonctionne avec tous les écrans du jeu
- ✅ Persiste correctement entre les transitions d'état
- ✅ N'affecte pas les cartes ennemies (système séparé)

## Migration

Si vous avez du code existant utilisant les cartes, aucune migration n'est nécessaire:
- Le flag `isDead` est optionnel
- Les cartes existantes sans `isDead` sont considérées comme vivantes
- Toutes les anciennes fonctions continuent de fonctionner

## Support

Pour toute question ou problème:
1. Consultez les exemples dans `src/examples/CardDeathSystemExample.tsx`
2. Vérifiez les types dans `src/types/card.types.ts`
3. Référez-vous aux utilitaires dans `src/shared/utils/cardDeathUtils.ts`
