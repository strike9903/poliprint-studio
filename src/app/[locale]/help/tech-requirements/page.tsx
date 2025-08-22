import { ModernLayout } from '@/components/layout/ModernLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocaleLink as Link } from '@/components/ui/LocaleLink';
import { 
  FileImage, 
  Palette, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  ArrowRight,
  FileType,
  Ruler
} from 'lucide-react';

interface TechRequirementsPageProps {
  params: { locale: string };
}

export const metadata = {
  title: "Технічні вимоги до макетів - Poliprint Studio",
  description: "Технічні вимоги до файлів для друку. Формати, розміри, роздільна здатність, кольорові профілі.",
};

export default async function TechRequirementsPage({ params: { locale } }: TechRequirementsPageProps) {
  const fileFormats = [
    {
      format: 'PDF',
      description: 'Рекомендований формат для готових макетів',
      requirements: ['PDF/X-1a або PDF/X-4', 'Вбудовані шрифти', 'CMYK кольори'],
      status: 'recommended'
    },
    {
      format: 'AI / EPS',
      description: 'Adobe Illustrator для векторної графіки',
      requirements: ['Переведені тексти в криві', 'CMYK кольори', 'Версія CS6+'],
      status: 'good'
    },
    {
      format: 'PSD',
      description: 'Adobe Photoshop для растрових зображень',
      requirements: ['Зведені шари', 'CMYK 300 DPI', 'Розмір + виліти'],
      status: 'good'
    },
    {
      format: 'JPG / PNG',
      description: 'Прийнятно для простих макетів',
      requirements: ['Мін. 300 DPI', 'Реальний розмір', 'RGB → CMYK конверсія'],
      status: 'warning'
    }
  ];

  const products = [
    {
      name: 'Холст',
      size: '30×40 см - 90×120 см',
      dpi: '150-300 DPI',
      bleed: 'Не потрібні',
      colors: 'RGB або CMYK',
      notes: 'Рекомендуємо RGB для кращої передачі кольорів'
    },
    {
      name: 'Акрил',
      size: '20×20 см - 100×150 см',
      dpi: '150-300 DPI',
      bleed: 'Не потрібні',
      colors: 'RGB або CMYK',
      notes: 'Яскраві кольори в RGB'
    },
    {
      name: 'Візитки',
      size: '90×50 мм',
      dpi: '300 DPI',
      bleed: '+3 мм з кожного боку',
      colors: 'CMYK',
      notes: 'Обов\'язкові виліти для обрізки'
    },
    {
      name: 'Листівки',
      size: 'A6, A5, A4',
      dpi: '300 DPI',
      bleed: '+3 мм з кожного боку',
      colors: 'CMYK',
      notes: 'Мінімальний розмір тексту 6pt'
    },
    {
      name: 'Наклейки',
      size: 'Від 1×1 см',
      dpi: '300 DPI',
      bleed: '+2 мм для вирубки',
      colors: 'CMYK',
      notes: 'Контур вирубки окремим шаром'
    }
  ];

  const commonMistakes = [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Низька роздільна здатність',
      description: 'DPI менше 150 призводить до пікселізації при друку',
      solution: 'Використовуйте мінімум 150 DPI, оптимально 300 DPI'
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'RGB замість CMYK',
      description: 'Кольори в RGB можуть відрізнятися від друкованих',
      solution: 'Конвертуйте в CMYK або надавайте RGB з позначкою'
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Відсутні виліти',
      description: 'Без вилітів можливі білі кантики після обрізки',
      solution: 'Додавайте виліти +3мм для поліграфії'
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Малий розмір тексту',
      description: 'Текст менше 6pt може бути нечитабельним',
      solution: 'Мінімальний розмір тексту 6-8pt'
    }
  ];

  return (
    <ModernLayout locale={locale} variant="default">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="bg-warning/10 text-warning border-warning/20 mb-4">
          <FileType className="w-4 h-4 mr-1" />
          Технічні вимоги
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Вимоги до макетів для друку
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Щоб отримати якісний результат, дотримуйтесь наших технічних вимог. 
          Правильно підготовлений макет - запорука ідеального друку.
        </p>
      </div>

      {/* File Formats */}
      <div className="mb-12">
        <h2 className="text-2xl font-heading font-bold mb-6 text-center">
          Підтримувані формати файлів
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fileFormats.map((format) => (
            <Card key={format.format} className={`
              hover:shadow-glow transition-all hover-lift
              ${format.status === 'recommended' ? 'border-success/50 bg-success/5' : ''}
              ${format.status === 'warning' ? 'border-warning/50 bg-warning/5' : ''}
            `}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{format.format}</CardTitle>
                  {format.status === 'recommended' && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                  {format.status === 'warning' && (
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{format.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {format.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mb-12">
        <h2 className="text-2xl font-heading font-bold mb-6 text-center">
          Технічні характеристики по продуктах
        </h2>
        <div className="grid gap-6">
          {products.map((product, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-sm text-muted-foreground">Розмір</div>
                    <div className="font-medium">{product.size}</div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-sm text-muted-foreground">DPI</div>
                    <div className="font-medium">{product.dpi}</div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-sm text-muted-foreground">Виліти</div>
                    <div className="font-medium">{product.bleed}</div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-sm text-muted-foreground">Кольори</div>
                    <div className="font-medium">{product.colors}</div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-xs text-muted-foreground italic">{product.notes}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="mb-12">
        <h2 className="text-2xl font-heading font-bold mb-6 text-center">
          Поширені помилки
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {commonMistakes.map((mistake, index) => (
            <Card key={index} className="border-warning/20 bg-warning/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-warning flex-shrink-0">
                    {mistake.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{mistake.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{mistake.description}</p>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-success">{mistake.solution}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Color Profiles */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Кольорові профілі
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Рекомендовані профілі CMYK:</h4>
              <ul className="space-y-2 text-sm">
                <li>• ISO Coated v2 (ECI) - для глянцевого паперу</li>
                <li>• PSO Uncoated ISO12647 (ECI) - для матового паперу</li>
                <li>• FOGRA39 (ISO Coated v2) - універсальний</li>
                <li>• GRACoL2006_Coated1v2 - для США</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">RGB профілі:</h4>
              <ul className="space-y-2 text-sm">
                <li>• sRGB IEC61966-2.1 - для холстів</li>
                <li>• Adobe RGB (1998) - широка гамма</li>
                <li>• ProPhoto RGB - для фотографій</li>
                <li>• Авто-конверсія при друці</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Actions */}
      <div className="text-center bg-surface rounded-2xl p-8 border border-border">
        <h2 className="text-2xl font-heading font-bold mb-4">
          Потрібна допомога з макетом?
        </h2>
        <p className="text-muted-foreground mb-6">
          Наші дизайнери перевірять ваш макет або створять новий з нуля
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="btn-hero" asChild>
            <Link href="/configurator">
              <FileImage className="w-5 h-5 mr-2" />
              Завантажити макет
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contacts">
              Консультація дизайнера
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/help">
              <ArrowRight className="w-4 h-4 mr-2" />
              Інші питання
            </Link>
          </Button>
        </div>
      </div>
    </ModernLayout>
  );
}
