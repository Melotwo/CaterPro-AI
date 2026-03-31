import { useState } from 'react';
import { Plus, Trash2, Calculator, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ingredient, MenuItem } from '@/types/menu';
import { calculatePlateCost, calculateFoodCostPercentage, calculateContributionMargin, createId } from '@/lib/menu-engine';

interface Props {
  onAddItem: (item: MenuItem) => void;
}

const PlateCostCalculator = ({ onAddItem }: Props) => {
  const [dishName, setDishName] = useState('');
  const [category, setCategory] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [popularity, setPopularity] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: createId(), name: '', cost: 0, quantity: 1, unit: 'ea' },
  ]);

  const addIngredient = () => {
    setIngredients([...ingredients, { id: createId(), name: '', cost: 0, quantity: 1, unit: 'ea' }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(i => i.id !== id));
    }
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map(i => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const plateCost = calculatePlateCost(ingredients);
  const price = parseFloat(menuPrice) || 0;
  const foodCostPct = calculateFoodCostPercentage(plateCost, price);
  const cm = calculateContributionMargin(price, plateCost);

  const handleSubmit = () => {
    if (!dishName || price === 0) return;
    const item: MenuItem = {
      id: createId(),
      name: dishName,
      category: category || 'Uncategorized',
      ingredients,
      plateCost,
      menuPrice: price,
      popularity: parseInt(popularity) || 0,
      foodCostPercentage: foodCostPct,
      contributionMargin: cm,
      quadrant: 'dog', 
    };
    onAddItem(item);
    setDishName('');
    setCategory('');
    setMenuPrice('');
    setPopularity('');
    setIngredients([{ id: createId(), name: '', cost: 0, quantity: 1, unit: 'ea' }]);
  };

  return (
    <div className="glass rounded-xl p-6 glow-emerald border border-emerald/20">
      <div className="mb-6 flex items-center gap-3">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Plate Cost Calculator (ZAR)</h2>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wider">Dish Name</label>
          <Input value={dishName} onChange={e => setDishName(e.target.value)} placeholder="e.g. Biltong Risotto" className="bg-secondary/50 border-border text-foreground" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
          <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Mains" className="bg-secondary/50 border-border text-foreground" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wider">Menu Price (R)</label>
          <Input type="number" value={menuPrice} onChange={e => setMenuPrice(e.target.value)} placeholder="150.00" className="bg-secondary/50 border-border text-foreground" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wider">Units Sold / Month</label>
          <Input type="number" value={popularity} onChange={e => setPopularity(e.target.value)} placeholder="120" className="bg-secondary/50 border-border text-foreground" />
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 grid grid-cols-[1fr_100px_80px_70px_40px] gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <span>Ingredient</span>
          <span>Cost (R)</span>
          <span>Qty</span>
          <span>Unit</span>
          <span></span>
        </div>
        <AnimatePresence>
          {ingredients.map(ing => (
            <motion.div
              key={ing.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-2 grid grid-cols-[1fr_100px_80px_70px_40px] gap-2"
            >
              <Input value={ing.name} onChange={e => updateIngredient(ing.id, 'name', e.target.value)} placeholder="Ingredient name" className="bg-secondary/30 border-border text-sm text-foreground" />
              <Input type="number" step="0.01" value={ing.cost || ''} onChange={e => updateIngredient(ing.id, 'cost', parseFloat(e.target.value) || 0)} className="bg-secondary/30 border-border text-sm text-foreground" />
              <Input type="number" step="0.1" value={ing.quantity || ''} onChange={e => updateIngredient(ing.id, 'quantity', parseFloat(e.target.value) || 0)} className="bg-secondary/30 border-border text-sm text-foreground" />
              <Input value={ing.unit} onChange={e => updateIngredient(ing.id, 'unit', e.target.value)} className="bg-secondary/30 border-border text-sm text-foreground" />
              <button onClick={() => removeIngredient(ing.id)} className="flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <Button variant="ghost" size="sm" onClick={addIngredient} className="mt-1 text-primary hover:text-emerald-glow hover:bg-primary/10">
          <Plus className="mr-1 h-4 w-4" /> Add Ingredient
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-6 rounded-lg bg-emerald/5 border border-emerald/10 p-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Coins className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Plate Cost</p>
            <p className="text-xl font-bold text-foreground font-mono">R{plateCost.toFixed(2)}</p>
          </div>
        </div>
        <div className="h-10 w-px bg-border/50 hidden sm:block" />
        <div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Food Cost %</p>
          <p className={`text-xl font-bold font-mono ${foodCostPct > 35 ? 'text-destructive' : 'text-primary'}`}>
            {foodCostPct.toFixed(1)}%
          </p>
        </div>
        <div className="h-10 w-px bg-border/50 hidden sm:block" />
        <div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Contribution Margin</p>
          <p className="text-xl font-bold text-primary font-mono">R{cm.toFixed(2)}</p>
        </div>
        <div className="ml-auto w-full sm:w-auto">
          <Button onClick={handleSubmit} disabled={!dishName || price === 0} className="w-full bg-primary text-primary-foreground hover:bg-emerald-glow font-bold shadow-lg shadow-emerald/20">
            ADD TO MATRIX
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlateCostCalculator;
