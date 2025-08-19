import { ArrowRight, Palette, CreditCard, Shirt, Image, FileText, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const PopularCategories = () => {
  const categories = [
    {
      name: "Друк на холсті",
      description: "Ваші фото на високоякісному холсті з галерейною або дзеркальною кромкою",
      icon: Palette,
      href: "/catalog/canvas",
      price: "від 180 ₴",
      tag: "Хіт продажів",
      image: "🖼️",
      features: ["3D превью", "Галерейна кромка", "4 розміри підрамника"]
    },
    {
      name: "Акрил та скло",
      description: "Преміум друк на акрилі з підсвіткою та дистанційними кріпленнями",
      icon: Image,
      href: "/catalog/acrylic",
      price: "від 320 ₴",
      tag: "Преміум",
      image: "💎",
      features: ["Face-mount", "Підсвітка", "3-10мм товщина"]
    },
    {
      name: "Візитні картки",
      description: "Класичні та дизайнерські візитки з ламінацією та спецефектами",
      icon: CreditCard,
      href: "/catalog/business-cards",
      price: "від 25 ₴",
      tag: "Швидко",
      image: "💼",
      features: ["Ламінація", "Вибіркова лакировка", "500+ шаблонів"]
    },
    {
      name: "Футболки DTF",
      description: "Якісний друк на футболках технологією DTF - яскраві кольори, м'яка відчуття",
      icon: Shirt,
      href: "/apparel/tshirts",
      price: "від 150 ₴",
      tag: "Нова технологія",
      image: "👕",
      features: ["DTF друк", "Еластичність", "Безліч кольорів тканини"]
    },
    {
      name: "Листівки та флаєри",
      description: "Рекламні матеріали високої якості з швидким виконанням",
      icon: FileText,
      href: "/catalog/flyers",
      price: "від 15 ₴",
      tag: "Експрес",
      image: "📄",
      features: ["Офсетна якість", "Глянець/мат", "Скидки від 500 шт"]
    },
    {
      name: "Упаковка",
      description: "Коробки, пакети, етикетки за вашим дизайном з швидким виконанням",
      icon: Package,
      href: "/catalog/packaging",
      price: "від 45 ₴",
      tag: "Під замовлення",
      image: "📦",
      features: ["Індивідуальний розмір", "Ді-лайн", "Тиснення фольгою"]
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Популярні категорії
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Що ми друкуємо найчастіше
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Виберіть категорію продукції та налаштуйте параметри за допомогою нашого онлайн-конфігуратора
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.name} 
                className="card-product hover:shadow-glow group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-4xl">{category.image}</div>
                    </div>
                    <Badge variant={category.tag === "Хіт продажів" ? "default" : "secondary"} className="text-xs">
                      {category.tag}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {category.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-lg font-semibold text-primary">
                        {category.price}
                      </div>
                      <Button size="sm" variant="ghost" className="group/btn" asChild>
                        <a href={category.href}>
                          Налаштувати
                          <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="btn-hero-outline" asChild>
            <a href="/catalog">
              Дивитись всі категорії
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};