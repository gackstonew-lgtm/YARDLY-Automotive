import { useEffect } from 'react';
import { siteConfig } from '../../config/site';

export interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  schema?: Record<string, unknown> | object[];
}

/**
 * Production-ready dynamic SEO management hook.
 * Sets page title, meta description, Open Graph tags, Twitter cards, canonical links, and JSON-LD structured schema.
 */
export function useSEO({
  title,
  description = siteConfig.description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage = '/logo.jpeg',
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  schema
}: SEOProps): void {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title.includes(siteConfig.name) 
      ? title 
      : `${title} | ${siteConfig.name}`;
    document.title = formattedTitle;

    // Helper to safely set or create meta tag
    const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or create link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large');

    // 3. Canonical Link
    const currentCanonical = canonical || (typeof window !== 'undefined' ? window.location.href : siteConfig.url);
    setLinkTag('canonical', currentCanonical);

    // 4. Open Graph Meta Tags
    setMetaTag('property', 'og:site_name', siteConfig.name);
    setMetaTag('property', 'og:title', ogTitle || formattedTitle);
    setMetaTag('property', 'og:description', ogDescription || description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', ogUrl || currentCanonical);

    // Ensure absolute image URL for Open Graph
    const absoluteOgImage = ogImage.startsWith('http') 
      ? ogImage 
      : `${typeof window !== 'undefined' ? window.location.origin : siteConfig.url}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
    setMetaTag('property', 'og:image', absoluteOgImage);

    // 5. Twitter / X Meta Tags
    setMetaTag('name', 'twitter:card', twitterCard);
    setMetaTag('name', 'twitter:title', ogTitle || formattedTitle);
    setMetaTag('name', 'twitter:description', ogDescription || description);
    setMetaTag('name', 'twitter:image', absoluteOgImage);

    // 6. JSON-LD Structured Data
    let schemaScript = document.getElementById('dynamic-json-ld') as HTMLScriptElement | null;
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dynamic-json-ld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    // Cleanup schema script on unmount
    return () => {
      const scriptToRemove = document.getElementById('dynamic-json-ld');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogUrl, ogType, twitterCard, schema]);
}
