import React from "react";
import { useGamepadNavigation } from "gaming-ui-a11y-toolkit";
import "gaming-ui-a11y-toolkit/style.css";

import { GameState } from "@enums/GameState.enum";
import { MAX_COMBATS } from "@shared/constants/cards";
import { useGameState } from "@core/hooks/useGameState";

import { MainMenu } from "@features/menu/components/MainMenu";
import { CombatScreen } from "@features/combat/components/CombatScreen";
import { RewardScreen } from "@features/reward/components/RewardScreen";
import { GameOverScreen } from "@features/gameOver/components/GameOverScreen";

import "@styles/globals.scss";
import styles from "./App.module.scss";

/**
 * Main application component
 * Manages routing between game screens based on game state
 */
const App: React.FC = () => {
  const {
    gameState,
    currentCombat,
    playerCard,
    enemyCard,
    startNewRun,
    handleCombatEnd,
    handleCardSelected,
    handleBackToMenu,
  } = useGameState();

  const { isGamepadConnected } = useGamepadNavigation({
    itemCount: 0,
  });

  return (
    <div className={styles.gameScreen}>
      <h1 className={styles.title}>Dice and Card</h1>

      {isGamepadConnected && (
        <p className={styles.gamepadStatus}>🎮 Manette connectée et prête !</p>
      )}

      {gameState === GameState.MENU && <MainMenu startNewRun={startNewRun} />}

      {gameState === GameState.COMBAT && playerCard && enemyCard && (
        <CombatScreen
          playerCard={playerCard}
          enemyCard={enemyCard}
          onCombatEnd={handleCombatEnd}
          combatNumber={currentCombat}
        />
      )}

      {gameState === GameState.REWARD && (
        <RewardScreen
          onCardSelected={handleCardSelected}
          combatNumber={currentCombat}
        />
      )}

      {gameState === GameState.GAMEOVER && (
        <GameOverScreen
          victory={currentCombat > MAX_COMBATS}
          combatNumber={currentCombat}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
};

export default App;
