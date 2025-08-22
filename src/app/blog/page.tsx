import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { Calendar, Clock, User, ArrowRight, Search, Filter } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "Як підготувати макет для друку: повний гайд 2024",
    excerpt: "Детальна інструкція з підготовки файлів для якісного друку. Формати, роздільна здатність, вилети та інші важливі нюанси.",
    image: "📄",
    category: "Поради",
    author: "Олексій Друкар",
    date: "15 грудня 2024",
    readTime: "8 хв",
    slug: "prepare-layout-for-print-2024",
    featured: true
  },
  {
    id: 2,
    title: "Топ-5 трендів у дизайні візиток 2024",
    excerpt: "Які стилі та рішення будуть актуальними цього року. Мінімалізм, градієнти, фактури та багато іншого.",
    image: "💼",
    category: "Тренди",
    author: "Марія Дизайнер",
    date: "12 грудня 2024",
    readTime: "5 хв",
    slug: "business-card-trends-2024",
    featured: false
  },
  {
    id: 3,
    title: "Порівняння матеріалів: холст vs акрил vs метал",
    excerpt: "Аналізуємо переваги та недоліки різних матеріалів для друку фотографій. Що вибрати для вашого проекту?",
    image: "🖼️",
    category: "Матеріали",
    author: "Петро Технолог",
    date: "10 грудня 2024",
    readTime: "12 хв",
    slug: "materials-comparison-canvas-acrylic-metal",
    featured: true
  },
  {
    id: 4,
    title: "Психологія кольору в рекламній поліграфії",
    excerpt: "Як правильно підібрати кольорову гаму для максимального впливу на цільову аудиторію.",
    image: "🎨",
    category: "Маркетинг",
    author: "Анна Психолог",
    date: "8 грудня 2024",
    readTime: "10 хв",
    slug: "color-psychology-in-advertising",
    featured: false
  },
  {
    id: 5,
    title: "Секрети професійної обробки зображень",
    excerpt: "Техніки підвищення якості фото перед друком. Корекція кольору, різкість, контрастність.",
    image: "⚡",
    category: "Обробка",
    author: "Сергій Ретушер",
    date: "5 грудня 2024",
    readTime: "15 хв",
    slug: "professional-image-processing-secrets",
    featured: false
  },
  {
    id: 6,
    title: "Екологічний друк: майбутнє поліграфії",
    excerpt: "Сучасні екологічні технології друку та матеріали. Як зменшити вплив на довкілля.",
    image: "🌱",
    category: "Екологія",
    author: "Ольга Еколог",
    date: "3 грудня 2024",
    readTime: "7 хв",
    slug: "eco-friendly-printing-future",
    featured: true
  }
];

export default function BlogPage() {
  const locale = 'uk';
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <ModernLayout locale={locale} variant="default">
              {/* Page Header */}
              <div className="text-center mb-12">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  Корисні статті
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                  Блог про друк і дизайн
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Поради від експертів, останні тренди та секрети професійного друку.
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Пошук статей..." 
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Категорії
                </Button>
              </div>

              {/* Featured Posts */}
              <div className="mb-12">
                <h2 className="text-2xl font-heading font-bold mb-6">Рекомендовані статті</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <CardContent className="p-0">
                        {/* Image */}
                        <div className="aspect-video bg-gradient-primary relative">
                          <div className="absolute inset-4 bg-surface rounded-lg border border-border/20 flex items-center justify-center">
                            <span className="text-4xl opacity-80">{post.image}</span>
                          </div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-primary text-primary-foreground">
                              {post.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          {/* Meta */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {post.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {post.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.readTime}
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm" className="w-full group/btn" asChild>
                            <a href={`/blog/${post.slug}`}>
                              Читати далі
                              <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Regular Posts */}
              <div className="mb-12">
                <h2 className="text-2xl font-heading font-bold mb-6">Всі статті</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Image */}
                          <div className="w-32 h-32 bg-gradient-accent flex items-center justify-center">
                            <span className="text-3xl opacity-80">{post.image}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4">
                            <Badge variant="outline" className="text-xs mb-2">
                              {post.category}
                            </Badge>
                            <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {post.excerpt}
                            </p>
                            
                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                              <span>{post.author}</span>
                              <span>{post.date}</span>
                              <span>{post.readTime}</span>
                            </div>
                            
                            <Button variant="ghost" size="sm" className="p-0 h-auto group/btn" asChild>
                              <a href={`/blog/${post.slug}`}>
                                Читати далі
                                <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <Card className="bg-gradient-primary">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-heading font-bold mb-4 text-primary-foreground">
                    Підписка на новини
                  </h3>
                  <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
                    Отримуйте нові статті та поради прямо на пошту
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input 
                      placeholder="Ваша електронна пошта" 
                      className="bg-background"
                    />
                    <Button variant="secondary">
                      Підписатися
                    </Button>
                  </div>
                </CardContent>
              </Card>
    </ModernLayout>
  );
}