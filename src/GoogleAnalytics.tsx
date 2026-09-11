
import React, { useEffect } from 'react';

// Measurement ID from user dashboard
export const GA_MEASUREMENT_ID: string = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-N648RKY309'; 

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Global helper to track custom events in Google Analytics 4.
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      timestamp: new Date().toISOString()
    });
    console.debug(`[GA4 Event] ${eventName}:`, params);
  }
};

/**
 * Track virtual page views (especially useful for single page app tab navigation)
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      cookie_flags: 'SameSite=None;Secure'
    });
    console.debug(`[GA4 PageView] ${pagePath} - ${pageTitle || document.title}`);
  }
};

interface GoogleAnalyticsProps {
  currentTab?: string;
}

export const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ currentTab }) => {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-REPLACE_ME') {
      return;
    }

    // Ensure dataLayer & gtag stub are present
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function() {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        cookie_flags: 'SameSite=None;Secure',
        send_page_view: true
      });
    }

    // Load gtag.js script if not already added in index.html
    const existingScript = document.getElementById('google-analytics-script') || 
                           document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`);
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-analytics-script';
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    console.info(`[Google Analytics] Active with Measurement ID: ${GA_MEASUREMENT_ID}`);
  }, []);

  // Track virtual page views when active tab changes
  useEffect(() => {
    if (currentTab) {
      const tabPaths: Record<string, { path: string; title: string }> = {
        proposal: { path: '/proposal', title: 'Executive Banquet Proposal | CaterProAI' },
        calculator: { path: '/calculator', title: 'ZAR Plate Costing Calculator | CaterProAI' },
        recipe: { path: '/recipe-generator', title: 'Culinary Recipe Generator | CaterProAI' },
        commis: { path: '/growth-lab', title: 'Student Growth & Productivity Lab | CaterProAI' }
      };

      const meta = tabPaths[currentTab] || { path: `/${currentTab}`, title: `${currentTab} | CaterProAI` };
      trackPageView(meta.path, meta.title);
    }
  }, [currentTab]);

  return null;
};

export default GoogleAnalytics;

