import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Shirt, Palette, Sparkles } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';

export const metadata = {
  title: "DTF друк на футболках - Нова технологія | Poliprint Studio",
  description: "Якісний DTF друк на футболках. Яскраві кольори, м'яка відчуття, еластичність. Безліч кольорів тканини.",
};

export default function TshirtsPage() {
  const features = [
    { icon: Shirt, title: "DTF технологія", description: "Найсучасніший Direct-to-Film друк" },
    { icon: Palette, title: "Яскраві кольори", description: "Насичені кольори що не вигорають" },
    { icon: Sparkles, title: "М'яка відчуття", description: "Еластичне покриття, приємне на дотик" }
  ];

  const products = [
    {
      name: "Класичні футболки",
      description: "100% бавовна, щільність 160г/м²",
      priceFrom: 150,
      features: ["Унісекс крій", "15 кольорів тканини", "S-3XL розміри"],
      colors: ["Білий", "Чорний", "Сірий", "Синій", "Червоний"]
    },
    {
      name: "Преміум футболки",
      description: "100% органічна бавовна, 180г/м²",
      priceFrom: 180,
      features: ["Органічна бавовна", "Преміум якість", "Екологічна сертифікація"],
      colors: ["Білий", "Чорний", "Хакі", "Бежевий", "Індиго"]
    },
    {
      name: "Поло футболки",
      description: "Пікс з комірцем, 200г/м²",
      priceFrom: 200,
      features: ["Класичний крій", "Міцний комір", "Ділові кольори"],
      colors: ["Білий", "Чорний", "Темно-синій", "Сірий"]
    },
    {
      name: "Лонгсліви",
      description: "Футболка з довгими рукавами",
      priceFrom: 180,
      features: ["Теплий варіант", "Манжети на рукавах", "Унісекс"],
      colors: ["Білий", "Чорний", "Сірий", "Синій", "Марсала"]
    },
    {
      name: "Худі",
      description: "Толстовка з капюшоном, 320г/м²",
      priceFrom: 350,
      features: ["Теплий флісовий ворс", "Великий капюшон", "Кенгуру кишеня"],
      colors: ["Чорний", "Сірий", "Синій", "Марсала", "Хакі"]
    },
    {
      name: "Дитячі футболки",
      description: "Спеціально для дітей, м'яка тканина",
      priceFrom: 120,
      features: ["Гіпоалергенні", "М'яка тканина", "Яскраві кольори"],
      colors: ["Білий", "Рожевий", "Блакитний", "Жовтий", "Зелений"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/catalog" className="hover:text-primary">Каталог</Link>
          <span>/</span>
          <span>Apparel</span>
          <span>/</span>
          <span>Футболки DTF</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="bg-success/10 text-success border-success/20 mb-4">
            👕 Нова технологія
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            DTF друк на футболках
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Якісний друк на футболках технологією DTF - яскраві кольори, м'яка відчуття на дотик, 
            еластичність та стійкість до прання.
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product, index) => (
            <Card key={index} className="card-elegant hover:shadow-glow">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Shirt className="w-8 h-8 text-success" />
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

                {/* Color Options */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Доступні кольори:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.colors.map((color, colorIndex) => (
                      <Badge key={colorIndex} variant="outline" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/configurator?product=tshirts">
                    Налаштувати
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* DTF Technology Info */}
        <div className="bg-surface rounded-2xl p-8 border border-border mb-12">
          <h2 className="text-xl font-heading font-bold mb-6 text-center">
            Переваги DTF технології
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Стійкість кольорів</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Прань без втрати якості</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Еластичність покриття</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">24 год</div>
              <div className="text-sm text-muted-foreground">Час виготовлення</div>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="bg-surface rounded-2xl p-8 border border-border mb-12">
          <h2 className="text-xl font-heading font-bold mb-4 text-center">
            Догляд за виробами з DTF друком
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-success mb-3">✅ Рекомендується:</h3>
              <ul className="space-y-2 text-sm">
                <li>• Прати при температурі до 40°C</li>
                <li>• Вивертати навиворіт перед пранням</li>
                <li>• Використовувати делікатний режим</li>
                <li>• Сушити в тіні на повітрі</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-destructive mb-3">❌ Не рекомендується:</h3>
              <ul className="space-y-2 text-sm">
                <li>• Прати в гарячій воді ({'>'} 60°C)</li>
                <li>• Використовувати відбілювачі</li>
                <li>• Гладити по малюнку</li>
                <li>• Сушити в сушильній машині</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-surface rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Готові замовити DTF друк?
          </h2>
          <p className="text-muted-foreground mb-6">
            Використайте наш конфігуратор для вибору футболки та дизайну
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero" asChild>
              <Link href="/configurator?product=tshirts">
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
      </div>
    </div>
  );
}