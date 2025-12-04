/**
 * Dice color palette for visual variety
 */
export const DICE_COLORS = [
  '#e63946',
  '#f1faee',
  '#a8dadc',
  '#457b9d',
  '#1d3557',
  '#0077b6',
];

/**
 * Dice face count (standard D6)
 */
export const DICE_FACES = 6;

/**
 * Helper to roll a dice (1-6)
 */
export const rollDice = (): number => Math.floor(Math.random() * DICE_FACES) + 1;
