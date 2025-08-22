import { BaseConstructor, ProductConfig, DesignTemplate, DesignElement, TextElement, ImageElement, ShapeElement } from '../constructor-engine';

// Специфичные интерфейсы для листовок
export interface FlyerConfig extends ProductConfig {
  category: 'flyers';
  flyerType: 'promotional' | 'event' | 'product-catalog' | 'service-menu' | 'announcement' | 'real-estate';
  size: 'A4' | 'A5' | 'A6' | 'DL' | 'custom';
  foldType?: 'single' | 'bifold' | 'trifold' | 'z-fold' | 'gate-fold' | 'accordion';
  pages: number; // Количество страниц/панелей
  contentSections: {
    headline: string;
    subheadline?: string;
    bodyText: string;
    callToAction: string;
    contactInfo: string;
    disclaimer?: string;
  };
  brandingElements: {
    logo?: string;
    companyName: string;
    brandColors: string[];
    fonts: string[];
  };
  marketingFeatures: {
    discountOffer?: {
      enabled: boolean;
      percentage?: number;
      code?: string;
      validUntil?: string;
    };
    qrCode?: {
      enabled: boolean;
      data: string;
      size: number;
      position: { x: number; y: number };
    };
    socialMedia?: Array<{
      platform: string;
      handle: string;
      icon: string;
    }>;
  };
  printFeatures: {
    perforation: boolean;
    scoring: boolean; // Для складывания
    dieCutting: boolean;
    spotColors: string[];
  };
}

export interface FlyerTemplate extends DesignTemplate {
  productType: 'flyers';
  flyerType: FlyerConfig['flyerType'];
  size: FlyerConfig['size'];
  foldType?: FlyerConfig['foldType'];
  industry: string[];
  colorScheme: string[];
  hasImages: boolean;
  hasDiscount: boolean;
  complexity: 'simple' | 'medium' | 'complex';
}

export class FlyerConstructor extends BaseConstructor {
  private flyerConfig: FlyerConfig;
  private templates: FlyerTemplate[] = [];

  constructor(productConfig: ProductConfig, templateId?: string) {
    super(productConfig, templateId);
    this.flyerConfig = productConfig as FlyerConfig;
    this.initializeFlyerDefaults();
    
    if (templateId) {
      this.loadTemplate(templateId);
    }
  }

  private initializeFlyerDefaults() {
    // Стандартные размеры листовок
    const sizeDimensions = {
      'A4': { width: 210, height: 297 },
      'A5': { width: 148, height: 210 },
      'A6': { width: 105, height: 148 },
      'DL': { width: 99, height: 210 },
      'custom': { width: 200, height: 300 }
    };

    if (!this.flyerConfig.dimensions) {
      const size = sizeDimensions[this.flyerConfig.size] || sizeDimensions.A4;
      this.flyerConfig.dimensions = {
        ...size,
        unit: 'mm',
        dpi: 300
      };
    }

    // Область печати с отступами
    if (!this.flyerConfig.printArea) {
      this.flyerConfig.printArea = {
        x: 5,
        y: 5,
        width: this.flyerConfig.dimensions.width - 10,
        height: this.flyerConfig.dimensions.height - 10
      };
    }

    // Область блида для листовок
    if (!this.flyerConfig.bleedArea) {
      this.flyerConfig.bleedArea = {
        top: 3,
        right: 3,
        bottom: 3,
        left: 3
      };
    }

    // Инициализируем тип листовки
    if (!this.flyerConfig.flyerType) {
      this.flyerConfig.flyerType = 'promotional';
    }

    // Инициализируем количество страниц
    if (!this.flyerConfig.pages) {
      this.flyerConfig.pages = this.flyerConfig.foldType ? 
        (this.flyerConfig.foldType === 'trifold' ? 6 : 4) : 2;
    }

    // Инициализируем контентные секции
    if (!this.flyerConfig.contentSections) {
      this.flyerConfig.contentSections = {
        headline: '',
        subheadline: '',
        bodyText: '',
        callToAction: '',
        contactInfo: ''
      };
    }

    // Инициализируем брендинг
    if (!this.flyerConfig.brandingElements) {
      this.flyerConfig.brandingElements = {
        companyName: '',
        brandColors: ['#3b82f6', '#ffffff'],
        fonts: ['Inter', 'Roboto']
      };
    }

    // Инициализируем маркетинговые функции
    if (!this.flyerConfig.marketingFeatures) {
      this.flyerConfig.marketingFeatures = {};
    }

    // Инициализируем особенности печати
    if (!this.flyerConfig.printFeatures) {
      this.flyerConfig.printFeatures = {
        perforation: false,
        scoring: false,
        dieCutting: false,
        spotColors: []
      };
    }
  }

