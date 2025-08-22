"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Truck,
  CreditCard,
  Package,
  Sparkles,
  Shield,
  Clock,
  X,
  Star,
  Zap,
  Heart,
  Eye,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Lock
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { useProjectManager } from '@/contexts/ProjectManagerContext';
import { type CartItem } from '@/contexts/CartContext';
import { useOrders, useCheckout, type PaymentMethod, type DeliveryMethod } from '@/contexts/OrderContext';
import { paymentEngine, type PaymentRecommendation } from '@/services/PaymentEngine';
import { deliveryAI, type DeliveryAnalysis } from '@/services/DeliveryAI';

// 🎯 Типы для checkout flow
type CheckoutStep = 'projects' | 'delivery' | 'payment' | 'confirmation' | 'processing' | 'success';

interface CheckoutState {
  step: CheckoutStep;
  isLoading: boolean;
  error?: string;
  
  // Данные пользователя
  deliveryInfo: {
    recipientName: string;
    phone: string;
    email: string;
    city: string;
    method: DeliveryMethod | null;
    warehouse?: string;
    address?: string;
    notes?: string;
  };
  
  paymentInfo: {
    method: PaymentMethod | null;
    cardToken?: string;
  };
  
  // AI анализ
  paymentRecommendations: PaymentRecommendation[];
  deliveryAnalysis?: DeliveryAnalysis;
  
  // Цены и расчеты
  pricing: {
    subtotal: number;
    delivery: number;
    payment: number;
    total: number;
    savings: number;
  };
}

interface CheckoutFlowProps {
  projects: CartItem[];
  onComplete: (orderId: string) => void;
  onCancel: () => void;
}

