import { getTranslations } from 'next-intl/server';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { Sticker, Palette, Droplets, Star, ArrowRight, Check, Sun } from 'lucide-react';

interface StickersPageProps {
  params: { locale: string };
}

export const metadata = {
  title: "Друк наклейок та стикерів - Poliprint Studio",
  description: "Якісний друк наклейок на вінілі, папері, прозорій плівці. Водостійкі стикери для вулиці та приміщень.",
};

export default async function StickersPage({ params: { locale } }: StickersPageProps) {
  const stickerTypes = [
    {
      id: 'vinyl-stickers',
      title: 'Вінілові наклейки',
      description: 'Водостійкі, довговічні, ідеальні для вулиці',
      priceFrom: 150,
      features: ['Водостійкі', 'UV-стійкі', 'До 7 років служби'],
      popular: true,
    },
    {
      id: 'paper-stickers',
      title: 'Паперові наклейки',
      description: 'Економний варіант для внутрішнього використання',
      priceFrom: 80,
      features: ['Глянцевий лак', 'Матова ламінація', 'Швидке виготовлення'],
    },
    {
      id: 'transparent-stickers',
      title: 'Прозорі наклейки',
      description: 'На прозорій плівці для ефекту "друку на склі"',
      priceFrom: 200,
      features: ['Прозора основа', 'Стійкий клей', 'Преміум вигляд'],
      isNew: true,
    },
    {
      id: 'holographic-stickers',
      title: 'Голограмні наклейки',
      description: 'З голографічним ефектом для особливих проектів',
      priceFrom: 300,
      features: ['Голограма', 'Захист від підробки', 'Унікальний дизайн'],
    },
  ];

  const applications = [
    {
      icon: <Sticker className="w-5 h-5" />,
      title: 'Брендинг',
      description: 'Логотипи, етикетки, фірмовий стиль'
    },
    {
      icon: <Sun className="w-5 h-5" />,
      title: 'Реклама',
      description: 'Промо-наклейки, акційні стикери'
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      title: 'Декор',
      description: 'Інтер\'єрні рішення, автотюнінг'
    },
  ];

  const shapes = [
    'Круглі',
    'Квадратні', 
    'Прямокутні',
    'Овальні',
    'Фігурна вирубка',
    'Kiss-cut',
    'Die-cut',
    'Перфорація'
  ];

  return (
    <ModernLayout locale={locale} variant="default">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
          <Sticker className="w-4 h-4 mr-1" />
          Друк наклейок
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Наклейки та стикери
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Якісні наклейки на різних матеріалах. Від простих паперових стикерів 
          до водостійких вінілових наклейок з голографічним ефектом.
        </p>
      </div>

      {/* Applications */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {applications.map((app, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                {app.icon}
              </div>
              <h3 className="font-semibold mb-2">{app.title}</h3>
              <p className="text-sm text-muted-foreground">{app.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stickerTypes.map((sticker) => (
          <Card key={sticker.id} className="relative hover:shadow-glow transition-all hover-lift">
            {sticker.popular && (
              <div className="absolute -top-2 left-4">
                <Badge className="bg-success text-success-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Популярний
                </Badge>
              </div>
            )}
            {sticker.isNew && (
              <div className="absolute -top-2 right-4">
                <Badge className="bg-accent text-accent-foreground">
                  Новинка
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sticker className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg text-center">{sticker.title}</CardTitle>
              <p className="text-sm text-muted-foreground text-center">{sticker.description}</p>
            </CardHeader>
            
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-primary">від {sticker.priceFrom} ₴</div>
                <div className="text-sm text-muted-foreground">за 100 шт</div>
              </div>
              
              <div className="space-y-2 mb-6">
                {sticker.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    {feature}
                  </div>
                ))}
              </div>
              
              <Button className="w-full btn-hero group" asChild>
                <Link href={`/configurator?product=${sticker.id}`}>
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
              <h4 className="font-semibold mb-2">Матеріали</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Вініл (полімерний)</li>
                <li>• Папір глянцевий</li>
                <li>• Папір матовий</li>
                <li>• Прозора плівка</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Розміри</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Від 1x1 см</li>
                <li>• До 70x100 см</li>
                <li>• Рулонна печать</li>
                <li>• Листова печать</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Клей</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Постійний</li>
                <li>• Знімний</li>
                <li>• Сильної адгезії</li>
                <li>• Для низьких температур</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Захист</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ламінація</li>
                <li>• UV-лак</li>
                <li>• Анти-граффіті</li>
                <li>• Термостійкість</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">
          Потрібні спеціальні наклейки?
        </h2>
        <p className="text-muted-foreground mb-6">
          Ми виготовимо наклейки будь-якої складності за вашими вимогами
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="btn-hero" asChild>
            <Link href="/contacts">Консультація</Link>
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