  async getAvailableTemplates(): Promise<DesignTemplate[]> {
    const mockTemplates: FlyerTemplate[] = [
      {
        id: 'fl_promo_001',
        name: 'Промо-акція магазину',
        category: 'flyers',
        subcategory: 'promotional',
        productType: 'flyers',
        thumbnail: '/templates/flyers/promo-sale.jpg',
        isPremium: false,
        tags: ['promotional', 'sale', 'discount', 'retail'],
        flyerType: 'promotional',
        size: 'A4',
        industry: ['retail', 'fashion', 'electronics', 'home'],
        colorScheme: ['#ef4444', '#ffffff', '#1f2937'],
        hasImages: true,
        hasDiscount: true,
        complexity: 'medium',
        elements: [
          // Яркий фон с градиентом
          {
            id: 'promo_bg',
            type: 'shape',
            x: 0,
            y: 0,
            width: 210,
            height: 297,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: true,
            visible: true,
            data: {
              shape: 'rectangle',
              fill: 'linear-gradient(135deg, #ef4444, #dc2626)',
              stroke: 'none',
              strokeWidth: 0
            }
          } as ShapeElement,
          // Декоративные элементы
          {
            id: 'deco_star_1',
            type: 'shape',
            x: 20,
            y: 20,
            width: 30,
            height: 30,
            rotation: 15,
            opacity: 0.2,
            layer: 1,
            locked: true,
            visible: true,
            data: {
              shape: 'polygon',
              fill: '#ffffff',
              stroke: 'none',
              strokeWidth: 0,
              points: [
                {x: 15, y: 0}, {x: 18, y: 10}, {x: 30, y: 10},
                {x: 21, y: 17}, {x: 24, y: 30}, {x: 15, y: 22},
                {x: 6, y: 30}, {x: 9, y: 17}, {x: 0, y: 10}, {x: 12, y: 10}
              ]
            }
          } as ShapeElement,
          // Основной заголовок
          {
            id: 'main_headline',
            type: 'text',
            x: 20,
            y: 60,
            width: 170,
            height: 50,
            rotation: 0,
            opacity: 1,
            layer: 2,
            locked: false,
            visible: true,
            data: {
              text: '{{headline}}',
              fontFamily: 'Inter',
              fontSize: 42,
              fontWeight: 'bold',
              fontStyle: 'normal',
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: -1,
              textDecoration: 'none',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }
          } as TextElement,
          // Процент скидки
          {
            id: 'discount_badge',
            type: 'shape',
            x: 150,
            y: 30,
            width: 50,
            height: 50,
            rotation: 0,
            opacity: 1,
            layer: 3,
            locked: false,
            visible: true,
            data: {
              shape: 'circle',
              fill: '#fbbf24',
              stroke: '#ffffff',
              strokeWidth: 3
            }
          } as ShapeElement,
          {
            id: 'discount_text',
            type: 'text',
            x: 160,
            y: 48,
            width: 30,
            height: 15,
            rotation: 0,
            opacity: 1,
            layer: 4,
            locked: false,
            visible: true,
            data: {
              text: '{{discountPercentage}}%',
              fontFamily: 'Inter',
              fontSize: 18,
              fontWeight: 'bold',
              fontStyle: 'normal',
              color: '#1f2937',
              textAlign: 'center',
              lineHeight: 1,
              letterSpacing: 0,
              textDecoration: 'none'
            }
          } as TextElement
        ],
        metadata: {
          author: 'Poliprint Design Team',
          description: 'Яркий промо-флаер для скидочных акций',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 156,
          rating: 4.6
        }
      },
      {
        id: 'fl_event_001',
        name: 'Івент-листівка',
        category: 'flyers',
        subcategory: 'event',
        productType: 'flyers',
        thumbnail: '/templates/flyers/event-modern.jpg',
        isPremium: true,
        tags: ['event', 'conference', 'party', 'modern'],
        flyerType: 'event',
        size: 'A5',
        industry: ['events', 'entertainment', 'conference', 'party'],
        colorScheme: ['#8b5cf6', '#ffffff', '#1f2937', '#fbbf24'],
        hasImages: true,
        hasDiscount: false,
        complexity: 'complex',
        elements: [],
        metadata: {
          author: 'Poliprint Design Team',
          description: 'Современный дизайн для мероприятий и событий',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 89,
          rating: 4.9
        }
      },
      {
        id: 'fl_product_001',
        name: 'Каталог продуктів',
        category: 'flyers',
        subcategory: 'catalog',
        productType: 'flyers',
        thumbnail: '/templates/flyers/product-catalog.jpg',
        isPremium: false,
        tags: ['catalog', 'products', 'business', 'clean'],
        flyerType: 'product-catalog',
        size: 'A4',
        foldType: 'trifold',
        industry: ['retail', 'manufacturing', 'services', 'technology'],
        colorScheme: ['#3b82f6', '#ffffff', '#f8fafc', '#1e293b'],
        hasImages: true,
        hasDiscount: false,
        complexity: 'complex',
        elements: [],
        metadata: {
          author: 'Poliprint Design Team',
          description: 'Профессиональный каталог товаров и услуг',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 203,
          rating: 4.7
        }
      }
    ];

    this.templates = mockTemplates;
    return mockTemplates;
  }

