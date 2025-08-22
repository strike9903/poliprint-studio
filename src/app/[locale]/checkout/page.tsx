"use client";

import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';

export default function CheckoutPage() {
  const { state } = useCart();

  // Если корзина пуста, показываем предупреждение
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-bold mb-4">
            Ваш кошик порожній
          </h1>
          <p className="text-muted-foreground mb-6">
            Додайте товари до кошика, щоб продовжити оформлення замовлення
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/catalog">
                Перейти до каталогу
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На головну
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Checkout Flow */}
      <CheckoutFlow 
        projects={state.items}
        onCancel={() => window.history.back()}
        onComplete={(orderId) => {
          // Redirect to success page
          window.location.href = `/order-success?orderId=${orderId}`;
        }}
      />
    </div>
  );
}
