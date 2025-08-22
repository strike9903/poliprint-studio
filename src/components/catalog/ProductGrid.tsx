"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "@/hooks/use-toast";

// Mock Product type for now, until we update the API
interface MockProduct {
  id: number;
  slug: string;
  title: string;
  priceFrom: number;
  category: string;
  image?: string;
  popular?: boolean;
  new?: boolean;
}

interface ProductGridProps {
  products: MockProduct[];
  locale: string;
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleAddToFavorites = (product: MockProduct) => {
    const favoriteItem = {
      id: product.slug,
      title: product.title,
      description: `${getCategoryName(product.category)} - ${product.title}`,
      price: product.priceFrom,
      category: product.category,
      href: locale === 'uk' ? `/product/${product.slug}` : `/${locale}/product/${product.slug}`,
      image: getCategoryIcon(product.category)
    };

    if (isFavorite(product.slug)) {
      removeFromFavorites(product.slug);
    } else {
      addToFavorites(favoriteItem);
    }
  };

  const handleAddToCart = (product: MockProduct) => {
    const cartItem = {
      id: `${product.slug}-${Date.now()}`,
      productId: product.slug,
      type: product.category as 'canvas' | 'acrylic' | 'business-cards' | 'custom',
      title: product.title,
      image: getCategoryIcon(product.category),
      price: product.priceFrom,
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
      title: "Додано в кошик 🛒",
      description: `${product.title} додано до вашого кошика`,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'canvas': return '🖼️';
      case 'acrylic': return '💎';
      case 'business-cards': return '💼';
      case 'brochures': return '📖';
      case 'stickers': return '🏷️';
      case 'posters': return '📄';
      default: return '📦';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'canvas': return 'Холст';
      case 'acrylic': return 'Акрил';
      case 'business-cards': return 'Візитки';
      case 'brochures': return 'Брошури';
      case 'stickers': return 'Наліпки';
      case 'posters': return 'Постери';
      default: return 'Інше';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Card 
          key={product.id} 
          className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm"
          style={{ 
            animationDelay: `${index * 0.1}s`,
            animation: 'fadeInUp 0.6s ease-out forwards',
          }}
        >
          <div className="relative overflow-hidden rounded-lg">
            {/* Product Image with Glass Morphism */}
            <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,#8b5cf6,transparent_50%)] group-hover:opacity-30 transition-opacity duration-500"></div>
              
              {/* Main product visual */}
              <div className="absolute inset-6 bg-white/90 backdrop-blur-xl rounded-xl border border-white/50 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                  {getCategoryIcon(product.category)}
                </span>
              </div>
              
              {/* Floating action buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <Button 
                  size="icon" 
                  className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl border-0 hover:scale-110 transition-all duration-200" 
                  asChild
                >
                  <Link href={locale === 'uk' ? `/product/${product.slug}` : `/${locale}/product/${product.slug}`}>
                    <Eye className="w-4 h-4 text-gray-700" />
                  </Link>
                </Button>
                <Button 
                  size="icon" 
                  className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl border-0 hover:scale-110 transition-all duration-200 ${
                    isFavorite(product.slug) ? 'bg-red-50/90 text-red-500' : 'text-gray-700'
                  }`}
                  onClick={() => handleAddToFavorites(product)}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(product.slug) ? 'fill-current' : ''}`} />
                </Button>
                <Button 
                  size="icon" 
                  className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl border-0 hover:scale-110 transition-all duration-200 text-gray-700"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Status badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.popular && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg text-xs font-medium">
                    🔥 Хіт
                  </Badge>
                )}
                {product.new && (
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg text-xs font-medium">
                    ✨ Новинка
                  </Badge>
                )}
              </div>

              {/* Category badge */}
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-white/80 backdrop-blur-sm text-gray-700 border-0 shadow-md text-xs">
                  {getCategoryName(product.category)}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5 space-y-4">
              {/* Title */}
              <h3 className="font-heading font-bold text-lg group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {product.title}
              </h3>
              
              {/* Price section */}
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground font-medium">Ціна від</div>
                  <div className="text-2xl font-black text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
                    {product.priceFrom} ₴
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 border-0 px-6"
                  asChild
                >
                  <Link href={locale === 'uk' ? `/product/${product.slug}` : `/${locale}/product/${product.slug}`}>
                    Налаштувати
                  </Link>
                </Button>
              </div>
              
              {/* Quick specs */}
              <div className="pt-3 border-t border-border/30">
                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span>24-48 год</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span>Преміум якість</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span>Швидка доставка</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
