import type { Card } from '@/types/card.types';

export interface DeckSelectionScreenProps {
  /**
   * Callback when 5 cards are selected and user confirms
   */
  onDeckConfirmed: (selectedCards: Card[]) => void;

  /**
   * Callback to return to main menu
   */
  onBackToMenu: () => void;
}
