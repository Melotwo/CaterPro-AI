import { useState, useEffect, useCallback } from 'react';

export type SubscriptionPlan = 'free' | 'premium' | 'pro';

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
      if (parsed.lastGenerationDate !== today) {
        parsed.generationsToday = 0;
        parsed.lastGenerationDate = today;
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse subscription state from localStorage", e);
  }
  // If nothing is stored, user has not selected a plan.
  // The 'free' plan is a default for logic, but the app should show the pricing page.
  return {
    plan: 'free',
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
    switch (feature) {
      case 'unlimitedGenerations':
        return subscription.plan === 'premium' || subscription.plan === 'pro';
      case 'allThemes':
        return subscription.plan === 'premium' || subscription.plan === 'pro';
      case 'saveMenus':
        return subscription.plan === 'premium' || subscription.plan === 'pro';
      case 'beveragePairings':
        return subscription.plan === 'premium' || subscription.plan === 'pro';
      case 'recommendedEquipment':
        return subscription.plan === 'premium' || subscription.plan === 'pro';
      case 'noWatermark':
        return subscription.plan === 'premium' || subscription.plan === 'pro';
      case 'aiChatBot':
        return subscription.plan === 'premium' || subscription.plan === 'pro';
      case 'shareableLinks':
        return subscription.plan === 'pro';
      case 'findSuppliers':
        return subscription.plan === 'pro';
      case 'bulkEdit':
        return subscription.plan === 'pro';
      case 'itemEditing':
        return subscription.plan === 'pro';
      case 'customItemGeneration':
        return subscription.plan === 'pro';
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
