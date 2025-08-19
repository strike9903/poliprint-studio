"use client";

import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "ua";

  const quickLinks = [
    { name: "Холст", href: `/${locale}/catalog/canvas` },
    { name: "Акрил", href: `/${locale}/catalog/acrylic` },
    { name: "Візитки", href: `/${locale}/catalog/business-cards` },
    { name: "Листівки", href: `/${locale}/catalog/flyers` },
    { name: "Наклейки", href: `/${locale}/catalog/stickers` },
    { name: "Футболки", href: `/${locale}/apparel/tshirts` },
  ];

  const helpLinks = [
    { name: "Технічні вимоги", href: `/${locale}/help/tech-requirements` },
    { name: "Доставка", href: `/${locale}/help/delivery` },
    { name: "Оплата", href: `/${locale}/help/payment` },
    { name: "Відстежити замовлення", href: `/${locale}/track` },
    { name: "FAQ", href: `/${locale}/help/faq` },
    { name: "Контакти", href: `/${locale}/contacts` },
  ];

  const paymentMethods = [
    { name: "Visa", logo: "💳" },
    { name: "Mastercard", logo: "💳" },
    { name: "LiqPay", logo: "💰" },
    { name: "MonoPay", logo: "🏦" },
  ];

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">P</span>
              </div>
              <span className="text-xl font-heading font-bold text-gradient">Poliprint</span>
            </div>
            
            <p className="text-muted-foreground text-sm">
              Професійна друкарня в Україні. Якісний друк на будь-яких матеріалах з доставкою Новою Поштою.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span className="text-muted-foreground">м. Київ, вул. Друкарська, 123</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">+380 (44) 123-45-67</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">info@poliprint.ua</span>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-primary" />
                <span className="text-muted-foreground">Пн-Пт: 09:00-18:00<br />Сб: 10:00-16:00</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Популярні послуги</h3>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Допомога</h3>
            <nav className="space-y-2">
              {helpLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Новини та знижки</h3>
            <p className="text-sm text-muted-foreground">
              Підпишіться на розсилку та отримуйте знижки до 20%
            </p>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Ваш email" 
                className="flex-1"
                type="email"
              />
              <Button size="sm" className="btn-hero">
                Підписатись
              </Button>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Ми в соцмережах</h4>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Poliprint. Всі права захищені.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Приймаємо:</span>
              <div className="flex gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center gap-1 px-2 py-1 bg-background rounded text-xs"
                  >
                    <span>{method.logo}</span>
                    <span>{method.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <a href={`/${locale}/privacy`} className="text-muted-foreground hover:text-primary transition-colors">
                Політика конфіденційності
              </a>
              <a href={`/${locale}/terms`} className="text-muted-foreground hover:text-primary transition-colors">
                Умови використання
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};