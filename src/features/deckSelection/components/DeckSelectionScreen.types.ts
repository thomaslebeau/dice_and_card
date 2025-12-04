import type { Card } from '@/types/card.types';

/**
 * Props for DeckSelectionScreen component
 */
export interface DeckSelectionScreenProps {
  onDeckConfirmed: (selectedCards: Card[]) => void;
  onBackToMenu: () => void;
}

/**
 * Return type for useDeckSelection hook
 */
export interface UseDeckSelectionReturn {
  availableCards: Card[];
  selectedCards: Card[];
  toggleCardSelection: (card: Card) => void;
  isCardSelected: (cardId: number) => boolean;
  canStartCombat: boolean;
}
