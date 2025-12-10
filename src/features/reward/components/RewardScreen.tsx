import React, { useState } from "react";
import type { Card } from "@/types/card.types";
import { useFocusable } from "@/external_lib";
import { CARD_DATABASE, RARITY_COLORS } from "@shared/constants/cards";
import { CardDisplay } from "@shared/components/CardDisplay/CardDisplay";
import styles from "./RewardScreen.module.scss";

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
        {rewardCards.map((card, index) => (
          <RewardCard
            key={card.id}
            card={card}
            onSelect={() => onCardSelected(card)}
            autoFocus={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

// ← NOUVEAU : Composant séparé
interface RewardCardProps {
  card: Card;
  onSelect: () => void;
  autoFocus?: boolean;
}

const RewardCard: React.FC<RewardCardProps> = ({
  card,
  onSelect,
  autoFocus,
}) => {
  const cardFocus = useFocusable({
    id: `reward-card-${card.id}`,
    group: "rewards",
    onActivate: onSelect,
    autoFocus,
  });

  const rarityColor = RARITY_COLORS[card.rarity];

  return (
    <div
      {...cardFocus.focusProps}
      className={`${styles.rewardCard} ${
        cardFocus.isFocused ? styles.focused : ""
      }`}
      style={{ borderColor: rarityColor }}
      aria-label={`${card.name} - ${card.description}`}
    >
      <CardDisplay card={card} />
    </div>
  );
};
