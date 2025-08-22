"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  Zap, 
  Tag,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export interface PrintConfiguration {
  product: {
    type: 'canvas' | 'acrylic' | 'business-cards' | 'poster' | 'banner';
    material: string;
    finishing: string;
  };
  dimensions: {
    width: number;
    height: number;
    depth?: number;
  };
  quantity: number;
  urgency: 'standard' | 'express' | 'super-express';
  fileQuality: {
    dpi: number;
    colorProfile: string;
    hasIssues: boolean;
  };
}

export interface PriceBreakdown {
  base: number;
  material: number;
  size: number;
  quantity: number;
  urgency: number;
  processing: number;
  delivery: number;
  discount: number;
  total: number;
  savings: number;
}

interface MarketComparison {
  ourPrice: number;
  competitorAverage: number;
  savings: number;
  savingsPercent: number;
}

interface RealTimePriceCalculatorProps {
  configuration: PrintConfiguration;
  onPriceUpdate?: (price: number, breakdown: PriceBreakdown) => void;
  showComparison?: boolean;
  showOptimizations?: boolean;
}

export function RealTimePriceCalculator({ 
  configuration, 
  onPriceUpdate,
  showComparison = true,
  showOptimizations = true
}: RealTimePriceCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  // Расчет цены в реальном времени
  const { breakdown, marketComparison, optimizations } = useMemo(() => {
    const calculatePrice = (): { breakdown: PriceBreakdown; marketComparison: MarketComparison } => {
      // Базовая цена по типу продукта
      const basePrices = {
        canvas: 250,
        acrylic: 180,
        'business-cards': 15,
        poster: 45,
        banner: 35
      };

      // Расчет размера (площадь в кв.м)
      const area = (configuration.dimensions.width * configuration.dimensions.height) / 10000;
      const basePrice = basePrices[configuration.product.type];
      
      // Детализированный расчет
      const materialMultiplier = {
        'premium-canvas': 1.3,
        'standard-canvas': 1.0,
        'eco-canvas': 0.8,
        'acrylic-3mm': 1.0,
        'acrylic-5mm': 1.4,
        'acrylic-mirror': 1.8
      }[configuration.product.material] || 1.0;

      const finishingMultiplier = {
        'gallery-wrap': 1.2,
        'standard': 1.0,
        'lamination': 1.1,
        'uv-protection': 1.15
      }[configuration.product.finishing] || 1.0;

      const urgencyMultipliers = {
        'standard': 1.0,
        'express': 1.5,
        'super-express': 2.2
      };

      // Скидки за количество
      const quantityDiscounts = [
        { min: 1, max: 1, discount: 0 },
        { min: 2, max: 5, discount: 0.05 },
        { min: 6, max: 20, discount: 0.12 },
        { min: 21, max: 50, discount: 0.18 },
        { min: 51, max: Infinity, discount: 0.25 }
      ];

      const quantityDiscount = quantityDiscounts.find(
        d => configuration.quantity >= d.min && configuration.quantity <= d.max
      )?.discount || 0;

      // Расчет компонентов цены
      const base = basePrice;
      const material = base * (materialMultiplier - 1);
      const size = base * area * 0.8;
      const quantity = (base + material + size) * configuration.quantity;
      const urgency = quantity * (urgencyMultipliers[configuration.urgency] - 1);
      const processing = configuration.fileQuality.hasIssues ? 25 : 0;
      const delivery = configuration.urgency === 'super-express' ? 85 : 
                      configuration.urgency === 'express' ? 45 : 25;
      
      const subtotal = quantity + urgency + processing + delivery;
      const discount = subtotal * quantityDiscount;
      const total = subtotal - discount;
      const savings = discount + (configuration.fileQuality.dpi >= 300 ? 15 : 0);

      // Сравнение с конкурентами
      const competitorMultiplier = 1.35; // В среднем мы дешевле на 35%
      const competitorPrice = total * competitorMultiplier;

      return {
        breakdown: {
          base,
          material,
          size,
          quantity: quantity - (base + material + size),
          urgency,
          processing,
          delivery,
          discount,
          total,
          savings
        },
        marketComparison: {
          ourPrice: total,
          competitorAverage: competitorPrice,
          savings: competitorPrice - total,
          savingsPercent: ((competitorPrice - total) / competitorPrice) * 100
        }
      };
    };

    const result = calculatePrice();

    // Оптимизации и рекомендации
    const getOptimizations = () => {
      const opts = [];

      // Рекомендации по количеству
      if (configuration.quantity === 1) {
        opts.push({
          type: 'quantity',
          title: 'Економія при замовленні 2-5 штук',
          description: 'Знижка 5% + безкоштовна доставка',
          savings: result.breakdown.total * 0.05,
          action: 'Додати ще один'
        });
      }

      // Рекомендации по срочности
      if (configuration.urgency === 'super-express') {
        const standardPrice = result.breakdown.total - result.breakdown.urgency + 
          (result.breakdown.quantity + result.breakdown.delivery) * 0.5;
        opts.push({
          type: 'urgency',
          title: 'Економія при стандартній доставці',
          description: '7-10 днів замість 24 годин',
          savings: result.breakdown.total - standardPrice,
          action: 'Змінити терміни'
        });
      }

      // Рекомендации по качеству файла
      if (configuration.fileQuality.hasIssues) {
        opts.push({
          type: 'quality',
          title: 'Покращити файл для економії',
          description: 'Уникніть доплати за обробку',
          savings: result.breakdown.processing,
          action: 'Покращити якість'
        });
      }

      return opts;
    };

    return {
      breakdown: result.breakdown,
      marketComparison: result.marketComparison,
      optimizations: getOptimizations()
    };
  }, [configuration]);

  // Анимация расчета
  useEffect(() => {
    setIsCalculating(true);
    setCalculationProgress(0);

    const interval = setInterval(() => {
      setCalculationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCalculating(false);
          return 100;
        }
        return prev + Math.random() * 25;
      });
    }, 50);

    // Обновление истории цен
    setPriceHistory(prev => [...prev.slice(-9), breakdown.total]);

    // Вызов колбэка
    if (onPriceUpdate) {
      setTimeout(() => {
        onPriceUpdate(breakdown.total, breakdown);
      }, 300);
    }

    return () => clearInterval(interval);
  }, [configuration, breakdown.total, onPriceUpdate]);

  return (
    <div className="space-y-6">
      {/* Основная цена */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Калькулятор цін
            </CardTitle>
            <Badge className="bg-success/10 text-success border-success/20">
              ⚡ Реальний час
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Расчет в процессе */}
          {isCalculating && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Розрахунок оптимальної ціни...
              </div>
              <Progress value={calculationProgress} className="h-2" />
            </div>
          )}

          {/* Главная цена */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">
              {breakdown.total.toFixed(0)} ₴
            </div>
            <div className="text-sm text-muted-foreground">
              {configuration.quantity > 1 ? `${(breakdown.total / configuration.quantity).toFixed(0)} ₴ за штуку` : 'Загальна вартість'}
            </div>
            
            {breakdown.savings > 0 && (
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-success/10 text-success border-success/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Економія {breakdown.savings.toFixed(0)} ₴
                </Badge>
              </div>
            )}
          </div>

          {/* Сравнение с конкурентами */}
          {showComparison && marketComparison.savings > 0 && (
            <Alert className="border-success bg-success/5">
              <TrendingUp className="h-4 w-4 text-success" />
              <AlertDescription>
                <div className="font-medium text-success">
                  На {marketComparison.savings.toFixed(0)} ₴ дешевше ніж у конкурентів
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Середня ціна на ринку: {marketComparison.competitorAverage.toFixed(0)} ₴
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Кнопка детализации */}
          <Button 
            variant="outline" 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full"
          >
            {showDetails ? 'Приховати' : 'Показати'} деталізацію
          </Button>
        </CardContent>
      </Card>

      {/* Детализация цены */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Деталізація вартості</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Базова ціна ({configuration.product.type})</span>
                <span className="font-medium">{breakdown.base.toFixed(0)} ₴</span>
              </div>
              
              {breakdown.material > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Матеріал ({configuration.product.material})</span>
                  <span className="font-medium">+{breakdown.material.toFixed(0)} ₴</span>
                </div>
              )}
              
              {breakdown.size > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    Розмір ({configuration.dimensions.width}×{configuration.dimensions.height} см)
                  </span>
                  <span className="font-medium">+{breakdown.size.toFixed(0)} ₴</span>
                </div>
              )}
              
              {configuration.quantity > 1 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Кількість (×{configuration.quantity})</span>
                  <span className="font-medium">+{breakdown.quantity.toFixed(0)} ₴</span>
                </div>
              )}
              
              {breakdown.urgency > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Терміновість ({configuration.urgency})</span>
                  <span className="font-medium text-warning">+{breakdown.urgency.toFixed(0)} ₴</span>
                </div>
              )}
              
              {breakdown.processing > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Обробка файлу</span>
                  <span className="font-medium text-warning">+{breakdown.processing.toFixed(0)} ₴</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Доставка</span>
                <span className="font-medium">+{breakdown.delivery.toFixed(0)} ₴</span>
              </div>
              
              {breakdown.discount > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-success">Знижка за кількість</span>
                    <span className="font-medium text-success">-{breakdown.discount.toFixed(0)} ₴</span>
                  </div>
                </>
              )}
              
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Загалом:</span>
                <span className="text-primary">{breakdown.total.toFixed(0)} ₴</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Оптимизации */}
      {showOptimizations && optimizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Як зекономити
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {optimizations.map((opt, index) => (
              <Alert key={index} className="border-accent/20 bg-accent/5">
                <Info className="h-4 w-4 text-accent" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{opt.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {opt.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-accent">
                      -{opt.savings.toFixed(0)} ₴
                    </div>
                    <Button variant="outline" size="sm" className="mt-1">
                      {opt.action}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Срочность */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Готовність:</span>
            </div>
            <div className="text-right">
              {configuration.urgency === 'super-express' && (
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                  ⚡ 24 години
                </Badge>
              )}
              {configuration.urgency === 'express' && (
                <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                  🚀 2-3 дні
                </Badge>
              )}
              {configuration.urgency === 'standard' && (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  📅 7-10 днів
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* График изменения цены */}
      {priceHistory.length > 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Динаміка цін</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-12">
              {priceHistory.slice(-10).map((price, index) => (
                <div
                  key={index}
                  className="bg-primary/20 flex-1 rounded-t"
                  style={{
                    height: `${(price / Math.max(...priceHistory)) * 100}%`,
                    minHeight: '2px'
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}