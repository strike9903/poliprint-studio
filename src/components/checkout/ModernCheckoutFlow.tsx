"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  User,
  MapPin,
  CreditCard,
  Package,
  Sparkles,
  Shield,
  Clock,
  Star,
  Zap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { type CartItem } from '@/contexts/CartContext';

interface ModernCheckoutFlowProps {
  projects: CartItem[];
  onComplete: (orderId: string) => void;
  onCancel: () => void;
}

type CheckoutStep = 'review' | 'delivery' | 'payment' | 'confirmation';

interface StepInfo {
  id: CheckoutStep;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

export function ModernCheckoutFlow({ projects, onComplete, onCancel }: ModernCheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('review');
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const { state: cartState } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const steps: StepInfo[] = [
    {
      id: 'review',
      title: 'Перегляд',
      description: 'Перевірте ваше замовлення',
      icon: Package,
      completed: completedSteps.has('review')
    },
    {
      id: 'delivery',
      title: 'Доставка',
      description: 'Адреса та спосіб доставки',
      icon: MapPin,
      completed: completedSteps.has('delivery')
    },
    {
      id: 'payment',
      title: 'Оплата',
      description: 'Виберіть спосіб оплати',
      icon: CreditCard,
      completed: completedSteps.has('payment')
    },
    {
      id: 'confirmation',
      title: 'Підтвердження',
      description: 'Фінальна перевірка',
      icon: CheckCircle,
      completed: completedSteps.has('confirmation')
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('uk-UA') + '₴';
  };

  const totalPrice = projects.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const deliveryFee = totalPrice >= 500 ? 0 : 60;
  const grandTotal = totalPrice + deliveryFee;

  const handleComplete = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderId = `PL${Date.now()}`;
    
    toast({
      title: "Замовлення успішно створено! 🎉",
      description: `Номер замовлення: #${orderId}`,
    });
    
    setIsProcessing(false);
    onComplete(orderId);
  };

  const StepHeader = () => (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-t-2xl">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">
            Крок {currentStepIndex + 1} з {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% завершено
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.completed;
          const isClickable = index <= currentStepIndex;

          return (
            <div key={step.id} className="flex items-center">
              <motion.button
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                onClick={() => isClickable && setCurrentStep(step.id)}
                disabled={!isClickable}
                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg' 
                    : isCompleted 
                      ? 'bg-success text-white' 
                      : isClickable
                        ? 'bg-muted hover:bg-muted/80 text-muted-foreground'
                        : 'bg-muted/50 text-muted-foreground/50'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
                
                {isActive && (
                  <motion.div
                    layoutId="activeStep"
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
              
              {index < steps.length - 1 && (
                <div className={`
                  h-0.5 w-8 mx-2 transition-all duration-200
                  ${isCompleted || (index < currentStepIndex) 
                    ? 'bg-success' 
                    : 'bg-muted'
                  }
                `} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Info */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-6 text-center"
      >
        <h2 className="text-2xl font-bold mb-2">{steps[currentStepIndex].title}</h2>
        <p className="text-muted-foreground">{steps[currentStepIndex].description}</p>
      </motion.div>
    </div>
  );

  const ReviewStep = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        {projects.map((item, index) => (
          <Card key={`${item.id}-${index}`} className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{item.image}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.options.size || 'Стандартний розмір'} • Кількість: {item.quantity}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      ✅ Готовий до друку
                    </Badge>
                    <span className="text-sm font-medium text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Sparkles className="w-5 h-5" />
            AI Рекомендації
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Якість файлів: Відмінно (300+ DPI)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-green-500" />
            <span>Час виготовлення: 24-48 годин</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>Рекомендована упаковка: Посилена</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DeliveryStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Адреса доставки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated && user ? (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">
                Київ, вул. Хрещатик, 1, кв. 10
              </p>
              <p className="text-sm text-muted-foreground">+380 99 123 45 67</p>
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
              <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Увійдіть в акаунт або заповніть адресу доставки
              </p>
            </div>
          )}

          <div className="grid gap-3">
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📦</span>
                  </div>
                  <div>
                    <p className="font-medium">Нова Пошта</p>
                    <p className="text-sm text-muted-foreground">1-2 робочі дні</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{deliveryFee === 0 ? 'Безкоштовно' : formatPrice(deliveryFee)}</p>
                  {totalPrice < 500 && (
                    <p className="text-xs text-muted-foreground">
                      До безкоштовної доставки: {formatPrice(500 - totalPrice)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PaymentStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Спосіб оплати
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {[
              { id: 'card', name: 'Картка онлайн', icon: '💳', fee: 0, popular: true },
              { id: 'liqpay', name: 'LiqPay', icon: '🏦', fee: 0 },
              { id: 'cod', name: 'Накладений платіж', icon: '📦', fee: 30 },
            ].map((method) => (
              <div key={method.id} className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{method.name}</p>
                        {method.popular && (
                          <Badge className="bg-success/10 text-success text-xs">
                            Популярно
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.fee === 0 ? 'Без комісії' : `Комісія: ${formatPrice(method.fee)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Безпечно</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ConfirmationStep = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-2">Все готово до оформлення!</h3>
            <p className="text-muted-foreground">
              Перевірте деталі замовлення перед підтвердженням
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Товарів:</span>
              <span>{projects.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Сума:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Доставка:</span>
              <span>{deliveryFee === 0 ? 'Безкоштовно' : formatPrice(deliveryFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>До сплати:</span>
              <span className="text-primary">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-muted/50 rounded-lg">
          <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs font-medium">24-48 годин</p>
          <p className="text-xs text-muted-foreground">Виготовлення</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <Shield className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="text-xs font-medium">Гарантія</p>
          <p className="text-xs text-muted-foreground">Якості</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-xs font-medium">Швидка</p>
          <p className="text-xs text-muted-foreground">Доставка</p>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'review':
        return <ReviewStep />;
      case 'delivery':
        return <DeliveryStep />;
      case 'payment':
        return <PaymentStep />;
      case 'confirmation':
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <StepHeader />
            
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="border-t p-6">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={currentStepIndex === 0 ? onCancel : prevStep}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {currentStepIndex === 0 ? 'Скасувати' : 'Назад'}
                </Button>

                {currentStep === 'confirmation' ? (
                  <Button
                    onClick={handleComplete}
                    disabled={isProcessing}
                    className="gap-2 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Обробка...
                      </>
                    ) : (
                      <>
                        Підтвердити замовлення
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={nextStep} className="gap-2">
                    Далі
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}