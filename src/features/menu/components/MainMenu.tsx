import React from "react";
import { GameMenu } from "gaming-ui-a11y-toolkit";
import type { MenuItem } from "@/types/game.types";
import styles from "./MainMenu.module.scss";

interface MainMenuProps {
  startNewRun: () => void;
}

/**
 * Main menu screen with gaming-ui-a11y-toolkit integration
 */
export const MainMenu: React.FC<MainMenuProps> = ({ startNewRun }) => {
  const menuItems: MenuItem[] = [
    {
      id: "play",
      label: "Commencer une Partie",
      icon: "🎮",
      onSelect: startNewRun,
    },
    {
      id: "quit",
      label: "Quitter le Jeu",
      icon: "🚪",
      onSelect: () => console.log("Fermeture du jeu (Simulé)..."),
    },
  ];

  return (
    <div className={styles.container}>
      <GameMenu
        title="Dices and Cards"
        items={menuItems}
        enableHapticFeedback={true}
      />
      <p className={styles.footer}>Phase 1 MVP - 5 combats pour gagner !</p>
    </div>
  );
};
