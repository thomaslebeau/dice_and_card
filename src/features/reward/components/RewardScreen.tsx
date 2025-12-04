import React, { useState } from 'react';
import type { Card } from '@/types/card.types';
import { CARD_DATABASE, RARITY_COLORS } from '@shared/constants/cards';
import { CardDisplay } from '@shared/components/CardDisplay/CardDisplay';
import styles from './RewardScreen.module.scss';

interface RewardScreenProps {
  onCardSelected: (card: Card) => void;
  combatNumber: number;
}

/**
 * Reward screen showing card choices after combat victory
 */
export const RewardScreen: React.FC<RewardScreenProps> = ({
  onCardSelected,
  combatNumber,
}) => {
  const [rewardCards] = useState<Card[]>(() => {
    const shuffled = [...CARD_DATABASE].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((card) => ({
      ...card,
      currentHp: card.maxHp,
    }));
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>🎉 Victoire ! 🎉</h2>
      <p className={styles.description}>
        Combat {combatNumber} terminé. Choisissez une nouvelle carte :
      </p>

      <div className={styles.rewardCards}>
        {rewardCards.map((card) => (
          <div
            key={card.id}
            className={styles.rewardCard}
            onClick={() => onCardSelected(card)}
            style={{ borderColor: RARITY_COLORS[card.rarity] }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCardSelected(card);
              }
            }}
          >
            <CardDisplay card={card} />
          </div>
        ))}
      </div>
    </div>
  );
};
