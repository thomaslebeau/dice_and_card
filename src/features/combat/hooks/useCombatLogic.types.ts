import type { Card, EnemyCard } from '@/types/card.types';
import type { DiceResults, CombatCalculation, CombatEndResult } from '@/types/combat.types';

/**
 * Props for useCombatLogic hook
 */
export interface UseCombatLogicProps {
  playerCard: Card;
  enemyCard: EnemyCard;
  onCombatEnd: (result: CombatEndResult) => void;
}

/**
 * Return type for useCombatLogic hook
 */
export interface UseCombatLogicReturn {
  roundNumber: number;
  diceKey: number;
  diceResults: DiceResults;
  showResults: boolean;
  roundResolved: boolean;
  combatFinished: boolean;
  currentPlayerCard: Card;
  currentEnemyCard: EnemyCard;
  combatResult: CombatCalculation | null;
  handleNextRound: () => void;
}
