"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Plus,
  Check,
  Zap,
  Heart,
  Star
} from 'lucide-react';

interface QuickAddToCartProps {
  product: {
    id: string;
    slug: string;
    title: string;
    priceFrom: number;
    category: string;
    rating?: number;
    popular?: boolean;
    new?: boolean;
    description?: string;
    material?: string;
    size?: string;
    finish?: string;
    urgency?: string;
    printType?: string;
    inStock?: boolean;
  };
  className?: string;
  variant?: 'default' | 'minimal' | 'featured';
}

export function QuickAddToCart({ product, className = '', variant = 'default' }: QuickAddToCartProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'canvas': return '🖼️';
      case 'acrylic': return '💎';
      case 'business-cards': return '💼';
      case 'brochures': return '📖';
      case 'stickers': return '🏷️';
      case 'posters': return '📄';
      case 'apparel': return '👕';
      case 'packaging': return '📦';
      case 'flyers': return '📋';
      default: return '📄';
    }
  };

  const handleQuickAdd = async () => {
    setIsAdding(true);

    const cartItem = {
      id: `${product.slug}-${Date.now()}`,
      productId: product.slug,
      type: product.category as 'canvas' | 'acrylic' | 'business-cards' | 'custom',
      title: product.title,
      image: getCategoryIcon(product.category),
      price: product.priceFrom,
      quantity: 1,
      options: {
        size: product.size || 'Стандарт',
        material: product.material || 'Стандарт',
        finish: product.finish || 'Стандарт'
      },
      metadata: {
        category: product.category,
        urgency: product.urgency,
        printType: product.printType
      }
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    addItem(cartItem);
    setIsAdding(false);
    setIsAdded(true);

    toast({
      title: "Додано в кошик! 🛒",
      description: `${product.title} додано до вашого кошика`,
    });

    // Reset added state after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (variant === 'minimal') {
    return (
      <Button
        onClick={handleQuickAdd}
        disabled={isAdding || isAdded}
        className={`gap-2 ${className}`}
        size="sm"
      >
        {isAdding ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isAdded ? (
          <Check className="w-4 h-4" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        {isAdded ? 'Додано' : 'В кошик'}
      </Button>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Product Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {getCategoryIcon(product.category)}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                  {product.title}
                </h3>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  {product.popular && (
                    <Badge className="bg-success/10 text-success text-xs px-1">
                      ХІТ
                    </Badge>
                  )}
                  {product.new && (
                    <Badge className="bg-blue-500/10 text-blue-600 text-xs px-1">
                      NEW
                    </Badge>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">
                    від {product.priceFrom.toLocaleString('uk-UA')}₴
                  </span>
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleQuickAdd}
                    disabled={isAdding || isAdded}
                    size="sm"
                    className={`
                      gap-2 transition-all duration-200
                      ${isAdded 
                        ? 'bg-success hover:bg-success text-white' 
                        : 'bg-primary hover:bg-primary/90'
                      }
                    `}
                  >
                    {isAdding ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isAdded ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                    {isAdded ? 'Додано' : 'В кошик'}
                  </Button>
                </motion.div>
              </div>

              {/* Quick specs */}
              <div className="flex items-center gap-2 mt-2">
                {product.urgency && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Zap className="w-3 h-3" />
                    {product.urgency === 'express' ? '24 год' : 
                     product.urgency === 'fast' ? '1-2 дні' : '3-5 днів'}
                  </div>
                )}
                {product.inStock !== false && (
                  <Badge variant="outline" className="text-xs border-success/30 text-success">
                    В наявності
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            від {product.priceFrom.toLocaleString('uk-UA')}₴
          </span>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          {product.popular && (
            <Badge className="bg-success/10 text-success">
              Популярне
            </Badge>
          )}
          {product.new && (
            <Badge className="bg-blue-500/10 text-blue-600">
              Новинка
            </Badge>
          )}
        </div>
      </div>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleQuickAdd}
          disabled={isAdding || isAdded}
          className={`
            w-full gap-2 transition-all duration-200
            ${isAdded 
              ? 'bg-success hover:bg-success text-white' 
              : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
            }
          `}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Додавання...
            </>
          ) : isAdded ? (
            <>
              <Check className="w-4 h-4" />
              Додано в кошик
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Швидке додавання
            </>
          )}
        </Button>
      </motion.div>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {product.urgency === 'express' ? 'Експрес 24 год' : 
           product.urgency === 'fast' ? 'Швидко 1-2 дні' : 'Стандарт 3-5 днів'}
        </div>
        {product.inStock !== false && (
          <div className="flex items-center gap-1 text-success">
            <Check className="w-3 h-3" />
            В наявності
          </div>
        )}
      </div>
    </div>
  );
}