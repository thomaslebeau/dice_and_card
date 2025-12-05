import { useState, useCallback } from 'react';
import type { Card } from '@/types/card.types';
import { CARD_DATABASE } from '@shared/constants/cards';

interface UseDeckSelectionReturn {
  availableCards: Card[];
  selectedCards: Card[];
  toggleCardSelection: (card: Card) => void;
  isCardSelected: (cardId: number) => boolean;
  canStartCombat: boolean;
}

export const useDeckSelection = (): UseDeckSelectionReturn => {
  // Les 5 premières cartes de la database sont disponibles
  const availableCards = CARD_DATABASE.slice(0, 5).map(card => ({
    ...card,
    currentHp: card.maxHp,
  }));

  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  /**
   * Toggle card selection (select/deselect)
   */
  const toggleCardSelection = useCallback((card: Card) => {
    setSelectedCards(prev => {
      const isAlreadySelected = prev.some(c => c.id === card.id);

      if (isAlreadySelected) {
        // Deselect
        return prev.filter(c => c.id !== card.id);
      } else {
        // Select (max 5)
        if (prev.length >= 5) {
          console.log('Maximum 5 cards already selected');
          return prev;
        }
        return [...prev, card];
      }
    });
  }, []);

  /**
   * Check if a card is selected
   */
  const isCardSelected = useCallback(
    (cardId: number): boolean => {
      return selectedCards.some(c => c.id === cardId);
    },
    [selectedCards]
  );

  /**
   * Can start combat only if exactly 5 cards are selected
   */
  const canStartCombat = selectedCards.length === 5;

  return {
    availableCards,
    selectedCards,
    toggleCardSelection,
    isCardSelected,
    canStartCombat,
  };
};
