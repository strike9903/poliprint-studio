"use client";

import { ArrowRight, Clock, Shield, Truck } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";

export const HeroSection = () => {
  const params = useParams();
  const locale = params.locale as string || 'uk';
  return (
    <section className="relative min-h-[80vh] bg-gradient-hero flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 animate-scale-in">
                🎯 Професійна друкарня №1 в Україні
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-heading font-bold leading-tight">
                Друк на
                <span className="text-gradient block">будь-яких матеріалах</span>
                за 24 години
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Від візиток до широкоформатних банерів. Автоматичний префлайт, прозорі ціни, доставка Новою Поштою.
              </p>
            </div>

            {/* USP Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 bg-surface/50 rounded-lg border border-border/50">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">24/7 онлайн</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-surface/50 rounded-lg border border-border/50">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">Авто-префлайт</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-surface/50 rounded-lg border border-border/50">
                <Truck className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Нова Пошта</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-hero group" asChild>
                <Link href="/configurator">
                  🤖 AI Конфігуратор
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="btn-hero-outline" asChild>
                <Link href="/catalog/canvas">
                  Друк на холсті
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="btn-hero-outline" asChild>
                <Link href="/catalog/acrylic">
                  Акрил та скло
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">Задоволених клієнтів</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24 год</div>
                <div className="text-sm text-muted-foreground">Середній час виконання</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Якість продукції</div>
              </div>
            </div>
          </div>

          {/* Hero Image/3D Preview */}
          <div className="relative">
            <div 
              className="aspect-square bg-gradient-primary rounded-2xl shadow-strong relative overflow-hidden group cursor-pointer"
onClick={() => window.location.href = '/configurator'}
            >
              {/* Interactive 3D Preview */}
              <div className="absolute inset-4 bg-surface rounded-xl border-2 border-border/20 flex items-center justify-center">
                <div className="w-full h-full relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {/* Canvas Animation */}
                  <div className="relative w-32 h-40 transform rotate-12 hover:rotate-6 transition-transform duration-700 cursor-pointer">
                    {/* Canvas Frame */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-sm shadow-lg">
                      {/* Canvas Edge */}
                      <div className="absolute inset-1 bg-white rounded-sm shadow-inner">
                        {/* Sample Image */}
                        <div className="w-full h-full bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 rounded-sm flex items-center justify-center">
                          <span className="text-4xl opacity-80">🏔️</span>
                        </div>
                      </div>
                    </div>
                    {/* Canvas Depth */}
                    <div className="absolute -right-2 top-2 bottom-2 w-2 bg-gradient-to-b from-amber-300 to-amber-400 transform skew-y-12"></div>
                    <div className="absolute -bottom-2 left-2 right-0 h-2 bg-gradient-to-r from-amber-300 to-amber-400 transform skew-x-12"></div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-primary rounded-full animate-bounce opacity-60" style={{ animationDelay: "0.5s" }}></div>
                  <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-accent rounded-full animate-bounce opacity-40" style={{ animationDelay: "1s" }}></div>
                  <div className="absolute bottom-6 left-6 w-1 h-1 bg-success rounded-full animate-bounce opacity-50" style={{ animationDelay: "1.5s" }}></div>
                </div>
              </div>
              
              {/* Interactive Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 rounded-2xl flex items-center justify-center">
                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 text-center">
                  <span className="text-2xl mb-2 block">🚀</span>
                  <p className="font-semibold text-sm">Перейти до конфігуратора</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-2 text-xs font-medium border border-border/50">
                Холст 60×90
              </div>
              <div className="absolute bottom-4 left-4 bg-success/20 text-success rounded-lg px-3 py-1 text-xs font-medium border border-success/30">
                Готово до друку ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};