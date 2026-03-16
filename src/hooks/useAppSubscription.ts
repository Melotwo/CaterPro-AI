
import { useState, useEffect, useCallback } from 'react';

export type SubscriptionPlan = 'free' | 'commis' | 'chef-de-partie' | 'sous-chef' | 'executive';

export interface SubscriptionState {
  plan: SubscriptionPlan;
  generationsToday: number;
  lastGenerationDate: string | null;
}

const MAX_FREE_GENERATIONS = 5;

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
      if (!['free', 'commis', 'chef-de-partie', 'sous-chef', 'executive'].includes(parsed.plan)) {
          parsed.plan = 'chef-de-partie';
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse subscription state", e);
  }
  return {
    plan: 'chef-de-partie',
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
    const isCommis = p === 'commis';
    const isChef = p === 'chef-de-partie';
    const isSous = p === 'sous-chef';
    const isExec = p === 'executive';
    
    const isProPlus = ['chef-de-partie', 'sous-chef', 'executive'].includes(p);
    const isGrowthPlus = ['sous-chef', 'executive'].includes(p);

    switch (feature) {
      case 'unlimitedGenerations': return isPaid;
      case 'noWatermark': return isProPlus; 
      case 'aiChatBot': return isPaid; 
      case 'saveMenus': return isPaid;
      case 'educationTools': return isCommis || isExec; 
      case 'costingEngine': return isProPlus;
      case 'shoppingLists': return isProPlus;
      case 'multiUser': return isGrowthPlus;
      case 'cloudStorage': return isGrowthPlus;
      case 'clientDashboard': return isGrowthPlus;
      case 'reelsMode': return isExec;
      case 'viralVideoCreator': return isExec;
      case 'beveragePairings': return isProPlus;
      default: return false;
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
        setSubscription(prev => ({ 
            ...prev, 
            generationsToday: currentGenerations + 1, 
            lastGenerationDate: today 
        }));
        return true;
    }
    
    setShowUpgradeModal(true);
    return false;
  }, [subscription, canAccessFeature]);

  const attemptAccess = (feature: string): boolean => {
      if (canAccessFeature(feature)) return true;
      setShowUpgradeModal(true);
      return false;
  };

  return { 
    subscription, 
    selectPlan,
    canAccessFeature,
    recordGeneration,
    showUpgradeModal,
    setShowUpgradeModal,
    attemptAccess
  };
};
