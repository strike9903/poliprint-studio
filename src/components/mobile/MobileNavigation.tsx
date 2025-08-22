"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MobileDrawer } from './MobileDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Home,
  Sparkles,
  User,
  Heart,
  ShoppingCart,
  Search,
  Settings,
  HelpCircle,
  LogIn,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface NavigationItem {
  name: string;
  href?: string;
  emoji?: string;
  description?: string;
  isNew?: boolean;
  hasDropdown?: boolean;
  isMegaMenu?: boolean;
  children?: any[]; // Allow flexible structure for both flat menu items and mega menu categories
}

interface MobileNavigationProps {
  locale: string;
  navigationItems: NavigationItem[];
}

export function MobileNavigation({ locale, navigationItems }: MobileNavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { state: cartState } = useCart();
  const { totalFavorites } = useFavorites();

  const isActivePath = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setExpandedItems([]);
  };

  const menuVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <MobileDrawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Меню"
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden h-9 w-9 p-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
      }
      snapPoints={[0.4, 0.8, 1]}
      shouldScaleBackground={true}
      contentClassName="p-0"
    >
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          
          {/* User Section */}
          {isAuthenticated && user ? (
            <motion.div
              initial="closed"
              animate="open"
              variants={menuVariants}
              className="mb-6 p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="closed"
              animate="open"
              variants={menuVariants}
              className="mb-6"
            >
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => {
                  handleLinkClick();
                  // Open auth modal
                }}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Увійти
              </Button>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial="closed"
            animate="open"
            variants={menuVariants}
            className="grid grid-cols-3 gap-2 mb-6"
          >
            <Link href="/search" onClick={handleLinkClick}>
              <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <Search className="h-5 w-5 mb-1" />
                <span className="text-xs">Пошук</span>
              </div>
            </Link>

            <Link href="/favorites" onClick={handleLinkClick}>
              <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors relative">
                <Heart className="h-5 w-5 mb-1" />
                <span className="text-xs">Закладки</span>
                {totalFavorites > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                    {totalFavorites}
                  </Badge>
                )}
              </div>
            </Link>

            <Link href="/cart" onClick={handleLinkClick}>
              <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors relative">
                <ShoppingCart className="h-5 w-5 mb-1" />
                <span className="text-xs">Кошик</span>
                {cartState.items.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-blue-500">
                    {cartState.items.length}
                  </Badge>
                )}
              </div>
            </Link>
          </motion.div>

          <Separator className="my-4" />

          {/* Navigation Items */}
          <motion.div
            initial="closed"
            animate="open"
            variants={menuVariants}
            className="space-y-1"
          >
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                {item.hasDropdown ? (
                  <div>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-3 h-auto"
                      onClick={() => toggleExpanded(item.name)}
                    >
                      <div className="flex items-center space-x-3">
                        {item.emoji && <span className="text-lg">{item.emoji}</span>}
                        <div className="text-left">
                          <div className="font-medium text-sm flex items-center">
                            {item.name}
                            {item.isNew && <Sparkles className="ml-1 h-3 w-3 text-primary" />}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {expandedItems.includes(item.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <AnimatePresence>
                      {expandedItems.includes(item.name) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 border-l border-border/50 pl-4 py-2 space-y-1">
                            {item.isMegaMenu ? (
                              // Handle mega menu structure
                              item.children?.map((category: any) => (
                                <div key={category.category} className="space-y-1 mb-4">
                                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1">
                                    {category.category}
                                  </div>
                                  {category.items?.map((subItem: any) => (
                                    <Link
                                      key={subItem.name}
                                      href={subItem.href}
                                      onClick={handleLinkClick}
                                      className={cn(
                                        "flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors",
                                        isActivePath(subItem.href) && "bg-accent/20 text-accent-foreground"
                                      )}
                                    >
                                      {subItem.emoji && <span className="text-base">{subItem.emoji}</span>}
                                      <div>
                                        <div className="font-medium text-sm">{subItem.name}</div>
                                        {subItem.description && (
                                          <div className="text-xs text-muted-foreground">
                                            {subItem.description}
                                          </div>
                                        )}
                                        {subItem.price && (
                                          <div className="text-xs text-primary font-medium">
                                            {subItem.price}
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ))
                            ) : (
                              // Handle regular menu structure
                              item.children?.map((child: any) => (
                                <Link
                                  key={child.name}
                                  href={child.href!}
                                  onClick={handleLinkClick}
                                  className={cn(
                                    "flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors",
                                    isActivePath(child.href!) && "bg-accent/20 text-accent-foreground"
                                  )}
                                >
                                  {child.emoji && <span className="text-base">{child.emoji}</span>}
                                  <div>
                                    <div className="font-medium text-sm">{child.name}</div>
                                    {child.description && (
                                      <div className="text-xs text-muted-foreground">
                                        {child.description}
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors",
                      isActivePath(item.href) && "bg-accent/20 text-accent-foreground"
                    )}
                  >
                    {item.emoji && <span className="text-lg">{item.emoji}</span>}
                    <div className="flex-1">
                      <div className="font-medium text-sm flex items-center">
                        {item.name}
                        {item.isNew && <Sparkles className="ml-1 h-3 w-3 text-primary" />}
                      </div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                    {isActivePath(item.href) && (
                      <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                    )}
                  </Link>
                ) : null}
              </motion.div>
            ))}
          </motion.div>

          <Separator className="my-4" />

          {/* Additional Links */}
          <motion.div
            initial="closed"
            animate="open"
            variants={menuVariants}
            className="space-y-1"
          >
            <Link href="/help" onClick={handleLinkClick}>
              <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <HelpCircle className="h-4 w-4" />
                <span className="text-sm">Довідка</span>
              </div>
            </Link>

            {isAuthenticated && (
              <Link href="/profile" onClick={handleLinkClick}>
                <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Налаштування</span>
                </div>
              </Link>
            )}

            {isAuthenticated && (
              <Button
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Вийти
              </Button>
            )}
          </motion.div>
        </div>
      </ScrollArea>
    </MobileDrawer>
  );
}