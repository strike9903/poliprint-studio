import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Олена Кравченко",
      position: "Власниця кафе \"Затишок\"",
      avatar: "ОК",
      rating: 5,
      text: "Замовляли фірмовий стиль для кафе - меню, візитки, листівки. Якість просто неймовірна! Особливо вразила швидкість виконання та уважність до деталей. Тепер всі друковані матеріали замовляємо тільки тут.",
      product: "Фірмовий стиль",
      date: "2 тижні тому"
    },
    {
      id: 2, 
      name: "Андрій Петров",
      position: "Фотограф",
      avatar: "АП",
      rating: 5,
      text: "Друкую свої роботи на холсті для виставок. 3D превью допомагає зрозуміти, як буде виглядати результат. Кольори передаються ідеально, кромка завжди рівна. Клієнти в захваті від якості!",
      product: "Друк на холсті",
      date: "1 місяць тому"
    },
    {
      id: 3,
      name: "Марина Іваненко", 
      position: "Маркетинг директор",
      avatar: "МІ",
      rating: 5,
      text: "Робили корпоративні футболки для команди - 50 штук різних розмірів. DTF друк виявився дуже якісним, логотип не тріскається після прання. Ціна чесна, без прихованих доплат.",
      product: "DTF друк на футболках",
      date: "3 тижні тому"
    },
    {
      id: 4,
      name: "Дмитро Коваленко",
      position: "Дизайн-студія \"Креатив\"",
      avatar: "ДК",
      rating: 5,
      text: "Постійно працюємо з Poliprint для наших клієнтів. Автоматична перевірка файлів заощаджує купу часу, а якість завжди на висоті. Особливо подобається друк на акрилі - виглядає дуже дорого!",
      product: "Акрил з підсвіткою",
      date: "1 тиждень тому"
    },
    {
      id: 5,
      name: "Ірина Сидоренко",
      position: "Event-менеджер",
      avatar: "ІС", 
      rating: 5,
      text: "Організовуємо весілля, потрібно багато друкованої продукції. Швидкість виконання просто рятує! За добу можемо отримати візитки, запрошення, етикетки. Доставка Новою Поштою працює як годинник.",
      product: "Весільна поліграфія",
      date: "2 дні тому"
    },
    {
      id: 6,
      name: "Василь Григоренко",
      position: "IT компанія \"TechSoft\"",
      avatar: "ВГ",
      rating: 5,
      text: "Робили стенд для виставки - банери, roll-up, листівки. Все виконано в строк та з відмінною якістю. Особливо вразила робота з великоформатним друком - кольори яскраві, зображення чітке.",
      product: "Виставкові матеріали", 
      date: "1 місяць тому"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-warning/10 text-warning border-warning/20 mb-4">
            Відгуки клієнтів
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Що кажуть наші клієнти
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Понад 1,200 позитивних відгуків від клієнтів по всій Україні. Читайте реальні історії співпраці.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="card-elegant group hover:shadow-glow animate-fade-in relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-8 h-8" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {testimonial.position}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.product}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {testimonial.date}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-surface rounded-2xl p-8 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.9</div>
              <div className="text-sm text-muted-foreground">Середня оцінка</div>
              <div className="flex justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1,247</div>
              <div className="text-sm text-muted-foreground">Відгуків на Google</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Повторних замовлень</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24 год</div>
              <div className="text-sm text-muted-foreground">Середній час відповіді</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};