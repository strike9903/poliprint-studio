"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Truck,
  CreditCard,
  Package,
  Shield,
  Clock,
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  Sparkles
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useProjectManager, type CartProject } from '@/contexts/ProjectManagerContext';
import { useOrders, useCheckout, type PaymentMethod, type DeliveryMethod } from '@/contexts/OrderContext';
import { paymentEngine, type PaymentRecommendation } from '@/services/PaymentEngine';
import { deliveryAI, type DeliveryAnalysis } from '@/services/DeliveryAI';

// 🎯 Компактные типы
type CheckoutStep = 'review' | 'details' | 'payment' | 'confirmation';

interface CompactCheckoutState {
  step: CheckoutStep;
  isLoading: boolean;
  
  // Объединенные данные пользователя
  userInfo: {
    name: string;
    phone: string;
    email: string;
    city: string;
    deliveryMethod: DeliveryMethod | null;
    paymentMethod: PaymentMethod | null;
    notes?: string;
  };
  
  // Упрощенные расчеты
  totals: {
    subtotal: number;
    delivery: number;
    total: number;
  };
  
  // AI рекомендации (загружаются фоном)
  recommendations: {
    payment: PaymentRecommendation[];
    delivery?: DeliveryAnalysis;
  };
}

interface CompactCheckoutFlowProps {
  projects: CartProject[];
  isOpen: boolean;
  onComplete: (orderId: string) => void;
  onCancel: () => void;
}

