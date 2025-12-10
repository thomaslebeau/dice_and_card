import type { Card } from '@/types/card.types';

/**
 * Deck management state
 */
export interface DeckManagementState {
  rewardCards: Card[]; // 3 reward cards (full HP)
  selectedRewardCard: Card | null; // Selected reward
  cardToReplace: Card | null; // Card from deck to replace (if 5 alive cards)
  pendingPositions: Map<number, number>; // cardId -> position (1-5)
  isReadyToConfirm: boolean; // All steps complete
}

/**
 * DeckManagementScreen props
 */
export interface DeckManagementScreenProps {
  currentDeck: Card[]; // Current player deck (up to 5 cards)
  onDeckConfirmed: (updatedDeck: Card[]) => void; // Callback when confirmed
  combatNumber: number; // Current combat number
}

/**
 * Hook return type
 */
export interface UseDeckManagementReturn {
  // State
  rewardCards: Card[];
  selectedRewardCard: Card | null;
  cardToReplace: Card | null;
  pendingPositions: Map<number, number>;
  isReadyToConfirm: boolean;
  needsReplacement: boolean; // True if 5 alive cards

  // Actions
  selectRewardCard: (card: Card) => void;
  selectCardToReplace: (card: Card) => void;
  assignPosition: (cardId: number, position: number) => void;
  getCardAtPosition: (position: number) => Card | null;
  isPositionTaken: (position: number) => boolean;
  confirmDeckManagement: () => void;
}
