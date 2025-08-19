import { Shield, Zap, Eye, Headphones, Award, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Benefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Гарантія якості",
      description: "Контроль якості на кожному етапі. Повернення коштів, якщо результат не відповідає очікуванням.",
      stats: "99.9% задоволених клієнтів"
    },
    {
      icon: Zap,
      title: "Швидке виконання",
      description: "Автоматизований препрес та сучасне обладнання дозволяють виконувати замовлення за 24-48 годин.",
      stats: "Від 4 годин для експрес-замовлень"
    },
    {
      icon: Eye,
      title: "Прозорі ціни",
      description: "Онлайн-калькулятор з детальною розбивкою вартості. Без прихованих доплат та несподіванок.",
      stats: "Точність ціни до копійки"
    },
    {
      icon: Headphones,
      title: "24/7 підтримка",
      description: "Консультації по технічним питанням, статусу замовлення та допомога з макетами цілодобово.",
      stats: "Середній час відповіді 3 хвилини"
    },
    {
      icon: Award,
      title: "Професійне обладнання",
      description: "HP Latex, Canon imagePROGRAF, Mimaki - преміум-обладнання для найвищої якості друку.",
      stats: "Обладнання оновлюється щороку"
    },
    {
      icon: Clock,
      title: "Точність термінів",
      description: "Виконуємо замовлення точно в строк. Система сповіщень про готовність та відправку.",
      stats: "98% замовлень вчасно"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Чому обирають <span className="text-gradient">Poliprint</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Понад 10 років досвіду в галузі професійного друку. Довіра тисяч клієнтів по всій Україні.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card 
                key={benefit.title} 
                className="card-elegant group hover:border-primary/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-3">
                    {benefit.description}
                  </p>

                  {/* Stats */}
                  <div className="text-xs font-medium text-primary bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
                    {benefit.stats}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="bg-surface rounded-2xl p-8 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Років досвіду</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-sm text-muted-foreground">Виконаних замовлень</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-sm text-muted-foreground">Позитивних відгуків</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Онлайн підтримка</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};