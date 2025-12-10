import { useState, useCallback, useEffect, useMemo } from 'react';
import type { Card } from '@/types/card.types';
import type { UseDeckManagementReturn } from '../types/deckManagement.types';
import { CARD_DATABASE } from '@shared/constants/cards';

interface UseDeckManagementProps {
  currentDeck: Card[];
  onDeckConfirmed: (updatedDeck: Card[]) => void;
}

export const useDeckManagement = ({
  currentDeck,
  onDeckConfirmed,
}: UseDeckManagementProps): UseDeckManagementReturn => {
  // Generate 3 random reward cards (with full HP) once on mount
  const [rewardCards] = useState<Card[]>(() => {
    const shuffled = [...CARD_DATABASE].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((card) => ({
      ...card,
      currentHp: card.maxHp, // Full HP
    }));
  });

  const [selectedRewardCard, setSelectedRewardCard] = useState<Card | null>(null);
  const [cardToReplace, setCardToReplace] = useState<Card | null>(null);
  const [pendingPositions, setPendingPositions] = useState<Map<number, number>>(new Map());

  // Calculate if we need replacement (5 alive cards)
  const aliveCards = useMemo(() => currentDeck.filter((c) => !c.isDead), [currentDeck]);
  const needsReplacement = aliveCards.length >= 5;

  /**
   * Select a reward card
   */
  const selectRewardCard = useCallback((card: Card) => {
    setSelectedRewardCard(card);
  }, []);

  /**
   * Select a card to replace
   */
  const selectCardToReplace = useCallback((card: Card) => {
    setCardToReplace(card);
  }, []);

  /**
   * Assign a position to a card
   * If position is already taken, swap cards
   */
  const assignPosition = useCallback(
    (cardId: number, newPosition: number) => {
      setPendingPositions((prev) => {
        const newPositions = new Map(prev);

        // Find old position of this card
        const oldPosition = newPositions.get(cardId);

        // Find if another card is at the target position
        let cardAtTarget: number | null = null;
        for (const [cId, pos] of newPositions.entries()) {
          if (pos === newPosition && cId !== cardId) {
            cardAtTarget = cId;
            break;
          }
        }

        // Swap if collision
        if (cardAtTarget !== null && oldPosition !== undefined) {
          newPositions.set(cardAtTarget, oldPosition);
        }

        // Assign new position
        newPositions.set(cardId, newPosition);
        return newPositions;
      });
    },
    []
  );

  /**
   * Get card at a specific position
   */
  const getCardAtPosition = useCallback(
    (position: number): Card | null => {
      for (const [cardId, pos] of pendingPositions.entries()) {
        if (pos === position) {
          // Find in current deck
          const card = currentDeck.find((c) => c.id === cardId);
          if (card) return card;

          // Or in selected reward
          if (selectedRewardCard && selectedRewardCard.id === cardId) {
            return selectedRewardCard;
          }
        }
      }
      return null;
    },
    [pendingPositions, currentDeck, selectedRewardCard]
  );

  /**
   * Check if a position is taken
   */
  const isPositionTaken = useCallback(
    (position: number): boolean => {
      return Array.from(pendingPositions.values()).includes(position);
    },
    [pendingPositions]
  );

  /**
   * Auto-fill positions when reward is selected
   */
  useEffect(() => {
    if (!selectedRewardCard) return;

    const newPositions = new Map<number, number>();

    if (needsReplacement && cardToReplace) {
      // Scenario: 5 cards, replace one
      // Keep all positions, swap new card at replaced card's position
      currentDeck.forEach((card) => {
        if (card.id === cardToReplace.id) {
          // Assign new card to this position
          if (card.position) {
            newPositions.set(selectedRewardCard.id, card.position);
          }
        } else if (!card.isDead && card.position) {
          // Keep existing position for alive cards
          newPositions.set(card.id, card.position);
        }
      });
    } else {
      // Scenario: < 5 cards, add new card
      // Keep existing positions, assign new card to next available position
      const usedPositions: number[] = [];

      currentDeck.forEach((card) => {
        if (!card.isDead && card.position) {
          newPositions.set(card.id, card.position);
          usedPositions.push(card.position);
        }
      });

      // Find next available position
      for (let pos = 1; pos <= 5; pos++) {
        if (!usedPositions.includes(pos)) {
          newPositions.set(selectedRewardCard.id, pos);
          break;
        }
      }
    }

    setPendingPositions(newPositions);
  }, [selectedRewardCard, cardToReplace, currentDeck, needsReplacement]);

  /**
   * Check if ready to confirm
   */
  const isReadyToConfirm = useMemo(() => {
    // Must have selected a reward
    if (!selectedRewardCard) return false;

    // If needs replacement, must have selected a card to replace
    if (needsReplacement && !cardToReplace) return false;

    // All alive cards (including new one) must have positions assigned
    const expectedCardCount = needsReplacement
      ? aliveCards.length // Same count (replace)
      : aliveCards.length + 1; // +1 (add)

    const assignedCount = pendingPositions.size;

    return assignedCount === expectedCardCount;
  }, [selectedRewardCard, needsReplacement, cardToReplace, aliveCards.length, pendingPositions.size]);

  /**
   * Confirm deck management
   */
  const confirmDeckManagement = useCallback(() => {
    if (!isReadyToConfirm || !selectedRewardCard) return;

    // Build updated deck
    let updatedDeck: Card[];

    if (needsReplacement && cardToReplace) {
      // Replace scenario
      updatedDeck = currentDeck.map((card) =>
        card.id === cardToReplace.id ? { ...selectedRewardCard, currentHp: selectedRewardCard.maxHp } : card
      );
    } else {
      // Add scenario
      updatedDeck = [...currentDeck, { ...selectedRewardCard, currentHp: selectedRewardCard.maxHp }];
    }

    // Assign positions from pendingPositions
    updatedDeck = updatedDeck.map((card) => {
      const position = pendingPositions.get(card.id);
      return position ? { ...card, position } : card;
    });

    onDeckConfirmed(updatedDeck);
  }, [
    isReadyToConfirm,
    selectedRewardCard,
    needsReplacement,
    cardToReplace,
    currentDeck,
    pendingPositions,
    onDeckConfirmed,
  ]);

  return {
    rewardCards,
    selectedRewardCard,
    cardToReplace,
    pendingPositions,
    isReadyToConfirm,
    needsReplacement,
    selectRewardCard,
    selectCardToReplace,
    assignPosition,
    getCardAtPosition,
    isPositionTaken,
    confirmDeckManagement,
  };
};
