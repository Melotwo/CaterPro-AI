
import { useState, useEffect, useCallback } from 'react';

export type SubscriptionPlan = 'free' | 'student' | 'starter' | 'professional' | 'business';

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
      // Ensure we don't accidentally load an invalid or outdated state
      if (!['free', 'student', 'starter', 'professional', 'business'].includes(parsed.plan)) {
          parsed.plan = 'free';
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse subscription state", e);
  }
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
    const p = subscription.plan;
    const isPaid = p !== 'free';
    const isStudent = p === 'student';
    const isProfessionalOrHigher = ['professional', 'business'].includes(p);
    const isBusiness = p === 'business';

    switch (feature) {
      case 'unlimitedGenerations': return isPaid; // Students get unlimited for PoE practice
      case 'noWatermark': return ['starter', 'professional', 'business'].includes(p); // Students STILL HAVE watermarks
      case 'allThemes': return isProfessionalOrHigher;
      case 'saveMenus': return isPaid; // Students can save (limited to 5)
      case 'beveragePairings': return isProfessionalOrHigher;
      case 'recommendedEquipment': return isProfessionalOrHigher;
      case 'aiChatBot': return isStudent || isProfessionalOrHigher; // Students get the tutor bot
      case 'shareableLinks': return isBusiness;
      case 'findSuppliers': return isBusiness;
      case 'bulkEdit': return isBusiness;
      case 'itemEditing': return isBusiness;
      case 'customItemGeneration': return isBusiness;
      case 'educationTools': return isStudent || isBusiness; // Students get PoE/Study tools
      case 'socialMediaTools': return isProfessionalOrHigher; // Students DON'T get Reels/Captions
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
