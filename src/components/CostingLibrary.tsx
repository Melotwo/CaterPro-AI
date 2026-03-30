import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface IngredientCost {
  id?: string;
  name: string;
  unit: string;
  price: number;
  lastUpdated: number;
}

const CostingLibrary: React.FC = () => {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<IngredientCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newIngredient, setNewIngredient] = useState<IngredientCost>({
    name: '',
    unit: 'kg',
    price: 0,
    lastUpdated: Date.now()
  });

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'ingredientCosts'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IngredientCost));
      setIngredients(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'ingredientCosts'), {
        ...newIngredient,
        userId: user.uid,
        lastUpdated: Date.now()
      });
      setNewIngredient({ name: '', unit: 'kg', price: 0, lastUpdated: Date.now() });
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ingredient?')) return;
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'ingredientCosts', id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return (
    <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
      <span className="text-6xl mb-4 block">📦</span>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white">Sign in to build your library</h3>
      <p className="text-slate-500 mt-2 font-medium">Save your ingredient prices to get more accurate costing.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Costing Library</h2>
          <p className="text-slate-500 font-medium">Your personalized ingredient price database.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="text-lg">➕</span> Add Ingredient
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search ingredients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Ingredient</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Unit</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Price (ZAR)</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Updated</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold">No ingredients found.</td>
                </tr>
              ) : (
                filteredIngredients.map((ing) => (
                  <tr key={ing.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">{ing.name}</td>
                    <td className="px-8 py-5 text-slate-600 dark:text-slate-400 font-bold">{ing.unit}</td>
                    <td className="px-8 py-5 text-emerald-600 dark:text-emerald-400 font-black">R {ing.price.toFixed(2)}</td>
                    <td className="px-8 py-5 text-slate-400 text-xs font-bold">{new Date(ing.lastUpdated).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => handleDelete(ing.id!)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                        <span className="text-lg">🗑️</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-in">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add Ingredient</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <span className="text-2xl text-slate-400">❌</span>
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ingredient Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">📦</span>
                    <input 
                      type="text" 
                      required
                      value={newIngredient.name}
                      onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold"
                      placeholder="e.g. Chicken Breast"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Unit</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">⚖️</span>
                      <select 
                        value={newIngredient.unit}
                        onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="L">L</option>
                        <option value="ml">ml</option>
                        <option value="unit">unit</option>
                        <option value="box">box</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Price (ZAR)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">💰</span>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={newIngredient.price}
                        onChange={(e) => setNewIngredient({...newIngredient, price: parseFloat(e.target.value)})}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? <span className="text-2xl animate-spin">⏳</span> : <span className="text-2xl">💾</span>}
                  Save Ingredient
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostingLibrary;
