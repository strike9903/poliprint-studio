"use client";

import { Product } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const t = useTranslations('Common');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="p-0">
              <div className="aspect-square bg-muted rounded-t-lg" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded mb-3 w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Товари не знайдені</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
          <CardHeader className="p-0 relative">
            <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
            </Button>
            {product.tags?.includes('popular') && (
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                Хіт
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2 line-clamp-2">{product.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">
                від {product.basePrice} ₴
              </div>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href={`/product/${product.slug}`}>
                    Налаштувати
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}