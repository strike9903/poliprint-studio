"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Heart, ShoppingCart, Eye, Star, Lightbulb, ChevronDown, Sparkles, Zap, Diamond } from 'lucide-react';

interface AcrylicProduct {
  id: number;
  title: string;
  image: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewsCount: number;
  sizes: {
    name: string;
    width: number;
    height: number;
    price: number;
    thickness: string;
  }[];
  options: {
    name: string;
    values: { name: string; price: number }[];
  }[];
  popular?: boolean;
  premium?: boolean;
}

const acrylicProducts: AcrylicProduct[] = [
  {
    id: 1,
    title: "Сучасна архітектура",
    image: "🏢",
    description: "Стильна архітектурна композиція з грою світла і тіні на акрилі",
    basePrice: 650,
    originalPrice: 780,
    discount: 17,
    rating: 4.9,
    reviewsCount: 87,
    popular: true,
    premium: true,
    sizes: [
      { name: "30×30 см", width: 30, height: 30, price: 650, thickness: "5мм" },
      { name: "40×40 см", width: 40, height: 40, price: 850, thickness: "5мм" },
      { name: "50×50 см", width: 50, height: 50, price: 1150, thickness: "8мм" },
      { name: "70×70 см", width: 70, height: 70, price: 1650, thickness: "10мм" },
    ],
    options: [
      { 
        name: "Товщина", 
        values: [
          { name: "5мм (стандарт)", price: 0 },
          { name: "8мм (+150₴)", price: 150 },
          { name: "10мм (+300₴)", price: 300 }
        ]
      },
      {
        name: "LED підсвітка",
        values: [
          { name: "Без підсвітки", price: 0 },
          { name: "LED підсвітка (+400₴)", price: 400 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Кольорові абстракції",
    image: "🌈",
    description: "Яскрава абстрактна композиція з неоновими кольорами та градієнтами",
    basePrice: 580,
    rating: 4.8,
    reviewsCount: 124,
    popular: true,
    sizes: [
      { name: "25×35 см", width: 25, height: 35, price: 580, thickness: "5мм" },
      { name: "35×50 см", width: 35, height: 50, price: 780, thickness: "5мм" },
      { name: "50×70 см", width: 50, height: 70, price: 1080, thickness: "8мм" },
      { name: "70×100 см", width: 70, height: 100, price: 1580, thickness: "10мм" },
    ],
    options: [
      { 
        name: "Товщина", 
        values: [
          { name: "5мм (стандарт)", price: 0 },
          { name: "8мм (+120₴)", price: 120 },
          { name: "10мм (+250₴)", price: 250 }
        ]
      },
      {
        name: "Ефекти",
        values: [
          { name: "Стандарт", price: 0 },
          { name: "Матовий (+100₴)", price: 100 },
          { name: "LED підсвітка (+350₴)", price: 350 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Мінімалізм",
    image: "⚪",
    description: "Елегантна мінімалістична композиція з чистими лініями та формами",
    basePrice: 520,
    originalPrice: 620,
    discount: 16,
    rating: 4.7,
    reviewsCount: 96,
    premium: true,
    sizes: [
      { name: "40×20 см", width: 40, height: 20, price: 520, thickness: "5мм" },
      { name: "60×30 см", width: 60, height: 30, price: 720, thickness: "5мм" },
      { name: "80×40 см", width: 80, height: 40, price: 1020, thickness: "8мм" },
      { name: "120×60 см", width: 120, height: 60, price: 1520, thickness: "10мм" },
    ],
    options: [
      { 
        name: "Товщина", 
        values: [
          { name: "5мм (стандарт)", price: 0 },
          { name: "8мм (+130₴)", price: 130 },
          { name: "10мм (+270₴)", price: 270 }
        ]
      },
      {
        name: "Обробка",
        values: [
          { name: "Глянець", price: 0 },
          { name: "Матова (+80₴)", price: 80 },
          { name: "Сатин (+120₴)", price: 120 }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Космічні пейзажі",
    image: "🪐",
    description: "Фантастичні космічні види з планетами, зірками та туманностями",
    basePrice: 690,
    rating: 4.9,
    reviewsCount: 143,
    popular: true,
    sizes: [
      { name: "30×45 см", width: 30, height: 45, price: 690, thickness: "5мм" },
      { name: "40×60 см", width: 40, height: 60, price: 890, thickness: "8мм" },
      { name: "60×90 см", width: 60, height: 90, price: 1290, thickness: "8мм" },
      { name: "80×120 см", width: 80, height: 120, price: 1790, thickness: "10мм" },
    ],
    options: [
      { 
        name: "Товщина", 
        values: [
          { name: "5мм (стандарт)", price: 0 },
          { name: "8мм (+160₴)", price: 160 },
          { name: "10мм (+320₴)", price: 320 }
        ]
      },
      {
        name: "LED підсвітка",
        values: [
          { name: "Без підсвітки", price: 0 },
          { name: "LED підсвітка (+450₴)", price: 450 },
          { name: "RGB підсвітка (+650₴)", price: 650 }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Флора і фауна",
    image: "🦋",
    description: "Красиві зображення природи з яскравими кольорами та деталями",
    basePrice: 610,
    originalPrice: 730,
    discount: 16,
    rating: 4.6,
    reviewsCount: 78,
    sizes: [
      { name: "35×35 см", width: 35, height: 35, price: 610, thickness: "5мм" },
      { name: "50×50 см", width: 50, height: 50, price: 810, thickness: "8мм" },
      { name: "70×70 см", width: 70, height: 70, price: 1210, thickness: "8мм" },
      { name: "90×90 см", width: 90, height: 90, price: 1710, thickness: "10мм" },
    ],
    options: [
      { 
        name: "Товщина", 
        values: [
          { name: "5мм (стандарт)", price: 0 },
          { name: "8мм (+140₴)", price: 140 },
          { name: "10мм (+280₴)", price: 280 }
        ]
      },
      {
        name: "Обробка",
        values: [
          { name: "Глянець", price: 0 },
          { name: "Матова (+90₴)", price: 90 }
        ]
      }
    ]
  }
];

interface AcrylicGalleryProps {
  locale: string;
}

export function AcrylicGallery({ locale }: AcrylicGalleryProps) {
  const [selectedProduct, setSelectedProduct] = useState<AcrylicProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: AcrylicProduct) => {
    setSelectedProduct(product);
    setSelectedSize(0);
    setSelectedOptions(new Array(product.options.length).fill(0));
    setIsModalOpen(true);
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;
    
    let total = selectedProduct.sizes[selectedSize].price;
    selectedOptions.forEach((optionIndex, categoryIndex) => {
      total += selectedProduct.options[categoryIndex].values[optionIndex].price;
    });
    
    return total;
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const size = selectedProduct.sizes[selectedSize];
      const selectedOptionValues = selectedOptions.map((optionIndex, categoryIndex) => 
        selectedProduct.options[categoryIndex].values[optionIndex]
      );
      
      console.log('Додано в корзину (акрил):', {
        product: selectedProduct.title,
        size: size.name,
        options: selectedOptionValues,
        totalPrice: calculateTotalPrice()
      });
      
      setIsModalOpen(false);
      // TODO: Добавить в реальную корзину
    }
  };

  return (
    <div className="space-y-8">
      {/* Stunning Glass Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 lg:p-16 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.4),transparent_50%)] opacity-70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.3),transparent_50%)] opacity-60"></div>
        
        <div className="relative text-center space-y-8">
          <div className="flex justify-center">
            <Badge className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 shadow-2xl px-6 py-3 text-base font-bold backdrop-blur-sm">
              💎 Преміум друк на акрилі
            </Badge>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-heading font-black bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-700 bg-clip-text text-transparent leading-tight">
            Кришталь<br/>на чіткість
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <Collapsible>
              <div className="text-xl text-indigo-700/90 font-semibold mb-6">
                Преміум акрил з LED підсвіткою та 3D ефектом
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 text-sm gap-2 mb-4">
                  Особливості технології <ChevronDown className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
                  <p className="text-indigo-600/80 leading-relaxed mb-4">
                    Face-mount технологія забезпечує неймовірну глибину кольорів. 
                    Преміум акрил 3-10мм з полірованими краями та дистанційними кріпленнями.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <Diamond className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <div className="font-semibold text-blue-700">Face-mount</div>
                      <div className="text-blue-600/70">Максимальна чіткість</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <Lightbulb className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      <div className="font-semibold text-purple-700">LED підсвітка</div>
                      <div className="text-purple-600/70">Додатковий WOW-ефект</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <Sparkles className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                      <div className="font-semibold text-indigo-700">3D глибина</div>
                      <div className="text-indigo-600/70">Об'ємний ефект</div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="flex justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-base font-semibold text-indigo-700">
              <Diamond className="w-5 h-5" />
              <span>Кришталева якість</span>
            </div>
            <div className="flex items-center gap-2 text-base font-semibold text-indigo-700">
              <Zap className="w-5 h-5" />
              <span>48-72 години</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Diamond className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-blue-900 mb-2">Кришталева прозорість</div>
              <div className="text-sm text-blue-700/70">100% оптична якість</div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-purple-900 mb-2">LED підсвітка</div>
              <div className="text-sm text-purple-700/70">Професійне освітлення</div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-green-100/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">🎯</span>
              </div>
              <div className="font-bold text-green-900 mb-2">Face-mount</div>
              <div className="text-sm text-green-700/70">Максимальна чіткість</div>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-orange-100/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">📐</span>
              </div>
              <div className="font-bold text-orange-900 mb-2">3-10мм товщина</div>
              <div className="text-sm text-orange-700/70">Люба товщина на вибір</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid with Glass Morphism Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {acrylicProducts.map((product, index) => (
          <Card 
            key={product.id} 
            className="overflow-hidden hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 group cursor-pointer transform hover:-translate-y-3 border-0"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
            onClick={() => handleProductClick(product)}
          >
            <div className="relative">
              {/* Advanced Acrylic Preview with LED effects */}
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 relative overflow-hidden p-4">
                {/* LED backlight effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                
                {/* Glass panel with depth */}
                <div className="relative w-full h-full transform-gpu perspective-1000 group-hover:scale-105 transition-all duration-500">
                  {/* Back depth layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-purple-200/50 rounded-xl transform translate-x-1 translate-y-1 blur-sm"></div>
                  
                  {/* Main glass surface */}
                  <div className="relative w-full h-full bg-white/90 backdrop-blur-2xl rounded-xl border border-white/60 shadow-2xl overflow-hidden group-hover:rotate-y-1 transition-all duration-500">
                    {/* Glass surface reflections */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-100/30 pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div>
                    
                    {/* Image content with glass effect */}
                    <div className="absolute inset-6 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <span className="text-6xl filter drop-shadow-xl group-hover:rotate-3 transition-all duration-300 relative z-10">
                        {product.image}
                      </span>
                    </div>
                    
                    {/* Edge lighting */}
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/50 pointer-events-none"></div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/10 via-transparent to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Floating shadow */}
                  <div className="absolute -inset-4 bg-gradient-radial from-transparent via-blue-900/5 to-purple-900/20 rounded-3xl -z-10"></div>
                </div>

                {/* Premium badges with glassmorphism */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.premium && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-xl backdrop-blur-sm text-xs font-bold">
                      💎 Преміум
                    </Badge>
                  )}
                  {product.popular && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-xl backdrop-blur-sm text-xs font-bold animate-pulse">
                      🔥 Хіт продажів
                    </Badge>
                  )}
                  {product.discount && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-xl backdrop-blur-sm text-xs font-bold">
                      -{product.discount}% 💥
                    </Badge>
                  )}
                </div>

                {/* Floating action buttons with LED effect */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <Button 
                    size="icon" 
                    className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-xl shadow-xl border-0 hover:scale-110 transition-all duration-200 hover:bg-red-50 hover:shadow-red-200/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Додано в обране:', product.title);
                    }}
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-xl shadow-xl border-0 hover:scale-110 transition-all duration-200 hover:bg-blue-50 hover:shadow-blue-200/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Швидкий перегляд:', product.title);
                    }}
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-5 space-y-4 bg-gradient-to-b from-white to-blue-50/30">
                {/* Title */}
                <h3 className="font-heading font-bold text-xl group-hover:text-blue-600 transition-colors leading-tight">
                  {product.title}
                </h3>
                
                {/* Collapsible Description */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto text-sm text-muted-foreground hover:text-primary gap-1">
                      Деталі <ChevronDown className="w-3 h-3" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                {/* Rating with LED glow */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 transition-all duration-200 ${i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg filter' 
                          : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {product.rating} ({product.reviewsCount} відгуків)
                  </span>
                </div>

                {/* Price section with gradient */}
                <div className="flex items-end justify-between pt-2">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground font-medium">Ціна від</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {product.basePrice}₴
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through bg-gray-100 px-2 py-1 rounded">
                          {product.originalPrice}₴
                        </span>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 border-0 px-6 h-10 font-semibold"
                  >
                    Налаштувати
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Configuration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl shadow-2xl rounded-2xl">
          <DialogHeader className="border-b border-blue-100/50 pb-4 flex-shrink-0">
            <DialogTitle className="text-2xl sm:text-3xl font-heading font-black bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
              {selectedProduct?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column - Preview */}
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative rounded-2xl overflow-hidden p-4 sm:p-6">
                  {/* Glass panel with depth effect */}
                  <div className="relative w-full h-full transform-gpu perspective-1000">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-purple-200/50 rounded-xl transform translate-x-1 translate-y-1 blur-sm"></div>
                    <div className="relative w-full h-full bg-white/90 backdrop-blur-2xl rounded-xl border border-white/60 shadow-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-100/30 pointer-events-none"></div>
                      <div className="absolute inset-3 sm:inset-4 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded flex items-center justify-center">
                        <span className="text-6xl sm:text-8xl filter drop-shadow-xl">
                          {selectedProduct.image}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Collapsible details */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between rounded-xl border-blue-200 hover:bg-blue-50">
                      <span className="font-semibold">Деталі та характеристики</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100">
                    <p className="text-muted-foreground leading-relaxed mb-3">{selectedProduct.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {selectedProduct.rating} ({selectedProduct.reviewsCount} відгуків)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium">💎 Матеріал</div>
                        <div className="text-muted-foreground">Акрил преміум якості</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">⚡ Виконання</div>
                        <div className="text-muted-foreground">48-72 години</div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Right Column - Configuration */}
              <div className="space-y-6">
                {/* Size Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-blue-800">Розмір та товщина:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProduct.sizes.map((size, index) => (
                      <Button
                        key={index}
                        variant={selectedSize === index ? "default" : "outline"}
                        className={`h-auto p-3 sm:p-4 flex flex-col items-center gap-2 rounded-xl transition-all duration-200 ${
                          selectedSize === index 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105' 
                            : 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                        onClick={() => setSelectedSize(index)}
                      >
                        <span className="font-bold text-sm sm:text-base">{size.name}</span>
                        <span className={`text-xs ${selectedSize === index ? 'text-blue-100' : 'text-muted-foreground'}`}>{size.thickness}</span>
                        <span className={`text-lg font-black ${selectedSize === index ? 'text-white' : 'text-blue-600'}`}>
                          {size.price}₴
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Compact Options */}
                {selectedProduct.options.map((option, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-3">
                    <h3 className="text-lg font-bold text-blue-800">{option.name}:</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {option.values.map((value, valueIndex) => (
                        <Button
                          key={valueIndex}
                          variant={selectedOptions[categoryIndex] === valueIndex ? "default" : "outline"}
                          className={`w-full justify-between h-auto p-3 rounded-lg transition-all duration-200 ${
                            selectedOptions[categoryIndex] === valueIndex 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
                              : 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                          onClick={() => {
                            const newOptions = [...selectedOptions];
                            newOptions[categoryIndex] = valueIndex;
                            setSelectedOptions(newOptions);
                          }}
                        >
                          <span className="font-medium text-sm sm:text-base">{value.name}</span>
                          {value.price > 0 && (
                            <span className={`font-bold ${selectedOptions[categoryIndex] === valueIndex ? 'text-white' : 'text-blue-600'}`}>
                              +{value.price}₴
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Total Price */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Обраний розмір:</span>
                    <span className="font-semibold">{selectedProduct.sizes[selectedSize].name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Загальна ціна:</span>
                    <span className="text-2xl font-bold text-primary">
                      {calculateTotalPrice()}₴
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    • Акрил преміум якості<br/>
                    • Face-mount технологія<br/>
                    • Дистанційне кріплення<br/>
                    • Виконання 48-72 години
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 gap-2 sm:gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 h-11 sm:h-12 text-white font-bold rounded-xl text-sm sm:text-base" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Додати в корзину
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="flex-1 h-11 sm:h-12 font-semibold rounded-xl border-blue-300 text-blue-700 hover:bg-blue-50 text-sm sm:text-base"
                  >
                    💳 Купити зараз
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}