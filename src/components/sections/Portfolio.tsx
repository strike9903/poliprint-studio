import { useState } from "react";
import { Eye, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Всі роботи" },
    { id: "canvas", name: "Холст" },
    { id: "acrylic", name: "Акрил" },
    { id: "business", name: "Візитки" },
    { id: "apparel", name: "Одяг" },
    { id: "branding", name: "Брендинг" },
  ];

  const portfolioItems = [
    {
      id: 1,
      title: "Сімейний портрет на холсті",
      category: "canvas",
      size: "60×90 см",
      image: "🖼️",
      description: "Високоякісний друк сімейного фото з галерейною кромкою",
      likes: 24,
      views: 156
    },
    {
      id: 2,
      title: "Логотип на акрилі з підсвіткою",
      category: "acrylic", 
      size: "40×60 см",
      image: "💎",
      description: "Корпоративний логотип з LED-підсвіткою",
      likes: 31,
      views: 203
    },
    {
      id: 3,
      title: "Преміум візитки з фольгуванням",
      category: "business",
      size: "90×50 мм",
      image: "💼",
      description: "Візитки з тисненням золотою фольгою та ламінацією",
      likes: 18,
      views: 89
    },
    {
      id: 4,
      title: "Корпоративні футболки",
      category: "apparel",
      size: "M, L, XL",
      image: "👕",
      description: "DTF друк логотипу компанії на якісних футболках",
      likes: 27,
      views: 134
    },
    {
      id: 5,
      title: "Фірмовий стиль ресторану",
      category: "branding",
      size: "Комплект",
      image: "📋",
      description: "Меню, візитки, листівки в єдиному стилі",
      likes: 42,
      views: 278
    },
    {
      id: 6,
      title: "Пейзаж на акрилі",
      category: "acrylic",
      size: "80×120 см",
      image: "🌅", 
      description: "Пейзажне фото з ефектом глибини на акрилі",
      likes: 35,
      views: 189
    },
    {
      id: 7,
      title: "Дитячий малюнок на холсті",
      category: "canvas",
      size: "30×40 см",
      image: "🎨",
      description: "Дитячий малюнок перенесений на художній холст",
      likes: 52,
      views: 321
    },
    {
      id: 8,
      title: "Промо-футболки для заходу",
      category: "apparel",
      size: "S-XXL",
      image: "🎉",
      description: "Яскравий друк для промо-заходу, різні розміри",
      likes: 19,
      views: 95
    }
  ];

  const filteredItems = selectedCategory === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-success/10 text-success border-success/20 mb-4">
            Портфоліо
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Наші кращі роботи
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Подивіться на результати нашої роботи. Кожен проект - це унікальне поєднання якості та творчості.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "btn-hero" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative bg-background rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-glow animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="aspect-square bg-gradient-primary relative overflow-hidden">
                <div className="absolute inset-4 bg-surface rounded-lg border border-border/20 flex items-center justify-center">
                  <span className="text-6xl opacity-80">{item.image}</span>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button size="icon" variant="secondary" className="hover:scale-110 transition-transform">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="hover:scale-110 transition-transform">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="hover:scale-110 transition-transform">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Category Badge */}
                <Badge className="absolute top-3 left-3 bg-background/80 text-foreground border-border/50">
                  {categories.find(cat => cat.id === item.category)?.name}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="text-xs text-muted-foreground ml-2">
                    {item.size}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Готово
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="btn-hero-outline">
            Дивитись всі роботи
          </Button>
        </div>
      </div>
    </section>
  );
};