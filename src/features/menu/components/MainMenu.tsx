import React from "react";
import { useFocusable } from "@/external_lib";
import styles from "./MainMenu.module.scss";

interface MainMenuProps {
  startNewRun: () => void;
}

/**
 * Main menu screen with gaming-ui-a11y-toolkit integration
 */
export const MainMenu: React.FC<MainMenuProps> = ({ startNewRun }) => {
  // Bouton Start avec useFocusable
  const startButton = useFocusable({
    id: "menu-start",
    onActivate: startNewRun,
    autoFocus: true, // Focus automatique au chargement
  });

  // Bouton Quit
  const quitButton = useFocusable({
    id: "menu-quit",
    onActivate: () => console.log("Quit game"),
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Menu Principal</h2>

      <div className={styles.menuItems}>
        <button
          {...startButton.focusProps}
          className={`${styles.menuButton} ${
            startButton.isFocused ? styles.focused : ""
          }`}
        >
          🎮 Commencer une Partie
        </button>

        <button
          {...quitButton.focusProps}
          className={`${styles.menuButton} ${
            quitButton.isFocused ? styles.focused : ""
          }`}
        >
          🚪 Quitter le Jeu
        </button>
      </div>

      <p className={styles.footer}>Phase 1 MVP - 5 combats pour gagner !</p>
    </div>
  );
};
