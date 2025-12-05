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
  const [playerDeck, setPlayerDeck] = useState<Card[]>([]);

  const startNewRun = () => {
    // Navigate to deck selection instead of starting combat directly
    setGameState(GameState.DECK_SELECTION);
    setCurrentCombat(1);
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

  const handleDeckConfirmed = (selectedCards: Card[]) => {
    setPlayerDeck(selectedCards);
    // First card of the deck becomes the active card for combat
    setPlayerCard(selectedCards[0]);
    startCombat(selectedCards[0], 1);
  };

  const handleBackToMenu = () => {
    setGameState(GameState.MENU);
    setCurrentCombat(1);
    setPlayerCard(null);
    setEnemyCard(null);
    setPlayerDeck([]);
  };

  return {
    gameState,
    currentCombat,
    playerCard,
    enemyCard,
    playerDeck,
    startNewRun,
    handleCombatEnd,
    handleCardSelected,
    handleDeckConfirmed,
    handleBackToMenu,
  };
};
