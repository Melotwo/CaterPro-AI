import { Ingredient, MenuItem, Quadrant } from '@/types/menu';

export function calculatePlateCost(ingredients: Ingredient[]): number {
  return ingredients.reduce((sum, ing) => sum + ing.cost * ing.quantity, 0);
}

export function calculateFoodCostPercentage(plateCost: number, menuPrice: number): number {
  if (menuPrice === 0) return 0;
  return (plateCost / menuPrice) * 100;
}

export function calculateContributionMargin(menuPrice: number, plateCost: number): number {
  return menuPrice - plateCost;
}

export function classifyMenuItem(
  item: MenuItem,
  avgContributionMargin: number,
  avgPopularity: number
): Quadrant {
  const highProfit = item.contributionMargin >= avgContributionMargin;
  const highPopularity = item.popularity >= avgPopularity;

  if (highProfit && highPopularity) return 'star';
  if (highProfit && !highPopularity) return 'puzzle';
  if (!highProfit && highPopularity) return 'plowhorse';
  return 'dog';
}

export function classifyAllItems(items: MenuItem[]): MenuItem[] {
  if (items.length === 0) return items;

  const avgCM = items.reduce((s, i) => s + i.contributionMargin, 0) / items.length;
  const avgPop = items.reduce((s, i) => s + i.popularity, 0) / items.length;

  return items.map(item => ({
    ...item,
    quadrant: classifyMenuItem(item, avgCM, avgPop),
  }));
}

export function createId(): string {
  return crypto.randomUUID();
}
