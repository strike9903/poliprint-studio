"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  Home,
  Plus,
  HelpCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { toast } from '@/hooks/use-toast';

type BreadcrumbType = {
  label: string;
  href: string;
  isHome?: boolean;
  isLast?: boolean;
};

export function AdminHeader() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbType[] => {
    const paths = pathname.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbType[] = [
      { label: 'Головна', href: '/', isHome: true }
    ];

    let currentPath = '';
    
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      if (path === 'admin') {
        breadcrumbs.push({ label: 'Админ', href: '/admin', isHome: false });
      } else {
        const labels: Record<string, string> = {
          orders: 'Замовлення',
          users: 'Клієнти', 
          products: 'Продукти',
          content: 'Контент',
          analytics: 'Аналітика',
          settings: 'Налаштування',
          new: 'Нові',
          processing: 'В роботі',
          completed: 'Завершені',
          active: 'Активні',
          vip: 'VIP',
          categories: 'Категорії',
          templates: 'Шаблони',
          blog: 'Блог',
          pages: 'Сторінки',
          faq: 'FAQ',
          sales: 'Продажі',
          customers: 'Клієнти'
        };
        
        breadcrumbs.push({
          label: labels[path] || path,
          href: currentPath,
          isHome: false,
          isLast: index === paths.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Вихід виконано",
        description: "До побачення!",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Пошук",
        description: `Шукаємо: "${searchQuery}"`,
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        
        {/* Left: Logo + Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="hidden sm:inline font-semibold text-foreground">
              Poliprint Admin
            </span>
          </Link>

          <div className="hidden md:flex">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.isHome ? (
                        <BreadcrumbLink href={crumb.href}>
                          <Home className="h-4 w-4" />
                        </BreadcrumbLink>
                      ) : crumb.isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Center: Search */}
        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Пошук замовлень, клієнтів, продуктів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4"
            />
          </div>
        </form>

        {/* Right: Actions + Profile */}
        <div className="flex items-center space-x-2">
          
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Додати</span>
            </Button>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Уведомления</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 space-y-2">
                <div className="flex items-start space-x-2 p-2 rounded hover:bg-accent">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Нове замовлення #1234</p>
                    <p className="text-xs text-muted-foreground">2 хвилини тому</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 rounded hover:bg-accent">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Оплата отримана</p>
                    <p className="text-xs text-muted-foreground">15 хвилин тому</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 rounded hover:bg-accent">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Низький запас матеріалу</p>
                    <p className="text-xs text-muted-foreground">1 година тому</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Button variant="ghost" size="sm">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    A
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@poliprint.ua
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Профіль</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Налаштування</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Вийти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}