"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Heart, ShoppingCart, Eye, Star, ChevronDown, Sparkles, Zap } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { ProductPageLayout } from '@/components/layout/ProductPageLayout';

interface CanvasProduct {
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
  }[];
  popular?: boolean;
}

const canvasProducts: CanvasProduct[] = [
  {
    id: 1,
    title: "Гірський пейзаж",
    image: "🏔️",
    description: "Величний вид на гірські вершини з фантастичним світлом заходу сонця",
    basePrice: 450,
    originalPrice: 550,
    discount: 18,
    rating: 4.9,
    reviewsCount: 127,
    popular: true,
    sizes: [
      { name: "30×40 см", width: 30, height: 40, price: 450 },
      { name: "40×60 см", width: 40, height: 60, price: 650 },
      { name: "60×80 см", width: 60, height: 80, price: 950 },
      { name: "80×120 см", width: 80, height: 120, price: 1450 },
    ]
  },
  {
    id: 2,
    title: "Абстрактне мистецтво",
    image: "🎨",
    description: "Сучасна абстрактна композиція з яскравими кольорами та плавними формами",
    basePrice: 380,
    rating: 4.7,
    reviewsCount: 89,
    sizes: [
      { name: "30×30 см", width: 30, height: 30, price: 380 },
      { name: "50×50 см", width: 50, height: 50, price: 580 },
      { name: "70×70 см", width: 70, height: 70, price: 880 },
      { name: "100×100 см", width: 100, height: 100, price: 1380 },
    ]
  },
  {
    id: 3,
    title: "Морський берег",
    image: "🌊",
    description: "Спокійний морський пейзаж з кришталево чистою водою та білим піском",
    basePrice: 420,
    originalPrice: 520,
    discount: 19,
    rating: 4.8,
    reviewsCount: 156,
    popular: true,
    sizes: [
      { name: "40×30 см", width: 40, height: 30, price: 420 },
      { name: "60×45 см", width: 60, height: 45, price: 620 },
      { name: "80×60 cm", width: 80, height: 60, price: 920 },
      { name: "120×90 см", width: 120, height: 90, price: 1420 },
    ]
  },
  {
    id: 4,
    title: "Міський пейзаж",
    image: "🏙️",
    description: "Нічне місто з неоновим освітленням та відображеннями у воді",
    basePrice: 490,
    rating: 4.6,
    reviewsCount: 94,
    sizes: [
      { name: "50×30 см", width: 50, height: 30, price: 490 },
      { name: "70×42 см", width: 70, height: 42, price: 690 },
      { name: "100×60 см", width: 100, height: 60, price: 990 },
      { name: "140×84 см", width: 140, height: 84, price: 1490 },
    ]
  },
  {
    id: 5,
    title: "Космічні мрії",
    image: "🌌",
    description: "Фантастичний космічний пейзаж з зірками, туманностями та далекими планетами",
    basePrice: 510,
    originalPrice: 630,
    discount: 19,
    rating: 4.9,
    reviewsCount: 203,
    popular: true,
    sizes: [
      { name: "40×60 см", width: 40, height: 60, price: 510 },
      { name: "60×90 см", width: 60, height: 90, price: 810 },
      { name: "80×120 см", width: 80, height: 120, price: 1210 },
      { name: "100×150 см", width: 100, height: 150, price: 1710 },
    ]
  },
  {
    id: 6,
    title: "Тропічний ліс",
    image: "🌿",
    description: "Густий тропічний ліс з екзотичними рослинами та промінням сонця",
    basePrice: 460,
    rating: 4.5,
    reviewsCount: 78,
    sizes: [
      { name: "30×45 см", width: 30, height: 45, price: 460 },
      { name: "45×68 см", width: 45, height: 68, price: 660 },
      { name: "60×90 см", width: 60, height: 90, price: 960 },
      { name: "90×135 см", width: 90, height: 135, price: 1460 },
    ]
  }
];

interface CanvasGalleryProps {
  locale: string;
}

