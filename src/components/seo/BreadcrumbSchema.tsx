import { StructuredData } from './StructuredData';

interface BreadcrumbItem {
  name: string;
  url?: string;
  position: number;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poliprint.com.ua';
  
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position || index + 1,
      name: item.name,
      ...(item.url && {
        item: {
          '@type': 'WebPage',
          '@id': item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
          name: item.name
        }
      })
    }))
  };

  return <StructuredData data={breadcrumbData} id="breadcrumb-schema" />;
}

// Helper function to generate breadcrumb items from pathname
export function generateBreadcrumbItems(pathname: string, locale: string = 'uk'): BreadcrumbItem[] {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poliprint.com.ua';
  const pathSegments = pathname.split('/').filter(segment => segment && segment !== locale);
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: 'Головна',
      url: `/${locale}`,
      position: 1
    }
  ];

  const segmentNames: Record<string, string> = {
    'catalog': 'Каталог',
    'canvas': 'Холст',
    'acrylic': 'Акрил',
    'business-cards': 'Візитки',
    'flyers': 'Листівки',
    'stickers': 'Наклейки',
    'packaging': 'Упаковка',
    'apparel': 'Одяг',
    'tshirts': 'Футболки',
    'configurator': 'Конфігуратор',
    'templates': 'Шаблони',
    'blog': 'Блог',
    'help': 'Довідка',
    'contacts': 'Контакти',
    'profile': 'Профіль',
    'orders': 'Замовлення',
    'checkout': 'Оформлення',
    'track': 'Відстеження',
    'about': 'Про нас',
    'delivery': 'Доставка',
    'payment': 'Оплата',
    'faq': 'Питання та відповіді',
    'tech-requirements': 'Технічні вимоги'
  };

  let currentPath = `/${locale}`;
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const segmentName = segmentNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      name: segmentName,
      url: currentPath,
      position: index + 2
    });
  });

  return breadcrumbs;
}