"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Image,
  Palette
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeVariant?: 'default' | 'destructive' | 'secondary' | 'outline';
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Замовлення',
    href: '/admin/orders',
    icon: ShoppingCart,
    badge: 12,
    badgeVariant: 'default',
    children: [
      { name: 'Усі замовлення', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Нові', href: '/admin/orders/new', icon: AlertCircle, badge: 5 },
      { name: 'В роботі', href: '/admin/orders/processing', icon: TrendingUp },
      { name: 'Завершені', href: '/admin/orders/completed', icon: Package },
    ]
  },
  {
    name: 'Клієнти',
    href: '/admin/users',
    icon: Users,
    badge: 1247,
    children: [
      { name: 'Усі клієнти', href: '/admin/users', icon: Users },
      { name: 'Активні', href: '/admin/users/active', icon: Users },
      { name: 'VIP клієнти', href: '/admin/users/vip', icon: Users },
    ]
  },
  {
    name: 'Продукти',
    href: '/admin/products',
    icon: Package,
    children: [
      { name: 'Каталог', href: '/admin/products', icon: Package },
      { name: 'Категорії', href: '/admin/products/categories', icon: Palette },
      { name: 'Шаблони', href: '/admin/products/templates', icon: Image },
    ]
  },
  {
    name: 'Контент',
    href: '/admin/content',
    icon: FileText,
    children: [
      { name: 'Блог', href: '/admin/content/blog', icon: FileText },
      { name: 'Сторінки', href: '/admin/content/pages', icon: FileText },
      { name: 'FAQ', href: '/admin/content/faq', icon: MessageSquare },
    ]
  },
  {
    name: 'Аналітика',
    href: '/admin/analytics',
    icon: BarChart3,
    children: [
      { name: 'Продажі', href: '/admin/analytics/sales', icon: TrendingUp },
      { name: 'Клієнти', href: '/admin/analytics/customers', icon: Users },
      { name: 'Продукти', href: '/admin/analytics/products', icon: Package },
    ]
  },
  {
    name: 'Налаштування',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isActivePath = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col border-r border-border bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Collapse Toggle */}
      <div className="flex h-14 items-center justify-between px-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-foreground">Адмін панель</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {navigation.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={() => item.children && !collapsed && toggleExpanded(item.href)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors group",
                  isActivePath(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badgeVariant || 'default'}
                        className="text-xs"
                      >
                        {item.badge > 999 ? '999+' : item.badge}
                      </Badge>
                    )}
                    {item.children && (
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        expandedItems.includes(item.href) && "rotate-90"
                      )} />
                    )}
                  </>
                )}
              </Link>

              {/* Submenu */}
              {item.children && !collapsed && expandedItems.includes(item.href) && (
                <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActivePath(child.href)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                      )}
                    >
                      <child.icon className="h-3.5 w-3.5" />
                      <span className="flex-1">{child.name}</span>
                      {child.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {child.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Info */}
      {!collapsed && (
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@poliprint.ua</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}