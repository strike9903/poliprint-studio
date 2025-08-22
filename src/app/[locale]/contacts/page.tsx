import { ModernLayout } from '@/components/layout/ModernLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  MessageCircle,
  Send,
  Building,
  Users,
  Headphones,
  Calendar,
  Car,
  Coffee,
  Shield,
  ArrowRight
} from 'lucide-react';

interface ContactsPageProps {
  params: { locale: string };
}

// Generate metadata for contacts page
export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return generateSEOMetadata({
    title: "Контакти - Зв'язатися з нами | Poliprint",
    description: "Контактна інформація типографії Poliprint. Телефон, адреса, email, онлайн чат. Працюємо з 9:00 до 18:00. вул. Поліграфічна, 15, Київ.",
    keywords: 'контакти, телефон, адреса, email, Київ, друкарня, типографія, зв\'язок',
    url: `/${locale}/contacts`,
    locale,
    alternateLocales: ['uk', 'ru'],
    type: 'website',
    image: '/images/og-contacts.jpg'
  });
}

export default async function ContactsPage({ params: { locale } }: ContactsPageProps) {
  const contactMethods = [
    {
      id: 'phone',
      title: 'Телефонуйте',
      description: 'Швидка консультація по телефону',
      icon: <Phone className="w-6 h-6" />,
      value: '+380 (44) 123-45-67',
      subtext: '24/7 підтримка',
      gradient: 'from-primary/20 to-primary/5',
      action: 'tel:+380441234567'
    },
    {
      id: 'email',
      title: 'Напишіть email',
      description: 'Детальне обговорення проекту',
      icon: <Mail className="w-6 h-6" />,
      value: 'info@poliprint.ua',
      subtext: 'Відповідь протягом години',
      gradient: 'from-accent/20 to-accent/5',
      action: 'mailto:info@poliprint.ua'
    },
    {
      id: 'chat',
      title: 'Онлайн чат',
      description: 'Миттєві відповіді в чаті',
      icon: <MessageCircle className="w-6 h-6" />,
      value: 'Онлайн чат',
      subtext: 'Пн-Пт 9:00-18:00',
      gradient: 'from-success/20 to-success/5',
      action: '#chat'
    },
    {
      id: 'visit',
      title: 'Завітайте до нас',
      description: 'Особиста зустріч в офісі',
      icon: <MapPin className="w-6 h-6" />,
      value: 'м. Київ, вул. Друкарська, 123',
      subtext: 'Пн-Пт 9:00-18:00',
      gradient: 'from-warning/20 to-warning/5',
      action: 'https://maps.google.com'
    }
  ];

  const officeFeatures = [
    {
      icon: <Car className="w-5 h-5" />,
      title: 'Безкоштовна парковка',
      description: '20 місць для клієнтів'
    },
    {
      icon: <Coffee className="w-5 h-5" />,
      title: 'Комфортна зона очікування',
      description: 'Wi-Fi та кава'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Безпечна територія',
      description: 'Охорона 24/7'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: 'Попередній запис',
      description: 'Уникайте черг'
    }
  ];

  const departments = [
    {
      name: 'Відділ продажів',
      phone: '+380 (44) 123-45-67',
      email: 'sales@poliprint.ua',
      schedule: 'Пн-Пт 9:00-18:00',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Технічна підтримка',
      phone: '+380 (44) 123-45-68',
      email: 'support@poliprint.ua',
      schedule: '24/7',
      icon: <Headphones className="w-5 h-5" />
    },
    {
      name: 'Відділ дизайну',
      phone: '+380 (44) 123-45-69',
      email: 'design@poliprint.ua',
      schedule: 'Пн-Пт 10:00-19:00',
      icon: <Building className="w-5 h-5" />
    }
  ];

  return (
    <ModernLayout locale={locale} variant="default">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-success/10 text-success border-success/20 mb-4">
          <MessageCircle className="w-4 h-4 mr-1" />
          Контакти
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Зв'яжіться з нами
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Маєте питання про друк або потрібна консультація? 
          Обирайте зручний спосіб зв'язку - ми завжди готові допомогти!
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contactMethods.map((method) => (
          <Card key={method.id} className="hover:shadow-glow transition-all hover-lift cursor-pointer">
            <CardContent className="p-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${method.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                {method.icon}
              </div>
              <h3 className="font-semibold mb-2 text-center">{method.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 text-center">{method.description}</p>
              <div className="text-center">
                <div className="font-medium mb-1">{method.value}</div>
                <div className="text-xs text-muted-foreground mb-4">{method.subtext}</div>
                <Button size="sm" className="w-full" asChild>
                  <Link href={method.action}>
                    Зв'язатися
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Form */}
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Швидке звернення
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Заповніть форму і ми зв'яжемося з вами найближчим часом
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Ваше ім'я" />
              <Input type="tel" placeholder="Телефон" />
            </div>
            <Input type="email" placeholder="Email" />
            <Input placeholder="Тема звернення" />
            <Textarea 
              placeholder="Опишіть ваш проект або питання детальніше..."
              rows={4}
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" className="rounded" />
              <span>Я погоджуюся з <Link href="/privacy" className="text-primary hover:underline">політикою конфіденційності</Link></span>
            </div>
            <Button className="w-full btn-hero">
              <Send className="w-4 h-4 mr-2" />
              Надіслати повідомлення
            </Button>
          </CardContent>
        </Card>

        {/* Office Info */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Наш офіс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium">м. Київ, вул. Друкарська, 123</div>
                    <div className="text-sm text-muted-foreground">офіс 45, 4 поверх</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Режим роботи</div>
                    <div className="text-sm text-muted-foreground">
                      Пн-Пт: 9:00-18:00<br/>
                      Сб: 10:00-15:00<br/>
                      Нд: вихідний
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Office Features */}
          <div className="grid grid-cols-2 gap-4">
            {officeFeatures.map((feature, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 text-accent">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{feature.title}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="mb-12">
        <h2 className="text-2xl font-heading font-bold text-center mb-8">
          Відділи та спеціалісти
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {dept.icon}
                  {dept.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${dept.phone.replace(/\D/g, '')}`} className="hover:text-primary">
                    {dept.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${dept.email}`} className="hover:text-primary">
                    {dept.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{dept.schedule}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Як нас знайти</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="font-semibold mb-2">Карта локації</div>
              <div className="text-sm text-muted-foreground mb-4">
                м. Київ, вул. Друкарська, 123
              </div>
              <Button variant="outline">
                Відкрити в Google Maps
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Quick Links */}
      <div className="text-center bg-surface rounded-2xl p-8 border border-border">
        <h2 className="text-2xl font-heading font-bold mb-4">
          Поширені питання
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Можливо, відповідь на ваше питання вже є в нашій базі знань
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/help/faq">
              Переглянути FAQ
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/help">
              Центр допомоги
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button size="lg" className="btn-hero" asChild>
            <Link href="/configurator">
              Розпочати замовлення
            </Link>
          </Button>
        </div>
      </div>
    </ModernLayout>
  );
}
