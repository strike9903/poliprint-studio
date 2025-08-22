"use client";

import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  CheckCircle
} from 'lucide-react';

interface ProductPageProps {
  params: { locale: string; slug: string };
}

// Mock product data
const getProductBySlug = (slug: string) => {
  const products = {
    'canvas-30x40': {
      id: 'canvas-30x40',
      title: 'Холст 30x40 см з галерейною кромкою',
      description: 'Високоякісний друк вашого фото на художньому холсті з професійною галерейною кромкою. Ідеально підходить для портретів та пейзажів.',
      category: 'canvas',
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
      description: 'Преміум друк на акрилі з можливістю LED-підсвітки. Створює ефект глибини та об\'єму для ваших фотографій.',
      category: 'acrylic',
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

export default function ProductPage({ params: { locale, slug } }: ProductPageProps) {
  const product = getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  // Create JSON-LD structured data
  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': product.title,
    'description': product.description,
    'offers': {
      '@type': 'Offer',
      'url': `https://poliprint.com.ua/${locale}/product/${product.id}`,
      'priceCurrency': 'UAH',
      'price': product.basePrice,
      'availability': 'https://schema.org/InStock',
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-primary relative">
                  <div className="absolute inset-6 bg-surface rounded-lg border border-border/20 flex items-center justify-center">
                    <span className="text-8xl opacity-80">{product.images[0]}</span>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.popular && (
                      <Badge className="bg-primary text-primary-foreground">
                        Хіт продажів
                      </Badge>
                    )}
                    {product.discount > 0 && (
                      <Badge className="bg-destructive text-destructive-foreground">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button size="icon" variant="secondary" className="hover:scale-110 transition-transform">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="hover:scale-110 transition-transform">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="hover:scale-110 transition-transform">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* 3D Preview Button */}
                  <div className="absolute bottom-4 left-4">
                    <Button variant="secondary" size="sm">
                      3D Превью
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Image Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((index) => (
                  <Card key={index} className="aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <div className="aspect-square bg-gradient-accent flex items-center justify-center">
                      <span className="text-2xl opacity-60">{product.images[0]}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Каталог</span>
                  <span>/</span>
                  <span>Холст</span>
                  <span>/</span>
                  <span className="text-foreground">{product.title}</span>
                </div>

                <h1 className="text-3xl font-heading font-bold">{product.title}</h1>
                
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewsCount} відгуків)
                  </span>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">{product.basePrice} ₴</span>
                  {product.originalPrice > product.basePrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {product.originalPrice} ₴
                    </span>
                  )}
                </div>
                
                {product.inStock ? (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">В наявності</span>
                  </div>
                ) : (
                  <div className="text-destructive text-sm">Немає в наявності</div>
                )}
              </div>

              <Separator />

              {/* Options */}
              <div className="space-y-4">
                <h3 className="font-semibold">Налаштування</h3>
                {product.options.map((option) => (
                  <div key={option.name} className="space-y-2">
                    <label className="text-sm font-medium">{option.name}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {option.values.map((value) => (
                        <Button key={value} variant="outline" size="sm" className="justify-start">
                          {value}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button size="lg" className="btn-hero flex-1" onClick={() => {
                    alert(`Товар додано в кошик!`);
                    // TODO: Integrate with real cart context
                  }}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Додати в кошик
                  </Button>
                  <Button size="lg" variant="outline" className="px-6" asChild>
                    <a href={`/${locale}/configurator?product=${slug}`}>
                      Конфігуратор
                    </a>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <Clock className="w-5 h-5 mx-auto text-primary" />
                    <div className="text-xs text-muted-foreground">24-48 год</div>
                  </div>
                  <div className="space-y-1">
                    <Shield className="w-5 h-5 mx-auto text-success" />
                    <div className="text-xs text-muted-foreground">Гарантія якості</div>
                  </div>
                  <div className="space-y-1">
                    <Truck className="w-5 h-5 mx-auto text-accent" />
                    <div className="text-xs text-muted-foreground">Нова Пошта</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold">Особливості</h3>
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-12">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-lg mb-4">Технічні характеристики</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-b-0">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}