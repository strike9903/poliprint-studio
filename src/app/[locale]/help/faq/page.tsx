import { ModernLayout } from '@/components/layout/ModernLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { 
  HelpCircle, 
  ChevronDown,
  Clock,
  CreditCard,
  Truck,
  Shield,
  ArrowRight,
  Search,
  MessageCircle,
  Phone
} from 'lucide-react';

interface FAQPageProps {
  params: { locale: string };
}

export const metadata = {
  title: "FAQ - Поширені питання - Poliprint Studio",
  description: "Відповіді на найпоширеніші питання про друк, замовлення, доставку та гарантії.",
};

export default async function FAQPage({ params: { locale } }: FAQPageProps) {
  const faqCategories = [
    {
      id: 'ordering',
      title: 'Замовлення та оплата',
      icon: <CreditCard className="w-5 h-5" />,
      questions: [
        {
          question: 'Як оформити замовлення?',
          answer: 'Ви можете оформити замовлення через наш сайт, вибравши товар і завантаживши макет, або зв\'язавшись з менеджером. Ми приймаємо замовлення 24/7 онлайн.'
        },
        {
          question: 'Які способи оплати ви приймаєте?',
          answer: 'Ми приймаємо оплату картою онлайн, банківським переказом для юридичних осіб, накладеним платежем при доставці Новою Поштою.'
        },
        {
          question: 'Чи можна змінити замовлення після оплати?',
          answer: 'Зміни можливі до початку виробництва. Зверніться до менеджера якомога швидше. Деякі зміни можуть вплинути на вартість.'
        },
        {
          question: 'Коли списуються кошти з карти?',
          answer: 'Кошти списуються відразу після підтвердження замовлення та успішної перевірки макету.'
        }
      ]
    },
    {
      id: 'delivery',
      title: 'Доставка',
      icon: <Truck className="w-5 h-5" />,
      questions: [
        {
          question: 'Скільки коштує доставка?',
          answer: 'Доставка Новою Поштою від 50₴ до відділення, від 80₴ кур\'єром. Самовивіз з нашого офісу у Києві безкоштовний.'
        },
        {
          question: 'Як швидко ви відправляете замовлення?',
          answer: 'Стандартні замовлення відправляємо протягом 1-3 робочих днів. Терміни залежать від складності та кількості продукції.'
        },
        {
          question: 'Чи можна відстежити замовлення?',
          answer: 'Так, після відправки ви отримаєте трек-номер для відстеження через сайт Нової Пошти або нашу систему трекінгу.'
        },
        {
          question: 'Що робити, якщо посилка пошкоджена?',
          answer: 'Обов\'язково складіть акт про пошкодження у відділенні НП та сфотографуйте товар. Ми компенсуємо збитки або перевиготовимо замовлення.'
        }
      ]
    },
    {
      id: 'production',
      title: 'Виробництво',
      icon: <Clock className="w-5 h-5" />,
      questions: [
        {
          question: 'Які вимоги до макетів?',
          answer: 'PDF з вилітами, роздільність 300 DPI, кольорова модель CMYK. Детальні вимоги дивіться в розділі технічних вимог.'
        },
        {
          question: 'Чи перевіряєте ви макети перед друком?',
          answer: 'Так, всі макети проходять технічну перевірку. При виявленні проблем ми зв\'яжемось з вами для уточнень.'
        },
        {
          question: 'Чи можете ви створити дизайн за нас?',
          answer: 'Так, наші дизайнери можуть створити макет з нуля або доопрацювати ваш. Вартість дизайну розраховується індивідуально.'
        },
        {
          question: 'Чи робите ви пробну печать?',
          answer: 'Для великих тиражів можемо зробити пробний відбиток за додаткову плату для підтвердження кольорів та якості.'
        }
      ]
    },
    {
      id: 'quality',
      title: 'Якість та гарантії',
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          question: 'Яка гарантія на вашу продукцію?',
          answer: 'Ми гарантуємо якість друку та відповідність технічним характеристикам. При браку з нашої вини - безкоштовне перевиготовлення.'
        },
        {
          question: 'Що робити, якщо результат не відповідає очікуванням?',
          answer: 'Зв\'яжіться з нами протягом 3 днів після отримання. Ми розглянемо кожен випадок індивідуально та знайдемо оптимальне рішення.'
        },
        {
          question: 'Чи можна повернути товар?',
          answer: 'Друкована продукція, виготовлена за індивідуальним макетом, поверненню не підлягає, крім випадків браку з нашої вини.'
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Створити замовлення',
      description: 'Оформіть замовлення онлайн',
      icon: <Search className="w-5 h-5" />,
      href: '/configurator',
      className: 'bg-primary/10 border-primary/20'
    },
    {
      title: 'Зв\'язатися з нами',
      description: 'Отримайте консультацію',
      icon: <MessageCircle className="w-5 h-5" />,
      href: '/contacts',
      className: 'bg-accent/10 border-accent/20'
    },
    {
      title: 'Технічні вимоги',
      description: 'Вимоги до макетів',
      icon: <HelpCircle className="w-5 h-5" />,
      href: '/help/tech-requirements',
      className: 'bg-success/10 border-success/20'
    }
  ];

  return (
    <ModernLayout locale={locale} variant="default">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
          <HelpCircle className="w-4 h-4 mr-1" />
          Допомога
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Поширені питання
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Знайдіть відповіді на найчастіші питання про замовлення, друк, 
          доставку та співпрацю з нашою друкарнею.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {quickActions.map((action, index) => (
          <Card key={index} className={`hover:shadow-glow transition-all cursor-pointer ${action.className}`}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                {action.icon}
              </div>
              <h3 className="font-semibold mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
              <Button asChild size="sm">
                <Link href={action.href}>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {faqCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                {category.icon}
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.questions.map((item, index) => (
                  <details key={index} className="group border border-border rounded-lg">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <h3 className="font-medium pr-4">{item.question}</h3>
                      <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-surface rounded-2xl p-8 border border-border mt-12">
        <h2 className="text-2xl font-heading font-bold mb-4">
          Не знайшли відповідь?
        </h2>
        <p className="text-muted-foreground mb-6">
          Наші менеджери готові відповісти на будь-які питання та надати персональну консультацію
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="btn-hero" asChild>
            <Link href="/contacts">
              <Phone className="w-5 h-5 mr-2" />
              Зв'язатися з нами
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/help">
              <ArrowRight className="w-4 h-4 mr-2" />
              Інші розділи допомоги
            </Link>
          </Button>
        </div>
      </div>
    </ModernLayout>
  );
}
