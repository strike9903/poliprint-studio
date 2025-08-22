import { NextIntlClientProvider } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowLeft, Share2, Heart } from 'lucide-react';
import dynamic from 'next/dynamic';

// Динамически импортируем Header как клиентский компонент
const Header = dynamic(
  () => import('@/components/layout/Header').then((mod) => mod.Header),
  { ssr: false }
);

interface BlogPostPageProps {
  params: { slug: string };
}

export default async function BlogPostPage({ params: { slug } }: BlogPostPageProps) {
  const locale = 'uk';
  let messages;
  
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch (error) {
    messages = {};
  }

  // Mock blog post data
  const post = {
    title: "Як підготувати макет для друку: повний гайд 2024",
    excerpt: "Детальна інструкція з підготовки файлів для якісного друку",
    content: `
      <h2>Вступ</h2>
      <p>Підготовка макетів для друку - це важливий етап, який визначає якість кінцевого результату. У цій статті ми розглянемо всі ключові моменти.</p>
      
      <h3>Основні вимоги</h3>
      <ul>
        <li><strong>Роздільна здатність:</strong> мінімум 300 DPI для якісного друку</li>
        <li><strong>Кольоровий профіль:</strong> CMYK для друку, RGB для веб</li>
        <li><strong>Вилети:</strong> 3-5 мм по всіх краях</li>
        <li><strong>Формат файлів:</strong> PDF, AI, PSD, TIFF</li>
      </ul>
      
      <h3>Покрокова інструкція</h3>
      <p>Щоб правильно підготувати макет для друку, дотримуйтесь наступних кроків:</p>
      <ol>
        <li>Створіть документ з правильними розмірами та вилетами</li>
        <li>Переконайтесь, що роздільна здатність становить 300 DPI</li>
        <li>Переведіть всі кольори в CMYK</li>
        <li>Перевірте шрифти та перетворіть їх на криві</li>
        <li>Збережіть у форматі PDF з потрібними налаштуваннями</li>
      </ol>
      
      <h3>Поширені помилки</h3>
      <p>Найчастіше зустрічаються такі помилки при підготовці макетів:</p>
      <ul>
        <li>Низька роздільна здатність (менше 300 DPI)</li>
        <li>Відсутність вилетів</li>
        <li>Використання RGB замість CMYK</li>
        <li>Важливі елементи занадто близько до краю</li>
      </ul>
    `,
    image: "📄",
    category: "Поради",
    author: "Олексій Друкар",
    date: "15 грудня 2024",
    readTime: "8 хв"
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header locale={locale} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Button variant="ghost" className="gap-2" asChild>
                <a href="/blog">
                  <ArrowLeft className="w-4 h-4" />
                  Назад до блогу
                </a>
              </Button>
            </div>

            {/* Article Header */}
            <div className="mb-8">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                {post.category}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                {post.title}
              </h1>
              
              {/* Meta */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Heart className="w-4 h-4" />
                    Подобається
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Поділитися
                  </Button>
                </div>
              </div>

              {/* Featured Image */}
              <Card className="overflow-hidden mb-8">
                <div className="aspect-video bg-gradient-primary relative">
                  <div className="absolute inset-8 bg-surface rounded-lg border border-border/20 flex items-center justify-center">
                    <span className="text-8xl opacity-80">{post.image}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Author Info */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-2xl text-primary-foreground">👨‍💻</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{post.author}</h3>
                    <p className="text-muted-foreground text-sm">
                      Експерт з підготовки макетів та друку з 10-річним досвідом. 
                      Спеціалізується на поліграфічній продукції та брендингу.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Articles */}
            <div>
              <h3 className="text-2xl font-heading font-bold mb-6">Схожі статті</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Топ-5 трендів у дизайні візиток 2024",
                    image: "💼",
                    slug: "business-card-trends-2024"
                  },
                  {
                    title: "Порівняння матеріалів: холст vs акрил vs метал",
                    image: "🖼️", 
                    slug: "materials-comparison"
                  }
                ].map((article, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="w-24 h-24 bg-gradient-accent flex items-center justify-center">
                          <span className="text-2xl opacity-80">{article.image}</span>
                        </div>
                        <div className="flex-1 p-4">
                          <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h4>
                          <Button variant="ghost" size="sm" className="p-0 h-auto mt-2" asChild>
                            <a href={`/blog/${article.slug}`}>
                              Читати
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
        <footer className="border-t py-6 mt-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PrintStudio. Всі права захищені.
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}