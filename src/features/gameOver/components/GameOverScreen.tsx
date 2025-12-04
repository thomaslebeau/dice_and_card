import React from 'react';
import { GameMenu } from '@/lib/gaming-ui-a11y-toolkit';
import type { MenuItem } from '@/types/game.types';
import styles from './GameOverScreen.module.scss';

interface GameOverScreenProps {
  victory: boolean;
  combatNumber: number;
  onBackToMenu: () => void;
}

/**
 * Game over screen showing victory or defeat
 */
export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  victory,
  combatNumber,
  onBackToMenu,
}) => {
  const gameActions: MenuItem[] = [
    {
      id: 'menu',
      label: 'Retour au Menu',
      icon: '↩️',
      onSelect: onBackToMenu,
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>{victory ? '🏆 VICTOIRE ! 🏆' : '💀 DÉFAITE 💀'}</h2>
      <p className={styles.description}>
        {victory
          ? `Félicitations ! Vous avez terminé les ${combatNumber} combats !`
          : `Vous avez été vaincu au combat ${combatNumber}.`}
      </p>
      <GameMenu items={gameActions} enableHapticFeedback={true} />
    </div>
  );
};
