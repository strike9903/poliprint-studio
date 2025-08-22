"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MobileDrawer } from './MobileDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Clock,
  Package,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface MobileCheckoutFormProps {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

type CheckoutStep = 'contact' | 'delivery' | 'payment' | 'review';

interface CheckoutFormData {
  // Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Delivery
  deliveryMethod: 'nova-poshta' | 'ukrposhta' | 'self-pickup';
  city: string;
  address: string;
  warehouse?: string;
  
  // Payment
  paymentMethod: 'liqpay' | 'cod' | 'bank-transfer';
  
  // Additional
  comment?: string;
  newsletter: boolean;
  terms: boolean;
}

export function MobileCheckoutForm({
  items,
  subtotal,
  shipping,
  total,
  onSubmit,
  isSubmitting = false
}: MobileCheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      deliveryMethod: 'nova-poshta',
      paymentMethod: 'liqpay',
      newsletter: false,
      terms: false
    }
  });

  const watchedValues = watch();

  const steps = [
    { id: 'contact', title: 'Контакти', icon: User, description: 'Ваші дані' },
    { id: 'delivery', title: 'Доставка', icon: Truck, description: 'Спосіб доставки' },
    { id: 'payment', title: 'Оплата', icon: CreditCard, description: 'Спосіб оплати' },
    { id: 'review', title: 'Підтвердження', icon: CheckCircle2, description: 'Перевірка' }
  ] as const;

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const isStepCompleted = (stepId: CheckoutStep) => {
    return completedSteps.includes(stepId);
  };

  const isStepValid = (stepId: CheckoutStep) => {
    switch (stepId) {
      case 'contact':
        return watchedValues.firstName && watchedValues.lastName && 
               watchedValues.email && watchedValues.phone;
      case 'delivery':
        return watchedValues.deliveryMethod && watchedValues.city;
      case 'payment':
        return watchedValues.paymentMethod;
      case 'review':
        return watchedValues.terms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep) && currentStepIndex < steps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const goToStep = (stepId: CheckoutStep) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex <= currentStepIndex || isStepCompleted(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const deliveryOptions = [
    { id: 'nova-poshta', name: 'Нова Пошта', price: 45, time: '1-3 дні', icon: Package },
    { id: 'ukrposhta', name: 'Укрпошта', price: 35, time: '3-7 днів', icon: Package },
    { id: 'self-pickup', name: 'Самовивіз', price: 0, time: 'Сьогодні', icon: MapPin }
  ];

  const paymentOptions = [
    { id: 'liqpay', name: 'LiqPay', description: 'Картка, Google Pay, Apple Pay', icon: CreditCard },
    { id: 'cod', name: 'При отриманні', description: 'Готівка або картка кур\'єру', icon: Package },
    { id: 'bank-transfer', name: 'Банківський переказ', description: 'Оплата через банк', icon: CreditCard }
  ];

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = isStepCompleted(step.id);
            const isPast = index < currentStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                disabled={!isPast && !isActive && !isCompleted}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                  isActive && "bg-primary/10 text-primary",
                  isCompleted && "text-green-600",
                  !isActive && !isCompleted && !isPast && "text-muted-foreground opacity-50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  isActive && "bg-primary text-primary-foreground",
                  isCompleted && "bg-green-600 text-white",
                  !isActive && !isCompleted && "bg-muted"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Progress line */}
        <div className="relative h-1 bg-muted rounded-full">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Contact Step */}
            {currentStep === 'contact' && (
              <div className="bg-card rounded-lg p-4 border space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Контактні дані</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">Ім'я *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName', { required: true })}
                      className={cn(errors.firstName && "border-red-500")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Прізвище *</Label>
                    <Input
                      id="lastName"
                      {...register('lastName', { required: true })}
                      className={cn(errors.lastName && "border-red-500")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: true })}
                    className={cn(errors.email && "border-red-500")}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+380..."
                    {...register('phone', { required: true })}
                    className={cn(errors.phone && "border-red-500")}
                  />
                </div>
              </div>
            )}

            {/* Delivery Step */}
            {currentStep === 'delivery' && (
              <div className="bg-card rounded-lg p-4 border space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Доставка</h3>
                </div>

                <RadioGroup
                  value={watchedValues.deliveryMethod}
                  onValueChange={(value) => setValue('deliveryMethod', value as any)}
                >
                  {deliveryOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div className="flex items-center gap-3 flex-1">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <Label htmlFor={option.id} className="font-medium">
                              {option.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{option.time}</p>
                          </div>
                          <div className="text-right">
                            {option.price === 0 ? (
                              <Badge variant="secondary">Безкоштовно</Badge>
                            ) : (
                              <span className="font-medium">{option.price}₴</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>

                <div>
                  <Label htmlFor="city">Місто *</Label>
                  <Input
                    id="city"
                    {...register('city', { required: true })}
                    className={cn(errors.city && "border-red-500")}
                  />
                </div>

                {watchedValues.deliveryMethod !== 'self-pickup' && (
                  <div>
                    <Label htmlFor="address">Адреса доставки</Label>
                    <Textarea
                      id="address"
                      {...register('address')}
                      className="min-h-[80px]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="bg-card rounded-lg p-4 border space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Спосіб оплати</h3>
                </div>

                <RadioGroup
                  value={watchedValues.paymentMethod}
                  onValueChange={(value) => setValue('paymentMethod', value as any)}
                >
                  {paymentOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div className="flex items-center gap-3 flex-1">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <Label htmlFor={option.id} className="font-medium">
                              {option.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>

                <div>
                  <Label htmlFor="comment">Коментар до замовлення</Label>
                  <Textarea
                    id="comment"
                    {...register('comment')}
                    placeholder="Додаткові побажання..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="space-y-4">
                {/* Order Summary */}
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold mb-4">Ваше замовлення</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {item.price}₴
                          </p>
                        </div>
                        <span className="font-medium">
                          {item.quantity * item.price}₴
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Підсумок:</span>
                      <span>{subtotal}₴</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Доставка:</span>
                      <span>{shipping === 0 ? 'Безкоштовно' : `${shipping}₴`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>До сплати:</span>
                      <span className="text-primary">{total}₴</span>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-card rounded-lg p-4 border space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="terms"
                      checked={watchedValues.terms}
                      onCheckedChange={(checked) => setValue('terms', checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      Я погоджуюся з{' '}
                      <a href="/terms" className="text-primary underline">
                        умовами використання
                      </a>{' '}
                      та{' '}
                      <a href="/privacy" className="text-primary underline">
                        політикою конфіденційності
                      </a>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="newsletter"
                      checked={watchedValues.newsletter}
                      onCheckedChange={(checked) => setValue('newsletter', checked as boolean)}
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      Підписатися на розсилку про акції та новинки
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-4 -mx-4 -mb-4">
          <div className="flex gap-3">
            {currentStep !== 'contact' && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1"
              >
                Назад
              </Button>
            )}

            {currentStep !== 'review' ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className={cn(
                  "flex-1",
                  currentStep === 'contact' && "w-full"
                )}
              >
                Далі
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!watchedValues.terms || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Обробляємо...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Оформити замовлення
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}