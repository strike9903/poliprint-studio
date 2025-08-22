"use client";

import { usePathname } from 'next/navigation';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  ShoppingCart,
  User,
  Heart,
  Sparkles,
  Grid3x3,
  Package,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuthStore } from '@/store/auth';
import { useState } from 'react';

interface TabItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  activeIcon?: React.ElementType;
  badge?: number;
  showBadge?: boolean;
  color?: string;
}

interface MobileBottomNavProps {
  locale: string;
  onMenuClick?: () => void;
  className?: string;
}

export function MobileBottomNav({ locale, onMenuClick, className }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { state: cartState, toggleCart } = useCart();
  const { totalFavorites } = useFavorites();
  const { isAuthenticated } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<string>('');

  // Определяем вкладки
  const tabs: TabItem[] = [
    {
      id: 'home',
      label: 'Головна',
      href: `/${locale}`,
      icon: Home,
      color: 'text-blue-500'
    },
    {
      id: 'catalog',
      label: 'Каталог',
      href: `/${locale}/catalog`,
      icon: Grid3x3,
      color: 'text-green-500'
    },
    {
      id: 'configurator',
      label: 'AI',
      href: `/${locale}/configurator`,
      icon: Sparkles,
      color: 'text-purple-500'
    },
    {
      id: 'favorites',
      label: 'Закладки',
      href: `/${locale}/favorites`,
      icon: Heart,
      badge: totalFavorites,
      showBadge: totalFavorites > 0,
      color: 'text-red-500'
    },
    {
      id: 'profile',
      label: isAuthenticated ? 'Профіль' : 'Увійти',
      href: isAuthenticated ? `/${locale}/profile` : `/${locale}/auth`,
      icon: User,
      color: 'text-orange-500'
    }
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleTabClick = (tab: TabItem) => {
    setActiveTab(tab.id);
    if (tab.id === 'cart') {
      toggleCart();
    }
  };

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 lg:hidden",
        "bg-background/95 backdrop-blur-lg border-t border-border/50",
        "supports-[backdrop-filter]:bg-background/80",
        className
      )}
    >
      {/* Safe area padding for devices with home indicator */}
      <div className="pb-safe">
        <div className="flex items-center justify-around px-2 py-1">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isTabActive = isActive(tab.href);
            
            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => handleTabClick(tab)}
                className={cn(
                  "relative flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-lg",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-accent/50 active:scale-95",
                  isTabActive && "bg-accent/20"
                )}
              >
                <div className="relative flex items-center justify-center">
                  {/* Icon with animation */}
                  <motion.div
                    animate={{
                      scale: isTabActive ? 1.1 : 1,
                      y: isTabActive ? -1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      isTabActive ? `${tab.color} bg-current/10` : "text-muted-foreground"
                    )}
                  >
                    <Icon 
                      className={cn(
                        "h-5 w-5 transition-all duration-200",
                        isTabActive && "drop-shadow-sm"
                      )} 
                    />
                  </motion.div>
                  
                  {/* Badge */}
                  <AnimatePresence>
                    {tab.showBadge && tab.badge && tab.badge > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="h-4 min-w-4 px-1 text-xs bg-red-500 text-white">
                          {tab.badge > 99 ? '99+' : tab.badge}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Label */}
                <motion.span
                  animate={{
                    color: isTabActive ? (tab.color || 'rgb(59, 130, 246)') : 'rgb(156, 163, 175)'
                  }}
                  className={cn(
                    "text-xs font-medium mt-0.5 transition-colors duration-200",
                    "max-w-full truncate"
                  )}
                >
                  {tab.label}
                </motion.span>
                
                {/* Active indicator */}
                <AnimatePresence>
                  {isTabActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={cn(
                        "absolute -top-0.5 left-1/2 transform -translate-x-1/2",
                        "w-1 h-1 rounded-full",
                        tab.color ? tab.color.replace('text-', 'bg-') : 'bg-primary'
                      )}
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartState.items.length > 0 && (
          <motion.button
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 100 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleCart()}
            className={cn(
              "fixed bottom-20 right-4 z-50",
              "w-14 h-14 bg-primary text-primary-foreground rounded-full",
              "shadow-lg shadow-primary/25 border-4 border-background",
              "flex items-center justify-center",
              "hover:shadow-xl transition-shadow duration-200"
            )}
          >
            <ShoppingCart className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white">
              {cartState.items.length}
            </Badge>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}