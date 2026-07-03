
type AnalyticsEvent = 
  | { type: 'awareness_view'; data: { page: string } }
  | { type: 'conversion_generate'; data: { eventType: string; plan: string } }
  | { type: 'loyalty_save'; data: { menuTitle: string } }
  | { type: 'founder_action'; data: { actionName: string } };

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private listeners: Set<(event: AnalyticsEvent) => void> = new Set();

  private constructor() {}

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  public subscribe(callback: (event: AnalyticsEvent) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  public track(event: AnalyticsEvent) {
    console.debug(`[Analytics] ${event.type}`, event.data);
    
    // Broadcast to listeners (GTag, FB Pixel, etc.)
    this.listeners.forEach(listener => listener(event));
    
    // Direct integration with window.gtag if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.type, event.data);
    }
  }
}

export const analytics = AnalyticsManager.getInstance();
