"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { useParams } from 'next/navigation';

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { state, removeItem, updateQuantity, clearCart, closeCart } = useCart();
  const params = useParams();
  const locale = params.locale as string || 'uk';

  const formatPrice = (price: number) => {
    return price.toLocaleString('uk-UA') + '₴';
  };

  const getItemDescription = (item: any) => {
    const parts = [];
    
    if (item.metadata?.size) {
      parts.push(item.metadata.size);
    }
    
    if (item.metadata?.thickness) {
      parts.push(item.metadata.thickness);
    }
    
    if (item.metadata?.quantity && item.type === 'business-cards') {
      parts.push(`${item.metadata.quantity} шт`);
    }
    
    // Добавляем основные опции
    Object.entries(item.options).forEach(([key, value]) => {
      const stringValue = String(value);
      if (stringValue !== 'Стандарт' && stringValue !== 'Без обробки' && !stringValue.includes('стандарт')) {
        parts.push(stringValue);
      }
    });
    
    return parts.join(' • ');
  };

  const handleCheckout = () => {
    console.log('Переход к оформлению заказа:', state);
    closeCart();
    // Use Next.js router for navigation
    window.location.href = `/${locale}/checkout`;
  };

  return (
    <>
      {children}
      <Sheet open={state.isOpen} onOpenChange={(open) => !open && closeCart()}>
        <SheetContent className="w-full sm:w-[420px]">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Корзина
                {state.totalItems > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {state.totalItems}
                  </Badge>
                )}
              </SheetTitle>
              {state.items.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearCart}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {state.items.length === 0 ? (
              // Empty Cart
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Корзина порожня</h3>
                  <p className="text-sm text-muted-foreground">
                    Додайте товари до корзини, щоб продовжити покупки
                  </p>
                </div>
                <Button onClick={closeCart}>
                  Продовжити покупки
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {state.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="space-y-3">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{item.image}</span>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {getItemDescription(item)}
                          </p>
                        
                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-6 h-6"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-6 h-6"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold text-sm">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs text-muted-foreground">
                                {formatPrice(item.price)} за шт
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {index < state.items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t pt-4 space-y-4">
                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Товарів:</span>
                    <span>{state.totalItems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Сума:</span>
                    <span>{formatPrice(state.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Доставка:</span>
                    <span>{state.totalPrice >= 500 ? 'Безкоштовно' : 'від 60₴'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>До сплати:</span>
                    <span className="text-lg">
                      {formatPrice(state.totalPrice + (state.totalPrice < 500 ? 60 : 0))}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  size="lg" 
                  className="w-full gap-2"
                  onClick={handleCheckout}
                >
                  Оформити замовлення
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {/* Additional Info */}
                <div className="text-xs text-center text-muted-foreground">
                  Безпечна оплата • Гарантія якості • Швидка доставка
                </div>
              </div>
            </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}