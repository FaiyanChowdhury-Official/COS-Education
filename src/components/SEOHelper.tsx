import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  schemaData?: Record<string, unknown>;
}

export const SEOHelper: React.FC<SEOProps> = ({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  schemaData,
}) => {
  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.includes('COS Education') ? title : `${title} | COS Education`;
    document.title = fullTitle;

    // 2. Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update OG Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let ogTypeMeta = document.querySelector('meta[property="og:type"]');
    if (ogTypeMeta) ogTypeMeta.setAttribute('content', ogType);

    // 4. Update Twitter Card Title & Description
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', fullTitle);

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', description);

    // 5. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}${canonicalPath}`);

    // 6. JSON-LD Structured Data
    const baseSchema = schemaData || {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      'name': 'COS Education',
      'url': 'https://cos-education.com',
      'description': description,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Lift-03, Floor-04, Manru Shopping City, Chowhatta Point',
        'addressLocality': 'Sylhet',
        'addressCountry': 'BD'
      },
      'telephone': '+880 1572 231717',
      'email': 'info@cos-education.com'
    };

    let schemaScript = document.getElementById('json-ld-seo') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'json-ld-seo';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(baseSchema);

    // Scroll to top upon page navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [title, description, canonicalPath, ogType, schemaData]);

  return null;
};
