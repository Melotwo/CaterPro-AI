import React, { useEffect } from 'react';

// INSTRUCTIONS TO FIND YOUR MANYCHAT ID:
//
// OPTION A (New Interface):
// 1. Go to "Settings" (Gear icon bottom left).
// 2. Look for "Widgets" in the settings menu.
// 3. Click "New Widget" -> "Customer Chat".
// 4. In the "Setup" tab, look for the code snippet: //widget.manychat.com/YOUR_ID.js
//
// OPTION B (Automation Method):
// 1. Go to "Automation" (Lightning bolt icon).
// 2. Click "New Automation" (top right).
// 3. Select "Start from Scratch".
// 4. Click "New Trigger".
// 5. Scroll down to "Growth Tools" -> select "Customer Chat".
// 6. Finish setup and look for the ID in the activation/setup tab.
//
// Paste the numeric ID below:

const MANYCHAT_PAGE_ID = 'YOUR_PAGE_ID_HERE'; 

const ManyChatWidget: React.FC = () => {
  useEffect(() => {
    if (!MANYCHAT_PAGE_ID || MANYCHAT_PAGE_ID === 'YOUR_PAGE_ID_HERE') {
      // Quietly fail in production so it doesn't break anything
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
