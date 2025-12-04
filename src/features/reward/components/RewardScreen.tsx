import React, { useEffect, useRef, useState } from "react";
import type { Card } from "@/types/card.types";
import { useGamepadNavigation } from "gaming-ui-a11y-toolkit";
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

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { selectedIndex } = useGamepadNavigation({
    itemCount: rewardCards.length,
    initialIndex: 0,
    direction: "horizontal",
    onActivate: (index) => {
      // Sélectionner la carte avec le bouton A
      onCardSelected(rewardCards[index]);
    },
    enableHapticFeedback: true,
  });

  useEffect(() => {
    if (cardRefs.current[selectedIndex]) {
      cardRefs.current[selectedIndex]?.focus();
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (cardRefs.current[0]) {
      cardRefs.current[0]?.focus();
    }
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>🎉 Victoire ! 🎉</h2>
      <p className={styles.description}>
        Combat {combatNumber} terminé. Choisissez une nouvelle carte :
      </p>

      <div className={styles.rewardCards}>
        {rewardCards.map((card, index) => {
          const isSelected = index === selectedIndex;

          return (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`${styles.rewardCard} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => onCardSelected(card)}
              style={{
                borderColor: isSelected
                  ? RARITY_COLORS[card.rarity]
                  : "rgba(255, 255, 255, 0.2)",
                borderWidth: isSelected ? "3px" : "2px",
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCardSelected(card);
                }
              }}
              aria-label={`${card.name} - ${card.description}`}
              aria-pressed={isSelected}
            >
              <CardDisplay card={card} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
