import { ModernLayout } from '@/components/layout/ModernLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight,
  Lightbulb,
  Palette,
  FileText,
  Printer,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface BlogPageProps {
  params: { locale: string };
}

// Generate metadata for blog page
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return generateSEOMetadata({
    title: 'Блог про друк та дизайн - Поради та новини | Poliprint',
    description: 'Корисні статті про поліграфію, дизайн, технології друку та тренди в індустрії від професіоналів Poliprint.',
    keywords: 'блог, дизайн, друк, поліграфія, статті, поради, новини, тренди',
    url: `/${locale}/blog`,
    locale,
    alternateLocales: ['uk', 'ru'],
    type: 'website',
    image: '/images/og-blog.jpg'
  });
}

export default async function BlogPage({ params: { locale } }: BlogPageProps) {
  const featuredPost = {
    id: 'dtf-printing-revolution',
    title: 'DTF друк - революція в текстильній індустрії',
    excerpt: 'Дізнайтеся, чому DTF технологія стає новим стандартом у друкуванні на тканині та як вона змінює ринок персоналізованого одягу.',
    content: 'Direct-to-Film (DTF) друк представляє новий етап розвитку технологій друку на текстилі. На відміну від традиційного сублімаційного друку або технології DTG, DTF дозволяє друкувати на будь-яких типах тканин...',
    author: 'Анна Коваленко',
    date: '15 березня 2024',
    readTime: '5 хв читання',
    category: 'Технології',
    image: '/blog/dtf-printing.jpg',
    featured: true
  };

  const blogPosts = [
    {
      id: 'design-trends-2024',
      title: '10 трендів дизайну візиток у 2024 році',
      excerpt: 'Від мінімалізму до максималізму: огляд найактуальніших трендів у дизайні візиток цього року.',
      author: 'Михайло Петренко',
      date: '12 березня 2024',
      readTime: '3 хв читання',
      category: 'Дизайн',
      icon: <Palette className="w-5 h-5" />
    },
    {
      id: 'eco-friendly-printing',
      title: 'Екологічний друк: міфи та реальність',
      excerpt: 'Розбираємо, що насправді означає "екологічний друк" та які технології дійсно безпечні для довкілля.',
      author: 'Олена Мороз',
      date: '8 березня 2024',
      readTime: '7 хв читання',
      category: 'Екологія',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'color-management',
      title: 'Управління кольором: від екрана до паперу',
      excerpt: 'Покрокова інструкція з налаштування кольорових профілів для точного відтворення кольорів при друці.',
      author: 'Дмитро Іванов',
      date: '5 березня 2024',
      readTime: '6 хв читання',
      category: 'Технічні поради',
      icon: <Printer className="w-5 h-5" />
    },
    {
      id: 'packaging-psychology',
      title: 'Психологія упаковки: як дизайн впливає на продажі',
      excerpt: 'Досліджуємо, як правильний дизайн упаковки може підвищити продажі та лояльність клієнтів.',
      author: 'Ірина Шевченко',
      date: '1 березня 2024',
      readTime: '4 хв читання',
      category: 'Маркетинг',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: 'print-quality-tips',
      title: '5 секретів ідеальної якості друку',
      excerpt: 'Професійні поради від наших технологів: як досягти найкращого результату при друці.',
      author: 'Сергій Коваль',
      date: '28 лютого 2024',
      readTime: '5 хв читання',
      category: 'Технічні поради',
      icon: <Lightbulb className="w-5 h-5" />
    },
    {
      id: 'typography-in-print',
      title: 'Типографіка в поліграфії: правила та винятки',
      excerpt: 'Як вибрати правильний шрифт для друку та уникнути найпоширеніших помилок у типографіці.',
      author: 'Катерина Бондар',
      date: '25 лютого 2024',
      readTime: '8 хв читання',
      category: 'Дизайн',
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const categories = [
    { name: 'Технології', count: 8, color: 'bg-primary/10 text-primary border-primary/20' },
    { name: 'Дизайн', count: 12, color: 'bg-accent/10 text-accent border-accent/20' },
    { name: 'Технічні поради', count: 6, color: 'bg-success/10 text-success border-success/20' },
    { name: 'Маркетинг', count: 4, color: 'bg-warning/10 text-warning border-warning/20' },
    { name: 'Екологія', count: 3, color: 'bg-info/10 text-info border-info/20' }
  ];

  return (
    <ModernLayout locale={locale} variant="default">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
          <BookOpen className="w-4 h-4 mr-1" />
          Блог
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Блог про друк та дизайн
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Професійні поради, новини індустрії та корисні інструкції від експертів Poliprint Studio. 
          Дізнавайтеся більше про світ поліграфії та дизайну.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {categories.map((category, index) => (
          <Badge key={index} className={`${category.color} cursor-pointer hover:opacity-80 transition-opacity`}>
            {category.name} ({category.count})
          </Badge>
        ))}
      </div>

      {/* Featured Post */}
      <Card className="mb-12 overflow-hidden hover:shadow-glow transition-all">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-8 md:p-12 flex items-center">
            <div>
              <Badge className="bg-primary text-primary-foreground mb-4">
                Рекомендована стаття
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-muted-foreground mb-6">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {featuredPost.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {featuredPost.readTime}
                </div>
              </div>
              <Button className="btn-hero" asChild>
                <Link href={`/blog/${featuredPost.id}`}>
                  Читати статтю
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-8 flex items-center justify-center">
            <div className="w-32 h-32 bg-background rounded-2xl flex items-center justify-center shadow-lg">
              <Printer className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>
      </Card>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {blogPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-glow transition-all hover-lift">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                {post.icon}
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs w-fit">
                  {post.category}
                </Badge>
                <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/blog/${post.id}`}>
                  Читати більше
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="text-center bg-surface rounded-2xl p-8 border border-border">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-heading font-bold mb-4">
          Отримуйте свіжі статті першими
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Підпишіться на нашу розсилку та отримуйте корисні поради, новини та спецпропозиції
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button size="lg" className="btn-hero" asChild>
            <Link href="/contacts">
              Підписатися на новини
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/catalog">
              <ArrowRight className="w-4 h-4 mr-2" />
              Перейти до каталогу
            </Link>
          </Button>
        </div>
      </div>
    </ModernLayout>
  );
}