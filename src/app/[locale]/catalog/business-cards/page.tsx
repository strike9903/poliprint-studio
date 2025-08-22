import { BusinessCardsGallery } from '@/components/business-cards/BusinessCardsGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ArrowLeft, CreditCard, Sparkles, Clock } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';

export const metadata = {
  title: "Візитки з ламінацією та фольгою | Poliprint Studio",
  description: "Професійні візитки з ламінацією, УФ-лакуванням, фольгуванням. 500+ готових шаблонів. Від 100 штук.",
};

interface BusinessCardsPageProps {
  params: { locale: string };
}

export default function BusinessCardsPage({ params: { locale } }: BusinessCardsPageProps) {
  const features = [
    { icon: CreditCard, title: "Преміум папір", description: "Щільний картон 350г/м² з матовим або глянцевим покриттям" },
    { icon: Sparkles, title: "Спецефекти", description: "Ламінація, УФ-лак, фольгування золотом та сріблом" },
    { icon: Clock, title: "Швидко", description: "Виготовлення за 24-48 годин, експрес за 4 години" }
  ];

  return (
    <ModernLayout locale={locale} variant="default">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/catalog" className="hover:text-primary">Каталог</Link>
          <span>/</span>
          <span>Візитні картки</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="bg-success/10 text-success border-success/20 mb-4">
            💼 Швидко
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Візитні картки з ламінацією
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Професійні візитки на преміум папері з ламінацією, УФ-лакуванням та фольгуванням. 
            500+ готових шаблонів або друк за вашим дизайном.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <Card key={feature.title} className="card-elegant">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Cards Gallery */}
        <BusinessCardsGallery locale={locale} />

        {/* CTA Section */}
        <div className="mt-16 text-center bg-surface rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Готові замовити візитки?
          </h2>
          <p className="text-muted-foreground mb-6">
            Виберіть один з 500+ шаблонів або завантажте власний дизайн
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero" asChild>
              <Link href="/configurator?product=business-cards">
                🤖 AI Конфігуратор
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/templates">
                Переглянути шаблони
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/catalog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад до каталогу
              </Link>
            </Button>
          </div>
        </div>
    </ModernLayout>
  );
}
