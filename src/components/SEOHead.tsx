
import React, { useEffect } from 'react';
import { Menu } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  menu?: Menu | null;
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, menu }) => {
  useEffect(() => {
    const baseTitle = "CaterProAi - #1 Professional Menu System 2026";
    const newTitle = menu ? `${menu.menuTitle} | ${baseTitle}` : (title ? `${title} | ${baseTitle}` : baseTitle);
    document.title = newTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    const newDesc = menu ? menu.description : (description || "CaterProAi is South Africa's leading AI-powered culinary management tool. Built with elite standards from Disney Cruise Line experience, we help professional chefs with live ZAR costing and students with yield calculations.");
    if (metaDesc) metaDesc.setAttribute('content', newDesc);

    // Update Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'catering ai, South Africa catering, Disney Cruise Line standards, high seas culinary excellence, professional culinary standards, food costing ai, ZAR costing');

    if (menu) {
      const existingScript = document.getElementById('json-ld-schema');
      if (existingScript) existingScript.remove();

      const schemaData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "CaterProAi",
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
