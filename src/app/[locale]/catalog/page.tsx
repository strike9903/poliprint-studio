import { getTranslations } from 'next-intl/server';
import { ProductCatalog } from '@/components/catalog/ProductCatalog';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { Badge } from '@/components/ui/badge';
import { generateMetadata as generateSEOMetadata, defaultMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

interface CatalogPageProps {
  params: { locale: string };
}

// Generate metadata for the catalog page
export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return generateSEOMetadata({
    ...defaultMetadata.catalog,
    url: `/${locale}/catalog`,
    locale,
    alternateLocales: ['uk', 'ru'],
    type: 'website'
  });
}

export default async function CatalogPage({ params: { locale } }: CatalogPageProps) {
  const t = await getTranslations('CatalogPage');

  return (
    <ModernLayout locale={locale} variant="default">
      {/* Page Header */}
      <div className="text-center mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
          Каталог продукції
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Професійний друк на будь-яких матеріалах
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Виберіть продукт, налаштуйте параметри та отримайте готовий результат за 24-48 годин.
        </p>
      </div>

      {/* Product Catalog */}
      <ProductCatalog locale={locale} />
    </ModernLayout>
  );
}