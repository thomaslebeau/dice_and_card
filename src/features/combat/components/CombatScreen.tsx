import React, { useEffect } from "react";
import type { Card, EnemyCard } from "@/types/card.types";
import type { CombatEndResult } from "@/types/combat.types";
import { useFocusable } from "gaming-ui-a11y-toolkit";
import { CardDisplay } from "@shared/components/CardDisplay/CardDisplay";
import { DiceDisplay } from "@shared/components/DiceDisplay/DiceDisplay";
import { useCombatLogic } from "../hooks/useCombatLogic";
import styles from "./CombatScreen.module.scss";

interface CombatScreenProps {
  playerCard: Card;
  enemyCard: EnemyCard;
  onCombatEnd: (result: CombatEndResult) => void;
  combatNumber: number;
}

/**
 * Combat screen with dice rolling and round-by-round combat
 */
export const CombatScreen: React.FC<CombatScreenProps> = ({
  playerCard,
  enemyCard,
  onCombatEnd,
  combatNumber,
}) => {
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
  } = useCombatLogic({ playerCard, enemyCard, onCombatEnd });

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

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>
        ⚔️ Combat #{combatNumber} - Round {roundNumber} ⚔️
      </h2>

      <div className={styles.cardsContainer}>
        <CardDisplay card={currentPlayerCard} isPlayer={true} />
        <CardDisplay card={currentEnemyCard} isPlayer={false} />
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
    </div>
  );
};
