import React, { useEffect, useRef } from "react";
import type { Card, EnemyCard } from "@/types/card.types";
import type { CombatEndResult } from "@/types/combat.types";
import { CardDisplay } from "@shared/components/CardDisplay/CardDisplay";
import { DiceDisplay } from "@shared/components/DiceDisplay/DiceDisplay";
import { useCombatLogic } from "../hooks/useCombatLogic";
import styles from "./CombatScreen.module.scss";
import { GameButton, useGamepadNavigation } from "gaming-ui-a11y-toolkit";

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

  const nextRoundButtonRef = useRef<HTMLButtonElement>(null);

  useGamepadNavigation({
    itemCount: 1,
    onActivate: () => {
      if (roundResolved && !combatFinished) {
        handleNextRound();
      }
    },
    enableHapticFeedback: true,
  });

  useEffect(() => {
    if (roundResolved && !combatFinished && nextRoundButtonRef.current) {
      // Petit délai pour laisser l'animation se finir
      const timer = setTimeout(() => {
        nextRoundButtonRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [roundResolved, combatFinished]);

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
            <div className={styles.buttonContainer}>
              <GameButton
                ref={nextRoundButtonRef}
                label="⚔️ Round Suivant"
                onClick={handleNextRound}
                variant="primary"
                size="large"
                enableHapticFeedback={true}
                className={styles.nextRoundButton}
              />
            </div>
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
