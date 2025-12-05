import React, { useCallback } from 'react';
import { useFocusable } from 'gaming-ui-a11y-toolkit';
import type { DeckSelectionScreenProps } from './DeckSelectionScreen.types';
import { useDeckSelection } from '../hooks/useDeckSelection';
import { CardDisplay } from '@shared/components/CardDisplay/CardDisplay';
import { RARITY_COLORS } from '@shared/constants/cards';
import type { Card } from '@/types/card.types';
import styles from './DeckSelectionScreen.module.scss';

export const DeckSelectionScreen: React.FC<DeckSelectionScreenProps> = ({
  onDeckConfirmed,
  onBackToMenu,
}) => {
  const {
    availableCards,
    selectedCards,
    toggleCardSelection,
    isCardSelected,
    canStartCombat,
  } = useDeckSelection();

  const handleStartCombat = useCallback(() => {
    if (canStartCombat) {
      onDeckConfirmed(selectedCards);
    }
  }, [canStartCombat, selectedCards, onDeckConfirmed]);

  // Bouton Menu (header gauche)
  const menuButton = useFocusable({
    id: 'deck-menu-button',
    onActivate: onBackToMenu,
    autoFocus: true, // Focus initial
    priority: 100,
  });

  // Bouton Start Combat (header droite)
  const startCombatButton = useFocusable({
    id: 'deck-start-button',
    onActivate: handleStartCombat,
    disabled: !canStartCombat,
    priority: 100,
  });

  return (
    <div className={styles.deckSelection}>
      {/* Header avec navigation */}
      <header className={styles.header}>
        <button
          {...menuButton.focusProps}
          className={`${styles.menuButton} ${
            menuButton.isFocused ? styles.focused : ''
          }`}
          aria-label="Retour au menu"
        >
          ← Menu
        </button>

        <h2 className={styles.title}>Acte 1 - Sélection du Deck</h2>

        <button
          {...startCombatButton.focusProps}
          className={`${styles.startButton} ${
            !canStartCombat ? styles.disabled : ''
          } ${startCombatButton.isFocused ? styles.focused : ''}`}
          disabled={!canStartCombat}
          aria-label="Commencer le combat"
        >
          Commencer Combat
        </button>
      </header>

      {/* Compteur de sélection */}
      <div className={styles.counter}>
        <span className={styles.counterText}>
          {selectedCards.length}/5 cartes sélectionnées
        </span>
        {selectedCards.length === 5 && (
          <span className={styles.counterReady}>✓ Prêt !</span>
        )}
      </div>

      {/* Instructions */}
      <div className={styles.instructions}>
        Sélectionnez 5 cartes pour constituer votre deck de départ
      </div>

      {/* Cartes disponibles */}
      <div className={styles.cardsContainer}>
        {availableCards.map((card) => (
          <SelectableCard
            key={card.id}
            card={card}
            isSelected={isCardSelected(card.id)}
            onToggle={() => toggleCardSelection(card)}
          />
        ))}
      </div>

      {/* Hints */}
      <footer className={styles.hints}>
        <p>🎮 D-Pad/Stick: Naviguer | A: Sélectionner/Activer</p>
        <p>⌨️ Clic/Flèches/Tab: Naviguer | Entrée/Espace: Sélectionner</p>
      </footer>
    </div>
  );
};

/**
 * Selectable Card Component
 * IMPORTANT: Extracted from loop to use useFocusable properly
 */
interface SelectableCardProps {
  card: Card;
  isSelected: boolean;
  onToggle: () => void;
}

const SelectableCard: React.FC<SelectableCardProps> = ({
  card,
  isSelected,
  onToggle,
}) => {
  const cardFocus = useFocusable({
    id: `deck-card-${card.id}`,
    group: 'deck-cards',
    onActivate: onToggle,
  });

  const rarityColor = RARITY_COLORS[card.rarity];

  return (
    <div
      {...cardFocus.focusProps}
      className={`${styles.selectableCard} ${
        isSelected ? styles.selected : ''
      } ${cardFocus.isFocused ? styles.focused : ''}`}
      style={{
        borderColor: isSelected ? rarityColor : 'rgba(255, 255, 255, 0.2)',
      }}
      aria-pressed={isSelected}
      aria-label={`${card.name}, ${isSelected ? 'sélectionnée' : 'non sélectionnée'}`}
    >
      <CardDisplay card={card} />

      {/* Indicateur de sélection */}
      {isSelected && (
        <div className={styles.selectedIndicator}>
          <span className={styles.checkmark}>✓</span>
        </div>
      )}

      {/* Badge de rareté */}
      <div className={styles.rarityBadge} style={{ backgroundColor: rarityColor }}>
        {card.rarity}
      </div>
    </div>
  );
};