export function CheckoutFlow({ projects, onComplete, onCancel }: CheckoutFlowProps) {
  const { state: projectState } = useProjectManager();
  const { startCheckout, setCheckoutStep } = useCheckout();
  
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'projects',
    isLoading: false,
    deliveryInfo: {
      recipientName: '',
      phone: '',
      email: '',
      city: '',
      method: null,
    },
    paymentInfo: {
      method: null,
    },
    paymentRecommendations: [],
    pricing: {
      subtotal: projects.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      delivery: 0,
      payment: 0,
      total: 0,
      savings: 0,
    },
  });

  // 📊 Прогресс checkout
  const progressPercentage = useMemo(() => {
    const stepProgress = {
      projects: 20,
      delivery: 40,
      payment: 70,
      confirmation: 85,
      processing: 95,
      success: 100,
    };
    return stepProgress[checkoutState.step];
  }, [checkoutState.step]);

  // 🤖 AI анализ при загрузке
  useEffect(() => {
    const initializeAI = async () => {
      if (checkoutState.step === 'delivery' && !checkoutState.paymentRecommendations.length) {
        setCheckoutState(prev => ({ ...prev, isLoading: true }));
        
        try {
          // Анализируем психологию пользователя для платежей
          const userPsychology = paymentEngine.analyzeUserPsychology({
            userAgent: navigator.userAgent,
            orderHistory: [], // В реальности из API
            currentOrder: { pricing: checkoutState.pricing as any },
            timestamp: new Date(),
          });
          
          // Получаем рекомендации по оплате
          const paymentRecs = paymentEngine.getPaymentRecommendations(
            userPsychology, 
            { pricing: checkoutState.pricing as any }
          );
          
          setCheckoutState(prev => ({
            ...prev,
            paymentRecommendations: paymentRecs,
            isLoading: false,
          }));
        } catch (error) {
          console.error('AI analysis failed:', error);
          setCheckoutState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeAI();
  }, [checkoutState.step, checkoutState.pricing.subtotal]);

  // 🚚 Анализ доставки при выборе города
  const analyzeDelivery = useCallback(async (city: string) => {
    if (!city || city.length < 2) return;
    
    setCheckoutState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const analysis = await deliveryAI.analyzeDelivery([], city, {
        budget: 'medium',
        speed: 'medium', 
        reliability: 'high',
      });
      
      setCheckoutState(prev => ({
        ...prev,
        deliveryAnalysis: analysis,
        isLoading: false,
        pricing: {
          ...prev.pricing,
          delivery: analysis.recommended.totalCost,
          total: prev.pricing.subtotal + analysis.recommended.totalCost + prev.pricing.payment,
        },
      }));
    } catch (error) {
      console.error('Delivery analysis failed:', error);
      setCheckoutState(prev => ({ ...prev, isLoading: false }));
    }
  }, [projects]);

  // 💳 Обновление стоимости при выборе метода оплаты
  const updatePaymentCost = useCallback((method: PaymentMethod) => {
    const paymentFee = paymentEngine.calculatePaymentFee(method, checkoutState.pricing.subtotal + checkoutState.pricing.delivery);
    
    setCheckoutState(prev => ({
      ...prev,
      paymentInfo: { ...prev.paymentInfo, method },
      pricing: {
        ...prev.pricing,
        payment: paymentFee,
        total: prev.pricing.subtotal + prev.pricing.delivery + paymentFee,
      },
    }));
  }, [checkoutState.pricing.subtotal, checkoutState.pricing.delivery]);

  // 📋 Валидация шагов
  const canProceedToNext = useMemo(() => {
    switch (checkoutState.step) {
      case 'projects':
        return projects.length > 0;
      case 'delivery':
        return checkoutState.deliveryInfo.recipientName && 
               checkoutState.deliveryInfo.phone && 
               checkoutState.deliveryInfo.city &&
               checkoutState.deliveryInfo.method;
      case 'payment':
        return checkoutState.paymentInfo.method;
      case 'confirmation':
        return true;
      default:
        return false;
    }
  }, [checkoutState, projects]);

  // 🎬 Переходы между шагами
  const nextStep = () => {
    const steps: CheckoutStep[] = ['projects', 'delivery', 'payment', 'confirmation', 'processing', 'success'];
    const currentIndex = steps.indexOf(checkoutState.step);
    if (currentIndex < steps.length - 1 && canProceedToNext) {
      const nextStepName = steps[currentIndex + 1];
      setCheckoutState(prev => ({ ...prev, step: nextStepName }));
      
      if (nextStepName === 'processing') {
        // Имитация обработки заказа
        setTimeout(() => {
          setCheckoutState(prev => ({ ...prev, step: 'success' }));
          onComplete('order-123'); // В реальности ID из API
        }, 3000);
      }
    }
  };

  const prevStep = () => {
    const steps: CheckoutStep[] = ['projects', 'delivery', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(checkoutState.step);
    if (currentIndex > 0) {
      setCheckoutState(prev => ({ ...prev, step: steps[currentIndex - 1] }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Прогресс Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-heading font-bold">Оформлення замовлення</h1>
                    <p className="text-muted-foreground">
                      {projects.length} проектів на суму {checkoutState.pricing.total.toFixed(0)} ₴
                    </p>
                  </div>
                </div>
                
                <Button variant="ghost" onClick={onCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Прогрес оформлення</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className={checkoutState.step === 'projects' ? 'text-primary font-medium' : ''}>
                    Проекти
                  </span>
                  <span className={checkoutState.step === 'delivery' ? 'text-primary font-medium' : ''}>
                    Доставка
                  </span>
                  <span className={checkoutState.step === 'payment' ? 'text-primary font-medium' : ''}>
                    Оплата
                  </span>
                  <span className={checkoutState.step === 'confirmation' ? 'text-primary font-medium' : ''}>
                    Підтвердження
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Основной контент */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={checkoutState.step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {checkoutState.step === 'projects' && (
                <ProjectsStep 
                  projects={projects}
                  onNext={nextStep}
                />
              )}
              
              {checkoutState.step === 'delivery' && (
                <DeliveryStep
                  deliveryInfo={checkoutState.deliveryInfo}
                  deliveryAnalysis={checkoutState.deliveryAnalysis}
                  isLoading={checkoutState.isLoading}
                  onUpdateDelivery={(updates) => {
                    setCheckoutState(prev => ({
                      ...prev,
                      deliveryInfo: { ...prev.deliveryInfo, ...updates }
                    }));
                    if (updates.city) {
                      analyzeDelivery(updates.city);
                    }
                  }}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              
              {checkoutState.step === 'payment' && (
                <PaymentStep
                  paymentInfo={checkoutState.paymentInfo}
                  recommendations={checkoutState.paymentRecommendations}
                  pricing={checkoutState.pricing}
                  onUpdatePayment={(updates) => {
                    setCheckoutState(prev => ({
                      ...prev,
                      paymentInfo: { ...prev.paymentInfo, ...updates }
                    }));
                    if (updates.method) {
                      updatePaymentCost(updates.method);
                    }
                  }}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              
              {checkoutState.step === 'confirmation' && (
                <ConfirmationStep
                  projects={projects}
                  deliveryInfo={checkoutState.deliveryInfo}
                  paymentInfo={checkoutState.paymentInfo}
                  pricing={checkoutState.pricing}
                  deliveryAnalysis={checkoutState.deliveryAnalysis}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              
              {checkoutState.step === 'processing' && (
                <ProcessingStep />
              )}
              
              {checkoutState.step === 'success' && (
                <SuccessStep 
                  orderId="order-123"
                  pricing={checkoutState.pricing}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// 📦 Шаг: Проекты
function ProjectsStep({ projects, onNext }: { 
  projects: CartItem[];
  onNext: () => void; 
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Ваші проекти ({projects.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project, index) => (
              <div key={project.id} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">
                    {project.type === 'canvas' ? '🖼️' : project.type === 'acrylic' ? '💎' : '📄'}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.options.size || 'Стандартний розмір'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">
                      ✅ Готовий до замовлення
                    </Badge>
                    <span className="text-sm font-medium">
                      {(project.price * project.quantity).toFixed(0)} ₴
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Разом</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Проекти ({projects.length})</span>
                <span>{projects.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(0)} ₴</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Доставка</span>
                <span>розраховується далі</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>До оплати</span>
                <span>{projects.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(0)} ₴+</span>
              </div>
            </div>
            
            <Button size="lg" className="w-full btn-hero" onClick={onNext}>
              Продовжити оформлення
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-success" />
              <div>
                <p className="font-medium text-sm">100% Гарантія якості</p>
                <p className="text-xs text-muted-foreground">
                  Безкоштовний передрук при браку
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 🚚 Шаг: Доставка  
function DeliveryStep({ 
  deliveryInfo, 
  deliveryAnalysis,
  isLoading,
  onUpdateDelivery, 
  onNext, 
  onPrev 
}: {
  deliveryInfo: CheckoutState['deliveryInfo'];
  deliveryAnalysis?: DeliveryAnalysis;
  isLoading: boolean;
  onUpdateDelivery: (updates: Partial<CheckoutState['deliveryInfo']>) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Контактна інформація
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ім'я та прізвище *</Label>
                <Input
                  id="name"
                  value={deliveryInfo.recipientName}
                  onChange={(e) => onUpdateDelivery({ recipientName: e.target.value })}
                  placeholder="Іван Іванов"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  value={deliveryInfo.phone}
                  onChange={(e) => onUpdateDelivery({ phone: e.target.value })}
                  placeholder="+380 XX XXX XX XX"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={deliveryInfo.email}
                onChange={(e) => onUpdateDelivery({ email: e.target.value })}
                placeholder="ivan@example.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Доставка
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">Місто *</Label>
              <Input
                id="city"
                value={deliveryInfo.city}
                onChange={(e) => onUpdateDelivery({ city: e.target.value })}
                placeholder="Київ"
              />
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-primary">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI аналізує варіанти доставки...</span>
              </div>
            )}

            {deliveryAnalysis && (
              <div className="space-y-4">
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium">🤖 AI рекомендація</div>
                    <div className="text-sm mt-1">
                      {deliveryAnalysis.recommendationReasons.join('. ')}
                    </div>
                  </AlertDescription>
                </Alert>

                <RadioGroup
                  value={deliveryInfo.method || ''}
                  onValueChange={(method) => onUpdateDelivery({ method: method as DeliveryMethod })}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-4 border-2 border-primary rounded-lg bg-primary/5">
                      <RadioGroupItem value={deliveryAnalysis.recommended.method} id="recommended" />
                      <div className="flex-1">
                        <Label htmlFor="recommended" className="flex items-center gap-2 cursor-pointer">
                          <Star className="w-4 h-4 text-warning" />
                          <span className="font-medium">
                            {deliveryAnalysis.recommended.method === 'nova-poshta-warehouse' ? 'Нова Пошта (відділення)' : 
                             deliveryAnalysis.recommended.method === 'nova-poshta-courier' ? 'Нова Пошта (кур\'єр)' : 
                             'Укрпошта'}
                          </span>
                          <Badge>Рекомендується</Badge>
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {deliveryAnalysis.recommended.estimatedDays.most_likely} дні • {deliveryAnalysis.recommended.totalCost} ₴
                        </p>
                      </div>
                    </div>

                    {deliveryAnalysis.alternatives.slice(0, 2).map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value={option.method} id={`alt-${index}`} />
                        <div className="flex-1">
                          <Label htmlFor={`alt-${index}`} className="cursor-pointer">
                            <span className="font-medium">
                              {option.method === 'nova-poshta-warehouse' ? 'Нова Пошта (відділення)' : 
                               option.method === 'nova-poshta-courier' ? 'Нова Пошта (кур\'єр)' : 
                               option.method === 'ukrposhta' ? 'Укрпошта' :
                               'Самовивіз'}
                            </span>
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {option.estimatedDays.most_likely} дні • {option.totalCost} ₴
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {deliveryAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Деталі доставки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Вартість доставки</span>
                  <span className="font-medium">{deliveryAnalysis.recommended.totalCost} ₴</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Очікувано</span>
                  <span className="font-medium">
                    {deliveryAnalysis.recommended.estimatedDays.most_likely} дні
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Ймовірність вчасно</span>
                  <span className="font-medium text-success">
                    {deliveryAnalysis.recommended.predictions.onTimeDeliveryProbability}%
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span>Відстеження в реальному часі</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <Shield className="w-4 h-4" />
                  <span>Страхування включено</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <Package className="w-4 h-4" />
                  <span>Професійна упаковка</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <Button 
            onClick={onNext} 
            disabled={!deliveryInfo.recipientName || !deliveryInfo.phone || !deliveryInfo.city || !deliveryInfo.method}
            className="flex-1 btn-hero"
          >
            Далі
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// 💳 Шаг: Оплата (будет продолжен в следующем сообщении из-за ограничения длины)
function PaymentStep({ 
  paymentInfo, 
  recommendations,
  pricing,
  onUpdatePayment, 
  onNext, 
  onPrev 
}: {
  paymentInfo: CheckoutState['paymentInfo'];
  recommendations: PaymentRecommendation[];
  pricing: CheckoutState['pricing'];
  onUpdatePayment: (updates: Partial<CheckoutState['paymentInfo']>) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Спосіб оплати
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 && (
              <RadioGroup
                value={paymentInfo.method || ''}
                onValueChange={(method) => onUpdatePayment({ method: method as PaymentMethod })}
              >
                <div className="space-y-3">
                  {recommendations.slice(0, 4).map((rec, index) => (
                    <div 
                      key={rec.method}
                      className={`flex items-center space-x-2 p-4 border-2 rounded-lg ${
                        index === 0 ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <RadioGroupItem value={rec.method} id={rec.method} />
                      <div className="flex-1">
                        <Label htmlFor={rec.method} className="flex items-center gap-2 cursor-pointer">
                          <span className="text-2xl">
                            {rec.method.includes('apple') ? '🍎' :
                             rec.method.includes('google') ? '📱' :
                             rec.method.includes('mono') ? '🖤' :
                             rec.method.includes('liqpay') ? '💳' : '💵'}
                          </span>
                          <div>
                            <div className="font-medium">
                              {rec.method === 'liqpay-card' ? 'Картка (LiqPay)' :
                               rec.method === 'mono-card' ? 'Картка (Mono)' :
                               rec.method === 'apple-pay' ? 'Apple Pay' :
                               rec.method === 'google-pay' ? 'Google Pay' :
                               'Накладений платіж'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Комісія: {rec.totalCost - pricing.subtotal - pricing.delivery} ₴
                            </div>
                          </div>
                          {index === 0 && <Badge>AI рекомендує</Badge>}
                        </Label>
                        
                        {rec.reasoning.length > 0 && (
                          <div className="mt-2 text-xs text-success">
                            💡 {rec.reasoning[0]}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">{rec.totalCost.toFixed(0)} ₴</div>
                        {rec.savings && (
                          <div className="text-xs text-success">
                            Економія {rec.savings.toFixed(0)} ₴
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8 text-success" />
              <div>
                <p className="font-medium text-sm">Безпечна оплата</p>
                <p className="text-xs text-muted-foreground">
                  Всі дані захищені SSL шифруванням
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>До сплати</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Товари</span>
                <span>{pricing.subtotal.toFixed(0)} ₴</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка</span>
                <span>{pricing.delivery.toFixed(0)} ₴</span>
              </div>
              <div className="flex justify-between">
                <span>Комісія оплати</span>
                <span>{pricing.payment.toFixed(0)} ₴</span>
              </div>
              {pricing.savings > 0 && (
                <div className="flex justify-between text-success">
                  <span>Економія</span>
                  <span>-{pricing.savings.toFixed(0)} ₴</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Разом</span>
                <span>{pricing.total.toFixed(0)} ₴</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <Button 
            onClick={onNext} 
            disabled={!paymentInfo.method}
            className="flex-1 btn-hero"
          >
            Далі
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Заглушки для остальных компонентов
interface ConfirmationStepProps {
  projects?: any[];
  deliveryInfo: any;
  paymentInfo: any;
  pricing: any;
  deliveryAnalysis?: any;
  onNext: () => void;
  onPrev: () => void;
}

function ConfirmationStep({ 
  projects = [], 
  deliveryInfo, 
  paymentInfo, 
  pricing, 
  deliveryAnalysis,
  onNext, 
  onPrev 
}: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Підтвердження замовлення</h2>
        <p className="text-muted-foreground">Перевірте дані перед оформленням</p>
      </div>

      {/* Order Summary */}
      <Card className="card-elegant">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Деталі замовлення</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Товарів:</span>
              <span>{projects?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Доставка:</span>
              <span>{deliveryInfo?.method || 'Не вибрано'}</span>
            </div>
            <div className="flex justify-between">
              <span>Оплата:</span>
              <span>{paymentInfo?.method || 'Не вибрано'}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Загалом:</span>
              <span>{pricing?.total || 0} ₴</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onPrev}>Назад</Button>
        <Button onClick={onNext} className="btn-hero">Підтвердити замовлення</Button>
      </div>
    </div>
  );
}

function ProcessingStep() {
  return (
    <div className="text-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">Обробляємо ваше замовлення</h2>
      <p className="text-muted-foreground">Зачекайте, будь ласка...</p>
    </div>
  );
}

function SuccessStep({ orderId, pricing }: { orderId: string; pricing: CheckoutState['pricing'] }) {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-10 h-10 text-white" />
      </motion.div>
      <h2 className="text-3xl font-bold mb-4">Замовлення оформлено!</h2>
      <p className="text-xl text-muted-foreground mb-6">
        Номер замовлення: <span className="font-mono font-bold">{orderId}</span>
      </p>
      <div className="text-lg mb-8">
        Сума: <span className="font-bold text-primary">{pricing.total.toFixed(0)} ₴</span>
      </div>
      <Button size="lg" className="btn-hero">
        Відстежити замовлення
      </Button>
    </div>
  );
}