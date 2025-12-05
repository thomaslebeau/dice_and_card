import type { GameState } from '@enums/GameState.enum';
import type { Card, EnemyCard } from '@/types/card.types';

/**
 * Main game state structure
 */
export interface GameStateData {
  gameState: GameState;
  currentCombat: number;
  playerCard: Card | null;
  enemyCard: EnemyCard | null;
}
