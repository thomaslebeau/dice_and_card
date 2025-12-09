import React, { useCallback, useState } from "react";
import { useFocusable } from "gaming-ui-a11y-toolkit";
import type { DeckSelectionScreenProps } from "./DeckSelectionScreen.types";
import { useDeckSelection } from "../hooks/useDeckSelection";
import { CardDisplay } from "@shared/components/CardDisplay/CardDisplay";
import { RARITY_COLORS } from "@shared/constants/cards";
import type { Card } from "@/types/card.types";
import { useAliveCards } from "@shared/hooks/useAliveCards";
import styles from "./DeckSelectionScreen.module.scss";

export const DeckSelectionScreen: React.FC<DeckSelectionScreenProps> = ({
  onDeckConfirmed,
  onBackToMenu,
}) => {
  const {
    availableCards,
    selectedCards,
    toggleCardSelection,
    isCardSelected,
    getSelectionOrder,
    canStartCombat,
  } = useDeckSelection();

  // Hook pour gérer les cartes vivantes/mortes
  const { aliveCardsCount, totalCards } = useAliveCards(availableCards);

  const handleStartCombat = useCallback(() => {
    if (canStartCombat) {
      onDeckConfirmed(selectedCards);
    }
  }, [canStartCombat, selectedCards, onDeckConfirmed]);

  // Bouton Menu (header gauche)
  const menuButton = useFocusable({
    id: "deck-menu-button",
    onActivate: onBackToMenu,
    autoFocus: true, // Focus initial
    priority: 100,
  });

  // Bouton Start Combat (header droite)
  const startCombatButton = useFocusable({
    id: "deck-start-button",
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
          onClick={onBackToMenu}
          className={`${styles.menuButton} ${
            menuButton.isFocused ? styles.focused : ""
          }`}
          aria-label="Retour au menu"
        >
          ← Menu
        </button>

        <h2 className={styles.title}>Acte 1 - Sélection du Deck</h2>

        <button
          {...startCombatButton.focusProps}
          onClick={handleStartCombat}
          className={`${styles.startButton} ${
            !canStartCombat ? styles.disabled : ""
          } ${startCombatButton.isFocused ? styles.focused : ""}`}
          disabled={!canStartCombat}
          aria-label="Commencer le combat"
        >
          Commencer Combat
        </button>
      </header>

      {/* Compteur de cartes vivantes */}
      <div className={styles.counter}>
        <span className={styles.counterText}>
          Cartes vivantes : {aliveCardsCount}/{totalCards}
        </span>
      </div>

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
            selectionOrder={getSelectionOrder(card.id)}
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
  selectionOrder: number; // 1-5 pour l'ordre de sélection, 0 si non sélectionnée
  onToggle: () => void;
}

const SelectableCard: React.FC<SelectableCardProps> = ({
  card,
  isSelected,
  selectionOrder,
  onToggle,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const isDead = card.isDead === true;

  const cardFocus = useFocusable({
    id: `deck-card-${card.id}`,
    group: "deck-cards",
    onActivate: () => onToggle,
  });

  const rarityColor = RARITY_COLORS[card.rarity];

  // Gestion du clic sur une carte morte
  const handleClick = () => {
    if (isDead) {
      // Trigger animation shake
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);

      // Feedback haptique (si disponible)
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]); // Pattern de vibration
      }

      return; // Empêcher la sélection
    }

    onToggle();
  };

  return (
    <div
      {...cardFocus.focusProps}
      onClick={handleClick}
      className={`${styles.selectableCard} ${
        isSelected ? styles.selected : ""
      } ${cardFocus.isFocused ? styles.focused : ""} ${
        isDead ? styles.dead : ""
      } ${isShaking ? styles.shake : ""}`}
      style={{
        borderColor: isSelected ? rarityColor : "rgba(255, 255, 255, 0.2)",
      }}
      aria-pressed={isSelected}
      aria-disabled={isDead}
      aria-label={`${card.name}, ${
        isDead
          ? "morte, ne peut pas être sélectionnée"
          : isSelected
          ? "sélectionnée"
          : "non sélectionnée"
      }`}
    >
      <CardDisplay card={card} isDead={isDead} />

      {/* Indicateur de carte morte */}
      {isDead && (
        <div className={styles.deadIndicator}>
          <span className={styles.deadIcon}>❌ MORTE</span>
        </div>
      )}

      {/* Indicateur de sélection avec ordre */}
      {isSelected && !isDead && (
        <div className={styles.selectedIndicator}>
          <span className={styles.selectionOrder}>{selectionOrder}</span>
        </div>
      )}

      {/* Badge de rareté */}
      <div
        className={styles.rarityBadge}
        style={{ backgroundColor: rarityColor }}
      >
        {card.rarity}
      </div>
    </div>
  );
};
