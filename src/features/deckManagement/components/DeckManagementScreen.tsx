import React from "react";
import { useFocusable } from "@/external_lib";
import type { DeckManagementScreenProps } from "../types/deckManagement.types";
import { useDeckManagement } from "../hooks/useDeckManagement";
import { CardDisplay } from "@shared/components/CardDisplay/CardDisplay";
import { RARITY_COLORS } from "@shared/constants/cards";
import type { Card } from "@/types/card.types";
import styles from "./DeckManagementScreen.module.scss";

export const DeckManagementScreen: React.FC<DeckManagementScreenProps> = ({
  currentDeck,
  onDeckConfirmed,
  combatNumber,
}) => {
  const {
    rewardCards,
    selectedRewardCard,
    cardToReplace,
    pendingPositions,
    isReadyToConfirm,
    needsReplacement,
    selectRewardCard,
    selectCardToReplace,
    assignPosition,
    getCardAtPosition,
    confirmDeckManagement,
  } = useDeckManagement({ currentDeck, onDeckConfirmed });

  // Count alive cards
  const aliveCards = currentDeck.filter((c) => !c.isDead);
  const aliveCount = aliveCards.length;

  // Calculate expected final card count
  const finalCardCount = needsReplacement ? aliveCount : aliveCount + 1;

  // Confirm button focus
  const confirmButton = useFocusable({
    id: "deck-management-confirm",
    onActivate: confirmDeckManagement,
    disabled: !isReadyToConfirm,
    priority: 100,
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <h2 className={styles.header}>🎉 Victoire ! 🎉</h2>
      <p className={styles.subheader}>Combat {combatNumber} terminé</p>

      {/* Current Deck Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Votre Deck Actuel ({aliveCount}{" "}
          {aliveCount > 1 ? "cartes vivantes" : "carte vivante"})
        </h3>
        {needsReplacement && (
          <p className={styles.sectionInstructions}>
            Sélectionnez 1 carte à remplacer par la nouvelle carte
          </p>
        )}
        <div className={styles.cardGrid}>
          {currentDeck.map((card) => (
            <DeckCard
              key={card.id}
              card={card}
              onSelect={() => selectCardToReplace(card)}
              isSelected={cardToReplace?.id === card.id}
              isSelectable={needsReplacement && !card.isDead}
            />
          ))}
        </div>
      </section>

      {/* Reward Cards Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Récompenses - Choisissez 1 carte
        </h3>
        <div className={styles.rewardGrid}>
          {rewardCards.map((card, index) => (
            <RewardCard
              key={card.id}
              card={card}
              onSelect={() => selectRewardCard(card)}
              isSelected={selectedRewardCard?.id === card.id}
              autoFocus={index === 0}
            />
          ))}
        </div>
      </section>

      {/* Position Assignment Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Ordre de Combat</h3>
        <p className={styles.sectionInstructions}>
          Position 1 combat EN PREMIER, puis 2, etc. Assignez les positions à
          vos cartes.
        </p>
        <div className={styles.positionGrid}>
          {Array.from({ length: finalCardCount }, (_, i) => i + 1).map(
            (position) => {
              const card = getCardAtPosition(position);
              return (
                <PositionSlot
                  key={position}
                  position={position}
                  card={card}
                  onAssign={(cardId) => assignPosition(cardId, position)}
                  availableCards={
                    needsReplacement && selectedRewardCard
                      ? [
                          ...aliveCards.filter(
                            (c) => c.id !== cardToReplace?.id
                          ),
                          selectedRewardCard,
                        ]
                      : selectedRewardCard
                      ? [...aliveCards, selectedRewardCard]
                      : aliveCards
                  }
                />
              );
            }
          )}
        </div>
      </section>

      {/* Progress Indicator */}
      <div className={styles.progress}>
        <p className={styles.progressText}>Progression :</p>
        <ul className={styles.progressList}>
          <li
            className={
              selectedRewardCard
                ? styles.progressComplete
                : styles.progressIncomplete
            }
          >
            {selectedRewardCard ? "✓" : "⚠"} Récompense sélectionnée
          </li>
          {needsReplacement && (
            <li
              className={
                cardToReplace
                  ? styles.progressComplete
                  : styles.progressIncomplete
              }
            >
              {cardToReplace ? "✓" : "⚠"} Carte à remplacer sélectionnée
            </li>
          )}
          <li
            className={
              pendingPositions.size === finalCardCount
                ? styles.progressComplete
                : styles.progressIncomplete
            }
          >
            {pendingPositions.size === finalCardCount ? "✓" : "⚠"} Positions
            assignées ({pendingPositions.size}/{finalCardCount})
          </li>
        </ul>
      </div>

      {/* Confirm Button */}
      <button
        {...confirmButton.focusProps}
        onClick={confirmDeckManagement}
        className={`${styles.confirmButton} ${
          !isReadyToConfirm ? styles.disabled : ""
        } ${confirmButton.isFocused ? styles.focused : ""}`}
        disabled={!isReadyToConfirm}
        aria-label="Confirmer et continuer"
      >
        Confirmer et Continuer
      </button>
    </div>
  );
};

// ==================== SUB-COMPONENTS ====================

/**
 * Deck Card (current deck)
 */
interface DeckCardProps {
  card: Card;
  onSelect: () => void;
  isSelected: boolean;
  isSelectable: boolean;
}

const DeckCard: React.FC<DeckCardProps> = ({
  card,
  onSelect,
  isSelected,
  isSelectable,
}) => {
  const cardFocus = useFocusable({
    id: `deck-card-${card.id}`,
    group: "current-deck",
    onActivate: isSelectable ? onSelect : undefined,
    disabled: !isSelectable,
  });

  const rarityColor = RARITY_COLORS[card.rarity];

  return (
    <div
      {...cardFocus.focusProps}
      className={`${styles.deckCard} ${isSelected ? styles.selected : ""} ${
        card.isDead ? styles.dead : ""
      } ${cardFocus.isFocused ? styles.focused : ""}`}
      style={{ borderColor: isSelected ? "#ff4444" : rarityColor }}
      onClick={isSelectable ? onSelect : undefined}
      aria-label={`${card.name} - ${card.currentHp} HP ${
        card.isDead ? "(Morte)" : ""
      } ${isSelected ? "(À remplacer)" : ""}`}
    >
      {card.isDead && <div className={styles.deadBadge}>❌ MORTE</div>}
      {isSelected && <div className={styles.replaceBadge}>À REMPLACER</div>}
      {card.position && (
        <div className={styles.positionBadge}>[{card.position}]</div>
      )}
      <CardDisplay card={card} />
    </div>
  );
};

/**
 * Reward Card
 */
interface RewardCardProps {
  card: Card;
  onSelect: () => void;
  isSelected: boolean;
  autoFocus?: boolean;
}

const RewardCard: React.FC<RewardCardProps> = ({
  card,
  onSelect,
  isSelected,
  autoFocus,
}) => {
  const cardFocus = useFocusable({
    id: `reward-card-${card.id}`,
    group: "reward-cards",
    onActivate: onSelect,
    autoFocus,
  });

  const rarityColor = RARITY_COLORS[card.rarity];

  return (
    <div
      {...cardFocus.focusProps}
      className={`${styles.rewardCard} ${isSelected ? styles.selected : ""} ${
        cardFocus.isFocused ? styles.focused : ""
      }`}
      style={{ borderColor: isSelected ? "#00ff00" : rarityColor }}
      onClick={onSelect}
      aria-label={`${card.name} - ${card.currentHp} HP (Nouvelle carte) ${
        isSelected ? "(Sélectionnée)" : ""
      }`}
    >
      {isSelected && (
        <div className={styles.selectedBadge}>⭐ SÉLECTIONNÉE</div>
      )}
      <CardDisplay card={card} />
    </div>
  );
};

/**
 * Position Slot
 */
interface PositionSlotProps {
  position: number;
  card: Card | null;
  onAssign: (cardId: number) => void;
  availableCards: Card[];
}

const PositionSlot: React.FC<PositionSlotProps> = ({
  position,
  card,
  onAssign,
  availableCards,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const slotFocus = useFocusable({
    id: `position-slot-${position}`,
    group: "position-slots",
    onActivate: () => setShowMenu(!showMenu),
  });

  const handleCardSelect = (cardId: number) => {
    onAssign(cardId);
    setShowMenu(false);
  };

  return (
    <div className={styles.positionSlotWrapper}>
      <div
        {...slotFocus.focusProps}
        className={`${styles.positionSlot} ${
          card ? styles.assigned : styles.empty
        } ${slotFocus.isFocused ? styles.focused : ""}`}
        onClick={() => setShowMenu(!showMenu)}
        aria-label={`Position ${position} ${
          card ? `- ${card.name}` : "(Vide)"
        }`}
      >
        <div className={styles.positionNumber}>{position}</div>
        {card ? (
          <div className={styles.positionCardInfo}>
            <span className={styles.positionCardName}>{card.name}</span>
            <span className={styles.positionCardHp}>{card.currentHp} HP</span>
          </div>
        ) : (
          <div className={styles.positionEmpty}>Vide</div>
        )}
      </div>

      {/* Card selection menu */}
      {showMenu && (
        <div className={styles.positionMenu}>
          {availableCards.map((availableCard) => (
            <button
              key={availableCard.id}
              className={styles.positionMenuItem}
              onClick={() => handleCardSelect(availableCard.id)}
            >
              {availableCard.name} ({availableCard.currentHp} HP)
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
