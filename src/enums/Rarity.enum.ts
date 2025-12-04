/**
 * Card rarity enum using as const pattern (Vite compatible)
 */
export const Rarity = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
} as const;

export type Rarity = typeof Rarity[keyof typeof Rarity];
