import { Upload, Settings, CreditCard, Truck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Виберіть продукт",
      description: "Оберіть категорію та налаштуйте параметри: розмір, матеріал, кількість за допомогою нашого конфігуратора",
      icon: Settings,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      number: "02", 
      title: "Завантажте макет",
      description: "Завантажте готовий файл або створіть дизайн в нашому редакторі. Автоматична перевірка якості та вказівки",
      icon: Upload,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      number: "03",
      title: "Оплатіть замовлення", 
      description: "Безпечна оплата картою або онлайн. Підтвердження замовлення та початок виробництва одразу після оплати",
      icon: CreditCard,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      number: "04",
      title: "Отримайте доставку",
      description: "Швидка доставка Новою Поштою в будь-яке відділення України. Відстеження статусу в особистому кабінеті",
      icon: Truck,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
            Простий процес
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Як це працює
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Від ідеї до готового продукту всього за 4 простих кроки. Весь процес займає від 24 годин.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="relative">
                <Card className="card-elegant hover-lift group">
                  <CardContent className="p-6 text-center">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className={`w-8 h-8 ${step.bgColor} ${step.color} rounded-full flex items-center justify-center font-bold text-sm border-2 border-background`}>
                        {step.number}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`w-8 h-8 ${step.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-heading font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Process Timeline */}
        <div className="bg-background rounded-2xl p-8 border border-border">
          <h3 className="text-xl font-heading font-semibold mb-6 text-center">
            Типовий час виконання
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">5 хв</div>
              <div className="text-sm text-muted-foreground">Налаштування та замовлення</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-2">30 хв</div>
              <div className="text-sm text-muted-foreground">Препрес та підготовка</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-2">4-12 год</div>
              <div className="text-sm text-muted-foreground">Друк та постобробка</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning mb-2">1-2 дні</div>
              <div className="text-sm text-muted-foreground">Доставка Новою Поштою</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};