import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Clock, 
  Shield, 
  Truck,
  Eye,
  Download,
  CheckCircle,
  ChevronLeft,
  ArrowUpRight,
  Sparkles,
  Play
} from 'lucide-react';

interface ProductPageProps {
  params: { slug: string };
}

// Mock product data
const getProductBySlug = (slug: string) => {
  const products = {
    'canvas-30x40': {
      id: 'canvas-30x40',
      title: 'Холст 30x40 см з галерейною кромкою',
      shortTitle: 'Холст 30x40',
      description: 'Високоякісний друк вашого фото на художньому холсті з професійною галерейною кромкою. Ідеально підходить для портретів та пейзажів.',
      category: 'canvas',
      categoryName: 'Холст',
      basePrice: 450,
      originalPrice: 550,
      discount: 18,
      rating: 4.8,
      reviewsCount: 127,
      images: ['🖼️'],
      features: [
        'Художній холст 380г/м²',
        'Галерейна кромка 38мм',
        'Підрамник з соснових брусків',
        'Кріплення для підвішування'
      ],
      specs: {
        'Розмір': '30×40 см',
        'Товщина підрамника': '38 мм',
        'Матеріал холста': 'Бавовна/поліестер',
        'Кромка': 'Галерейна',
        'Час виконання': '24-48 годин'
      },
      options: [
        { name: 'Розмір', values: ['30×40 см (+0₴)', '40×60 см (+200₴)', '60×90 см (+400₴)'] },
        { name: 'Кромка', values: ['Галерейна', 'Дзеркальна (+50₴)', 'Біла (+30₴)'] },
        { name: 'Підрамник', values: ['18мм', '38мм (+100₴)'] }
      ],
      inStock: true,
      popular: true
    },
    'acrylic-30x30': {
      id: 'acrylic-30x30',
      title: 'Акрил 30x30 см з підсвіткою',
      shortTitle: 'Акрил 30x30',
      description: 'Преміум друк на акрилі з можливістю LED-підсвітки. Створює ефект глибини та об\'єму для ваших фотографій.',
      category: 'acrylic',
      categoryName: 'Акрил',
      basePrice: 350,
      originalPrice: 420,
      discount: 17,
      rating: 4.9,
      reviewsCount: 89,
      images: ['💎'],
      features: [
        'Акрил товщина 5мм',
        'Face-mount технологія',
        'Підсвітка LED (опціонально)',
        'Дистанційне кріплення'
      ],
      specs: {
        'Розмір': '30×30 см',
        'Товщина': '5 мм',
        'Матеріал': 'Акрил преміум',
        'Технологія': 'Face-mount',
        'Час виконання': '48-72 години'
      },
      options: [
        { name: 'Розмір', values: ['30×30 см (+0₴)', '40×40 см (+100₴)', '50×70 см (+350₴)'] },
        { name: 'Товщина', values: ['5мм', '8мм (+150₴)', '10мм (+250₴)'] },
        { name: 'Підсвітка', values: ['Без підсвітки', 'LED (+300₴)'] }
      ],
      inStock: true,
      popular: true
    }
  };
  
  return products[slug as keyof typeof products] || null;
};

export default async function ProductPage({ params: { slug } }: ProductPageProps) {
  const locale = 'uk';
  const product = getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  } catch (error) {
    messages = {};
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ModernLayout locale={locale} variant="product">
        {/* Компактный breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Назад до каталогу
          </Button>
          <span>/</span>
          <span>{product.categoryName}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{product.shortTitle}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images - Более компактные */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden group">
              <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/60 relative">
                <div className="absolute inset-4 bg-background rounded-xl border border-border/20 flex items-center justify-center shadow-sm">
                  <span className="text-6xl lg:text-7xl opacity-80">{product.images[0]}</span>
                </div>
                
                {/* Компактные badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {product.popular && (
                    <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
                      ХІТ
                    </Badge>
                  )}
                  {product.discount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                      -{product.discount}%
                    </Badge>
                  )}
                </div>

                {/* Floating action buttons */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                    <Heart className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                    <Share2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* 3D Preview */}
                <div className="absolute bottom-3 left-3">
                  <Button variant="secondary" size="sm" className="text-xs h-7 px-3">
                    <Play className="w-3 h-3 mr-1" />
                    3D
                  </Button>
                </div>
              </div>
            </Card>

            {/* Thumbnail gallery */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((index) => (
                <Card key={index} className="aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                  <div className="aspect-square bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center">
                    <span className="text-xl opacity-60">{product.images[0]}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Info - Более структурированная */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header section */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-heading font-bold leading-tight">
                    {product.title}
                  </h1>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviewsCount} відгуків)</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="ml-4">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-4 bg-muted/30 rounded-xl">
                <span className="text-3xl font-bold text-primary">{product.basePrice}₴</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice}₴
                  </span>
                )}
                <span className="text-sm text-green-600 font-medium ml-auto">
                  Економія {product.originalPrice ? product.originalPrice - product.basePrice : 0}₴
                </span>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Options - Компактные */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Налаштування
              </h3>
              {product.options.map((option) => (
                <div key={option.name} className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{option.name}:</label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Actions - Современные */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button size="lg" className="h-12 text-base font-semibold gap-2" asChild>
                  <a href={`/configurator?product=${slug}`}>
                    <ShoppingCart className="w-5 h-5" />
                    Налаштувати та замовити
                  </a>
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    3D Превью
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Шаблон
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Features и Guarantees - Объединенные */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Особливості:</h3>
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Гарантії:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-sm">24-48 годин виконання</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-sm">100% задоволення</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-sm">Безкоштовна доставка від 500₴</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModernLayout>
    </NextIntlClientProvider>
  );
}