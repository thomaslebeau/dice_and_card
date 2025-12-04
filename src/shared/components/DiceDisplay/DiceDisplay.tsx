import React from 'react';
import type { DiceDisplayProps } from '@/types/combat.types';
import styles from './DiceDisplay.module.scss';

/**
 * Dice display component showing attack and defense rolls
 */
export const DiceDisplay: React.FC<DiceDisplayProps> = ({ results, diceKey }) => {
  return (
    <div className={styles.diceDisplay} key={diceKey}>
      <div className={styles.diceContainer}>
        <div className={styles.diceLabel}>🎮 JOUEUR</div>
        <div className={styles.diceGroup}>
          <div className={styles.diceContainer}>
            <div className={styles.diceLabel}>🗡️ Attaque</div>
            <div className={`${styles.dice} ${styles.playerDice}`}>
              {results.playerAttack}
            </div>
          </div>
          <div className={styles.diceContainer}>
            <div className={styles.diceLabel}>🛡️ Défense</div>
            <div className={`${styles.dice} ${styles.playerDice}`}>
              {results.playerDefense}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.diceContainer}>
        <div className={styles.diceLabel}>🤖 ENNEMI</div>
        <div className={styles.diceGroup}>
          <div className={styles.diceContainer}>
            <div className={styles.diceLabel}>🗡️ Attaque</div>
            <div className={`${styles.dice} ${styles.enemyDice}`}>
              {results.enemyAttack}
            </div>
          </div>
          <div className={styles.diceContainer}>
            <div className={styles.diceLabel}>🛡️ Défense</div>
            <div className={`${styles.dice} ${styles.enemyDice}`}>
              {results.enemyDefense}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