  async validateDesign(): Promise<{valid: boolean, errors: string[]}> {
    const errors: string[] = [];
    const allElements = this.getAllElements();

    // Проверка обязательного контента
    const sections = this.flyerConfig.contentSections;
    if (!sections.headline) {
      errors.push('Основной заголовок обязателен для листовки');
    }
    if (!sections.callToAction) {
      errors.push('Призыв к действию (CTA) обязателен для эффективной листовки');
    }
    if (!sections.contactInfo) {
      errors.push('Контактная информация обязательна');
    }

    // Проверка размера шрифтов для читаемости
    const textElements = allElements.filter(el => el.type === 'text') as TextElement[];
    textElements.forEach(element => {
      if (element.data.fontSize < 8) {
        errors.push(`Размер шрифта "${element.data.fontSize}px" слишком мал для печати листовки. Минимум: 8px`);
      }
      
      // Проверка основного заголовка
      if (element.id === 'main_headline' && element.data.fontSize < 24) {
        errors.push('Основной заголовок должен быть не менее 24px для хорошей видимости');
      }
    });

    // Проверка областей печати для разных типов складывания
    if (this.flyerConfig.foldType) {
      const foldConstraints = this.getFoldConstraints();
      allElements.forEach(element => {
        if (!this.isElementInPrintableArea(element, foldConstraints)) {
          errors.push(`Элемент "${element.id}" может быть обрезан при складывании`);
        }
      });
    }

    // Проверка качества изображений
    const imageElements = allElements.filter(el => el.type === 'image') as ImageElement[];
    imageElements.forEach(element => {
      if (element.width > 50 || element.height > 50) { // Крупные изображения
        errors.push(`Убедитесь, что изображение "${element.id}" имеет разрешение не менее 300 DPI для качественной печати`);
      }
    });

    // Проверка скидочных предложений
    if (this.flyerConfig.marketingFeatures.discountOffer?.enabled) {
      const discount = this.flyerConfig.marketingFeatures.discountOffer;
      if (!discount.percentage && !discount.code) {
        errors.push('Для скидочного предложения укажите процент или промокод');
      }
      if (discount.validUntil) {
        const validDate = new Date(discount.validUntil);
        if (validDate < new Date()) {
          errors.push('Дата окончания скидки уже прошла');
        }
      }
    }

    // Проверка QR кода
    if (this.flyerConfig.marketingFeatures.qrCode?.enabled) {
      const qr = this.flyerConfig.marketingFeatures.qrCode;
      if (!qr.data) {
        errors.push('QR код включен, но данные не указаны');
      }
      if (qr.size < 15) {
        errors.push('Размер QR кода слишком мал для листовки (минимум 15мм)');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private getFoldConstraints() {
    const { width, height } = this.flyerConfig.dimensions;
    const constraints = {
      safeMargin: 5, // отступ от линии сгиба
      foldLines: [] as number[]
    };

    switch (this.flyerConfig.foldType) {
      case 'bifold':
        constraints.foldLines = [width / 2];
        break;
      case 'trifold':
        constraints.foldLines = [width / 3, (width / 3) * 2];
        break;
      case 'z-fold':
        constraints.foldLines = [width / 3, (width / 3) * 2];
        break;
      case 'gate-fold':
        constraints.foldLines = [width / 4, width / 2, (width / 4) * 3];
        break;
    }

    return constraints;
  }

  private isElementInPrintableArea(element: DesignElement, constraints: any): boolean {
    // Упрощенная проверка - элемент не должен пересекать линии сгиба
    for (const foldLine of constraints.foldLines) {
      if (element.x < foldLine + constraints.safeMargin && 
          element.x + element.width > foldLine - constraints.safeMargin) {
        return false;
      }
    }
    return true;
  }

  async calculatePrice(quantity: number): Promise<{total: number, breakdown: any}> {
    const basePrice = this.flyerConfig.basePrice;
    const pricePerUnit = this.flyerConfig.pricePerUnit;

    // Скидки за количество (более агрессивные для листовок)
    let quantityDiscount = 0;
    if (quantity >= 10000) quantityDiscount = 0.25;
    else if (quantity >= 5000) quantityDiscount = 0.2;
    else if (quantity >= 1000) quantityDiscount = 0.15;
    else if (quantity >= 500) quantityDiscount = 0.1;
    else if (quantity >= 250) quantityDiscount = 0.05;

    // Надбавки за размер
    let sizeMultiplier = 1;
    switch (this.flyerConfig.size) {
      case 'A4': sizeMultiplier = 1; break;
      case 'A5': sizeMultiplier = 0.7; break;
      case 'A6': sizeMultiplier = 0.5; break;
      case 'DL': sizeMultiplier = 0.6; break;
      case 'custom': sizeMultiplier = 1.2; break;
    }

    // Надбавки за складывание
    let foldMultiplier = 1;
    switch (this.flyerConfig.foldType) {
      case 'bifold': foldMultiplier = 1.3; break;
      case 'trifold': foldMultiplier = 1.6; break;
      case 'z-fold': foldMultiplier = 1.7; break;
      case 'gate-fold': foldMultiplier = 2.0; break;
      case 'accordion': foldMultiplier = 2.2; break;
    }

    // Надбавки за материалы
    let materialMultiplier = 1;
    const materials = this.flyerConfig.materials;
    if (materials.includes('glossy_paper')) materialMultiplier += 0.1;
    if (materials.includes('textured_paper')) materialMultiplier += 0.15;
    if (materials.includes('synthetic_paper')) materialMultiplier += 0.3;

    // Надбавки за особенности печати
    let featuresPrice = 0;
    const features = this.flyerConfig.printFeatures;
    if (features.perforation) featuresPrice += quantity * 0.1;
    if (features.scoring) featuresPrice += quantity * 0.05;
    if (features.dieCutting) featuresPrice += quantity * 0.8;
    if (features.spotColors.length > 0) {
      featuresPrice += quantity * features.spotColors.length * 0.3;
    }

    // Двусторонняя печать
    let sidesMultiplier = this.flyerConfig.sides === 2 ? 1.8 : 1;

    // Расчет итоговой цены
    const subtotal = (basePrice + (pricePerUnit * quantity)) * 
                    sizeMultiplier * foldMultiplier * materialMultiplier * sidesMultiplier;
    const discountAmount = subtotal * quantityDiscount;
    const subtotalWithDiscount = subtotal - discountAmount;
    const total = subtotalWithDiscount + featuresPrice;

    const breakdown = {
      basePrice,
      quantity,
      pricePerUnit,
      subtotal,
      sizeMultiplier,
      foldMultiplier,
      materialMultiplier,
      sidesMultiplier,
      quantityDiscount,
      discountAmount,
      featuresPrice,
      total,
      currency: 'UAH',
      details: {
        size: this.flyerConfig.size,
        foldType: this.flyerConfig.foldType || 'single',
        materials: materials.join(', '),
        sides: this.flyerConfig.sides,
        printFeatures: Object.entries(features)
          .filter(([_, enabled]) => enabled)
          .map(([feature, _]) => feature)
      }
    };

    return { total, breakdown };
  }

  async exportDesign(format: 'pdf' | 'png' | 'jpg' | 'svg'): Promise<Blob> {
    // Для листовок нужно учитывать многостраничность и складывание
    const pages = this.flyerConfig.pages;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    const dpi = this.flyerConfig.dimensions.dpi;
    const mmToPx = dpi / 25.4;
    
    // Расчет размера с учетом складывания
    let canvasWidth = this.flyerConfig.dimensions.width * mmToPx;
    let canvasHeight = this.flyerConfig.dimensions.height * mmToPx;
    
    if (this.flyerConfig.foldType) {
      // Для складных листовок показываем развертку
      switch (this.flyerConfig.foldType) {
        case 'trifold':
          canvasWidth *= 3;
          break;
        case 'bifold':
          canvasWidth *= 2;
          break;
        case 'gate-fold':
          canvasWidth *= 2;
          break;
      }
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Белый фон
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Если есть складывание, рисуем линии сгиба
    if (this.flyerConfig.foldType) {
      this.drawFoldLines(ctx, canvasWidth, canvasHeight);
    }

    // Рендерим элементы
    const elements = this.getAllElements().sort((a, b) => a.layer - b.layer);
    
    for (const element of elements) {
      if (!element.visible) continue;

      ctx.save();
      ctx.globalAlpha = element.opacity;
      
      const x = element.x * mmToPx;
      const y = element.y * mmToPx;
      const width = element.width * mmToPx;
      const height = element.height * mmToPx;

      if (element.rotation !== 0) {
        ctx.translate(x + width/2, y + height/2);
        ctx.rotate(element.rotation * Math.PI / 180);
        ctx.translate(-width/2, -height/2);
      } else {
        ctx.translate(x, y);
      }

      switch (element.type) {
        case 'text':
          await this.renderTextElement(ctx, element as TextElement, width, height);
          break;
        case 'shape':
          await this.renderShapeElement(ctx, element as ShapeElement, width, height);
          break;
        case 'image':
          await this.renderImageElement(ctx, element as ImageElement, width, height);
          break;
      }

      ctx.restore();
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, `image/${format === 'jpg' ? 'jpeg' : format}`);
    });
  }

  private drawFoldLines(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    const constraints = this.getFoldConstraints();
    const mmToPx = this.flyerConfig.dimensions.dpi / 25.4;

    constraints.foldLines.forEach(foldLine => {
      const x = foldLine * mmToPx;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    });

    ctx.setLineDash([]);
  }

  private async renderTextElement(ctx: CanvasRenderingContext2D, element: TextElement, width: number, height: number) {
    const data = element.data;
    
    // Подстановка переменных из контента
    let text = data.text;
    const sections = this.flyerConfig.contentSections;
    const marketing = this.flyerConfig.marketingFeatures;
    const branding = this.flyerConfig.brandingElements;
    
    text = text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      switch (key) {
        case 'headline': return sections.headline || match;
        case 'subheadline': return sections.subheadline || match;
        case 'bodyText': return sections.bodyText || match;
        case 'callToAction': return sections.callToAction || match;
        case 'contactInfo': return sections.contactInfo || match;
        case 'companyName': return branding.companyName || match;
        case 'discountPercentage': return marketing.discountOffer?.percentage?.toString() || match;
        case 'discountCode': return marketing.discountOffer?.code || match;
        default: return match;
      }
    });

    ctx.font = `${data.fontStyle} ${data.fontWeight} ${data.fontSize}px ${data.fontFamily}`;
    ctx.fillStyle = data.color;
    ctx.textAlign = data.textAlign as CanvasTextAlign;

    // Эффект тени если есть
    if (data.textShadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 4;
    }

    const lines = text.split('\n');
    const lineHeight = data.fontSize * data.lineHeight;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 0, index * lineHeight + data.fontSize);
    });

    // Сбрасываем тень
    ctx.shadowColor = 'transparent';
  }

  private async renderShapeElement(ctx: CanvasRenderingContext2D, element: ShapeElement, width: number, height: number) {
    const data = element.data;
    
    // Поддержка градиентов
    if (data.fill.includes('gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#dc2626');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = data.fill;
    }

    if (data.stroke && data.stroke !== 'none') {
      ctx.strokeStyle = data.stroke;
      ctx.lineWidth = data.strokeWidth;
    }

    switch (data.shape) {
      case 'rectangle':
        if (data.borderRadius) {
          this.drawRoundedRect(ctx, 0, 0, width, height, data.borderRadius);
        } else {
          ctx.fillRect(0, 0, width, height);
        }
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(width/2, height/2, Math.min(width, height)/2, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'polygon':
        if (data.points) {
          ctx.beginPath();
          data.points.forEach((point, index) => {
            const x = (point.x / 30) * width; // Нормализация координат
            const y = (point.y / 30) * height;
            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.closePath();
          ctx.fill();
        }
        break;
    }

    if (data.stroke && data.stroke !== 'none') {
      ctx.stroke();
    }
  }

  private drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  private async renderImageElement(ctx: CanvasRenderingContext2D, element: ImageElement, width: number, height: number) {
    const data = element.data;
    
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const sx = (data.cropX / 100) * img.width;
        const sy = (data.cropY / 100) * img.height;
        const sw = (data.cropWidth / 100) * img.width;
        const sh = (data.cropHeight / 100) * img.height;
        
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = data.src;
    });
  }

  // Специфичные методы для листовок
  updateContentSection(section: keyof FlyerConfig['contentSections'], content: string) {
    this.flyerConfig.contentSections[section] = content;
    this.updateDynamicText();
    this.emit('contentSectionUpdated', { section, content });
  }

  private updateDynamicText() {
    const textElements = this.getAllElements().filter(el => el.type === 'text') as TextElement[];
    
    textElements.forEach(element => {
      if (element.data.text.includes('{{')) {
        this.emit('elementUpdated', element);
      }
    });
  }

  updateBrandingElement(element: keyof FlyerConfig['brandingElements'], value: any) {
    (this.flyerConfig.brandingElements as any)[element] = value;
    this.emit('brandingElementUpdated', { element, value });
  }

  addDiscountOffer(percentage: number, code?: string, validUntil?: string) {
    this.flyerConfig.marketingFeatures.discountOffer = {
      enabled: true,
      percentage,
      code,
      validUntil
    };
    this.emit('discountOfferAdded', this.flyerConfig.marketingFeatures.discountOffer);
  }

  removeDiscountOffer() {
    this.flyerConfig.marketingFeatures.discountOffer = { enabled: false };
    this.emit('discountOfferRemoved');
  }

  addQRCode(data: string, size: number = 20, position: { x: number; y: number } = { x: 170, y: 250 }) {
    this.flyerConfig.marketingFeatures.qrCode = {
      enabled: true,
      data,
      size,
      position
    };

    const qrElement: ImageElement = {
      id: 'flyer_qr_code',
      type: 'image',
      x: position.x,
      y: position.y,
      width: size,
      height: size,
      rotation: 0,
      opacity: 1,
      layer: 10,
      locked: false,
      visible: true,
      data: {
        src: this.generateQRCodeURL(data),
        alt: 'QR Code',
        brightness: 1,
        contrast: 1,
        saturation: 1,
        blur: 0,
        cropX: 0,
        cropY: 0,
        cropWidth: 100,
        cropHeight: 100
      }
    };

    this.addElement(qrElement);
    this.emit('qrCodeAdded', qrElement);
  }

  private generateQRCodeURL(data: string): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
  }

  removeQRCode() {
    if (this.flyerConfig.marketingFeatures.qrCode?.enabled) {
      this.removeElement('flyer_qr_code');
      this.flyerConfig.marketingFeatures.qrCode.enabled = false;
      this.emit('qrCodeRemoved');
    }
  }

  updatePrintFeature(feature: keyof FlyerConfig['printFeatures'], enabled: boolean | string[]) {
    (this.flyerConfig.printFeatures as any)[feature] = enabled;
    this.emit('printFeatureUpdated', { feature, enabled });
  }

  changeFoldType(foldType: FlyerConfig['foldType']) {
    this.flyerConfig.foldType = foldType;
    
    // Обновляем количество страниц в зависимости от типа складывания
    switch (foldType) {
      case 'single':
        this.flyerConfig.pages = 2;
        break;
      case 'bifold':
        this.flyerConfig.pages = 4;
        break;
      case 'trifold':
      case 'z-fold':
        this.flyerConfig.pages = 6;
        break;
      case 'gate-fold':
        this.flyerConfig.pages = 8;
        break;
      case 'accordion':
        this.flyerConfig.pages = 8;
        break;
    }

    this.emit('foldTypeChanged', { foldType, pages: this.flyerConfig.pages });
  }

  // Получение информации о конфигурации
  getContentSections(): FlyerConfig['contentSections'] {
    return { ...this.flyerConfig.contentSections };
  }

  getBrandingElements(): FlyerConfig['brandingElements'] {
    return { ...this.flyerConfig.brandingElements };
  }

  getMarketingFeatures(): FlyerConfig['marketingFeatures'] {
    return { ...this.flyerConfig.marketingFeatures };
  }

  getPrintFeatures(): FlyerConfig['printFeatures'] {
    return { ...this.flyerConfig.printFeatures };
  }

  // Предустановки по типу листовки
  applyFlyerType(type: FlyerConfig['flyerType']) {
    this.flyerConfig.flyerType = type;
    
    // Применяем предустановки в зависимости от типа
    switch (type) {
      case 'promotional':
        this.flyerConfig.contentSections = {
          ...this.flyerConfig.contentSections,
          headline: 'Спеціальна пропозиція!',
          callToAction: 'Дзвоніть зараз!'
        };
        break;
      case 'event':
        this.flyerConfig.contentSections = {
          ...this.flyerConfig.contentSections,
          headline: 'Приєднуйтесь до нас!',
          callToAction: 'Забронювати місце'
        };
        break;
      case 'product-catalog':
        this.flyerConfig.contentSections = {
          ...this.flyerConfig.contentSections,
          headline: 'Наші продукти',
          callToAction: 'Дізнатися більше'
        };
        break;
    }

    this.emit('flyerTypeChanged', type);
  }

  // Быстрые шаблоны по размеру
  getTemplatesBySize(size: FlyerConfig['size']): FlyerTemplate[] {
    return this.templates.filter(t => t.size === size);
  }

  // Экспорт конфигурации
  exportConfig(): FlyerConfig {
    return JSON.parse(JSON.stringify(this.flyerConfig));
  }

  // Импорт конфигурации
  importConfig(config: FlyerConfig) {
    this.flyerConfig = config;
    this.emit('configImported', config);
  }
}