"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Shield, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  Smartphone,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface PaymentFormProps {
  orderId: string;
  amount: number;
  currency?: string;
  description: string;
  customerData?: {
    email?: string;
    name?: string;
    phone?: string;
  };
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
}

type PaymentStatus = 'idle' | 'creating' | 'redirect' | 'processing' | 'success' | 'error';

export function PaymentForm({
  orderId,
  amount,
  currency = 'UAH',
  description,
  customerData,
  onPaymentSuccess,
  onPaymentError,
  className
}: PaymentFormProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const createPayment = async () => {
    setPaymentStatus('creating');
    setErrorMessage('');

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          description,
          orderId,
          customerEmail: customerData?.email,
          customerName: customerData?.name,
          customerPhone: customerData?.phone,
          productName: description,
          productCategory: 'printing',
          resultUrl: `${window.location.origin}/payment/result?orderId=${orderId}`,
          serverUrl: `${window.location.origin}/api/payment/webhook`
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment');
      }

      setPaymentData(data.payment);
      setPaymentStatus('redirect');

      // Автоматически отправляем форму платежа
      setTimeout(() => {
        submitPaymentForm(data.payment);
      }, 1000);

    } catch (error) {
      console.error('Payment creation error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Невідома помилка';
      setErrorMessage(errorMsg);
      setPaymentStatus('error');
      onPaymentError?.(errorMsg);
      
      toast({
        title: "Помилка створення платежу",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const submitPaymentForm = (payment: any) => {
    // Создаем и отправляем форму программно
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = payment.action;
    form.target = '_blank'; // Открываем в новой вкладке
    
    const dataInput = document.createElement('input');
    dataInput.type = 'hidden';
    dataInput.name = 'data';
    dataInput.value = payment.data;
    
    const signatureInput = document.createElement('input');
    signatureInput.type = 'hidden';
    signatureInput.name = 'signature';
    signatureInput.value = payment.signature;
    
    form.appendChild(dataInput);
    form.appendChild(signatureInput);
    document.body.appendChild(form);
    
    form.submit();
    document.body.removeChild(form);

    // Начинаем проверку статуса
    setPaymentStatus('processing');
    startStatusChecking();
  };

  const startStatusChecking = () => {
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/status?orderId=${orderId}`);
        const data = await response.json();

        if (data.success && data.payment) {
          if (data.payment.isPaid) {
            setPaymentStatus('success');
            clearInterval(checkInterval);
            onPaymentSuccess?.(data.payment);
            
            toast({
              title: "Платіж успішний!",
              description: `Замовлення ${orderId} оплачено`,
            });
          } else if (data.payment.isFailed) {
            setPaymentStatus('error');
            clearInterval(checkInterval);
            setErrorMessage('Платіж не пройшов');
            onPaymentError?.('Платіж не пройшов');
          }
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    }, 5000); // Проверяем каждые 5 секунд

    // Останавливаем проверку через 10 минут
    setTimeout(() => {
      clearInterval(checkInterval);
      if (paymentStatus === 'processing') {
        setPaymentStatus('error');
        setErrorMessage('Час очікування платежу вичерпано');
      }
    }, 600000);
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'creating':
      case 'redirect':
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'creating':
        return 'Створюємо платіж...';
      case 'redirect':
        return 'Перенаправляємо на сторінку оплати...';
      case 'processing':
        return 'Очікуємо підтвердження платежу...';
      case 'success':
        return 'Платіж успішно проведено!';
      case 'error':
        return errorMessage || 'Сталася помилка при оплаті';
      default:
        return 'Готовий до оплати';
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>Оплата замовлення</span>
        </CardTitle>
        <CardDescription>
          {getStatusMessage()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        
        {/* Детали заказа */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Замовлення:</span>
            <span className="font-medium">{orderId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Опис:</span>
            <span className="font-medium text-right max-w-xs truncate">{description}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="font-medium">До сплати:</span>
            <span className="text-lg font-bold text-primary">
              {formatAmount(amount)}
            </span>
          </div>
        </div>

        {/* Информация о клиенте */}
        {customerData && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Дані покупця</h4>
              {customerData.name && (
                <div className="text-sm text-muted-foreground">
                  {customerData.name}
                </div>
              )}
              {customerData.email && (
                <div className="text-sm text-muted-foreground">
                  {customerData.email}
                </div>
              )}
              {customerData.phone && (
                <div className="text-sm text-muted-foreground">
                  {customerData.phone}
                </div>
              )}
            </div>
          </>
        )}

        {/* Статус платежа */}
        {paymentStatus !== 'idle' && (
          <>
            <Separator />
            <div className="p-3 bg-muted/50 rounded-md">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">
                  {getStatusMessage()}
                </span>
              </div>
              
              {paymentStatus === 'processing' && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Після оплати ця сторінка автоматично оновиться
                </div>
              )}
            </div>
          </>
        )}

        {/* Кнопки действий */}
        <div className="space-y-3">
          {paymentStatus === 'idle' && (
            <Button 
              onClick={createPayment} 
              className="w-full" 
              size="lg"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Оплатити {formatAmount(amount)}
            </Button>
          )}

          {paymentStatus === 'error' && (
            <Button 
              onClick={() => {
                setPaymentStatus('idle');
                setErrorMessage('');
              }} 
              variant="outline" 
              className="w-full"
            >
              Спробувати знову
            </Button>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Дякуємо за оплату! Ми розпочнемо виконання вашого замовлення
              </p>
            </div>
          )}
        </div>

        {/* Способы оплаты */}
        <div className="space-y-3">
          <Separator />
          <div>
            <h4 className="font-medium text-sm mb-2">Способи оплати</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                <CreditCard className="mr-1 h-3 w-3" />
                Картка
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Smartphone className="mr-1 h-3 w-3" />
                Google Pay
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Wallet className="mr-1 h-3 w-3" />
                Apple Pay
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Безпечна оплата через LiqPay</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}