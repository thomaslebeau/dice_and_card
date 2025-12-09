import type { Card } from '@/types/card.types';

/**
 * Mark a card as dead (immutable operation)
 * @param card - The card to mark as dead
 * @returns A new card instance with isDead set to true
 */
export const markCardAsDead = (card: Card): Card => {
  return {
    ...card,
    isDead: true,
  };
};

/**
 * Mark a card in a deck as dead by its ID (immutable operation)
 * @param deck - The current deck
 * @param cardId - The ID of the card to mark as dead
 * @returns A new deck with the specified card marked as dead
 */
export const markCardAsDeadInDeck = (deck: Card[], cardId: number): Card[] => {
  return deck.map((card) => (card.id === cardId ? markCardAsDead(card) : card));
};

/**
 * Filter out dead cards from a deck
 * @param deck - The deck to filter
 * @returns An array of only alive cards
 */
export const filterAliveCards = (deck: Card[]): Card[] => {
  return deck.filter((card) => !card.isDead);
};

/**
 * Filter out alive cards, returning only dead cards
 * @param deck - The deck to filter
 * @returns An array of only dead cards
 */
export const filterDeadCards = (deck: Card[]): Card[] => {
  return deck.filter((card) => card.isDead === true);
};

/**
 * Check if a card is alive (not dead)
 * @param card - The card to check
 * @returns True if the card is alive
 */
export const isCardAlive = (card: Card): boolean => {
  return !card.isDead;
};

/**
 * Get the count of alive cards in a deck
 * @param deck - The deck to count from
 * @returns The number of alive cards
 */
export const getAliveCardsCount = (deck: Card[]): number => {
  return filterAliveCards(deck).length;
};

/**
 * Get the count of dead cards in a deck
 * @param deck - The deck to count from
 * @returns The number of dead cards
 */
export const getDeadCardsCount = (deck: Card[]): number => {
  return filterDeadCards(deck).length;
};

/**
 * Check if a card should be marked as dead (HP <= 0)
 * @param card - The card to check
 * @returns True if the card should be marked as dead
 */
export const shouldCardDie = (card: Card): boolean => {
  return card.currentHp <= 0;
};

/**
 * Mark a card as dead if it should die (HP <= 0)
 * @param card - The card to check and potentially mark as dead
 * @returns The card with isDead set to true if HP <= 0, otherwise unchanged
 */
export const markCardAsDeadIfNeeded = (card: Card): Card => {
  if (shouldCardDie(card)) {
    return markCardAsDead(card);
  }
  return card;
};
