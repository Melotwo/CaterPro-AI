import { useState, useEffect, useCallback } from 'react';

export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'business';

export interface SubscriptionState {
  plan: SubscriptionPlan;
  generationsToday: number;
  lastGenerationDate: string | null;
}

const MAX_FREE_GENERATIONS = 3;

const getInitialState = (): SubscriptionState => {
  try {
    const storedState = localStorage.getItem('caterpro-subscription');
    if (storedState) {
      const parsed = JSON.parse(storedState);
      const today = new Date().toDateString();
      // Reset daily counter if it's a new day
      if (parsed.lastGenerationDate !== today) {
        parsed.generationsToday = 0;
        parsed.lastGenerationDate = today;
      }
      // Migrate old plan names if necessary
      if (parsed.plan === 'premium') parsed.plan = 'professional';
      if (parsed.plan === 'pro') parsed.plan = 'business';
      if (parsed.plan === 'enterprise') parsed.plan = 'business'; // Downgrade legacy enterprise to business
      
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse subscription state from localStorage", e);
  }
  return {
    // Default to 'business' so the user can test all features immediately
    plan: 'business',
    generationsToday: 0,
    lastGenerationDate: new Date().toDateString(),
  };
};

export const useAppSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionState>(getInitialState());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('caterpro-subscription', JSON.stringify(subscription));
  }, [subscription]);

  const selectPlan = (plan: SubscriptionPlan) => {
    setSubscription(prev => ({ ...prev, plan }));
  };

  const canAccessFeature = useCallback((feature: string): boolean => {
    const p = subscription.plan;
    const isPaid = p !== 'free';
    const isProfessionalOrHigher = ['professional', 'business'].includes(p);
    const isBusiness = p === 'business';

    switch (feature) {
      case 'unlimitedGenerations':
        return isPaid; // Starter and up
      case 'noWatermark':
        return isPaid; // Starter and up
      case 'allThemes':
        return isProfessionalOrHigher;
      case 'saveMenus':
        return isProfessionalOrHigher;
      case 'beveragePairings':
        return isProfessionalOrHigher;
      case 'recommendedEquipment':
        return isProfessionalOrHigher;
      case 'aiChatBot':
        return isProfessionalOrHigher;
      case 'shareableLinks':
        return isBusiness;
      case 'findSuppliers':
        return isBusiness;
      case 'bulkEdit':
        return isBusiness;
      case 'itemEditing':
        return isBusiness;
      case 'customItemGeneration':
        return isBusiness;
      default:
        return false;
    }
  }, [subscription.plan]);

  const recordGeneration = useCallback((): boolean => {
    const today = new Date().toDateString();
    
    let currentGenerations = subscription.generationsToday;
    if (subscription.lastGenerationDate !== today) {
        currentGenerations = 0;
    }
    
    if (canAccessFeature('unlimitedGenerations')) {
        setSubscription(prev => ({ ...prev, lastGenerationDate: today }));
        return true;
    }
    
    if (currentGenerations < MAX_FREE_GENERATIONS) {
        setSubscription(prev => ({ ...prev, generationsToday: currentGenerations + 1, lastGenerationDate: today }));
        return true;
    }
    
    setShowUpgradeModal(true);
    return false;

  }, [subscription, canAccessFeature]);

  const attemptAccess = (feature: string): boolean => {
      if (canAccessFeature(feature)) {
          return true;
      }
      setShowUpgradeModal(true);
      return false;
  };

  const generationsLeft = canAccessFeature('unlimitedGenerations')
    ? Infinity
    : Math.max(0, MAX_FREE_GENERATIONS - (subscription.lastGenerationDate === new Date().toDateString() ? subscription.generationsToday : 0));


  return { 
    subscription, 
    selectPlan,
    canAccessFeature,
    recordGeneration,
    showUpgradeModal,
    setShowUpgradeModal,
    attemptAccess,
    generationsLeft,
  };
};
