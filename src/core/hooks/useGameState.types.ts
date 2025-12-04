import type { GameState } from '@enums/GameState.enum';
import type { Card, EnemyCard } from '@/types/card.types';
import type { CombatEndResult } from '@/types/combat.types';

/**
 * Return type for useGameState hook
 */
export interface UseGameStateReturn {
  gameState: GameState;
  currentCombat: number;
  playerCard: Card | null;
  enemyCard: EnemyCard | null;
  playerDeck: Card[];
  startNewRun: () => void;
  handleCombatEnd: (result: CombatEndResult) => void;
  handleCardSelected: (newCard: Card) => void;
  handleDeckConfirmed: (selectedCards: Card[]) => void;
  handleBackToMenu: () => void;
}
