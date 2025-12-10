import React from "react";
import { useFocusable } from "@/external_lib";
import styles from "./GameOverScreen.module.scss";

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
  const menuButton = useFocusable({
    id: "gameover-menu-button",
    onActivate: onBackToMenu,
    autoFocus: true,
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>
        {victory ? "🎉 VICTOIRE TOTALE ! 🎉" : "💀 DÉFAITE... 💀"}
      </h2>

      <p className={styles.description}>
        {victory
          ? `Félicitations ! Vous avez vaincu tous les ennemis en ${combatNumber} combats !`
          : `Vous avez été vaincu au combat ${combatNumber}...`}
      </p>

      <button
        {...menuButton.focusProps}
        className={`${styles.menuButton} ${
          menuButton.isFocused ? styles.focused : ""
        }`}
      >
        ↩️ Retour au Menu
      </button>
    </div>
  );
};
