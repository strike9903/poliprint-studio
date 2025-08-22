"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Heart, ShoppingCart, Eye, Star, Sparkles, ChevronDown, Zap, Gift, Calculator } from 'lucide-react';

interface BusinessCardTemplate {
  id: number;
  title: string;
  image: string;
  description: string;
  category: string;
  basePrice: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewsCount: number;
  quantities: {
    amount: number;
    price: number;
    pricePerUnit: number;
    popular?: boolean;
  }[];
  options: {
    name: string;
    values: { name: string; price: number }[];
  }[];
  popular?: boolean;
  premium?: boolean;
}

const businessCardTemplates: BusinessCardTemplate[] = [
  {
    id: 1,
    title: "Класичні візитки",
    image: "💼",
    description: "Елегантні візитки з мінімалістичним дизайном для професіоналів",
    category: "Класичні",
    basePrice: 120,
    originalPrice: 150,
    discount: 20,
    rating: 4.8,
    reviewsCount: 234,
    popular: true,
    quantities: [
      { amount: 100, price: 120, pricePerUnit: 1.2 },
      { amount: 250, price: 250, pricePerUnit: 1.0, popular: true },
      { amount: 500, price: 450, pricePerUnit: 0.9 },
      { amount: 1000, price: 800, pricePerUnit: 0.8 },
    ],
    options: [
      { 
        name: "Папір", 
        values: [
          { name: "300г/м² (стандарт)", price: 0 },
          { name: "350г/м² (+30₴)", price: 30 },
          { name: "400г/м² преміум (+60₴)", price: 60 }
        ]
      },
      {
        name: "Обробка",
        values: [
          { name: "Без обробки", price: 0 },
          { name: "Матова ламінація (+50₴)", price: 50 },
          { name: "Глянцева ламінація (+50₴)", price: 50 },
          { name: "Soft-touch (+80₴)", price: 80 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Креативні візитки",
    image: "🎨",
    description: "Яскраві креативні візитки для творчих професій та стартапів",
    category: "Креативні",
    basePrice: 180,
    rating: 4.7,
    reviewsCount: 156,
    popular: true,
    quantities: [
      { amount: 100, price: 180, pricePerUnit: 1.8 },
      { amount: 250, price: 400, pricePerUnit: 1.6, popular: true },
      { amount: 500, price: 750, pricePerUnit: 1.5 },
      { amount: 1000, price: 1400, pricePerUnit: 1.4 },
    ],
    options: [
      { 
        name: "Папір", 
        values: [
          { name: "350г/м² дизайнерський", price: 0 },
          { name: "400г/м² з текстурою (+40₴)", price: 40 },
          { name: "Крафт папір (+30₴)", price: 30 }
        ]
      },
      {
        name: "Спецефекти",
        values: [
          { name: "Без ефектів", price: 0 },
          { name: "UV-лак частковий (+80₴)", price: 80 },
          { name: "Золоте тиснення (+120₴)", price: 120 },
          { name: "Срібне тиснення (+120₴)", price: 120 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Преміум візитки",
    image: "✨",
    description: "Розкішні візитки з тисненням фольгою та спецефектами для топ-менеджменту",
    category: "Преміум",
    basePrice: 320,
    originalPrice: 400,
    discount: 20,
    rating: 4.9,
    reviewsCount: 89,
    premium: true,
    popular: true,
    quantities: [
      { amount: 100, price: 320, pricePerUnit: 3.2 },
      { amount: 250, price: 750, pricePerUnit: 3.0, popular: true },
      { amount: 500, price: 1400, pricePerUnit: 2.8 },
      { amount: 1000, price: 2600, pricePerUnit: 2.6 },
    ],
    options: [
      { 
        name: "Матеріал", 
        values: [
          { name: "Дизайнерський картон 400г/м²", price: 0 },
          { name: "Металізований картон (+100₴)", price: 100 },
          { name: "Пластик PVC (+150₴)", price: 150 }
        ]
      },
      {
        name: "Тиснення фольгою",
        values: [
          { name: "Без тиснення", price: 0 },
          { name: "Золота фольга (+200₴)", price: 200 },
          { name: "Срібна фольга (+200₴)", price: 200 },
          { name: "Голографічна фольга (+300₴)", price: 300 }
        ]
      },
      {
        name: "Додаткові ефекти",
        values: [
          { name: "Без ефектів", price: 0 },
          { name: "Вирубка (+100₴)", price: 100 },
          { name: "Конгрев (+150₴)", price: 150 }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Еко-візитки",
    image: "🌱",
    description: "Екологічні візитки з переробленого паперу з природними текстурами",
    category: "Еко",
    basePrice: 160,
    rating: 4.6,
    reviewsCount: 123,
    quantities: [
      { amount: 100, price: 160, pricePerUnit: 1.6 },
      { amount: 250, price: 350, pricePerUnit: 1.4, popular: true },
      { amount: 500, price: 650, pricePerUnit: 1.3 },
      { amount: 1000, price: 1200, pricePerUnit: 1.2 },
    ],
    options: [
      { 
        name: "Еко-папір", 
        values: [
          { name: "Переробний картон 300г/м²", price: 0 },
          { name: "Крафт-картон 350г/м² (+20₴)", price: 20 },
          { name: "Бавовняний папір (+50₴)", price: 50 }
        ]
      },
      {
        name: "Еко-фарби",
        values: [
          { name: "Соєві фарби (стандарт)", price: 0 },
          { name: "Водні фарби (+30₴)", price: 30 }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Мінімалістичні візитки",
    image: "⚪",
    description: "Стильні мінімалістичні візитки з акцентом на типографіку",
    category: "Мінімалізм",
    basePrice: 140,
    rating: 4.8,
    reviewsCount: 178,
    popular: true,
    quantities: [
      { amount: 100, price: 140, pricePerUnit: 1.4 },
      { amount: 250, price: 320, pricePerUnit: 1.28, popular: true },
      { amount: 500, price: 600, pricePerUnit: 1.2 },
      { amount: 1000, price: 1100, pricePerUnit: 1.1 },
    ],
    options: [
      { 
        name: "Папір", 
        values: [
          { name: "300г/м² білий", price: 0 },
          { name: "350г/м² білий (+25₴)", price: 25 },
          { name: "350г/м² кольоровий (+40₴)", price: 40 }
        ]
      },
      {
        name: "Друк",
        values: [
          { name: "1+0 (односторонній)", price: 0 },
          { name: "1+1 (двосторонній) (+30₴)", price: 30 }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Корпоративні vizitki",
    image: "🏢",
    description: "Солідні корпоративні візитки для великих компаній та організацій",
    category: "Корпоративні",
    basePrice: 200,
    originalPrice: 240,
    discount: 17,
    rating: 4.7,
    reviewsCount: 145,
    quantities: [
      { amount: 100, price: 200, pricePerUnit: 2.0 },
      { amount: 250, price: 450, pricePerUnit: 1.8 },
      { amount: 500, price: 850, pricePerUnit: 1.7, popular: true },
      { amount: 1000, price: 1600, pricePerUnit: 1.6 },
    ],
    options: [
      { 
        name: "Папір", 
        values: [
          { name: "350г/м² преміум", price: 0 },
          { name: "400г/м² з водяними знаками (+70₴)", price: 70 }
        ]
      },
      {
        name: "Обробка",
        values: [
          { name: "Матова ламінація", price: 0 },
          { name: "Глянцева ламінація (+20₴)", price: 20 },
          { name: "Soft-touch + UV-лак (+100₴)", price: 100 }
        ]
      }
    ]
  }
];

interface BusinessCardsGalleryProps {
  locale: string;
}

export function BusinessCardsGallery({ locale }: BusinessCardsGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<BusinessCardTemplate | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Всі");

  const categories = ["Всі", "Класичні", "Креативні", "Преміум", "Еко", "Мінімалізм", "Корпоративні"];

  const filteredTemplates = activeCategory === "Всі" 
    ? businessCardTemplates 
    : businessCardTemplates.filter(template => template.category === activeCategory);

  const handleTemplateClick = (template: BusinessCardTemplate) => {
    setSelectedTemplate(template);
    setSelectedQuantity(1);
    setSelectedOptions(new Array(template.options.length).fill(0));
    setIsModalOpen(true);
  };

  const calculateTotalPrice = () => {
    if (!selectedTemplate) return 0;
    
    let total = selectedTemplate.quantities[selectedQuantity].price;
    selectedOptions.forEach((optionIndex, categoryIndex) => {
      total += selectedTemplate.options[categoryIndex].values[optionIndex].price;
    });
    
    return total;
  };

  const handleAddToCart = () => {
    if (selectedTemplate) {
      const quantity = selectedTemplate.quantities[selectedQuantity];
      const selectedOptionValues = selectedOptions.map((optionIndex, categoryIndex) => 
        selectedTemplate.options[categoryIndex].values[optionIndex]
      );
      
      console.log('Додано в корзину (візитки):', {
        template: selectedTemplate.title,
        quantity: `${quantity.amount} шт`,
        options: selectedOptionValues,
        totalPrice: calculateTotalPrice()
      });
      
      setIsModalOpen(false);
      // TODO: Добавить в реальную корзину
    }
  };

  return (
    <div className="space-y-8">
      {/* Modern Business Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-16 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.3),transparent_50%)] opacity-70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(79,70,229,0.2),transparent_50%)] opacity-60"></div>
        
        <div className="relative text-center space-y-8">
          <div className="flex justify-center">
            <Badge className="bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 text-white border-0 shadow-2xl px-6 py-3 text-base font-bold backdrop-blur-sm">
              💼 Професійні візитки
            </Badge>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-heading font-black bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent leading-tight">
            Перше<br/>враження
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <Collapsible>
              <div className="text-xl text-slate-700/90 font-semibold mb-6">
                500+ шаблонів • Преміум папір • Спецефекти • Швидке виконання
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="text-slate-600 hover:text-slate-700 text-sm gap-2 mb-4">
                  Переваги наших візиток <ChevronDown className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl">
                  <p className="text-slate-600/80 leading-relaxed mb-4">
                    Професійні візитки з тисненням фольгою, UV-лаком та іншими спецефектами. 
                    Широкий вибір паперу від 300г/м² до преміум дизайнерських серій.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-white/20 rounded-lg">
                      <Sparkles className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                      <div className="font-semibold text-slate-700">Спецефекти</div>
                      <div className="text-slate-600/70">UV-лак, фольгування</div>
                    </div>
                    <div className="text-center p-3 bg-white/20 rounded-lg">
                      <Calculator className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <div className="font-semibold text-blue-700">Вигідні ціни</div>
                      <div className="text-blue-600/70">Від 100 до 1000+ шт</div>
                    </div>
                    <div className="text-center p-3 bg-white/20 rounded-lg">
                      <Zap className="w-6 h-6 mx-auto mb-2 text-green-500" />
                      <div className="font-semibold text-green-700">Швидко</div>
                      <div className="text-green-600/70">24-48 годин</div>
                    </div>
                    <div className="text-center p-3 bg-white/20 rounded-lg">
                      <Gift className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      <div className="font-semibold text-purple-700">Безкоштовно</div>
                      <div className="text-purple-600/70">Дизайн і доставка</div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="flex justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-base font-semibold text-slate-700">
              <Sparkles className="w-5 h-5" />
              <span>Преміум якість</span>
            </div>
            <div className="flex items-center gap-2 text-base font-semibold text-slate-700">
              <Zap className="w-5 h-5" />
              <span>Швидке виконання</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Category Tabs */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
              activeCategory === category 
                ? 'bg-gradient-to-r from-slate-600 to-blue-600 text-white shadow-lg scale-105 border-0' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:scale-105'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category === 'Всі' && '✨'} 
            {category === 'Класичні' && '💼'}
            {category === 'Креативні' && '🎨'}
            {category === 'Преміум' && '💎'}
            {category === 'Еко' && '🌱'}
            {category === 'Мінімалізм' && '⚪'}
            {category === 'Корпоративні' && '🏢'}
            {' '}{category}
          </Button>
        ))}
      </div>

      {/* Templates Grid with Business Card Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template, index) => (
          <Card 
            key={template.id} 
            className="overflow-hidden hover:shadow-2xl hover:shadow-slate-500/25 transition-all duration-500 group cursor-pointer transform hover:-translate-y-3 border-0"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
            onClick={() => handleTemplateClick(template)}
          >
            <div className="relative">
              {/* Business Card Preview with Real Card Effect */}
              <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 relative overflow-hidden p-8">
                {/* Business card stack effect */}
                <div className="relative w-full h-full transform-gpu perspective-1000 group-hover:scale-105 transition-all duration-500">
                  {/* Back cards for depth */}
                  <div className="absolute inset-0 bg-white rounded-lg transform translate-x-1 translate-y-1 shadow-lg border border-gray-100 opacity-60"></div>
                  <div className="absolute inset-0 bg-white rounded-lg transform translate-x-0.5 translate-y-0.5 shadow-md border border-gray-100 opacity-80"></div>
                  
                  {/* Main business card */}
                  <div className="relative w-full h-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden group-hover:rotate-1 transition-all duration-500">
                    {/* Paper texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02)_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
                    
                    {/* Card content area */}
                    <div className="absolute inset-4 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300 block mb-2">
                          {template.image}
                        </span>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-2"></div>
                        <div className="space-y-1">
                          <div className="w-16 h-1 bg-gray-200 rounded mx-auto"></div>
                          <div className="w-12 h-1 bg-gray-100 rounded mx-auto"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Premium effects */}
                    {template.premium && (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-orange-400/10 pointer-events-none"></div>
                    )}
                  </div>
                </div>

                {/* Premium badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {template.premium && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-xl backdrop-blur-sm text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Преміум
                    </Badge>
                  )}
                  {template.popular && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl backdrop-blur-sm text-xs font-bold animate-pulse">
                      🔥 Хіт продажів
                    </Badge>
                  )}
                  {template.discount && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-xl backdrop-blur-sm text-xs font-bold">
                      -{template.discount}% 💥
                    </Badge>
                  )}
                </div>

                {/* Floating action buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <Button 
                    size="icon" 
                    className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-xl shadow-xl border-0 hover:scale-110 transition-all duration-200 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Додано в обране:', template.title);
                    }}
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-xl shadow-xl border-0 hover:scale-110 transition-all duration-200 hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Швидкий перегляд:', template.title);
                    }}
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                  </Button>
                </div>

                {/* Category label */}
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur-sm text-slate-700 border-0 shadow-md text-xs">
                    {template.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5 space-y-4 bg-gradient-to-b from-white to-slate-50/50">
                {/* Title */}
                <h3 className="font-heading font-bold text-xl group-hover:text-slate-700 transition-colors leading-tight">
                  {template.title}
                </h3>
                
                {/* Collapsible Description */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto text-sm text-muted-foreground hover:text-primary gap-1">
                      Особливості <ChevronDown className="w-3 h-3" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 transition-all duration-200 ${i < Math.floor(template.rating) 
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
                          : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {template.rating} ({template.reviewsCount} відгуків)
                  </span>
                </div>

                {/* Price section */}
                <div className="flex items-end justify-between pt-2">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground font-medium">Ціна від</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
                        {template.basePrice}₴
                      </span>
                      {template.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through bg-gray-100 px-2 py-1 rounded">
                          {template.originalPrice}₴
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">за 100 шт</div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 border-0 px-6 h-10 font-semibold"
                  >
                    Налаштувати
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Smart Configuration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl border-0 bg-gradient-to-br from-white via-slate-50/30 to-blue-50/30 backdrop-blur-xl shadow-2xl rounded-2xl">
          <DialogHeader className="border-b border-slate-100/50 pb-4 flex-shrink-0">
            <DialogTitle className="text-2xl sm:text-3xl font-heading font-black bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              {selectedTemplate?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left: Enhanced Preview & Details */}
              <div className="space-y-4">
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-blue-100 relative overflow-hidden p-4 sm:p-6 lg:p-8 rounded-2xl shadow-inner">
                  {/* Business card with real effect */}
                  <div className="relative w-full h-full transform perspective-1000">
                    <div className="absolute inset-0 bg-white rounded-lg transform translate-x-1 translate-y-1 shadow-lg opacity-60"></div>
                    <div className="relative w-full h-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02)_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
                      <div className="absolute inset-3 sm:inset-4 lg:inset-6 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl sm:text-4xl lg:text-5xl block mb-2 sm:mb-3">{selectedTemplate.image}</span>
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-2 sm:mb-3"></div>
                          <div className="space-y-1 sm:space-y-2">
                            <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gray-200 rounded mx-auto"></div>
                            <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gray-100 rounded mx-auto"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Collapsible details */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between rounded-xl border-slate-200 hover:bg-slate-50">
                      <span className="font-semibold">Деталі шаблону та відгуки</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100">
                    <p className="text-muted-foreground leading-relaxed mb-3">{selectedTemplate.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(selectedTemplate.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {selectedTemplate.rating} ({selectedTemplate.reviewsCount} відгуків)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium">📄 Категорія</div>
                        <div className="text-muted-foreground">{selectedTemplate.category}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">⚡ Виконання</div>
                        <div className="text-muted-foreground">24-48 годин</div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Right: Smart Configuration */}
              <div className="space-y-6">
                {/* Quantity Selection with Smart Layout */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Кількість:
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedTemplate.quantities.map((quantity, index) => (
                      <Button
                        key={index}
                        variant={selectedQuantity === index ? "default" : "outline"}
                        className={`h-auto p-4 flex flex-col items-center gap-2 rounded-xl transition-all duration-200 relative ${
                          selectedQuantity === index 
                            ? 'bg-gradient-to-br from-slate-600 to-blue-600 text-white shadow-lg scale-105' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        } ${quantity.popular ? 'ring-2 ring-blue-300' : ''}`}
                        onClick={() => setSelectedQuantity(index)}
                      >
                        {quantity.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs border-0 shadow-lg">
                            Популярно
                          </Badge>
                        )}
                        <span className="font-bold">{quantity.amount} шт</span>
                        <span className={`text-lg font-black ${selectedQuantity === index ? 'text-white' : 'text-slate-700'}`}>
                          {quantity.price}₴
                        </span>
                        <span className={`text-xs ${selectedQuantity === index ? 'text-slate-200' : 'text-muted-foreground'}`}>
                          {quantity.pricePerUnit.toFixed(2)}₴ за шт
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Compact Options */}
                {selectedTemplate.options.map((option, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-800">{option.name}:</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {option.values.map((value, valueIndex) => (
                        <Button
                          key={valueIndex}
                          variant={selectedOptions[categoryIndex] === valueIndex ? "default" : "outline"}
                          className={`w-full justify-between h-auto p-3 rounded-lg transition-all duration-200 ${
                            selectedOptions[categoryIndex] === valueIndex 
                              ? 'bg-gradient-to-r from-slate-600 to-blue-600 text-white shadow-md' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                          onClick={() => {
                            const newOptions = [...selectedOptions];
                            newOptions[categoryIndex] = valueIndex;
                            setSelectedOptions(newOptions);
                          }}
                        >
                          <span className="font-medium">{value.name}</span>
                          {value.price > 0 && (
                            <span className={`font-bold ${selectedOptions[categoryIndex] === valueIndex ? 'text-white' : 'text-slate-600'}`}>
                              +{value.price}₴
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Smart Price Summary */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-slate-800">Кількість:</span>
                    <span className="font-bold text-slate-900">{selectedTemplate.quantities[selectedQuantity].amount} шт</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-slate-800">Загальна ціна:</span>
                    <span className="text-3xl font-black bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
                      {calculateTotalPrice()}₴
                    </span>
                  </div>
                  
                  {/* Quick benefits */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700/80">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>Швидке виконання</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>Безкоштовний дизайн</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span>Доставка від 500₴</span>
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
                    className="flex-1 gap-2 sm:gap-3 bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 h-11 sm:h-12 text-white font-bold rounded-xl text-sm sm:text-base" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Додати в корзину
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="flex-1 h-11 sm:h-12 font-semibold rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 text-sm sm:text-base"
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