export function CompactCheckoutFlow({ projects, isOpen, onComplete, onCancel }: CompactCheckoutFlowProps) {
  const [state, setState] = useState<CompactCheckoutState>({
    step: 'review',
    isLoading: false,
    userInfo: {
      name: '',
      phone: '',
      email: '',
      city: '',
      deliveryMethod: null,
      paymentMethod: null,
    },
    totals: {
      subtotal: projects.reduce((sum, p) => sum + p.pricing.currentPrice, 0),
      delivery: 0,
      total: projects.reduce((sum, p) => sum + p.pricing.currentPrice, 0),
    },
    recommendations: {
      payment: [],
    },
  });

  // 📊 Прогресс
  const progressValue = useMemo(() => {
    const stepProgress = { review: 25, details: 50, payment: 75, confirmation: 100 };
    return stepProgress[state.step];
  }, [state.step]);

  // 🤖 AI анализ в фоне
  useEffect(() => {
    if (isOpen && state.recommendations.payment.length === 0) {
      // Загружаем рекомендации асинхронно
      const loadRecommendations = async () => {
        try {
          const userPsychology = paymentEngine.analyzeUserPsychology({
            userAgent: navigator.userAgent,
            orderHistory: [],
            currentOrder: { pricing: state.totals as any },
            timestamp: new Date(),
          });
          
          const paymentRecs = paymentEngine.getPaymentRecommendations(
            userPsychology, 
            { pricing: state.totals as any }
          );
          
          setState(prev => ({
            ...prev,
            recommendations: {
              ...prev.recommendations,
              payment: paymentRecs,
            },
          }));
        } catch (error) {
          console.error('AI recommendations failed:', error);
        }
      };

      loadRecommendations();
    }
  }, [isOpen, state.totals]);

  // 🚀 Навигация
  const nextStep = useCallback(() => {
    const steps: CheckoutStep[] = ['review', 'details', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(state.step);
    if (currentIndex < steps.length - 1) {
      setState(prev => ({ ...prev, step: steps[currentIndex + 1] }));
    } else {
      // Завершение заказа
      setState(prev => ({ ...prev, isLoading: true }));
      setTimeout(() => {
        onComplete('order-' + Date.now());
      }, 2000);
    }
  }, [state.step, onComplete]);

  const prevStep = useCallback(() => {
    const steps: CheckoutStep[] = ['review', 'details', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(state.step);
    if (currentIndex > 0) {
      setState(prev => ({ ...prev, step: steps[currentIndex - 1] }));
    }
  }, [state.step]);

  // 💰 Обновление цен
  const updatePricing = useCallback((deliveryCost: number = 0, paymentFee: number = 0) => {
    setState(prev => ({
      ...prev,
      totals: {
        ...prev.totals,
        delivery: deliveryCost,
        total: prev.totals.subtotal + deliveryCost + paymentFee,
      },
    }));
  }, []);

  // ✅ Валидация
  const canProceed = useMemo(() => {
    switch (state.step) {
      case 'review':
        return projects.length > 0;
      case 'details':
        return state.userInfo.name && state.userInfo.phone && state.userInfo.city && state.userInfo.deliveryMethod;
      case 'payment':
        return state.userInfo.paymentMethod;
      case 'confirmation':
        return true;
      default:
        return false;
    }
  }, [state.step, state.userInfo, projects]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl max-h-[95vh]">
        <DialogHeader className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Оформлення замовлення
            </DialogTitle>
            <div className="text-sm text-muted-foreground">
              {projects.length} товарів • {state.totals.total.toFixed(0)} ₴
            </div>
          </div>
          
          {/* Прогресс */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Крок {['review', 'details', 'payment', 'confirmation'].indexOf(state.step) + 1} з 4</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-1.5" />
          </div>
        </DialogHeader>

        {/* Основной контент */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {state.step === 'review' && (
                <ReviewStep 
                  projects={projects}
                  totals={state.totals}
                  onNext={nextStep}
                />
              )}
              
              {state.step === 'details' && (
                <DetailsStep
                  userInfo={state.userInfo}
                  deliveryAnalysis={state.recommendations.delivery}
                  onUpdate={(updates) => {
                    setState(prev => ({
                      ...prev,
                      userInfo: { ...prev.userInfo, ...updates }
                    }));
                  }}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              
              {state.step === 'payment' && (
                <PaymentStep
                  userInfo={state.userInfo}
                  recommendations={state.recommendations.payment}
                  totals={state.totals}
                  onUpdate={(updates) => {
                    setState(prev => ({
                      ...prev,
                      userInfo: { ...prev.userInfo, ...updates }
                    }));
                  }}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              
              {state.step === 'confirmation' && (
                <ConfirmationStep
                  projects={projects}
                  userInfo={state.userInfo}
                  totals={state.totals}
                  isLoading={state.isLoading}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Футер с кнопками */}
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {state.step === 'confirmation' ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Shield className="w-4 h-4" />
                  Ваші дані захищені SSL
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Безпечне оформлення
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {state.step !== 'review' && (
                <Button variant="outline" onClick={prevStep} disabled={state.isLoading}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Назад
                </Button>
              )}
              
              <Button 
                onClick={nextStep} 
                disabled={!canProceed || state.isLoading}
                className="min-w-[120px]"
              >
                {state.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-background border-t-foreground rounded-full animate-spin" />
                    Обробка...
                  </div>
                ) : state.step === 'confirmation' ? (
                  <>
                    Підтвердити
                    <CheckCircle className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Далі
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 📦 Компактные шаги

function ReviewStep({ 
  projects, 
  totals, 
  onNext 
}: { 
  projects: CartProject[]; 
  totals: CompactCheckoutState['totals']; 
  onNext: () => void; 
}) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <h3 className="font-semibold">Ваші проекти</h3>
        <div className="space-y-3">
          {projects.map((project, index) => (
            <Card key={project.id} className="p-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">
                    {project.configuration.product.type === 'canvas' ? '🖼️' : '💎'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{project.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {project.configuration.dimensions.width}×{project.configuration.dimensions.height} см
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      {project.status === 'ready' ? '✅ Готовий' : '⚠️ Потребує уваги'}
                    </Badge>
                    <span className="text-sm font-semibold">
                      {project.pricing.currentPrice.toFixed(0)} ₴
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Разом</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Проекти ({projects.length})</span>
              <span>{totals.subtotal.toFixed(0)} ₴</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Доставка</span>
              <span>розраховується далі</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>До оплати</span>
              <span>{totals.total.toFixed(0)} ₴+</span>
            </div>
            
            <Alert className="mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-xs">
                100% гарантія якості • Безкоштовний передрук при браку
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailsStep({ 
  userInfo, 
  deliveryAnalysis,
  onUpdate, 
  onNext, 
  onPrev 
}: {
  userInfo: CompactCheckoutState['userInfo'];
  deliveryAnalysis?: DeliveryAnalysis;
  onUpdate: (updates: Partial<CompactCheckoutState['userInfo']>) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <User className="w-4 h-4" />
          Контактні дані
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs">Ім'я та прізвище *</Label>
            <Input
              id="name"
              value={userInfo.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Іван Іванов"
              className="h-9"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs">Телефон *</Label>
            <Input
              id="phone"
              value={userInfo.phone}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              placeholder="+380 XX XXX XX XX"
              className="h-9"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs">Email</Label>
          <Input
            id="email"
            type="email"
            value={userInfo.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="ivan@example.com"
            className="h-9"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="city" className="text-xs">Місто *</Label>
          <Input
            id="city"
            value={userInfo.city}
            onChange={(e) => onUpdate({ city: e.target.value })}
            placeholder="Київ"
            className="h-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Доставка
        </h3>
        
        <RadioGroup
          value={userInfo.deliveryMethod || ''}
          onValueChange={(method) => onUpdate({ deliveryMethod: method as DeliveryMethod })}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-3 border border-primary rounded-lg bg-primary/5">
              <RadioGroupItem value="nova-poshta-warehouse" id="np-warehouse" />
              <div className="flex-1">
                <Label htmlFor="np-warehouse" className="flex items-center gap-2 cursor-pointer">
                  <Star className="w-3 h-3 text-warning" />
                  <span className="text-sm font-medium">Нова Пошта (відділення)</span>
                  <Badge variant="secondary" className="text-xs">Рекомендується</Badge>
                </Label>
                <p className="text-xs text-muted-foreground">1-2 дні • від 60₴</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="nova-poshta-courier" id="np-courier" />
              <div className="flex-1">
                <Label htmlFor="np-courier" className="cursor-pointer">
                  <span className="text-sm font-medium">Нова Пошта (кур'єр)</span>
                </Label>
                <p className="text-xs text-muted-foreground">1-2 дні • від 80₴</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="ukrposhta" id="ukrposhta" />
              <div className="flex-1">
                <Label htmlFor="ukrposhta" className="cursor-pointer">
                  <span className="text-sm font-medium">Укрпошта</span>
                </Label>
                <p className="text-xs text-muted-foreground">3-5 днів • від 40₴</p>
              </div>
            </div>
          </div>
        </RadioGroup>

        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-success mb-1">
            <CheckCircle className="w-3 h-3" />
            <span>Відстеження в реальному часі</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-success">
            <Shield className="w-3 h-3" />
            <span>Страхування включено</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentStep({ 
  userInfo, 
  recommendations,
  totals,
  onUpdate, 
  onNext, 
  onPrev 
}: {
  userInfo: CompactCheckoutState['userInfo'];
  recommendations: PaymentRecommendation[];
  totals: CompactCheckoutState['totals'];
  onUpdate: (updates: Partial<CompactCheckoutState['userInfo']>) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const paymentMethods = [
    { id: 'liqpay-card', name: 'Картка (LiqPay)', emoji: '💳', fee: 0 },
    { id: 'mono-card', name: 'Картка (Mono)', emoji: '🖤', fee: 0 },
    { id: 'apple-pay', name: 'Apple Pay', emoji: '🍎', fee: 0 },
    { id: 'google-pay', name: 'Google Pay', emoji: '📱', fee: 0 },
    { id: 'cash-on-delivery', name: 'Накладений платіж', emoji: '💵', fee: 25 },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Спосіб оплати
        </h3>
        
        <RadioGroup
          value={userInfo.paymentMethod || ''}
          onValueChange={(method) => onUpdate({ paymentMethod: method as PaymentMethod })}
        >
          <div className="space-y-2">
            {paymentMethods.map((method, index) => (
              <div 
                key={method.id}
                className={`flex items-center space-x-2 p-3 border rounded-lg ${
                  index === 0 ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex-1">
                  <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer">
                    <span className="text-lg">{method.emoji}</span>
                    <div>
                      <div className="text-sm font-medium">{method.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {method.fee > 0 ? `Комісія: ${method.fee}₴` : 'Без комісії'}
                      </div>
                    </div>
                    {index === 0 && <Badge variant="secondary" className="text-xs">AI рекомендує</Badge>}
                  </Label>
                </div>
                <div className="text-sm font-medium">
                  {(totals.total + method.fee).toFixed(0)} ₴
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>

        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Всі платежі захищені SSL шифруванням. Ваші дані безпечні.
          </AlertDescription>
        </Alert>
      </div>

      <div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">До сплати</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Товари</span>
                <span>{totals.subtotal.toFixed(0)} ₴</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка</span>
                <span>{totals.delivery.toFixed(0)} ₴</span>
              </div>
              <div className="flex justify-between">
                <span>Комісія оплати</span>
                <span>0 ₴</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Разом</span>
                <span>{totals.total.toFixed(0)} ₴</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConfirmationStep({ 
  projects,
  userInfo, 
  totals,
  isLoading,
  onNext, 
  onPrev 
}: {
  projects: CartProject[];
  userInfo: CompactCheckoutState['userInfo'];
  totals: CompactCheckoutState['totals'];
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Підтвердження замовлення</h3>
        <p className="text-sm text-muted-foreground">Перевірте дані перед оформленням</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Контактні дані</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Ім'я:</strong> {userInfo.name}</div>
            <div><strong>Телефон:</strong> {userInfo.phone}</div>
            <div><strong>Email:</strong> {userInfo.email}</div>
            <div><strong>Місто:</strong> {userInfo.city}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Доставка та оплата</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Доставка:</strong> {userInfo.deliveryMethod}</div>
            <div><strong>Оплата:</strong> {userInfo.paymentMethod}</div>
            <div><strong>Загальна сума:</strong> {totals.total.toFixed(0)} ₴</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Товари ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex justify-between text-sm">
                <span>{project.name}</span>
                <span>{project.pricing.currentPrice.toFixed(0)} ₴</span>
              </div>
            ))}
            {projects.length > 3 && (
              <div className="text-sm text-muted-foreground">
                ...та ще {projects.length - 3} товарів
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Обробляємо ваше замовлення. Зачекайте, будь ласка...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
