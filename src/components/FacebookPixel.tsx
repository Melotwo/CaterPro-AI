import React, { useEffect } from 'react';

// INSTRUCTIONS:
// 1. Go to https://business.facebook.com/settings/datasets
//    (If that link doesn't work, go to Business Settings > Data Sources > Datasets)
// 2. Click on your dataset (e.g., "CaterPro AI Pixel").
// 3. The "ID" is a long number at the top (e.g., 149284...).
// 4. Paste it below.

const PIXEL_ID: string = '105023177877998'; 

const FacebookPixel: React.FC = () => {
  useEffect(() => {
    if (!PIXEL_ID || PIXEL_ID === 'YOUR_PIXEL_ID_HERE') {
        // Only log this warning in development so it doesn't clutter production logs
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Facebook Pixel ID is missing. Go to src/components/FacebookPixel.tsx to add it.');
        }
        return;
    }

    // Define the facebook pixel function type on window
    const w = window as any;
    
    if (w.fbq) return;

    const n = function(this: any, ...args: any[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    } as any;

    if (!w._fbq) w._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    
    const t = document.createElement('script');
    t.async = true;
    t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    
    const s = document.getElementsByTagName('script')[0];
    if (s && s.parentNode) {
      s.parentNode.insertBefore(t, s);
    }

    n.callMethod ? n.callMethod('init', PIXEL_ID) : n.queue.push(['init', PIXEL_ID]);
    n.callMethod ? n.callMethod('track', 'PageView') : n.queue.push(['track', 'PageView']);

    console.log(`✅ Facebook Pixel initialized: ${PIXEL_ID}`);

  }, []);

  return null;
};

export default FacebookPixel;
