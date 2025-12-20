
import React, { useEffect } from 'react';
import { Menu } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  menu?: Menu | null;
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, menu }) => {
  useEffect(() => {
    // Update Document Title
    const baseTitle = "CaterPro AI - Professional Menu Generator";
    const newTitle = menu ? `${menu.menuTitle} | ${baseTitle}` : (title ? `${title} | ${baseTitle}` : baseTitle);
    document.title = newTitle;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    const newDesc = menu ? menu.description : (description || "AI-powered assistant for chefs. Generate professional menu proposals, shopping lists, and service notes instantly.");
    if (metaDesc) metaDesc.setAttribute('content', newDesc);

    // Dynamic JSON-LD for SEO Rich Snippets
    if (menu) {
      const existingScript = document.getElementById('json-ld-schema');
      if (existingScript) existingScript.remove();

      const schemaData = {
        "@context": "https://schema.org",
        "@type": "Menu",
        "name": menu.menuTitle,
        "description": menu.description,
        "hasMenuItem": [
          ...(menu.appetizers || []).map(item => ({ "@type": "MenuItem", "name": item })),
          ...(menu.mainCourses || []).map(item => ({ "@type": "MenuItem", "name": item })),
          ...(menu.dessert || []).map(item => ({ "@type": "MenuItem", "name": item }))
        ]
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
