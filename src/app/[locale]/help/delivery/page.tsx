import { ModernLayout } from '@/components/layout/ModernLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { Truck, Clock, MapPin, Package, CheckCircle, Calculator, ArrowRight } from 'lucide-react';

interface DeliveryPageProps {
  params: { locale: string };
}

export const metadata = {
  title: "Доставка замовлень - Poliprint Studio",
  description: "Вся інформація про доставку: терміни, вартість, способи. Доставка Новою Поштою по всій Україні.",
};

export default async function DeliveryPage({ params: { locale } }: DeliveryPageProps) {
  const deliveryMethods = [
    {
      name: 'Нова Пошта',
      description: 'До відділення або поштомату',
      price: 'від 50 ₴',
      time: '1-3 дні',
      icon: <Package className="w-6 h-6" />,
      features: ['По всій Україні', 'Відстеження', 'Безпечно']
    },
    {
      name: 'Нова Пошта (адресна)',
      description: 'Кур\'єр за вашою адресою',
      price: 'від 80 ₴',
      time: '1-3 дні',
      icon: <Truck className="w-6 h-6" />,
      features: ['Київ, Харків, Одеса', 'До дверей', 'Зручно']
    },
    {
      name: 'Самовивіз',
      description: 'З нашого офісу у Києві',
      price: 'Безкоштовно',
      time: 'Від 1 дня',
      icon: <MapPin className="w-6 h-6" />,
      features: ['Економія', 'Швидко', 'Перевірка якості']
    }
  ];

  const deliveryZones = [
    { zone: 'Київ', time: '1-2 дні', price: '50-80 ₴' },
    { zone: 'Обласні центри', time: '1-3 дні', price: '50-100 ₴' },
    { zone: 'Інші міста', time: '2-4 дні', price: '60-120 ₴' },
    { zone: 'Села (за наявності НП)', time: '2-5 днів', price: '60-150 ₴' }
  ];

  return (
    <ModernLayout locale={locale} variant="default">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
          <Truck className="w-4 h-4 mr-1" />
          Доставка
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Доставка замовлень
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Швидка та надійна доставка по всій Україні. Відстежуйте замовлення онлайн 
          та отримуйте якісну продукцію в зручний час.
        </p>
      </div>

      {/* Delivery Methods */}
      <div className="mb-12">
        <h2 className="text-2xl font-heading font-bold mb-6 text-center">
          Способи доставки
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {deliveryMethods.map((method, index) => (
            <Card key={index} className="hover:shadow-glow transition-all hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-accent">
                  {method.icon}
                </div>
                <CardTitle className="text-lg text-center">{method.name}</CardTitle>
                <p className="text-sm text-muted-foreground text-center">{method.description}</p>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-primary">{method.price}</div>
                  <div className="text-sm text-muted-foreground">{method.time}</div>
                </div>
                <div className="space-y-2">
                  {method.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delivery Zones */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Терміни та вартість доставки по регіонах</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {deliveryZones.map((zone, index) => (
              <div key={index} className="grid md:grid-cols-3 gap-4 items-center p-4 bg-muted/20 rounded-lg">
                <div className="font-medium">{zone.zone}</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{zone.time}</span>
                </div>
                <div className="text-primary font-semibold">{zone.price}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Info */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Упаковка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span>Захисна упаковка для крихких виробів</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span>Холсти в спеціальних тубусах</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span>Акрил у вакуумній плівці</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <span>Страхування вантажу</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Терміни виготовлення
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>Холсти та акрил:</span>
                <span className="font-medium">1-3 дні</span>
              </li>
              <li className="flex justify-between">
                <span>Візитки (до 1000 шт):</span>
                <span className="font-medium">1-2 дні</span>
              </li>
              <li className="flex justify-between">
                <span>Листівки:</span>
                <span className="font-medium">2-3 дні</span>
              </li>
              <li className="flex justify-between">
                <span>Наклейки:</span>
                <span className="font-medium">1-2 дні</span>
              </li>
              <li className="flex justify-between">
                <span>Упаковка (індивідуальна):</span>
                <span className="font-medium">5-10 днів</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center bg-surface rounded-2xl p-8 border border-border">
        <h2 className="text-2xl font-heading font-bold mb-4">
          Питання про доставку?
        </h2>
        <p className="text-muted-foreground mb-6">
          Зв'яжіться з нами для уточнення термінів та розрахунку вартості доставки
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="btn-hero" asChild>
            <Link href="/track">
              <Package className="w-5 h-5 mr-2" />
              Відстежити замовлення
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contacts">
              Зв'язатися з нами
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/help">
              <ArrowRight className="w-4 h-4 mr-2" />
              Інші питання
            </Link>
          </Button>
        </div>
      </div>
    </ModernLayout>
  );
}
