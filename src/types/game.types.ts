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

/**
 * Menu item structure for gaming-ui-a11y-toolkit
 */
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  onSelect: () => void;
}
