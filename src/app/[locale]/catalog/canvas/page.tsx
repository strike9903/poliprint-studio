import { CanvasGallery } from '@/components/canvas/CanvasGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ArrowLeft, Palette, Sparkles, Shield } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';

export const metadata = {
  title: "Друк на холсті - Преміум якість | Poliprint Studio",
  description: "Професійний друк фото на холсті з галерейною кромкою. Від 30x40 до 120x180 см. Швидка доставка по Україні.",
};

interface CanvasPageProps {
  params: { locale: string };
}

export default function CanvasPage({ params: { locale } }: CanvasPageProps) {
  const features = [
    { icon: Palette, title: "Преміум холст", description: "Натуральний бавовняний холст 340 г/м²" },
    { icon: Sparkles, title: "Галерейна кромка", description: "Професійне натягування з дзеркальною або кольоровою кромкою" },
    { icon: Shield, title: "Захист від вигорання", description: "UV-стійкі чорнила гарантують 50+ років без втрати кольору" }
  ];

  return (
    <ModernLayout locale={locale} variant="default">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/catalog" className="hover:text-primary">Каталог</Link>
          <span>/</span>
          <span>Друк на холсті</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            🎨 Найпопулярніше
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Друк на холсті з галерейною кромкою
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Перетворіть ваші фото в справжні мистецькі полотна. Преміум друк на натуральному холсті 
            з професійним натягуванням на дерев'яний підрамник.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <Card key={feature.title} className="card-elegant">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Canvas Gallery */}
        <CanvasGallery locale={locale} />

        {/* CTA Section */}
        <div className="mt-16 text-center bg-surface rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Готові замовити друк на холсті?
          </h2>
          <p className="text-muted-foreground mb-6">
            Використайте наш AI-конфігуратор для швидкого підбору оптимальних параметрів
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero" asChild>
              <Link href="/configurator?product=canvas">
                🤖 AI Конфігуратор
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
