export interface Ingredient {
  id: string;
  name: string;
  cost: number;
  quantity: number;
  unit: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  ingredients: Ingredient[];
  plateCost: number;
  menuPrice: number;
  popularity: number; // number sold per period
  foodCostPercentage: number;
  contributionMargin: number;
  quadrant: 'star' | 'puzzle' | 'plowhorse' | 'dog';
}

export type Quadrant = 'star' | 'puzzle' | 'plowhorse' | 'dog';

export const QUADRANT_INFO: Record<Quadrant, { label: string; description: string; emoji: string }> = {
  star: { label: 'Stars', description: 'High Profit, High Popularity', emoji: '⭐' },
  puzzle: { label: 'Puzzles', description: 'High Profit, Low Popularity', emoji: '🧩' },
  plowhorse: { label: 'Plow Horses', description: 'Low Profit, High Popularity', emoji: '🐴' },
  dog: { label: 'Dogs', description: 'Low Profit, Low Popularity', emoji: '🐕' },
};
