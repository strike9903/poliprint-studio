import { SmartConfigurator } from '@/components/configurator/SmartConfigurator';
import { Badge } from '@/components/ui/badge';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { generateMetadata as generateSEOMetadata, defaultMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

interface ConfiguratorPageProps {
  params: { locale: string };
  searchParams: { product?: string };
}

// Generate metadata for the configurator page
export async function generateMetadata({ params }: ConfiguratorPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return generateSEOMetadata({
    ...defaultMetadata.configurator,
    url: `/${locale}/configurator`,
    locale,
    alternateLocales: ['uk', 'ru'],
    type: 'website'
  });
}

export default function ConfiguratorPage({ params: { locale }, searchParams }: ConfiguratorPageProps) {
  return (
    <ModernLayout locale={locale} variant="default">
        {/* Page Header */}
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-primary to-accent text-white mb-4">
            🤖 AI-Powered
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Розумний конфігуратор друку
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Завантажте зображення і наш ШІ підбере найкращий варіант друку спеціально для вас
          </p>
        </div>

        {/* Smart Configurator */}
        <SmartConfigurator productId={searchParams.product} locale={locale} />
        
        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-semibold">ШІ аналіз</h3>
            <p className="text-sm text-muted-foreground">
              Автоматичний аналіз якості, розміру та типу зображення
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold">Миттєві рекомендації</h3>
            <p className="text-sm text-muted-foreground">
              Персоналізовані пропозиції за 3 секунди
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-semibold">Оптимальна ціна</h3>
            <p className="text-sm text-muted-foreground">
              Найкраще співвідношення ціна/якість для вашого проекту
            </p>
          </div>
        </div>
    </ModernLayout>
  );
}