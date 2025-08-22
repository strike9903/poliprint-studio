"use client";

import { useState } from 'react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  Share2,
  Plus,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  discount?: number;
  category: string;
  href: string;
}

interface MobileProductCardProps {
  product: Product;
  locale: string;
  variant?: 'default' | 'compact' | 'featured';
  showQuickActions?: boolean;
  className?: string;
}

export function MobileProductCard({
  product,
  locale,
  variant = 'default',
  showQuickActions = true,
  className
}: MobileProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const isProductFavorite = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      type: 'custom',
      title: product.name,
      image: product.image,
      price: product.price,
      quantity,
      options: {}
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProductFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        title: product.name,
        description: product.category || '',
        price: product.price,
        category: product.category,
        image: product.image,
        href: product.href
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Подивіться на цей продукт: ${product.name}`,
          url: `${window.location.origin}/${locale}${product.href}`
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const cardVariants = {
    default: "bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm",
    compact: "bg-card rounded-lg border border-border/50 overflow-hidden",
    featured: "bg-gradient-to-br from-card to-accent/5 rounded-2xl border-2 border-primary/20 overflow-hidden shadow-lg"
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(cardVariants[variant], className)}
    >
      <Link href={product.href} className="block">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-500 hover:scale-105",
              imageLoading && "scale-110 blur-sm"
            )}
            onLoadingComplete={() => setImageLoading(false)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">
                NEW
              </Badge>
            )}
            {discount && discount > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleFavorite}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors",
                  isProductFavorite 
                    ? "bg-red-500/90 text-white" 
                    : "bg-white/90 text-muted-foreground hover:text-red-500"
                )}
              >
                <Heart className={cn("h-4 w-4", isProductFavorite && "fill-current")} />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </motion.button>
            </div>
          )}

          {/* Loading overlay */}
          {imageLoading && (
            <div className="absolute inset-0 bg-muted/50 animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-primary">
              {product.price}₴
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice}₴
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Add Section */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={false}
            animate={{ 
              height: isExpanded ? 'auto' : 'auto',
              opacity: 1 
            }}
            className="border-t border-border/50 p-3 bg-muted/30"
          >
            {isExpanded ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {/* Quantity Selector */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="font-medium w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuantity(quantity + 1);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsExpanded(false);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Деталі
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Купити
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8"
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(true);
                }}
              >
                <ShoppingCart className="h-3 w-3 mr-2" />
                Швидка купівля
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}