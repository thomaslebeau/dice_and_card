import { useMemo } from 'react';
import type { Card } from '@/types/card.types';
import {
  filterAliveCards,
  filterDeadCards,
  getAliveCardsCount,
  getDeadCardsCount,
} from '@/shared/utils/cardDeathUtils';

export interface UseAliveCardsReturn {
  aliveCards: Card[];
  deadCards: Card[];
  aliveCardsCount: number;
  deadCardsCount: number;
  totalCards: number;
  hasAliveCards: boolean;
  hasDeadCards: boolean;
}

/**
 * Hook to get alive and dead cards from a deck
 * @param deck - The deck to analyze
 * @returns Object containing alive cards, dead cards, and counts
 */
export const useAliveCards = (deck: Card[]): UseAliveCardsReturn => {
  const aliveCards = useMemo(() => filterAliveCards(deck), [deck]);
  const deadCards = useMemo(() => filterDeadCards(deck), [deck]);
  const aliveCardsCount = useMemo(() => getAliveCardsCount(deck), [deck]);
  const deadCardsCount = useMemo(() => getDeadCardsCount(deck), [deck]);

  return {
    aliveCards,
    deadCards,
    aliveCardsCount,
    deadCardsCount,
    totalCards: deck.length,
    hasAliveCards: aliveCardsCount > 0,
    hasDeadCards: deadCardsCount > 0,
  };
};
