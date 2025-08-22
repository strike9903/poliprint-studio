import { NextIntlClientProvider } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, Eye } from 'lucide-react';
import dynamic from 'next/dynamic';

// Динамически импортируем Header как клиентский компонент
const Header = dynamic(
  () => import('@/components/layout/Header').then((mod) => mod.Header),
  { ssr: false }
);

const mockTemplates = [
  {
    id: 1,
    title: "Візитка класична",
    category: "Візитки", 
    preview: "💼",
    downloads: 2341,
    featured: true
  },
  {
    id: 2,
    title: "Листівка новорічна",
    category: "Листівки",
    preview: "🎄", 
    downloads: 1890,
    featured: false
  },
  {
    id: 3,
    title: "Постер мотиваційний",
    category: "Постери",
    preview: "⚡",
    downloads: 987,
    featured: true
  },
  {
    id: 4,
    title: "Брошура корпоративна",
    category: "Брошури",
    preview: "📋",
    downloads: 654,
    featured: false
  },
  {
    id: 5,
    title: "Етикетка продукту",
    category: "Етикетки", 
    preview: "🏷️",
    downloads: 432,
    featured: false
  },
  {
    id: 6,
    title: "Сертифікат досягнень",
    category: "Сертифікати",
    preview: "🏆",
    downloads: 789,
    featured: true
  }
];

export default async function TemplatesPage() {
  const locale = 'uk';
  let messages;
  
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch (error) {
    messages = {};
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header locale={locale} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
              {/* Page Header */}
              <div className="text-center mb-12">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  500+ шаблонів
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                  Готові шаблони для друку
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Професійні макети від досвідчених дизайнерів. Завантажуйте, редагуйте та друкуйте.
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Пошук шаблонів..." 
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Фільтри
                </Button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["Всі", "Візитки", "Листівки", "Постери", "Брошури", "Етикетки", "Сертифікати"].map((category) => (
                  <Badge 
                    key={category}
                    variant={category === "Всі" ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <CardContent className="p-0">
                      {/* Preview */}
                      <div className="aspect-[3/4] bg-gradient-primary relative">
                        <div className="absolute inset-4 bg-surface rounded-lg border border-border/20 flex items-center justify-center">
                          <span className="text-6xl opacity-80">{template.preview}</span>
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2">
                          {template.featured && (
                            <Badge className="bg-accent text-accent-foreground">
                              Хіт
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {template.downloads.toLocaleString()} завантажень
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm mb-3">{template.title}</h3>
                        <Button size="sm" className="w-full gap-2">
                          <Download className="w-4 h-4" />
                          Завантажити
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Завантажити ще
                </Button>
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