import { NextIntlClientProvider } from 'next-intl';
import dynamic from 'next/dynamic';
import { CanvasGallery } from '@/components/canvas/CanvasGallery';
import { AcrylicGallery } from '@/components/acrylic/AcrylicGallery';
import { BusinessCardsGallery } from '@/components/business-cards/BusinessCardsGallery';

// Динамически импортируем Header как клиентский компонент
const Header = dynamic(
  () => import('@/components/layout/Header').then((mod) => mod.Header),
  { ssr: false }
);

interface CategoryPageProps {
  params: { category: string };
}

export default async function CategoryPage({ params: { category } }: CategoryPageProps) {
  const locale = 'uk';
  
  let messages;
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch (error) {
    messages = {};
  }

  const renderCategoryContent = () => {
    switch (category) {
      case 'canvas':
        return <CanvasGallery locale={locale} />;
      case 'acrylic':
        return <AcrylicGallery locale={locale} />;
      case 'business-cards':
        return <BusinessCardsGallery locale={locale} />;
      default:
        return (
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold capitalize">{category}</h1>
            <p className="text-muted-foreground">Каталог для цієї категорії в розробці</p>
          </div>
        );
    }
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header locale={locale} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {renderCategoryContent()}
        </main>
        <footer className="border-t py-6 mt-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PrintStudio. Всі права захищені.
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}