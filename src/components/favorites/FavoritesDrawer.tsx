"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Trash2, ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function FavoritesDrawer({ isOpen, onClose, children }: FavoritesDrawerProps) {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addItem } = useCart();

  const handleAddToCart = (favorite: any) => {
    const cartItem = {
      id: `${favorite.id}-${Date.now()}`,
      productId: favorite.id,
      type: favorite.category,
      title: favorite.title,
      image: favorite.image || '📄',
      price: favorite.price,
      quantity: 1,
      options: {
        size: 'Стандарт',
        material: 'Стандарт',
        finish: 'Стандарт'
      },
      metadata: {
        category: favorite.category
      }
    };

    addItem(cartItem);
    
    toast({
      title: "Додано в кошик 🛒",
      description: `${favorite.title} додано до вашого кошика`,
    });
  };

  const sortedFavorites = [...favorites].sort((a, b) => b.addedAt - a.addedAt);

  return (
    <>
      {children}
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:w-[500px] p-0 flex flex-col">
          <SheetHeader className="space-y-4 p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-2xl font-heading flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary-foreground" />
                  </div>
                  Обране
                  {favorites.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {favorites.length}
                    </Badge>
                  )}
                </SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Ваші улюблені товари та послуги
                </p>
              </div>
              {favorites.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFavorites}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {favorites.length === 0 ? (
              // Empty Favorites
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8 px-6">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Список обраного порожній</h3>
                  <p className="text-sm text-muted-foreground">
                    Додавайте товари в обране, натискаючи ❤️ на картках товарів
                  </p>
                </div>
                <Button onClick={onClose}>
                  Переглянути каталог
                </Button>
              </div>
            ) : (
              <>
                {/* Favorites List */}
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 py-4">
                    {sortedFavorites.map((favorite, index) => (
                      <Card key={favorite.id} className="card-elegant group">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-2xl">{favorite.image}</span>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                                {favorite.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                                {favorite.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {favorite.category}
                                  </Badge>
                                  <span className="text-sm font-semibold text-primary">
                                    від {favorite.price} ₴
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:text-destructive"
                                onClick={() => removeFromFavorites(favorite.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleAddToCart(favorite)}
                              >
                                <ShoppingCart className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                asChild
                              >
                                <Link href={favorite.href} onClick={onClose}>
                                  <Eye className="w-3 h-3" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                {/* Summary and Actions */}
                <div className="p-6 pt-4 border-t border-border space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Загалом {favorites.length} товар{favorites.length === 1 ? '' : favorites.length < 5 ? 'и' : 'ів'} в обраному
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={onClose} asChild>
                      <Link href="/catalog">
                        Каталог
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" onClick={onClose} asChild>
                      <Link href="/configurator">
                        Конфігуратор
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" onClick={onClose} asChild>
                      <Link href="/profile">
                        Профіль
                      </Link>
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className="text-xs text-center text-muted-foreground">
                    Обране зберігається локально • Увійдіть для синхронізації
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
