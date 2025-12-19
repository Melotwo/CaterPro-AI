
import React, { useState } from 'react';
import { ShoppingCart, Sparkles, Loader2 } from 'lucide-react';
import { PpeProduct } from '../types';
// Fixed: Using the correct exported function from geminiService
import { generateMenuImageFromApi } from '../services/geminiService';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=800&q=80'; // Reliable fallback image (Kitchen/Cooking)

const ProductCard: React.FC<{
  product: PpeProduct;
  onGetQuote: (product: PpeProduct) => void;
}> = ({ product, onGetQuote }) => {
  const [imgSrc, setImgSrc] = useState(product.image);
  const [hasError, setHasError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  const handleGenerateImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
        // Fixed: Using generateMenuImageFromApi instead of missing generateProductImageFromApi
        const base64Data = await generateMenuImageFromApi(product.name, product.description);
        setImgSrc(`data:image/png;base64,${base64Data}`);
    } catch (err) {
        console.error("Failed to generate image:", err);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col transition-transform hover:-translate-y-1 duration-200 h-full group">
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <img 
            src={imgSrc} 
            alt={product.name} 
            onError={handleError}
            className={`h-full w-full object-cover transition-opacity duration-300 ${isGenerating ? 'opacity-50 blur-sm' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        
        <button 
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all shadow-sm z-10"
            title="Generate AI Image"
        >
            {isGenerating ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Sparkles size={16} className="text-amber-300" />
            )}
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{product.name}</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {product.priceRange}
            </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 flex-grow">{product.description}</p>
        <button
          onClick={() => onGetQuote(product)}
          className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-slate-900 bg-amber-500 hover:bg-amber-600 focus:outline-none transition-colors"
        >
          <ShoppingCart size={16} className="mr-2" />
          Get a Quote
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
