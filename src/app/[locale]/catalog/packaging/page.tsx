import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Package, Sparkles, Ruler } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';

export const metadata = {
  title: "Упаковка під замовлення - Коробки, пакети | Poliprint Studio",
  description: "Упаковка за індивідуальним дизайном. Коробки, пакети, етикетки. Тиснення фольгою, ламінація, УФ-лак.",
};

export default function PackagingPage() {
  const features = [
    { icon: Package, title: "Індивідуальний розмір", description: "Упаковка точно за вашими розмірами" },
    { icon: Sparkles, title: "Тиснення фольгою", description: "Золота, срібна фольга та голографія" },
    { icon: Ruler, title: "Ді-лайн розробка", description: "Безкоштовна підготовка макету упаковки" }
  ];

  const products = [
    {
      name: "Картонні коробки",
      description: "Складні коробки під будь-які товари",
      priceFrom: 45,
      features: ["Гофрокартон/картон", "Повнокольоровий друк", "Матова/глянцева ламінація"],
      popular: true
    },
    {
      name: "Паперові пакети",
      description: "Екологічні пакети з логотипом",
      priceFrom: 35,
      features: ["Крафт-папір", "Кручені ручки", "Тиснення фольгою"]
    },
    {
      name: "Етикетки та стікери",
      description: "Самоклеючі етикетки для товарів",
      priceFrom: 25,
      features: ["Різні матеріали", "Вирубка по контуру", "Водостійкі варіанти"]
    },
    {
      name: "Тубуси картонні",
      description: "Циліндричні коробки для постерів",
      priceFrom: 60,
      features: ["Щільний картон", "Металеві кришки", "Індивідуальний діаметр"]
    },
    {
      name: "Конверти фірмові",
      description: "Конверти з логотипом компанії",
      priceFrom: 30,
      features: ["С4, С5, DL формати", "Вікно або без", "Кольорова печать"]
    },
    {
      name: "Подарункові коробки",
      description: "Преміум упаковка для подарунків",
      priceFrom: 85,
      features: ["Дизайнерський картон", "Стрічки та вставки", "Магнітний замок"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/catalog" className="hover:text-primary">Каталог</Link>
          <span>/</span>
          <span>Упаковка</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
            📦 Під замовлення
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Упаковка за вашим дизайном
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Коробки, пакети, етикетки та інша упаковка за індивідуальним дизайном. 
            Безкоштовна розробка ді-лайну та макету.
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product, index) => (
            <Card key={index} className="card-elegant hover:shadow-glow relative">
              {product.popular && (
                <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground z-10">
                  Популярне
                </Badge>
              )}
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  <div className="text-2xl font-bold text-primary">
                    від {product.priceFrom} ₴
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {product.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full" asChild>
                  <Link href="/configurator?product=packaging">
                    Розрахувати вартість
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-surface rounded-2xl p-8 border border-border mb-12">
          <h2 className="text-xl font-heading font-bold mb-6 text-center">
            Як ми працюємо з упаковкою
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="font-semibold text-sm mb-2">1. Консультація</h3>
              <p className="text-xs text-muted-foreground">Обговорюємо ваші потреби та розміри</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📐</span>
              </div>
              <h3 className="font-semibold text-sm mb-2">2. Ді-лайн</h3>
              <p className="text-xs text-muted-foreground">Розробляємо креслення упаковки</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🎨</span>
              </div>
              <h3 className="font-semibold text-sm mb-2">3. Дизайн</h3>
              <p className="text-xs text-muted-foreground">Ви надаєте макет або ми розробляємо</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🖨️</span>
              </div>
              <h3 className="font-semibold text-sm mb-2">4. Виробництво</h3>
              <p className="text-xs text-muted-foreground">Друк, вирубка та складання</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-surface rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Потрібна упаковка під замовлення?
          </h2>
          <p className="text-muted-foreground mb-6">
            Зв'яжіться з нами для консультації та розрахунку вартості
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero" asChild>
              <Link href="/configurator?product=packaging">
                📦 Розрахувати вартість
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contacts">
                Консультація
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
      </div>
    </div>
  );
}