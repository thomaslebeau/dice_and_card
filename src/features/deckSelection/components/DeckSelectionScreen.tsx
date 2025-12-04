import React, { useCallback } from 'react';
import { useGamepadNavigation } from 'gaming-ui-a11y-toolkit';
import type { DeckSelectionScreenProps } from './DeckSelectionScreen.types';
import { useDeckSelection } from '../hooks/useDeckSelection';
import { CardDisplay } from '@shared/components/CardDisplay/CardDisplay';
import { RARITY_COLORS } from '@shared/constants/cards';
import styles from './DeckSelectionScreen.module.scss';

/**
 * Deck selection screen component
 * Allows player to select 5 cards before starting combat
 */
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

  // Handle start combat action
  const handleStartCombat = useCallback(() => {
    if (canStartCombat) {
      onDeckConfirmed(selectedCards);
    }
  }, [canStartCombat, selectedCards, onDeckConfirmed]);

  // Gamepad navigation
  const { focusedIndex, updateFocusedIndex } = useGamepadNavigation({
    itemCount: availableCards.length,
    direction: 'horizontal',
    onConfirm: (index) => {
      toggleCardSelection(availableCards[index]);
    },
    onBack: onBackToMenu,
    onStart: handleStartCombat,
  });

  return (
    <div className={styles.deckSelection}>
      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.menuButton}
          onClick={onBackToMenu}
          aria-label="Retour au menu"
        >
          ← Menu
        </button>
        <h2 className={styles.title}>Acte 1</h2>
        <button
          className={`${styles.startButton} ${!canStartCombat ? styles.disabled : ''}`}
          onClick={handleStartCombat}
          disabled={!canStartCombat}
          aria-label="Commencer le combat"
        >
          Commencer Combat
        </button>
      </div>

      {/* Counter */}
      <div className={styles.counter}>
        {selectedCards.length}/5 cartes sélectionnées
      </div>

      {/* Instructions */}
      <div className={styles.instructions}>
        Sélectionnez 5 cartes pour constituer votre deck de départ
      </div>

      {/* Cards container */}
      <div className={styles.cardsContainer}>
        {availableCards.map((card, index) => {
          const selected = isCardSelected(card.id);
          const focused = focusedIndex === index;
          const rarityColor = RARITY_COLORS[card.rarity];

          return (
            <div
              key={card.id}
              className={`${styles.selectableCard} ${selected ? styles.selected : ''} ${focused ? styles.focused : ''}`}
              onClick={() => toggleCardSelection(card)}
              onMouseEnter={() => updateFocusedIndex(index)}
              style={{
                borderColor: selected ? rarityColor : 'rgba(255, 255, 255, 0.2)',
              }}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`${card.name}, ${selected ? 'sélectionnée' : 'non sélectionnée'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleCardSelection(card);
                }
              }}
            >
              <CardDisplay card={card} />
              {selected && (
                <div className={styles.selectedIndicator}>✓</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Gamepad hints */}
      <div className={styles.hints}>
        <p>🎮 D-Pad/Stick: Naviguer | A: Sélectionner | B: Menu | Start: Combat</p>
        <p>⌨️ Clic/Entrée: Sélectionner | Échap: Menu</p>
      </div>
    </div>
  );
};
