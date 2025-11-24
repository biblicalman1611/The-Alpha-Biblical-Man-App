
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "A hub for The Biblical Man featuring a micro-scripture learning tool, Substack writings, and curated resources for modern Christian stoicism.",
  image = "https://picsum.photos/seed/biblicalman/1200/630",
  type = 'website'
}) => {
  useEffect(() => {
    // 1. Update Title
    const prevTitle = document.title;
    document.title = title;

    // 2. Helper to set/update meta tags safely
    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector(selector);
      if (!el) {
         // Create if missing (ensures robust handling even if index.html is cached/older)
         const parts = selector.split('[');
         if (parts.length > 1) {
            const attrParts = parts[1].replace(']', '').split('=');
            if (attrParts.length === 2) {
               el = document.createElement('meta');
               el.setAttribute(attrParts[0], attrParts[1].replace(/"/g, ''));
               document.head.appendChild(el);
            }
         }
      }
      if (el) el.setAttribute('content', content);
    };

    // 3. Update Meta Tags
    setMeta('meta[name="title"]', title);
    setMeta('meta[name="description"]', description);
    
    // Open Graph
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:type"]', type);
    
    // Twitter
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', image);

    // Cleanup: Restore title on unmount (optional but polite for SPA transitions)
    return () => {
      document.title = prevTitle;
    };
  }, [title, description, image, type]);

  return null;
};

export default SEO;
