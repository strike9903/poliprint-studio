"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { useSearchParams } from 'next/navigation';

export function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Simulate loading order data
    if (orderId) {
      setOrderData({
        id: orderId,
        total: 850,
        estimatedDelivery: '2-3 дні',
        items: [
          { name: 'Холст 60x90 см', quantity: 1, price: 750 },
          { name: 'Доставка', quantity: 1, price: 100 }
        ]
      });
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Замовлення успішно оформлено! 🎉
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Дякуємо за ваше замовлення! Ми вже почали його обробку.
          </p>

          {/* Order Details */}
          {orderData && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Номер замовлення:</span>
                    <Badge variant="outline">#{orderData.id}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Сума замовлення:</span>
                    <span className="text-lg font-bold text-primary">{orderData.total} ₴</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Очікувана доставка:</span>
                    <span>{orderData.estimatedDelivery}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">📧</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">Email підтвердження</h3>
                <p className="text-xs text-muted-foreground">Перевірте пошту для деталей</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">Швидка обробка</h3>
                <p className="text-xs text-muted-foreground">Почнемо друк протягом години</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">📦</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">Відстеження</h3>
                <p className="text-xs text-muted-foreground">SMS сповіщення про статус</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/track">
                Відстежити замовлення
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Замовлення Poliprint',
                  text: `Замовив друк у Poliprint! Номер замовлення: #${orderId}`,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Посилання скопійовано!');
              }
            }}>
              <Share2 className="w-4 h-4 mr-2" />
              Поділитися
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/contacts">
                <MessageCircle className="w-4 h-4 mr-2" />
                Підтримка
              </Link>
            </Button>
          </div>

          {/* Back to Shopping */}
          <div className="mt-12">
            <Button variant="ghost" asChild>
              <Link href="/catalog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Продовжити покупки
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}