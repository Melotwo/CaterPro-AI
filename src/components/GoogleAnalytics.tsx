import React, { useEffect } from 'react';

// INSTRUCTIONS:
// 1. Create a free account at analytics.google.com
// 2. Create a "Web" property.
// 3. Copy the "Measurement ID" (It starts with 'G-')
// 4. Replace 'G-REPLACE_ME' below with your actual ID.

const GA_MEASUREMENT_ID: string = 'G-N648RKY309'; 

const GoogleAnalytics: React.FC = () => {
  useEffect(() => {
    if (GA_MEASUREMENT_ID === 'G-REPLACE_ME' || !GA_MEASUREMENT_ID) {
        console.warn('Google Analytics: ID not set. Views are not being tracked yet.');
        return;
    }

    // prevent duplicate injection
    if (document.getElementById('google-analytics-script')) return;

    // Load the Google Analytics script
    const script = document.createElement('script');
    script.id = 'google-analytics-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer
    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(inlineScript);

  }, []);

  return null;
};

export default GoogleAnalytics;
