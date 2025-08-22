"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Banknote,
  Globe,
  QrCode,
  Wallet
} from 'lucide-react';

export type PaymentMethod = 'card' | 'liqpay' | 'privat24' | 'monobank' | 'crypto' | 'cash';

export interface PaymentData {
  method: PaymentMethod;
  amount: number;
  currency: 'UAH' | 'USD' | 'EUR';
  orderId: string;
  description: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface CardData {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface PaymentFormProps {
  paymentData: PaymentData;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
  onPaymentCancel?: () => void;
  className?: string;
}

const paymentMethods = [
  {
    id: 'card' as PaymentMethod,
    name: 'Банківська картка',
    description: 'Visa, MasterCard, Prostir',
    icon: CreditCard,
    fee: 2.95,
    popular: true
  },
  {
    id: 'liqpay' as PaymentMethod,
    name: 'LiqPay',
    description: 'Миттєва оплата через LiqPay',
    icon: Smartphone,
    fee: 2.75,
    popular: true
  },
  {
    id: 'privat24' as PaymentMethod,
    name: 'Privat24',
    description: 'Онлайн банкінг ПриватБанку',
    icon: Building2,
    fee: 1.5
  },
  {
    id: 'monobank' as PaymentMethod,
    name: 'monobank',
    description: 'Оплата через додаток monobank',
    icon: Smartphone,
    fee: 1.0
  },
  {
    id: 'crypto' as PaymentMethod,
    name: 'Криптовалюта',
    description: 'Bitcoin, Ethereum, USDT',
    icon: Globe,
    fee: 0.5
  },
  {
    id: 'cash' as PaymentMethod,
    name: 'Готівка',
    description: 'Оплата при отриманні',
    icon: Banknote,
    fee: 0
  }
];

export function PaymentForm({
  paymentData,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
  className
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState<CardData>({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [saveCard, setSaveCard] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  // Форматирование номера карты
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Форматирование срока действия
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Валидация карты
  const validateCard = () => {
    const newErrors: Record<string, string> = {};

    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
      newErrors.number = 'Введіть коректний номер картки';
    }

    if (!cardData.expiry || cardData.expiry.length !== 5) {
      newErrors.expiry = 'Введіть термін дії (MM/YY)';
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'Введіть CVV код';
    }

    if (!cardData.name.trim()) {
      newErrors.name = 'Введіть ім\'я власника картки';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Підтвердіть згоду з умовами';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка оплаты
  const handlePayment = async () => {
    if (selectedMethod === 'card' && !validateCard()) {
      return;
    }

    if (!acceptTerms) {
      setErrors({ terms: 'Підтвердіть згоду з умовами' });
      return;
    }

    setIsProcessing(true);
    setErrors({});

    try {
      // Симуляция обработки платежа
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          method: selectedMethod,
          cardData: selectedMethod === 'card' ? cardData : undefined,
          saveCard
        }),
      });

      if (!response.ok) {
        throw new Error('Помилка обробки платежу');
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Оплата успішна!",
          description: `Транзакція ${result.transactionId} виконана`,
        });
        onPaymentSuccess(result.transactionId);
      } else {
        throw new Error(result.error || 'Помилка оплати');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      toast({
        title: "Помилка оплати",
        description: errorMessage,
        variant: "destructive",
      });
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // LiqPay интеграция
  const handleLiqPayPayment = () => {
    // Перенаправление на LiqPay
    const liqpayForm = document.createElement('form');
    liqpayForm.method = 'POST';
    liqpayForm.action = 'https://www.liqpay.ua/api/3/checkout';
    liqpayForm.target = '_blank';

    // Создание полей формы (в реальном приложении data и signature генерируются на сервере)
    const dataField = document.createElement('input');
    dataField.type = 'hidden';
    dataField.name = 'data';
    dataField.value = btoa(JSON.stringify({
      version: 3,
      action: 'pay',
      amount: paymentData.amount,
      currency: paymentData.currency,
      description: paymentData.description,
      order_id: paymentData.orderId,
      result_url: `${window.location.origin}/payment/success`,
      server_url: `${window.location.origin}/api/payment/webhook`
    }));

    const signatureField = document.createElement('input');
    signatureField.type = 'hidden';
    signatureField.name = 'signature';
    signatureField.value = 'signature_here'; // В реальном приложении генерируется на сервере

    liqpayForm.appendChild(dataField);
    liqpayForm.appendChild(signatureField);
    document.body.appendChild(liqpayForm);
    liqpayForm.submit();
    document.body.removeChild(liqpayForm);
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const finalAmount = paymentData.amount + (paymentData.amount * (selectedMethodData?.fee || 0) / 100);

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Спосіб оплати</span>
          </CardTitle>
          <CardDescription>
            Оберіть зручний для вас спосіб оплати
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label 
                    htmlFor={method.id}
                    className="flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <method.icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{method.name}</span>
                          {method.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Популярно
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {method.fee > 0 ? (
                        <div className="text-sm">
                          <span className="text-gray-500">+{method.fee}%</span>
                          <br />
                          <span className="text-xs text-gray-400">
                            +₴{((paymentData.amount * method.fee) / 100).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-green-600">
                          Безкоштовно
                        </Badge>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <AnimatePresence mode="wait">
        {selectedMethod === 'card' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Дані картки</span>
                </CardTitle>
                <CardDescription>
                  Введіть дані вашої банківської картки
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="card-number">Номер картки</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => setCardData({
                      ...cardData,
                      number: formatCardNumber(e.target.value)
                    })}
                    maxLength={19}
                    className={errors.number ? 'border-red-500' : ''}
                  />
                  {errors.number && (
                    <p className="text-sm text-red-500">{errors.number}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry */}
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Термін дії</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({
                        ...cardData,
                        expiry: formatExpiry(e.target.value)
                      })}
                      maxLength={5}
                      className={errors.expiry ? 'border-red-500' : ''}
                    />
                    {errors.expiry && (
                      <p className="text-sm text-red-500">{errors.expiry}</p>
                    )}
                  </div>

                  {/* CVV */}
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({
                        ...cardData,
                        cvv: e.target.value.replace(/[^0-9]/g, '')
                      })}
                      maxLength={4}
                      type="password"
                      className={errors.cvv ? 'border-red-500' : ''}
                    />
                    {errors.cvv && (
                      <p className="text-sm text-red-500">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardholder">Ім'я власника картки</Label>
                  <Input
                    id="cardholder"
                    placeholder="IVAN PETROV"
                    value={cardData.name}
                    onChange={(e) => setCardData({
                      ...cardData,
                      name: e.target.value.toUpperCase()
                    })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Save Card */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-card"
                    checked={saveCard}
                    onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                  />
                  <Label htmlFor="save-card" className="text-sm">
                    Зберегти картку для майбутніх покупок
                  </Label>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedMethod === 'crypto' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5" />
                  <span>Криптовалюта</span>
                </CardTitle>
                <CardDescription>
                  Оплата через криптовалютні гаманці
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Globe className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Після підтвердження ви будете перенаправлені на платіжний шлюз
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedMethod === 'cash' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Banknote className="h-5 w-5" />
                  <span>Оплата готівкою</span>
                </CardTitle>
                <CardDescription>
                  Оплата при отриманні замовлення
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Зручна оплата</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Ви сплачуєте замовлення готівкою або карткою при отриманні. 
                        Комісія за цей спосіб оплати відсутня.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Деталі замовлення</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Сума замовлення:</span>
            <span>₴{paymentData.amount.toFixed(2)}</span>
          </div>
          
          {selectedMethodData && selectedMethodData.fee > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Комісія {selectedMethodData.name} ({selectedMethodData.fee}%):</span>
              <span>₴{((paymentData.amount * selectedMethodData.fee) / 100).toFixed(2)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-medium">
            <span>До сплати:</span>
            <span>₴{finalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Terms Agreement */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              className={errors.terms ? 'border-red-500' : ''}
            />
            <Label htmlFor="terms" className="text-sm leading-6">
              Я погоджуюся з{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                умовами використання
              </a>{' '}
              та{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                політикою конфіденційності
              </a>. 
              Підтверджую, що ознайомлений з умовами оплати та доставки.
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-500 mt-2">{errors.terms}</p>
          )}
        </CardContent>
      </Card>

      {/* Payment Actions */}
      <div className="flex items-center justify-between space-x-4">
        {onPaymentCancel && (
          <Button variant="outline" onClick={onPaymentCancel} disabled={isProcessing}>
            Скасувати
          </Button>
        )}
        
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Захищена оплата</span>
          </div>
          
          <Button
            onClick={selectedMethod === 'liqpay' ? handleLiqPayPayment : handlePayment}
            disabled={isProcessing || !acceptTerms}
            className="min-w-[200px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Обробка...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Сплатити ₴{finalAmount.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Security Info */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div className="text-sm">
              <p className="font-medium">Ваші дані в безпеці</p>
              <p className="text-gray-600">
                Всі платежі захищені SSL-шифруванням. Ми не зберігаємо дані вашої картки.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentForm;