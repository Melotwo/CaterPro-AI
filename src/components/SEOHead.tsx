
import React, { useEffect } from 'react';
import { Menu } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  menu?: Menu | null;
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, menu }) => {
  useEffect(() => {
    const baseTitle = "CaterPro AI - #1 Professional Menu System 2026";
    const newTitle = menu ? `${menu.menuTitle} | ${baseTitle}` : (title ? `${title} | ${baseTitle}` : baseTitle);
    document.title = newTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    const newDesc = menu ? menu.description : (description || "The first AI Lifecycle system for catering professionals at caterproai.com. Generate professional menu proposals, ZAR shopping lists, and HACCP safety notes instantly. Updated for 2026.");
    if (metaDesc) metaDesc.setAttribute('content', newDesc);

    // Update Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'catering ai, hospital menu planner, school cafeteria software, culinary portfolio assistant, South Africa catering, catering proposal generator 2026, food costing ai');

    if (menu) {
      const existingScript = document.getElementById('json-ld-schema');
      if (existingScript) existingScript.remove();

      const schemaData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "CaterPro AI",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "ZAR"
        },
        "description": newDesc
      };

      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }
  }, [title, description, menu]);

  return null;
};

export default SEOHead;
