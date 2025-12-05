import { useState, useMemo } from 'react';
import type { Card } from '@/types/card.types';
import type { UseDeckSelectionReturn } from '../components/DeckSelectionScreen.types';
import { CARD_DATABASE } from '@shared/constants/cards';

const REQUIRED_DECK_SIZE = 5;
const AVAILABLE_CARDS_COUNT = 5;

/**
 * Hook managing deck selection logic
 */
export const useDeckSelection = (): UseDeckSelectionReturn => {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  // Get first 5 cards from database as available cards
  const availableCards = useMemo<Card[]>(() => {
    return CARD_DATABASE.slice(0, AVAILABLE_CARDS_COUNT).map(cardBase => ({
      ...cardBase,
      currentHp: cardBase.maxHp,
    }));
  }, []);

  /**
   * Toggle card selection
   */
  const toggleCardSelection = (card: Card) => {
    setSelectedCards(prev => {
      const isAlreadySelected = prev.some(c => c.id === card.id);

      if (isAlreadySelected) {
        // Deselect card
        return prev.filter(c => c.id !== card.id);
      } else {
        // Select card only if we haven't reached the limit
        if (prev.length < REQUIRED_DECK_SIZE) {
          return [...prev, card];
        }
        return prev;
      }
    });
  };

  /**
   * Check if a card is selected
   */
  const isCardSelected = (cardId: number): boolean => {
    return selectedCards.some(c => c.id === cardId);
  };

  /**
   * Check if player can start combat (exactly 5 cards selected)
   */
  const canStartCombat = selectedCards.length === REQUIRED_DECK_SIZE;

  return {
    availableCards,
    selectedCards,
    toggleCardSelection,
    isCardSelected,
    canStartCombat,
  };
};
