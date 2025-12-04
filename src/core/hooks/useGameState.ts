import { useState } from 'react';
import type { UseGameStateReturn } from './useGameState.types';
import type { Card } from '@/types/card.types';
import type { CombatEndResult } from '@/types/combat.types';
import { GameState } from '@enums/GameState.enum';
import { CARD_DATABASE, MAX_COMBATS } from '@shared/constants/cards';
import { generateEnemy } from '@shared/utils/enemyGenerator';

/**
 * Central game state management hook
 */
export const useGameState = (): UseGameStateReturn => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentCombat, setCurrentCombat] = useState(1);
  const [playerCard, setPlayerCard] = useState<Card | null>(null);
  const [enemyCard, setEnemyCard] = useState<ReturnType<typeof generateEnemy> | null>(null);

  const startNewRun = () => {
    const startCard: Card = {
      ...CARD_DATABASE[0],
      currentHp: CARD_DATABASE[0].maxHp,
    };
    setPlayerCard(startCard);
    setCurrentCombat(1);
    startCombat(startCard, 1);
  };

  const startCombat = (_pCard: Card, combatNum: number) => {
    const enemy = generateEnemy(combatNum);
    setEnemyCard(enemy);
    setGameState(GameState.COMBAT);
  };

  const handleCombatEnd = ({ victory, playerCard: updatedPlayerCard }: CombatEndResult) => {
    if (!victory) {
      setGameState(GameState.GAMEOVER);
      return;
    }

    setPlayerCard(updatedPlayerCard);

    if (currentCombat >= MAX_COMBATS) {
      setGameState(GameState.GAMEOVER);
    } else {
      setGameState(GameState.REWARD);
    }
  };

  const handleCardSelected = (newCard: Card) => {
    if (!playerCard) return;

    const updatedCard: Card = {
      ...newCard,
      currentHp: playerCard.currentHp,
    };
    setPlayerCard(updatedCard);

    const nextCombat = currentCombat + 1;
    setCurrentCombat(nextCombat);
    startCombat(updatedCard, nextCombat);
  };

  const handleBackToMenu = () => {
    setGameState(GameState.MENU);
    setCurrentCombat(1);
    setPlayerCard(null);
    setEnemyCard(null);
  };

  return {
    gameState,
    currentCombat,
    playerCard,
    enemyCard,
    startNewRun,
    handleCombatEnd,
    handleCardSelected,
    handleBackToMenu,
  };
};
