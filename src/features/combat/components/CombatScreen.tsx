import React, { useEffect, useState } from "react";
import type { Card, EnemyCard } from "@/types/card.types";
import type { CombatEndResult } from "@/types/combat.types";
import { useFocusable } from "@/external_lib";
import { CardDisplay } from "@shared/components/CardDisplay/CardDisplay";
import { DiceDisplay } from "@shared/components/DiceDisplay/DiceDisplay";
import { useCombatLogic } from "../hooks/useCombatLogic";
import styles from "./CombatScreen.module.scss";

interface CombatScreenProps {
  playerDeck: Card[];
  enemyCard: EnemyCard;
  onCombatEnd: (result: CombatEndResult) => void;
  combatNumber: number;
}

/**
 * Combat screen with drag and drop card combat
 */
export const CombatScreen: React.FC<CombatScreenProps> = ({
  playerDeck,
  enemyCard,
  onCombatEnd,
  combatNumber,
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [combatStarted, setCombatStarted] = useState(false);

  // Get alive cards
  const aliveCards = playerDeck.filter(card => !card.isDead);

  // Only initialize combat logic when a card is selected
  const combatLogic = useCombatLogic({
    playerCard: selectedCard || aliveCards[0],
    enemyCard,
    onCombatEnd
  });

  const {
    roundNumber,
    diceKey,
    diceResults,
    showResults,
    roundResolved,
    combatFinished,
    currentPlayerCard,
    currentEnemyCard,
    combatResult,
    handleNextRound,
  } = combatLogic;

  // Bouton "Round Suivant"
  const nextRoundButton = useFocusable({
    id: "combat-next-round",
    onActivate: handleNextRound,
    disabled: !roundResolved || combatFinished,
  });

  // Auto-focus quand le bouton apparaît
  useEffect(() => {
    if (roundResolved && !combatFinished) {
      nextRoundButton.focus();
    }
  }, [roundResolved, combatFinished, nextRoundButton]);

  // Start combat automatically with first alive card if none selected
  useEffect(() => {
    if (!combatStarted && aliveCards.length > 0 && !selectedCard) {
      setSelectedCard(aliveCards[0]);
      setCombatStarted(true);
    }
  }, [combatStarted, aliveCards, selectedCard]);

  // Drag handlers
  const handleDragStart = (card: Card) => {
    if (!card.isDead) {
      setDraggedCard(card);
    }
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setIsDropZoneActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedCard && !combatFinished) {
      setIsDropZoneActive(true);
    }
  };

  const handleDragLeave = () => {
    setIsDropZoneActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(false);

    if (draggedCard && !draggedCard.isDead && !combatFinished && roundResolved) {
      setSelectedCard(draggedCard);
      setCombatStarted(true);
      // Reset for next round with new card
      handleNextRound();
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>
        ⚔️ Combat #{combatNumber} - Round {roundNumber} ⚔️
      </h2>

      {/* Enemy card in the center */}
      <div
        className={`${styles.enemyZone} ${isDropZoneActive ? styles.dropZoneActive : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardDisplay card={currentEnemyCard} isPlayer={false} />
        {isDropZoneActive && (
          <div className={styles.dropIndicator}>
            ⚔️ Déposez votre carte ici pour attaquer !
          </div>
        )}
        {roundResolved && !combatFinished && !isDropZoneActive && (
          <div className={styles.waitingIndicator}>
            👇 Glissez une carte pour continuer le combat
          </div>
        )}
      </div>

      <DiceDisplay results={diceResults} diceKey={diceKey} />

      {showResults && combatResult && (
        <div className={styles.combatResults}>
          <div className={styles.playerResults}>
            <div className={`${styles.playerSection} ${styles.player}`}>
              <h3>🎮 Votre Carte</h3>
              <div className={styles.diceResult}>
                🗡️ Attaque: {diceResults.playerAttack} +{" "}
                {currentPlayerCard.attackMod} = {combatResult.playerAttack}
              </div>
              <div className={styles.diceResult}>
                🛡️ Défense: {diceResults.playerDefense} +{" "}
                {currentPlayerCard.defenseMod} = {combatResult.playerDefense}
              </div>
              <div
                className={styles.damageText}
                style={{
                  color:
                    combatResult.damageToPlayer > 0 ? "#FF6B6B" : "#4ADE80",
                }}
              >
                {combatResult.damageToPlayer > 0
                  ? `💔 -${combatResult.damageToPlayer} HP`
                  : "✅ Aucun dégât"}
              </div>
            </div>

            <div className={`${styles.playerSection} ${styles.ia}`}>
              <h3>🤖 Ennemi</h3>
              <div className={styles.diceResult}>
                🗡️ Attaque: {diceResults.enemyAttack} +{" "}
                {currentEnemyCard.attackMod} = {combatResult.enemyAttack}
              </div>
              <div className={styles.diceResult}>
                🛡️ Défense: {diceResults.enemyDefense} +{" "}
                {currentEnemyCard.defenseMod} = {combatResult.enemyDefense}
              </div>
              <div
                className={styles.damageText}
                style={{
                  color: combatResult.damageToEnemy > 0 ? "#4ADE80" : "#FF6B6B",
                }}
              >
                {combatResult.damageToEnemy > 0
                  ? `💥 -${combatResult.damageToEnemy} HP`
                  : "🛡️ Bloqué"}
              </div>
            </div>
          </div>

          {roundResolved && !combatFinished && (
            <button
              {...nextRoundButton.focusProps}
              className={`${styles.nextRoundButton} ${
                nextRoundButton.isFocused ? styles.focused : ""
              }`}
            >
              ⚔️ Round Suivant
            </button>
          )}

          {combatFinished && (
            <div className={styles.finalResult}>
              {currentEnemyCard.currentHp <= 0
                ? "🎉 VICTOIRE !"
                : "💀 DÉFAITE..."}
            </div>
          )}
        </div>
      )}

      {/* Player deck at the bottom */}
      <div className={styles.playerDeck}>
        {playerDeck.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className={`${styles.deckCard} ${card.isDead ? styles.deadCard : ''} ${draggedCard?.id === card.id ? styles.dragging : ''}`}
            draggable={!card.isDead}
            onDragStart={() => handleDragStart(card)}
            onDragEnd={handleDragEnd}
          >
            <CardDisplay card={card} isPlayer={true} isDead={card.isDead} />
          </div>
        ))}
      </div>
    </div>
  );
};
