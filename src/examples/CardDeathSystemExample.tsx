import React from 'react';
import { useGameState } from '@/core/hooks/useGameState';
import { useAliveCards } from '@/shared/hooks/useAliveCards';
import type { Card } from '@/types/card.types';

/**
 * EXAMPLE 1: Using the card death system in a component
 * This example shows how to access and display alive/dead cards from useGameState
 */
export const CardDeathExample1: React.FC = () => {
  const {
    playerDeck,
    aliveCards,
    deadCards,
    aliveCardsCount,
    deadCardsCount,
    markCardAsDead,
  } = useGameState();

  return (
    <div>
      <h2>Card Statistics</h2>
      <p>Total cards: {playerDeck.length}</p>
      <p>Alive cards: {aliveCardsCount}</p>
      <p>Dead cards: {deadCardsCount}</p>

      <h3>Alive Cards</h3>
      <ul>
        {aliveCards.map((card) => (
          <li key={card.id}>
            {card.name} - HP: {card.currentHp}/{card.maxHp}
            <button onClick={() => markCardAsDead(card.id)}>Mark as Dead</button>
          </li>
        ))}
      </ul>

      <h3>Dead Cards</h3>
      <ul>
        {deadCards.map((card) => (
          <li key={card.id} style={{ textDecoration: 'line-through', color: 'gray' }}>
            {card.name} - DEAD
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * EXAMPLE 2: Using useAliveCards hook directly with a custom deck
 * This example shows how to use the useAliveCards hook independently
 */
export const CardDeathExample2: React.FC<{ customDeck: Card[] }> = ({ customDeck }) => {
  const {
    aliveCards,
    deadCards,
    aliveCardsCount,
    deadCardsCount,
    hasAliveCards,
    hasDeadCards,
  } = useAliveCards(customDeck);

  return (
    <div>
      <h2>Custom Deck Analysis</h2>
      {hasAliveCards ? (
        <p>You still have {aliveCardsCount} card(s) ready for battle!</p>
      ) : (
        <p>All your cards are dead. Game Over!</p>
      )}

      {hasDeadCards && <p>{deadCardsCount} card(s) have fallen in battle.</p>}

      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <h3>Available for Combat</h3>
          {aliveCards.map((card) => (
            <div key={card.id}>{card.name}</div>
          ))}
        </div>

        <div>
          <h3>Fallen Heroes</h3>
          {deadCards.map((card) => (
            <div key={card.id} style={{ opacity: 0.5 }}>
              {card.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * EXAMPLE 3: Reward screen - selecting next card (only alive cards)
 * This example shows how to filter alive cards for card selection
 */
export const RewardScreenExample: React.FC = () => {
  const { aliveCards, playerCard, handleCardSelected } = useGameState();

  // Filter out the current card from the alive cards
  const availableCards = aliveCards.filter((card) => card.id !== playerCard?.id);

  if (availableCards.length === 0) {
    return (
      <div>
        <h2>No Available Cards</h2>
        <p>You have no other alive cards to switch to!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Select Your Next Card</h2>
      <p>Choose a card for the next battle:</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {availableCards.map((card) => (
          <button key={card.id} onClick={() => handleCardSelected(card)}>
            <div>
              <h4>{card.name}</h4>
              <p>
                HP: {card.currentHp}/{card.maxHp}
              </p>
              <p>ATK: {card.attackMod > 0 ? '+' : ''}{card.attackMod}</p>
              <p>DEF: {card.defenseMod > 0 ? '+' : ''}{card.defenseMod}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * EXAMPLE 4: Deck overview with death indicators
 * This example shows a visual representation of the entire deck
 */
export const DeckOverviewExample: React.FC = () => {
  const { playerDeck, playerCard } = useGameState();

  return (
    <div>
      <h2>Your Deck</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {playerDeck.map((card) => (
          <div
            key={card.id}
            style={{
              padding: '10px',
              border: '2px solid',
              borderRadius: '8px',
              borderColor: card.isDead ? 'red' : 'green',
              opacity: card.isDead ? 0.5 : 1,
              backgroundColor: card.id === playerCard?.id ? '#f0f0f0' : 'white',
            }}
          >
            <h4>{card.name}</h4>
            {card.id === playerCard?.id && <span>[ACTIVE]</span>}
            {card.isDead ? (
              <div style={{ color: 'red', fontWeight: 'bold' }}>☠️ DEAD</div>
            ) : (
              <div>
                <p>
                  HP: {card.currentHp}/{card.maxHp}
                </p>
                <p>Status: Ready</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * EXAMPLE 5: Manual card death utility usage
 * This shows how to use the utility functions directly
 */
import {
  markCardAsDead,
  markCardAsDeadInDeck,
  filterAliveCards,
  isCardAlive,
  shouldCardDie,
} from '@/shared/utils/cardDeathUtils';

export const manualCardDeathExample = () => {
  // Example card
  const card: Card = {
    id: 1,
    name: 'Warrior',
    rarity: 'common',
    maxHp: 10,
    currentHp: 0, // Card has died in combat
    attackMod: 2,
    defenseMod: 1,
    description: 'A brave warrior',
  };

  // Check if card should die
  if (shouldCardDie(card)) {
    console.log(`${card.name} has fallen!`);
    const deadCard = markCardAsDead(card);
    console.log('Card marked as dead:', deadCard.isDead); // true
  }

  // Example deck
  const deck: Card[] = [
    { id: 1, name: 'Card 1', currentHp: 5, maxHp: 10, isDead: false } as Card,
    { id: 2, name: 'Card 2', currentHp: 0, maxHp: 10, isDead: true } as Card,
    { id: 3, name: 'Card 3', currentHp: 8, maxHp: 10, isDead: false } as Card,
  ];

  // Mark a specific card as dead
  const updatedDeck = markCardAsDeadInDeck(deck, 1);
  console.log('Updated deck:', updatedDeck);

  // Filter alive cards
  const aliveCards = filterAliveCards(deck);
  console.log('Alive cards:', aliveCards); // Cards with id 1 and 3

  // Check individual card status
  deck.forEach((card) => {
    console.log(`${card.name} is ${isCardAlive(card) ? 'alive' : 'dead'}`);
  });
};
