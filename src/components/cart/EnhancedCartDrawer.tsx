"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Zap,
  Gift,
  Percent,
  Heart,
  Tag,
  Star,
  Clock,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { useParams } from 'next/navigation';

interface CartDrawerProps {
  children: React.ReactNode;
}

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
}

const suggestedProducts = [
  { id: 'canvas-30x40', name: 'Холст 30×40 см', price: 450, image: '🖼️', category: 'canvas' },
  { id: 'acrylic-30x30', name: 'Акрил 30×30 см', price: 350, image: '💎', category: 'acrylic' },
  { id: 'business-cards', name: 'Візитки (100 шт)', price: 120, image: '💼', category: 'business-cards' },
  { id: 'stickers-pack', name: 'Наклейки (50 шт)', price: 80, image: '🏷️', category: 'stickers' },
];

const promoCodes: PromoCode[] = [
  { code: 'FIRST10', discount: 10, type: 'percentage', description: 'Знижка 10% для нових клієнтів' },
  { code: 'SAVE50', discount: 50, type: 'fixed', description: 'Знижка 50₴ на замовлення від 500₴' },
  { code: 'EXPRESS5', discount: 5, type: 'percentage', description: '5% знижка на експрес замовлення' },
];

export function EnhancedCartDrawer({ children }: CartDrawerProps) {
  const { state, removeItem, updateQuantity, clearCart, closeCart, addItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  const locale = params.locale as string || 'uk';
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fastCheckoutLoading, setFastCheckoutLoading] = useState(false);

  // Персистентність корзини
  useEffect(() => {
    const savedCart = localStorage.getItem('poliprint-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        // Відновлення корзини з localStorage
      } catch (error) {
        console.error('Error loading saved cart:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('poliprint-cart', JSON.stringify(state));
    }
  }, [state]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('uk-UA') + '₴';
  };

  const getItemDescription = (item: any) => {
    const parts = [];
    
    if (item.metadata?.size) parts.push(item.metadata.size);
    if (item.metadata?.thickness) parts.push(item.metadata.thickness);
    if (item.metadata?.quantity && item.type === 'business-cards') {
      parts.push(`${item.metadata.quantity} шт`);
    }
    
    Object.entries(item.options).forEach(([key, value]) => {
      const stringValue = String(value);
      if (stringValue !== 'Стандарт' && stringValue !== 'Без обробки' && !stringValue.includes('стандарт')) {
        parts.push(stringValue);
      }
    });
    
    return parts.join(' • ');
  };

  const applyPromoCode = () => {
    const promo = promoCodes.find(p => p.code.toLowerCase() === promoCode.toLowerCase());
    if (promo) {
      setAppliedPromo(promo);
      toast({
        title: "Промо-код застосовано! 🎉",
        description: promo.description,
      });
    } else {
      toast({
        title: "Невірний промо-код",
        description: "Перевірте код та спробуйте ще раз",
        variant: "destructive"
      });
    }
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.type === 'percentage') {
      return Math.round(state.totalPrice * (appliedPromo.discount / 100));
    } else {
      return Math.min(appliedPromo.discount, state.totalPrice);
    }
  };

  const finalTotal = state.totalPrice - calculateDiscount();
  const deliveryFee = finalTotal >= 500 ? 0 : 60;
  const grandTotal = finalTotal + deliveryFee;

  const handleFastCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Увійдіть в акаунт",
        description: "Для швидкого оформлення потрібно увійти в систему",
      });
      return;
    }

    setFastCheckoutLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Замовлення оформлено! ⚡",
      description: "Ваше замовлення буде готове протягом доби",
    });
    
    setFastCheckoutLoading(false);
    closeCart();
  };

  const addSuggestedProduct = (product: any) => {
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      type: product.category as 'canvas' | 'acrylic' | 'business-cards' | 'custom',
      title: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      options: {
        size: 'Стандарт',
        material: 'Стандарт',
        finish: 'Стандарт'
      },
      metadata: {
        category: product.category
      }
    };

    addItem(cartItem);
    toast({
      title: "Товар додано! 🛒",
      description: `${product.name} додано до корзини`,
    });
  };

  return (
    <>
      {children}
      <Sheet open={state.isOpen} onOpenChange={(open) => !open && closeCart()}>
        <SheetContent className="w-full sm:w-[450px] flex flex-col p-0">
          {/* Modern Header */}
          <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  {state.totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-success">
                      {state.totalItems}
                    </Badge>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold">Кошик</h2>
                  {state.totalItems > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {state.totalItems} товар(ів) на {formatPrice(state.totalPrice)}
                    </p>
                  )}
                </div>
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

          <div className="flex-1 flex flex-col overflow-hidden">
            {state.items.length === 0 ? (
              // Empty Cart with Suggestions
              <div className="flex-1 p-6">
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Кошик порожній</h3>
                  <p className="text-muted-foreground mb-6">
                    Додайте товари до кошика, щоб продовжити покупки
                  </p>
                  
                  {/* Suggestions */}
                  <div className="w-full space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Sparkles className="w-4 h-4" />
                      Рекомендуємо
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {suggestedProducts.slice(0, 4).map((product) => (
                        <motion.div
                          key={product.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className="cursor-pointer border-dashed hover:border-solid hover:border-primary/50 transition-all duration-200">
                            <CardContent className="p-3 text-center">
                              <div className="text-xl mb-2">{product.image}</div>
                              <h4 className="text-xs font-medium line-clamp-2 mb-1">{product.name}</h4>
                              <p className="text-xs text-primary font-semibold">{formatPrice(product.price)}</p>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="w-full mt-2 h-7 text-xs"
                                onClick={() => addSuggestedProduct(product)}
                              >
                                Додати
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <Button onClick={closeCart} className="mt-6 w-full">
                    Перейти до каталогу
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence>
                    {state.items.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="py-4"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-2xl">{item.image}</span>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm leading-tight">
                                {item.title}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                              {getItemDescription(item)}
                            </p>
                          
                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0 rounded-full"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                
                                <span className="text-sm font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0 rounded-full"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              
                              <div className="text-right">
                                <div className="font-bold text-sm">
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
                        </div>
                        
                        {index < state.items.length - 1 && <Separator className="mt-4" />}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Promo Code Section */}
                <div className="px-6 py-4 bg-gradient-to-r from-accent/5 to-primary/5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Промо-код"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="pl-10 h-10"
                        disabled={!!appliedPromo}
                      />
                    </div>
                    <Button 
                      size="sm" 
                      onClick={applyPromoCode}
                      disabled={!promoCode || !!appliedPromo}
                      className="h-10"
                    >
                      {appliedPromo ? <CheckCircle className="w-4 h-4" /> : 'Застосувати'}
                    </Button>
                  </div>
                  
                  {appliedPromo && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-2 text-sm text-success"
                    >
                      <Gift className="w-4 h-4" />
                      {appliedPromo.description}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-4 h-4 p-0 text-muted-foreground"
                        onClick={() => {
                          setAppliedPromo(null);
                          setPromoCode('');
                        }}
                      >
                        ×
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t bg-background p-6 space-y-4">
                  {/* Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Товарів ({state.totalItems}):</span>
                      <span>{formatPrice(state.totalPrice)}</span>
                    </div>
                    
                    {appliedPromo && (
                      <div className="flex justify-between text-sm text-success">
                        <span className="flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          Знижка:
                        </span>
                        <span>-{formatPrice(calculateDiscount())}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Доставка:
                      </span>
                      <span className={deliveryFee === 0 ? 'text-success' : ''}>
                        {deliveryFee === 0 ? 'Безкоштовно' : formatPrice(deliveryFee)}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>До сплати:</span>
                      <span className="text-primary">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {isAuthenticated && (
                      <Button 
                        variant="outline"
                        size="lg" 
                        className="w-full gap-2"
                        onClick={handleFastCheckout}
                        disabled={fastCheckoutLoading}
                      >
                        {fastCheckoutLoading ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        Швидке оформлення
                      </Button>
                    )}
                    
                    <Button 
                      size="lg" 
                      className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      onClick={() => {
                        closeCart();
                        window.location.href = `/${locale}/checkout`;
                      }}
                    >
                      Оформити замовлення
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Безпечна оплата
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Гарантія якості
                    </div>
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