export function CanvasGallery({ locale }: CanvasGalleryProps) {
  const [selectedProduct, setSelectedProduct] = useState<CanvasProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();

  const handleProductClick = (product: CanvasProduct) => {
    setSelectedProduct(product);
    setSelectedSize(0);
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const size = selectedProduct.sizes[selectedSize];
      
      addItem({
        id: `canvas-${selectedProduct.id}-${selectedSize}`,
        type: 'canvas',
        title: selectedProduct.title,
        image: selectedProduct.image,
        price: size.price,
        quantity: 1,
        options: {
          'Розмір': size.name,
          'Товщина підрамника': '38мм',
          'Кромка': 'Галерейна'
        },
        metadata: {
          size: size.name,
          thickness: '38мм',
          material: 'Художній холст 380г/м²'
        }
      });
      
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-3xl p-8 lg:p-12 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(251,191,36,0.3),transparent_50%)] opacity-60"></div>
        <div className="relative text-center space-y-6">
          <div className="flex justify-center">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-4 py-2 text-sm font-medium">
              🎨 Професійний друк на холсті
            </Badge>
          </div>
          <h1 className="text-4xl lg:text-6xl font-heading font-black bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent">
            Ваші спогади<br/>на холсті
          </h1>
          <div className="max-w-3xl mx-auto">
            <Collapsible>
              <div className="text-lg text-orange-700/80 font-medium mb-4">
                Перетворіть фото на справжні витвори мистецтва
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="text-orange-600 hover:text-orange-700 text-sm gap-2">
                  Дізнатись більше <ChevronDown className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <p className="text-orange-600/70 leading-relaxed">
                  Високоякісний друк на художньому холсті 380г/м² з галерейною кромкою 38мм. 
                  Професійні пігментні чорнила забезпечують стійкість кольорів до 100 років.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-700">
              <Sparkles className="w-4 h-4" />
              <span>Преміум якість</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-orange-700">
              <Zap className="w-4 h-4" />
              <span>24-48 годин</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filter Pills */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Badge 
          variant="default" 
          className="cursor-pointer px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
        >
          ✨ Всі
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer px-6 py-2 rounded-full hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:border-transparent transition-all duration-200"
        >
          🏔️ Пейзажі
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer px-6 py-2 rounded-full hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-200"
        >
          🎨 Абстракція
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer px-6 py-2 rounded-full hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white hover:border-transparent transition-all duration-200"
        >
          🌿 Природа
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer px-6 py-2 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:border-transparent transition-all duration-200"
        >
          🏙️ Міста
        </Badge>
      </div>

      {/* Gallery Grid with 3D Canvas Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {canvasProducts.map((product, index) => (
          <Card 
            key={product.id} 
            className="overflow-hidden hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-500 group cursor-pointer transform hover:-translate-y-3 border-0"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
            onClick={() => handleProductClick(product)}
          >
            <div className="relative">
              {/* Premium 3D Canvas Preview */}
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 via-orange-50 to-red-50 relative overflow-hidden p-4">
                {/* Canvas frame with 3D perspective */}
                <div className="relative w-full h-full transform-gpu perspective-1000 group-hover:scale-105 transition-all duration-500">
                  {/* Back canvas side (3D depth) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg transform translate-x-1 translate-y-1 shadow-xl"></div>
                  
                  {/* Main canvas */}
                  <div className="relative w-full h-full bg-white rounded-lg shadow-2xl border-2 border-amber-100 overflow-hidden group-hover:rotate-y-2 transition-all duration-500">
                    {/* Canvas texture */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%),linear-gradient(-45deg,rgba(255,255,255,0.1)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(255,255,255,0.1)_75%),linear-gradient(-45deg,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] opacity-20"></div>
                    
                    {/* Image content */}
                    <div className="absolute inset-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <span className="text-6xl filter drop-shadow-lg group-hover:rotate-3 transition-all duration-300">
                        {product.image}
                      </span>
                    </div>
                    
                    {/* Canvas frame edge highlight */}
                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/50 pointer-events-none"></div>
                  </div>
                  
                  {/* Gallery wall shadow */}
                  <div className="absolute -inset-2 bg-gradient-radial from-transparent via-amber-900/5 to-amber-900/20 rounded-2xl -z-10"></div>
                </div>

                {/* Premium badges with glassmorphism */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.popular && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm text-xs font-bold animate-pulse">
                      🔥 Хіт продажів
                    </Badge>
                  )}
                  {product.discount && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg backdrop-blur-sm text-xs font-bold">
                      -{product.discount}% 💥
                    </Badge>
                  )}
                </div>

                {/* Floating action buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <Button 
                    size="icon" 
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xl shadow-xl border-0 hover:scale-110 transition-all duration-200 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Додано в обране:', product.title);
                    }}
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xl shadow-xl border-0 hover:scale-110 transition-all duration-200 hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Швидкий перегляд:', product.title);
                    }}
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-5 space-y-4 bg-gradient-to-b from-white to-gray-50/50">
                {/* Title */}
                <h3 className="font-heading font-bold text-xl group-hover:text-amber-600 transition-colors leading-tight">
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

                {/* Rating with improved design */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 transition-all duration-200 ${i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
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
                      <span className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
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
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 border-0 px-6 h-10 font-semibold"
                  >
                    Вибрати розмір
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Smart Modal Window */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl border-0 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 backdrop-blur-xl shadow-2xl rounded-2xl">
          <DialogHeader className="border-b border-amber-100/50 pb-4 flex-shrink-0">
            <DialogTitle className="text-2xl sm:text-3xl font-heading font-black bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
              {selectedProduct?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left: Enhanced Product Preview */}
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 relative rounded-2xl overflow-hidden p-4 sm:p-6 shadow-inner">
                  {/* 3D Canvas preview */}
                  <div className="relative w-full h-full transform perspective-1000">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg transform translate-x-1 translate-y-1 shadow-xl"></div>
                    <div className="relative w-full h-full bg-white rounded-lg shadow-2xl border-2 border-amber-100 overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%)] bg-[length:20px_20px] opacity-20"></div>
                      <div className="absolute inset-3 sm:inset-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center">
                        <span className="text-6xl sm:text-8xl filter drop-shadow-lg">
                          {selectedProduct.image}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Collapsible details */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between rounded-xl border-amber-200 hover:bg-amber-50">
                      <span className="font-semibold">Деталі та характеристики</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-100">
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
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium">✨ Матеріал</div>
                        <div className="text-muted-foreground">Художній холст 380г/м²</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">🖼️ Кромка</div>
                        <div className="text-muted-foreground">Галерейна 38мм</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">🔧 Кріплення</div>
                        <div className="text-muted-foreground">Для підвішування</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">⚡ Виконання</div>
                        <div className="text-muted-foreground">24-48 годин</div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Right: Size Selection */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-amber-800">Оберіть розмір:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProduct.sizes.map((size, index) => (
                      <Button
                        key={index}
                        variant={selectedSize === index ? "default" : "outline"}
                        className={`h-auto p-3 sm:p-4 flex flex-col sm:flex-row lg:flex-col items-center gap-2 rounded-xl transition-all duration-200 ${
                          selectedSize === index 
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg scale-105' 
                            : 'border-amber-200 hover:border-amber-300 hover:bg-amber-50'
                        }`}
                        onClick={() => setSelectedSize(index)}
                      >
                        <span className="font-bold text-sm sm:text-base">{size.name}</span>
                        <span className={`text-lg font-black ${selectedSize === index ? 'text-white' : 'text-amber-600'}`}>
                          {size.price}₴
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-amber-800">Обраний розмір:</span>
                    <span className="font-bold text-amber-900">{selectedProduct.sizes[selectedSize].name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-amber-800">Ціна:</span>
                    <span className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {selectedProduct.sizes[selectedSize].price}₴
                    </span>
                  </div>
                  
                  {/* Quick specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-amber-700/80">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>Швидке виконання</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>Преміум якість</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span>Безкоштовне кріплення</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span>Гарантія якості</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 gap-2 sm:gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 h-11 sm:h-12 text-white font-bold rounded-xl text-sm sm:text-base" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Додати в корзину
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="flex-1 h-11 sm:h-12 font-semibold rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50 text-sm sm:text-base"
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