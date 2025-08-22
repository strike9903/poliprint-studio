import { ModernLayout } from '@/components/layout/ModernLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { 
  Package, 
  Search,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  AlertCircle,
  Printer,
  PackageCheck,
  Calendar
} from 'lucide-react';

interface TrackPageProps {
  params: { locale: string };
}

export const metadata = {
  title: "Відстежити замовлення - Статус виконання | Poliprint Studio",
  description: "Відстежуйте статус вашого замовлення в режимі реального часу. Перевіряйте етапи виготовлення та доставки.",
};

export default async function TrackPage({ params: { locale } }: TrackPageProps) {
  // Sample order data for demonstration
  const sampleOrder = {
    id: 'PP-2024-001234',
    status: 'in_production',
    items: [
      { name: 'Візитки двосторонні', quantity: 1000, price: 450 },
      { name: 'Листівки A5', quantity: 500, price: 320 }
    ],
    total: 770,
    orderDate: '2024-03-15',
    estimatedCompletion: '2024-03-18',
    deliveryMethod: 'Нова Пошта',
    trackingNumber: '20450123456789'
  };

  const orderStatuses = [
    {
      id: 'confirmed',
      title: 'Замовлення підтверджено',
      description: 'Ваше замовлення прийнято в роботу',
      icon: <CheckCircle className="w-5 h-5" />,
      completed: true,
      date: '15.03.2024 10:30'
    },
    {
      id: 'design_check',
      title: 'Перевірка макетів',
      description: 'Технічна перевірка файлів для друку',
      icon: <FileText className="w-5 h-5" />,
      completed: true,
      date: '15.03.2024 14:20'
    },
    {
      id: 'in_production',
      title: 'У виробництві',
      description: 'Друк та постобробка продукції',
      icon: <Printer className="w-5 h-5" />,
      completed: false,
      current: true,
      estimatedDate: '17.03.2024'
    },
    {
      id: 'quality_check',
      title: 'Контроль якості',
      description: 'Перевірка готової продукції',
      icon: <PackageCheck className="w-5 h-5" />,
      completed: false,
      estimatedDate: '18.03.2024'
    },
    {
      id: 'packaging',
      title: 'Упаковка',
      description: 'Підготовка до відправлення',
      icon: <Package className="w-5 h-5" />,
      completed: false,
      estimatedDate: '18.03.2024'
    },
    {
      id: 'shipped',
      title: 'Відправлено',
      description: 'Передано службі доставки',
      icon: <Truck className="w-5 h-5" />,
      completed: false,
      estimatedDate: '18.03.2024'
    }
  ];

  const trackingTips = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Актуальна інформація',
      description: 'Статус оновлюється кожні 30 хвилин'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email сповіщення',
      description: 'Отримуйте оновлення на ваш email'
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Підтримка 24/7',
      description: 'Зв\'яжіться з нами у разі питань'
    }
  ];

  return (
    <ModernLayout locale={locale} variant="default">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
          <Package className="w-4 h-4 mr-1" />
          Відстеження
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Відстежити замовлення
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Введіть номер замовлення, щоб відстежити статус виконання та доставки в режимі реального часу.
        </p>
      </div>

      {/* Search Form */}
      <Card className="max-w-2xl mx-auto mb-12">
        <CardHeader>
          <CardTitle className="text-center">Знайти замовлення</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Введіть номер замовлення (наприклад: PP-2024-001234)" 
                className="pl-12"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input type="email" placeholder="Email (необов'язково)" />
              <Input type="tel" placeholder="Телефон (необов'язково)" />
            </div>
            <Button className="w-full btn-hero">
              <Search className="w-4 h-4 mr-2" />
              Відстежити замовлення
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sample Order Status - for demonstration */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-heading font-bold mb-2">Статус замовлення</h2>
          <p className="text-muted-foreground">Приклад відстеження для демонстрації</p>
        </div>

        {/* Order Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Замовлення {sampleOrder.id}
              </CardTitle>
              <Badge className="bg-warning/10 text-warning border-warning/20">
                У виробництві
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Дата замовлення</div>
                <div className="font-medium">{sampleOrder.orderDate}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Очікувана готовність</div>
                <div className="font-medium">{sampleOrder.estimatedCompletion}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Спосіб доставки</div>
                <div className="font-medium">{sampleOrder.deliveryMethod}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Сума замовлення</div>
                <div className="font-medium text-primary">{sampleOrder.total} ₴</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Етапи виконання</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {orderStatuses.map((status, index) => (
                <div key={status.id} className="flex items-start gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${status.completed ? 'bg-success text-success-foreground' : 
                      status.current ? 'bg-warning text-warning-foreground animate-pulse' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    {status.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold ${status.current ? 'text-warning' : ''}`}>
                        {status.title}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        {status.date || (status.estimatedDate && `очіку. ${status.estimatedDate}`)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{status.description}</p>
                    {status.current && (
                      <div className="mt-2">
                        <Badge className="bg-warning/10 text-warning border-warning/20">
                          Поточний етап
                        </Badge>
                      </div>
                    )}
                  </div>
                  {index < orderStatuses.length - 1 && (
                    <div className={`
                      w-0.5 h-8 ml-5 -mb-2
                      ${status.completed ? 'bg-success/30' : 'bg-muted'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Товари в замовленні</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleOrder.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.quantity} шт</div>
                  </div>
                  <div className="text-primary font-semibold">{item.price} ₴</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tracking Tips */}
      <div className="mb-12">
        <h2 className="text-2xl font-heading font-bold text-center mb-8">
          Корисна інформація
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {trackingTips.map((tip, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {tip.icon}
                </div>
                <h3 className="font-semibold mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Інформація про доставку
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Нова Пошта</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>Відділення №123, вул. Центральна, 45</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>Трек-номер: {sampleOrder.trackingNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Режим роботи: Пн-Нд 08:00-20:00</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Важливо знати</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• СМС сповіщення про прибуття</li>
                <li>• Безкоштовне зберігання 5 днів</li>
                <li>• Потрібен паспорт для отримання</li>
                <li>• Можна оплатити при отриманні</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <div className="text-center bg-surface rounded-2xl p-8 border border-border">
        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-heading font-bold mb-4">
          Потрібна допомога?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Не можете знайти своє замовлення або маєте питання про статус виконання?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="btn-hero" asChild>
            <Link href="/contacts">
              <Phone className="w-5 h-5 mr-2" />
              Зв'язатися з підтримкою
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/help/delivery">
              <ArrowRight className="w-4 h-4 mr-2" />
              Про доставку
            </Link>
          </Button>
        </div>
      </div>
    </ModernLayout>
  );
}
