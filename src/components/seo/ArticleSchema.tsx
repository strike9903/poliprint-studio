import { StructuredData } from './StructuredData';

interface ArticleSchemaProps {
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher?: {
    name: string;
    logo: string;
    url?: string;
  };
  url: string;
  wordCount?: number;
  timeRequired?: string; // ISO 8601 duration format (e.g., "PT5M" for 5 minutes)
  keywords?: string;
  articleSection?: string;
  articleBody?: string;
  about?: string;
  mentions?: Array<{
    name: string;
    url?: string;
  }>;
}

export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
  url,
  wordCount,
  timeRequired,
  keywords,
  articleSection,
  articleBody,
  about,
  mentions
}: ArticleSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poliprint.com.ua';
  
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${baseUrl}${url}#article`,
    headline,
    ...(description && { description }),
    url: `${baseUrl}${url}`,
    
    // Images
    ...(image && {
      image: Array.isArray(image) 
        ? image.map(img => ({
            '@type': 'ImageObject',
            url: img.startsWith('http') ? img : `${baseUrl}${img}`,
            width: 1200,
            height: 630
          }))
        : {
            '@type': 'ImageObject',
            url: image.startsWith('http') ? image : `${baseUrl}${image}`,
            width: 1200,
            height: 630
          }
    }),
    
    // Dates
    datePublished,
    dateModified: dateModified || datePublished,
    
    // Author
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { 
        url: author.url.startsWith('http') ? author.url : `${baseUrl}${author.url}`
      })
    },
    
    // Publisher
    publisher: publisher || {
      '@type': 'Organization',
      name: 'Poliprint',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
        width: 300,
        height: 100
      }
    },
    
    // Main entity of page
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${url}`
    },
    
    // Content details
    ...(wordCount && { wordCount }),
    ...(timeRequired && { timeRequired }),
    ...(keywords && { keywords }),
    ...(articleSection && { articleSection }),
    ...(articleBody && { articleBody }),
    ...(about && { about }),
    
    // Mentions
    ...(mentions && mentions.length > 0 && {
      mentions: mentions.map(mention => ({
        '@type': 'Thing',
        name: mention.name,
        ...(mention.url && { 
          url: mention.url.startsWith('http') ? mention.url : `${baseUrl}${mention.url}`
        })
      }))
    }),
    
    // Language and audience
    inLanguage: 'uk',
    audience: {
      '@type': 'Audience',
      audienceType: 'general public',
      geographicArea: {
        '@type': 'Country',
        name: 'Ukraine'
      }
    },
    
    // Additional properties for printing/design articles
    genre: 'printing, design, business',
    
    // Breadcrumb trail
    isPartOf: {
      '@type': 'Blog',
      name: 'Блог Poliprint',
      url: `${baseUrl}/blog`,
      publisher: {
        '@type': 'Organization',
        name: 'Poliprint',
        url: baseUrl
      }
    },
    
    // Copyright
    copyrightHolder: {
      '@type': 'Organization',
      name: 'Poliprint',
      url: baseUrl
    },
    copyrightYear: new Date().getFullYear(),
    license: `${baseUrl}/terms`,
    
    // Interaction statistics (if available)
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ReadAction',
        userInteractionCount: 0
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ShareAction',
        userInteractionCount: 0
      }
    ]
  };

  return <StructuredData data={articleData} id="article-schema" />;
}