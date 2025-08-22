import { ModernLayout } from '@/components/layout/ModernLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { 
  FileText, 
  Download,
  Search,
  Filter,
  Star,
  Eye,
  ArrowRight,
  CreditCard,
  Palette,
  Briefcase,
  Gift,
  ShoppingBag,
  MessageSquare,
  Calendar,
  Award
} from 'lucide-react';

interface TemplatesPageProps {
  params: { locale: string };
}

// Generate metadata for templates page
export async function generateMetadata({ params }: TemplatesPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return generateSEOMetadata({
    title: 'Готові шаблони для друку - Візитки, листівки, постери | Poliprint',
    description: 'Більше 1000+ готових шаблонів для друку. Візитки, листівки, постери, запрошення. Безкоштовні та преміум дизайни. Швидке редагування онлайн.',
    keywords: 'шаблони, дизайн, візитки, листівки, постери, запрошення, безкоштовні шаблони, готові дизайни',
    url: `/${locale}/templates`,
    locale,
    alternateLocales: ['uk', 'ru'],
    type: 'website',
    image: '/images/og-templates.jpg'
  });
}

export default async function TemplatesPage({ params: { locale } }: TemplatesPageProps) {
  const templateCategories = [
    {
      id: 'business-cards',
      name: 'Візитки',
      description: 'Професійні шаблони візиток',
      count: 847,
      icon: <CreditCard className="w-6 h-6" />,
      popular: true,
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      id: 'flyers',
      name: 'Листівки та флаєри',
      description: 'Рекламні матеріали та промо',
      count: 623,
      icon: <FileText className="w-6 h-6" />,
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      id: 'branding',
      name: 'Брендинг',
      description: 'Логотипи та фірмовий стиль',
      count: 456,
      icon: <Palette className="w-6 h-6" />,
      gradient: 'from-success/20 to-success/5'
    },
    {
      id: 'packaging',
      name: 'Упаковка',
      description: 'Коробки, етикетки, пакети',
      count: 298,
      icon: <ShoppingBag className="w-6 h-6" />,
      gradient: 'from-warning/20 to-warning/5'
    },
    {
      id: 'presentations',
      name: 'Презентації',
      description: 'Бізнес презентації та звіти',
      count: 187,
      icon: <Briefcase className="w-6 h-6" />,
      gradient: 'from-info/20 to-info/5'
    },
    {
      id: 'social-media',
      name: 'Соціальні мережі',
      description: 'Пости для Instagram, Facebook',
      count: 734,
      icon: <MessageSquare className="w-6 h-6" />,
      gradient: 'from-purple/20 to-purple/5'
    },
    {
      id: 'invitations',
      name: 'Запрошення',
      description: 'Весільні, святкові запрошення',
      count: 412,
      icon: <Gift className="w-6 h-6" />,
      gradient: 'from-rose/20 to-rose/5'
    },
    {
      id: 'calendars',
      name: 'Календарі',
      description: 'Настільні та настінні календарі',
      count: 89,
      icon: <Calendar className="w-6 h-6" />,
      gradient: 'from-emerald/20 to-emerald/5'
    }
  ];

  const featuredTemplates = [
    {
      id: 'modern-business-card',
      title: 'Сучасна візитка для IT',
      category: 'Візитки',
      downloads: 1247,
      rating: 4.9,
      preview: '/templates/modern-business-card.jpg',
      premium: false
    },
    {
      id: 'restaurant-flyer',
      title: 'Флаєр для ресторану',
      category: 'Листівки',
      downloads: 856,
      rating: 4.8,
      preview: '/templates/restaurant-flyer.jpg',
      premium: true
    },
    {
      id: 'eco-packaging',
      title: 'Еко-упаковка для косметики',
      category: 'Упаковка',
      downloads: 432,
      rating: 4.9,
      preview: '/templates/eco-packaging.jpg',
      premium: true
    },
    {
      id: 'wedding-invitation',
      title: 'Весільне запрошення мінімал',
      category: 'Запрошення',
      downloads: 678,
      rating: 5.0,
      preview: '/templates/wedding-invitation.jpg',
      premium: false
    }
  ];

  const stats = [
    { number: '2000+', label: 'Шаблонів' },
    { number: '50+', label: 'Категорій' },
    { number: '10K+', label: 'Завантажень' },
    { number: '4.8', label: 'Середній рейтинг' }
  ];

  return (
    <ModernLayout locale={locale} variant="default">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
          <FileText className="w-4 h-4 mr-1" />
          Готові шаблони
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Професійні шаблони для друку
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Більше 2000 готових шаблонів для всіх видів поліграфічної продукції. 
          Безкоштовні та преміум дизайни від професійних дизайнерів.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text" 
            placeholder="Пошук шаблонів..." 
            className="w-full pl-12 pr-24 py-4 border border-border rounded-2xl bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Filter className="w-4 h-4 mr-2" />
            Фільтри
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Templates */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold">Популярні шаблони</h2>
          <Button variant="outline" asChild>
            <Link href="/templates/featured">
              Всі популярні
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-glow transition-all hover-lift">
              <div className="relative">
                <div className="aspect-[3/4] bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-primary opacity-50" />
                </div>
                {template.premium && (
                  <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground">
                    Premium
                  </Badge>
                )}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white bg-black/70 px-2 py-1 rounded text-xs">
                  <Eye className="w-3 h-3" />
                  {template.downloads}
                </div>
              </div>
              
              <CardContent className="p-4">
                <Badge variant="outline" className="text-xs mb-2 w-fit">
                  {template.category}
                </Badge>
                <h3 className="font-semibold mb-2 text-sm line-clamp-2">
                  {template.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-current text-warning" />
                    {template.rating}
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Завантажити
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Template Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-heading font-bold text-center mb-8">
          Категорії шаблонів
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templateCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-glow transition-all hover-lift cursor-pointer">
              <CardHeader>
                <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 relative`}>
                  {category.icon}
                  {category.popular && (
                    <div className="absolute -top-1 -right-1">
                      <Award className="w-5 h-5 text-warning fill-current" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-center text-lg">{category.name}</CardTitle>
                <p className="text-sm text-muted-foreground text-center">{category.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {category.count}
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    доступних шаблонів
                  </div>
                  <Button className="w-full btn-hero" asChild>
                    <Link href={`/templates/${category.id}`}>
                      Переглянути
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Design CTA */}
      <div className="text-center bg-surface rounded-2xl p-8 border border-border">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-heading font-bold mb-4">
          Не знайшли підходящий шаблон?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Наші дизайнери створять унікальний дизайн спеціально для вашого проекту
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="btn-hero" asChild>
            <Link href="/configurator">
              <Palette className="w-5 h-5 mr-2" />
              AI Конфігуратор
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contacts">
              Консультація дизайнера
            </Link>
          </Button>
        </div>
      </div>
    </ModernLayout>
  );
}
