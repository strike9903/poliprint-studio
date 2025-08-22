"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { Menu, X, ShoppingCart, User, Search, Sparkles, ChevronDown, HelpCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProjectDrawer } from "@/components/project-manager/ProjectDrawer";
import { EnhancedCartDrawer } from "@/components/cart/EnhancedCartDrawer";
import { AuthDrawer } from "@/components/auth/AuthDrawer";
import { SearchDrawer } from "@/components/search/SearchDrawer";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { MobileSearch } from "@/components/mobile/MobileSearch";
import { FavoritesDrawer } from "@/components/favorites/FavoritesDrawer";
import { useProjectManager } from "@/contexts/ProjectManagerContext";
import { useCart } from "@/contexts/CartContext";
import { useAuthStore } from "@/store/auth";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  locale: string;
}

export const Header = ({ locale }: HeaderProps) => {
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const { state } = useProjectManager();
  const { state: cartState, toggleCart } = useCart();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const { totalFavorites } = useFavorites();

  // Check auth on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Функция для проверки активности пути
  const isActivePath = (href: string) => {
    if (href === '/') return pathname === `/${locale}` || pathname === '/';
    return pathname.includes(href);
  };

  // Расширенная навигация с полным каталогом и активными состояниями
  const navigationItems = [
    { 
      name: "🤖 AI Конфігуратор", 
      href: "/configurator", 
      isNew: true,
      description: "Створюйте дизайни з ШІ"
    },
    { 
      name: "Каталог", 
      href: "/catalog",
      hasDropdown: true,
      isMegaMenu: true,
      children: [
        {
          category: "Інтер'єрний друк",
          items: [
            { name: "Холст", href: "/catalog/canvas", emoji: "🖼️", price: "від 250₴", description: "Фотодрук на художньому холсті" },
            { name: "Акрил", href: "/catalog/acrylic", emoji: "💎", price: "від 350₴", description: "Сучасний друк на акриловому склі" },
          ]
        },
        {
          category: "Поліграфія",
          items: [
            { name: "Візитки", href: "/catalog/business-cards", emoji: "📇", price: "від 150₴", description: "Професійні візитні картки" },
            { name: "Листівки", href: "/catalog/flyers", emoji: "📄", price: "від 200₴", description: "Рекламні матеріали та флаєри" },
            { name: "Наклейки", href: "/catalog/stickers", emoji: "🏷️", price: "від 80₴", description: "Водостійкі та вінілові наклейки" },
            { name: "Упаковка", href: "/catalog/packaging", emoji: "📦", price: "від 45₴", description: "Індивідуальна упаковка та етикетки" },
          ]
        },
        {
          category: "Текстиль",
          items: [
            { name: "DTF Футболки", href: "/apparel/tshirts", emoji: "👕", price: "від 150₴", description: "Якісний DTF друк на тканині", isNew: true },
          ]
        }
      ]
    },
    { 
      name: "Шаблони", 
      href: "/templates",
      description: "2000+ готових шаблонів"
    },
    { 
      name: "Блог", 
      href: "/blog",
      description: "Поради та новини"
    },
    {
      name: "Допомога",
      href: "/help",
      hasDropdown: true,
      children: [
        { name: "FAQ", href: "/help/faq", emoji: "❓", description: "Поширені питання" },
        { name: "Технічні вимоги", href: "/help/tech-requirements", emoji: "📋", description: "Вимоги до макетів" },
        { name: "Доставка", href: "/help/delivery", emoji: "🚚", description: "Умови доставки" },
        { name: "Контакти", href: "/contacts", emoji: "📞", description: "Зв'язатися з нами" },
      ]
    }
  ];

  // Общий счетчик уведомлений
  const totalNotifications = cartState.totalItems + state.projects.length + totalFavorites;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        {/* Современный компактный header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo - более компактный */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              {totalNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Poliprint
              </h1>
            </div>
          </Link>

          {/* Navigation - скрыта на мобильных */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <NavigationMenuTrigger className={cn(
                        "h-9 px-3 font-medium transition-all",
                        isActivePath(item.href) && "bg-accent/50 text-accent-foreground"
                      )}>
                        {item.name}
                        <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200" />
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        {item.isMegaMenu ? (
                          // Мега-меню для каталога
                          <div className="w-[600px] p-6">
                            <div className="grid grid-cols-3 gap-6">
                              {item.children?.map((category: any) => (
                                <div key={category.category}>
                                  <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                                    {category.category}
                                  </h4>
                                  <div className="space-y-2">
                                    {category.items?.map((child: any) => (
                                      <Link
                                        key={child.name}
                                        href={child.href}
                                        className={cn(
                                          "flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group relative",
                                          isActivePath(child.href) && "bg-accent/20 border border-accent/30"
                                        )}
                                      >
                                        <span className="text-lg group-hover:scale-110 transition-transform">
                                          {child.emoji}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <div className="font-medium text-sm">{child.name}</div>
                                            {child.isNew && (
                                              <Badge className="bg-success/10 text-success text-xs px-1 py-0">
                                                NEW
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {child.description}
                                          </div>
                                          <div className="text-xs font-medium text-primary mt-1">
                                            {child.price}
                                          </div>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {/* Футер мега-меню */}
                            <div className="border-t border-border/50 mt-6 pt-4 flex items-center justify-between">
                              <div className="text-sm text-muted-foreground">
                                Не знайшли що шукали?
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" asChild>
                                  <Link href="/catalog">Весь каталог</Link>
                                </Button>
                                <Button size="sm" asChild>
                                  <Link href="/configurator">🤖 AI Конфігуратор</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Стандартное выпадающее меню
                          <div className="grid w-[350px] gap-2 p-4">
                            {item.children?.map((child: any) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors",
                                  isActivePath(child.href) && "bg-accent/20 border border-accent/30"
                                )}
                              >
                                <span className="text-xl">{child.emoji}</span>
                                <div>
                                  <div className="font-medium text-sm">{child.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {child.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href}>
                      <NavigationMenuLink className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        item.isNew && "relative bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold",
                        isActivePath(item.href) && "bg-accent text-accent-foreground shadow-sm"
                      )}>
                        {item.name}
                        {item.isNew && (
                          <Sparkles className="ml-1 h-3 w-3 animate-pulse" />
                        )}
                        {isActivePath(item.href) && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent-foreground rounded-full" />
                        )}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions - компактные с объединенными функциями */}
          <div className="flex items-center gap-1">
            {/* Search - Desktop */}
            <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex h-9 w-9 p-0"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </SearchDrawer>

            {/* Mobile Search */}
            <MobileSearch 
              isOpen={isSearchOpen} 
              onClose={() => setIsSearchOpen(false)} 
              locale={locale}
            />
            
            {/* Combined Drawer - современный подход */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 px-2 gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium hidden sm:inline">Збережене</span>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                  </div>
                  {(state.projects.length > 0 || totalFavorites > 0) && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-blue-500">
                      {state.projects.length + totalFavorites}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setIsFavoritesOpen(true)}>
                  <span className="mr-2">❤️</span>
                  Улюблені ({totalFavorites})
                </DropdownMenuItem>
                <ProjectDrawer>
                  <DropdownMenuItem>
                    <span className="mr-2">📁</span>
                    Проекти ({state.projects.length})
                  </DropdownMenuItem>
                </ProjectDrawer>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Cart - всегда видимая */}
            <EnhancedCartDrawer>
              <Button variant="ghost" size="sm" className="relative h-9 px-2 gap-1" onClick={toggleCart}>
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs font-medium hidden sm:inline">Корзина</span>
                {cartState.totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-green-500">
                    {cartState.totalItems}
                  </Badge>
                )}
              </Button>
            </EnhancedCartDrawer>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">{user?.name}</div>
                  <div className="px-2 py-1 text-xs text-muted-foreground">{user?.email}</div>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Профіль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Замовлення</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    Вийти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthDrawer isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => setIsAuthModalOpen(true)}>
                  <User className="h-4 w-4" />
                </Button>
              </AuthDrawer>
            )}

            {/* Mobile Navigation */}
            <MobileNavigation 
              locale={locale} 
              navigationItems={navigationItems} 
            />
          </div>
        </div>

      </div>

      {/* Скрытые модальные окна */}
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav locale={locale} />
    </header>
  );
};