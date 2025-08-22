import { AcrylicGallery } from '@/components/acrylic/AcrylicGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ArrowLeft, Gem, Zap, Eye } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';

export const metadata = {
  title: "Друк на акрилі з підсвіткою - Преміум | Poliprint Studio", 
  description: "Ексклюзивний друк на акрилі з LED підсвіткою. Face-mount технологія, товщина 3-10мм. Дистанційні кріплення.",
};

interface AcrylicPageProps {
  params: { locale: string };
}

export default function AcrylicPage({ params: { locale } }: AcrylicPageProps) {
  const features = [
    { icon: Gem, title: "Преміум акрил", description: "Оптичний акрил товщиною від 3 до 10 мм" },
    { icon: Zap, title: "LED підсвітка", description: "Дополнительное LED освещение для ефекту глибини" },
    { icon: Eye, title: "Face-mount", description: "Зображення друкується з зворотного боку для захисту" }
  ];

  return (
    <ModernLayout locale={locale} variant="default">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/catalog" className="hover:text-primary">Каталог</Link>
          <span>/</span>
          <span>Акрил та скло</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
            💎 Преміум
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Друк на акрилі з підсвіткою
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ексклюзивні акрилові панелі з професійним друком та LED підсвіткою. 
            Face-mount технологія забезпечує максимальну чіткість та захист зображення.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <Card key={feature.title} className="card-elegant">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acrylic Gallery */}
        <AcrylicGallery locale={locale} />

        {/* CTA Section */}
        <div className="mt-16 text-center bg-surface rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Готові замовити друк на акрилі?
          </h2>
          <p className="text-muted-foreground mb-6">
            Використайте наш AI-конфігуратор для швидкого підбору оптимальних параметрів
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero" asChild>
              <Link href="/configurator?product=acrylic">
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
