"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  
  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname);
  
  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav 
      aria-label="Хлібні крошки" 
      className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}
    >
      <Link 
        href={`/${locale}`} 
        className="hover:text-foreground transition-colors p-1"
        aria-label="Головна"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-foreground font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Map segments to human-readable labels
    const label = getBreadcrumbLabel(segment, segments[index - 1]);
    
    breadcrumbs.push({
      label,
      href: currentPath
    });
  });
  
  return breadcrumbs;
}

function getBreadcrumbLabel(segment: string, parentSegment?: string): string {
  const labelMap: Record<string, string> = {
    'catalog': 'Каталог',
    'canvas': 'Холсти',
    'acrylic': 'Акрил',
    'posters': 'Плакати',
    'business-cards': 'Візитки',
    'flyers': 'Листівки',
    'brochures': 'Брошури',
    'stickers': 'Наклейки',
    'calendars': 'Календарі',
    'packaging': 'Упаковка',
    'rigid': 'Жорсткі матеріали',
    'rollups': 'Ролап банери',
    'apparel': 'Одяг',
    'tshirts': 'Футболки',
    'product': 'Товар',
    'templates': 'Шаблони',
    'cart': 'Кошик',
    'checkout': 'Оформлення',
    'track': 'Відстеження',
    'account': 'Особистий кабінет',
    'admin': 'Адміністрування',
    'blog': 'Блог',
    'help': 'Допомога',
    'tech-requirements': 'Технічні вимоги',
    'delivery': 'Доставка',
    'payment': 'Оплата',
    'about': 'Про нас',
    'contacts': 'Контакти'
  };
  
  return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}