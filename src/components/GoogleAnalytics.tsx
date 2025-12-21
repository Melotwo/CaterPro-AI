
import React, { useEffect } from 'react';

// Measurement ID from your dashboard
const GA_MEASUREMENT_ID: string = 'G-N648RKY309'; 

/**
 * Global helper to track custom events in Google Analytics.
 * Use this to track button clicks, successful generations, etc.
 */
export const trackEvent = (eventName: string, params?: object) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};

const GoogleAnalytics: React.FC = () => {
  useEffect(() => {
    if (GA_MEASUREMENT_ID === 'G-REPLACE_ME' || !GA_MEASUREMENT_ID) {
        return;
    }

    if (document.getElementById('google-analytics-script')) return;

    const script = document.createElement('script');
    script.id = 'google-analytics-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        send_page_view: true,
        cookie_flags: 'max-age=7200;Secure;SameSite=None'
      });
    `;
    document.head.appendChild(inlineScript);

  }, []);

  return null;
};

export default GoogleAnalytics;
