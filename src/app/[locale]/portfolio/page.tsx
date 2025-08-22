import { Portfolio } from '@/components/sections/Portfolio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';

export const metadata = {
  title: "Портфоліо - Наші кращі роботи | Poliprint Studio",
  description: "Переглядайте портфоліо наших робіт: друк на холсті, акрилі, візитки, брендинг. Понад 500 виконаних проектів.",
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Головна</Link>
          <span>/</span>
          <span>Портфоліо</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="bg-success/10 text-success border-success/20 mb-4">
            🖼️ Наші роботи
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Портфоліо робіт Poliprint Studio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Перегляньте найкращі зразки нашої роботи. Кожен проект - це унікальне поєднання 
            професійного друку та творчого підходу до вирішення завдань клієнтів.
          </p>
        </div>

        {/* Portfolio Component */}
        <Portfolio />

        {/* Additional Info */}
        <div className="mt-16 bg-surface rounded-2xl p-8 border border-border">
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold mb-4">
              Хочете бачити свою роботу тут?
            </h2>
            <p className="text-muted-foreground mb-6">
              Замовте друк у нас і станьте частиною нашого портфоліо найкращих робіт!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-hero" asChild>
                <Link href="/configurator">
                  🤖 Почати проект
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  На головну
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
