import React from 'react';
import type { DiceDisplayProps } from '@/types/combat.types';
import { RollingDice } from '../RollingDice/RollingDice';
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
            <RollingDice
              finalValue={results.playerAttack}
              isPlayer={true}
              diceKey={`player-attack-${diceKey}`}
            />
          </div>
          <div className={styles.diceContainer}>
            <div className={styles.diceLabel}>🛡️ Défense</div>
            <RollingDice
              finalValue={results.playerDefense}
              isPlayer={true}
              diceKey={`player-defense-${diceKey}`}
            />
          </div>
        </div>
      </div>

      <div className={styles.diceContainer}>
        <div className={styles.diceLabel}>🤖 ENNEMI</div>
        <div className={styles.diceGroup}>
          <div className={styles.diceContainer}>
            <div className={styles.diceLabel}>🗡️ Attaque</div>
            <RollingDice
              finalValue={results.enemyAttack}
              isPlayer={false}
              diceKey={`enemy-attack-${diceKey}`}
            />
          </div>
          <div className={styles.diceContainer}>
            <div className={styles.diceLabel}>🛡️ Défense</div>
            <RollingDice
              finalValue={results.enemyDefense}
              isPlayer={false}
              diceKey={`enemy-defense-${diceKey}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
