import { getTranslations } from 'next-intl/server';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { FileText, Palette, Clock, Star, ArrowRight, Check } from 'lucide-react';

interface FlyersPageProps {
  params: { locale: string };
}

export default async function FlyersPage({ params: { locale } }: FlyersPageProps) {
  const t = await getTranslations('FlyersPage');

  const flyerTypes = [
    {
      id: 'flyer-a6',
      title: 'Листівки A6 (10x15 см)',
      description: 'Компактний формат для промо-акцій та анонсів',
      priceFrom: 80,
      features: ['Глянцевий лак', 'Двостороння печать', 'Швидке виготовлення'],
      popular: true,
    },
    {
      id: 'flyer-a5',
      title: 'Листівки A5 (14.8x21 см)',
      description: 'Стандартний формат з більшим простором для інформації',
      priceFrom: 120,
      features: ['Матова ламінація', 'Вибір паперу', 'Дизайн-макет'],
    },
    {
      id: 'flyer-a4',
      title: 'Листівки A4 (21x29.7 см)',
      description: 'Великий формат для детальної презентації товарів',
      priceFrom: 180,
      features: ['Преміум папір', 'UV-лак', 'Фольгування'],
    },
    {
      id: 'flyer-custom',
      title: 'Нестандартний розмір',
      description: 'Індивідуальні розміри під ваші потреби',
      priceFrom: 150,
      features: ['Будь-який розмір', 'Вирубка', 'Спеціальні ефекти'],
      isNew: true,
    },
  ];

  const benefits = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Швидке виготовлення',
      description: 'Від 1 дня в залежності від тиражу'
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: 'Якісна печать',
      description: 'Цифрова та офсетна печать'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Постобробка',
      description: 'Ламінація, лак, фольгування'
    },
  ];

  return (
    <ModernLayout locale={locale} variant="default">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
          <FileText className="w-4 h-4 mr-1" />
          Друк листівок
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Листівки та флаєри
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ефективний маркетинговий інструмент для промо-акцій, анонсів та реклами. 
          Якісна печать на різних форматах з можливістю постобробки.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {benefits.map((benefit, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                {benefit.icon}
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {flyerTypes.map((flyer) => (
          <Card key={flyer.id} className="relative hover:shadow-glow transition-all hover-lift">
            {flyer.popular && (
              <div className="absolute -top-2 left-4">
                <Badge className="bg-success text-success-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Популярний
                </Badge>
              </div>
            )}
            {flyer.isNew && (
              <div className="absolute -top-2 right-4">
                <Badge className="bg-accent text-accent-foreground">
                  Новинка
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg text-center">{flyer.title}</CardTitle>
              <p className="text-sm text-muted-foreground text-center">{flyer.description}</p>
            </CardHeader>
            
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-primary">від {flyer.priceFrom} ₴</div>
                <div className="text-sm text-muted-foreground">за 100 шт</div>
              </div>
              
              <div className="space-y-2 mb-6">
                {flyer.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    {feature}
                  </div>
                ))}
              </div>
              
              <Button className="w-full btn-hero group" asChild>
                <Link href={`/configurator?product=${flyer.id}`}>
                  Замовити
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technical Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Технічні характеристики</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Формати</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• A6 (10x15 см)</li>
                <li>• A5 (14.8x21 см)</li>
                <li>• A4 (21x29.7 см)</li>
                <li>• Нестандартні розміри</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Папір</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 130-350 г/м²</li>
                <li>• Глянцевий/матовий</li>
                <li>• Дизайнерський</li>
                <li>• Екологічний</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Печать</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 4+0 (одностороння)</li>
                <li>• 4+4 (двостороння)</li>
                <li>• Pantone кольори</li>
                <li>• Білий та лаки</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Постобробка</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ламінація</li>
                <li>• UV-лак</li>
                <li>• Фольгування</li>
                <li>• Вирубка</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">
          Потрібна консультація?
        </h2>
        <p className="text-muted-foreground mb-6">
          Наші менеджери допоможуть обрати оптимальний варіант для ваших завдань
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="btn-hero" asChild>
            <Link href="/contacts">Зв'язатися з нами</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/configurator">
              <Palette className="w-5 h-5 mr-2" />
              Створити дизайн
            </Link>
          </Button>
        </div>
      </div>
    </ModernLayout>
  );
}