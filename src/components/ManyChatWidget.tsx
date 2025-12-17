import React, { useEffect } from 'react';

// INSTRUCTIONS TO FIND YOUR MANYCHAT ID:
//
// If you can't find it, don't worry! 
// Leave the value as 'YOUR_PAGE_ID_HERE'. 
// The widget will simply hide itself and won't break your app.
//
// 1. Go to ManyChat "Settings" > "Widgets" (or "Growth Tools").
// 2. Create a "Customer Chat" widget.
// 3. Look for the script source in the Setup tab: //widget.manychat.com/123456.js
// 4. That number is your ID.

const MANYCHAT_PAGE_ID = 'YOUR_PAGE_ID_HERE'; 

const ManyChatWidget: React.FC = () => {
  useEffect(() => {
    // If ID is missing or default, just return silently.
    if (!MANYCHAT_PAGE_ID || MANYCHAT_PAGE_ID === 'YOUR_PAGE_ID_HERE') {
      return;
    }

    // Prevent duplicate injection
    if (document.getElementById('manychat-widget-script')) return;

    const script = document.createElement('script');
    script.id = 'manychat-widget-script';
    script.src = `//widget.manychat.com/${MANYCHAT_PAGE_ID}.js`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Initializer for ManyChat
    const mcScript = document.createElement('script');
    mcScript.innerHTML = `
      window.mcAsyncInit = function() {
        MC.init({
          widgetId: '${MANYCHAT_PAGE_ID}'
        });
      };
    `;
    document.head.appendChild(mcScript);

  }, []);

  return null;
};

export default ManyChatWidget;
