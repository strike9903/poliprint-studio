"use client";

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { cn } from '@/lib/utils';

interface ModernLayoutProps {
  children: ReactNode;
  locale: string;
  variant?: 'default' | 'centered' | 'wide' | 'product';
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function ModernLayout({ 
  children, 
  locale, 
  variant = 'default',
  className,
  showHeader = true,
  showFooter = true 
}: ModernLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      {showHeader && <Header locale={locale} />}
      
      {/* Main Content */}
      <main className={cn(
        "flex-1",
        variant === 'centered' && "flex items-center justify-center",
        variant === 'wide' && "w-full",
        variant === 'product' && "bg-gradient-to-br from-background to-muted/20",
        className
      )}>
        <div className={cn(
          variant === 'default' && "container mx-auto px-4 py-8",
          variant === 'centered' && "container mx-auto px-4 py-12",
          variant === 'wide' && "w-full px-4 py-8",
          variant === 'product' && "container mx-auto px-4 py-6"
        )}>
          {children}
        </div>
      </main>
      
      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}
