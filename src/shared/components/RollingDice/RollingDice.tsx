import React, { useState, useEffect, useRef } from 'react';
import styles from './RollingDice.module.scss';

interface RollingDiceProps {
  finalValue: number;
  isPlayer: boolean;
  diceKey: string | number;
}

// Configuration de l'animation
const ROLL_CONFIG = {
  totalDuration: 2000, // Durée totale en ms
  startSpeed: 50, // Vitesse initiale
  slowPoint1: 0.5, // Quand ralentir (50%)
  slowSpeed1: 100, // Nouvelle vitesse
  slowPoint2: 0.7, // Deuxième ralentissement (70%)
  slowSpeed2: 150, // Vitesse finale
  stopPoint: 0.95, // Quand s'arrêter (95%)
};

/**
 * Rolling dice component with slot machine effect
 * Numbers scroll from 1-6 with progressive slowdown
 */
export const RollingDice: React.FC<RollingDiceProps> = ({
  finalValue,
  isPlayer,
  diceKey,
}) => {
  const [currentValue, setCurrentValue] = useState(1);
  const [isRolling, setIsRolling] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<number | null>(null);
  const changeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset on new roll
    startTimeRef.current = Date.now();
    setIsRolling(true);
    setCurrentValue(1);

    const rollInterval = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = elapsed / ROLL_CONFIG.totalDuration;

      // Stop rolling at 95%
      if (progress >= ROLL_CONFIG.stopPoint) {
        setCurrentValue(finalValue);
        setIsRolling(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      // Change to random value
      setIsChanging(true);
      setCurrentValue(Math.floor(Math.random() * 6) + 1);

      // Reset changing state after micro-animation
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
      changeTimeoutRef.current = setTimeout(() => {
        setIsChanging(false);
      }, 50);

      // Calculate next interval speed based on progress
      let nextSpeed = ROLL_CONFIG.startSpeed;
      if (progress >= ROLL_CONFIG.slowPoint2) {
        nextSpeed = ROLL_CONFIG.slowSpeed2;
      } else if (progress >= ROLL_CONFIG.slowPoint1) {
        nextSpeed = ROLL_CONFIG.slowSpeed1;
      }

      // Clear current interval and set new one with updated speed
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setTimeout(rollInterval, nextSpeed);
    };

    // Start rolling
    intervalRef.current = setTimeout(rollInterval, ROLL_CONFIG.startSpeed);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
    };
  }, [diceKey, finalValue]);

  const diceClass = `${styles.dice} ${
    isPlayer ? styles.playerDice : styles.enemyDice
  } ${isRolling ? styles.rolling : styles.stopped}`;

  const numberClass = `${styles.diceNumber} ${isChanging ? styles.changing : ''}`;

  return (
    <div className={diceClass}>
      <span className={numberClass}>{currentValue}</span>
    </div>
  );
};
