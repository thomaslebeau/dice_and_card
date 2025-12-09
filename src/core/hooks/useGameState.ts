import { useState } from 'react';
import type { UseGameStateReturn } from './useGameState.types';
import type { Card } from '@/types/card.types';
import type { CombatEndResult } from '@/types/combat.types';
import { GameState } from '@enums/GameState.enum';
import { MAX_COMBATS } from '@shared/constants/cards';
import { generateEnemy } from '@shared/utils/enemyGenerator';
import { useAliveCards } from '@/shared/hooks/useAliveCards';
import {
  markCardAsDeadInDeck,
  markCardAsDeadIfNeeded,
} from '@/shared/utils/cardDeathUtils';

/**
 * Central game state management hook
 */
export const useGameState = (): UseGameStateReturn => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentCombat, setCurrentCombat] = useState(1);
  const [playerCard, setPlayerCard] = useState<Card | null>(null);
  const [enemyCard, setEnemyCard] = useState<ReturnType<typeof generateEnemy> | null>(null);
  const [playerDeck, setPlayerDeck] = useState<Card[]>([]);

  // Use the alive cards hook to get card statistics
  const { aliveCards, deadCards, aliveCardsCount, deadCardsCount } = useAliveCards(playerDeck);

  /**
   * Start a new run
   * Transition: MENU → DECK_SELECTION
   */
  const startNewRun = () => {
    console.log('Starting new run...');

    // Reset states
    setPlayerDeck([]);
    setPlayerCard(null);
    setEnemyCard(null);
    setCurrentCombat(0);

    // Go to deck selection
    setGameState(GameState.DECK_SELECTION);
  };

  /**
   * Handler for deck confirmation (5 cards)
   * Transition: DECK_SELECTION → COMBAT
   */
  const handleDeckConfirmed = (selectedCards: Card[]) => {
    console.log('Deck confirmed:', selectedCards);

    // Store the deck
    setPlayerDeck(selectedCards);

    // The first card of the deck becomes the active card
    setPlayerCard(selectedCards[0]);

    // Start the first combat
    setCurrentCombat(1);
    startCombat(selectedCards[0], 1);
  };

  const startCombat = (_pCard: Card, combatNum: number) => {
    const enemy = generateEnemy(combatNum);
    setEnemyCard(enemy);
    setGameState(GameState.COMBAT);
  };

  const handleCombatEnd = ({ victory, playerCard: updatedPlayerCard }: CombatEndResult) => {
    // Check if the player card should be marked as dead
    const finalPlayerCard = markCardAsDeadIfNeeded(updatedPlayerCard);
    setPlayerCard(finalPlayerCard);

    // Update the deck with the potentially dead card
    if (finalPlayerCard.isDead) {
      setPlayerDeck((prevDeck) => markCardAsDeadInDeck(prevDeck, finalPlayerCard.id));
    }

    if (!victory) {
      setGameState(GameState.GAMEOVER);
      return;
    }

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

  /**
   * Mark a card as dead in the player deck
   * @param cardId - The ID of the card to mark as dead
   */
  const markCardAsDead = (cardId: number) => {
    setPlayerDeck((prevDeck) => markCardAsDeadInDeck(prevDeck, cardId));
  };

  return {
    gameState,
    currentCombat,
    playerCard,
    enemyCard,
    playerDeck,
    aliveCards,
    deadCards,
    aliveCardsCount,
    deadCardsCount,
    startNewRun,
    handleDeckConfirmed,
    handleCombatEnd,
    handleCardSelected,
    handleBackToMenu,
    markCardAsDead,
  };
};
