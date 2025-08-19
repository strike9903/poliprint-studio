import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  jsonLd?: Record<string, any>;
}

export function SEO({
  title,
  description,
  canonical,
  openGraph,
  jsonLd
}: SEOProps) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      {openGraph?.title && <meta property="og:title" content={openGraph.title} />}
      {openGraph?.description && <meta property="og:description" content={openGraph.description} />}
      {openGraph?.image && <meta property="og:image" content={openGraph.image} />}
      {openGraph?.type && <meta property="og:type" content={openGraph.type} />}
      
      {/* JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Helmet>
  );
}