/**
 * Game state enum using as const pattern (Vite compatible)
 */
export const GameState = {
  MENU: 'menu',
  DECK_SELECTION: 'deck_selection',
  COMBAT: 'combat',
  REWARD: 'reward',
  GAMEOVER: 'gameover',
} as const;

export type GameState = typeof GameState[keyof typeof GameState];
