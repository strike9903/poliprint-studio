/**
 * ConfiguratorBrain - AI-powered продуктовый движок
 * Революционный подход к конфигурации печатных продуктов
 */

export interface UserIntent {
  purpose: 'home-decor' | 'business' | 'gift' | 'marketing' | 'personal';
  context?: string; // "для гостиной", "для стартапа"
  urgency: 'standard' | 'fast' | 'express';
  budget: 'economy' | 'standard' | 'premium';
}

export interface FileAnalysis {
  type: 'photo' | 'graphic' | 'document' | 'artwork';
  orientation: 'portrait' | 'landscape' | 'square';
  quality: 'low' | 'medium' | 'high' | 'excellent';
  dpi: number;
  dimensions: { width: number; height: number };
  colorProfile: 'rgb' | 'cmyk' | 'grayscale';
  dominantColors: string[];
  hasText: boolean;
  hasFaces: boolean;
  complexity: 'simple' | 'medium' | 'complex';
  suggestedProducts: string[];
}

export interface SmartSuggestion {
  productType: 'canvas' | 'acrylic' | 'business-cards' | 'poster' | 'tshirt' | 'metal' | 'fabric';
  size: string;
  configuration: Record<string, any>;
  price: number;
  confidence: number; // 0-100
  reasoning: string;
  benefits: string[];
  preview: string;
  bestFor: string[];
}

export interface PricingPsychology {
  basePrice: number;
  originalPrice?: number;
  savings?: number;
  comparisonText: string; // "Дешевле чем в студии на 35%"
  valueProposition: string; // "Стоимость = 1 поход в кино"
  urgencyText?: string;
}

export class ConfiguratorBrain {
  /**
   * Анализ намерений пользователя по загруженному файлу и описанию
   */
  analyzeUserIntent(file: File, description?: string): UserIntent {
    // AI логика анализа намерений
    const fileType = this.detectFileType(file);
    const context = description?.toLowerCase() || '';
    
    // Определяем цель
    let purpose: UserIntent['purpose'] = 'personal';
    if (context.includes('офис') || context.includes('бизнес') || context.includes('визитк')) {
      purpose = 'business';
    } else if (context.includes('подарок') || context.includes('родител') || context.includes('юбилей')) {
      purpose = 'gift';
    } else if (context.includes('гостин') || context.includes('спальн') || context.includes('дом')) {
      purpose = 'home-decor';
    } else if (context.includes('реклам') || context.includes('флаер') || context.includes('промо')) {
      purpose = 'marketing';
    }
    
    return {
      purpose,
      context: description,
      urgency: context.includes('срочн') || context.includes('завтра') ? 'express' : 'standard',
      budget: context.includes('премиум') || context.includes('дорог') ? 'premium' : 
              context.includes('бюджет') || context.includes('дешев') ? 'economy' : 'standard'
    };
  }

  /**
   * Глубокий анализ загруженного файла
   */
  async analyzeFile(file: File): Promise<FileAnalysis> {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Анализ изображения
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const analysis = this.performImageAnalysis(imageData, img);
        
        resolve(analysis);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Генерация умных рекомендаций на основе анализа
   */
  generateSmartSuggestions(intent: UserIntent, fileAnalysis: FileAnalysis): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    
    // Логика рекомендаций на основе контекста
    if (intent.purpose === 'home-decor' && fileAnalysis.type === 'photo') {
      // Фото для дома - рекомендуем холст
      if (fileAnalysis.orientation === 'landscape') {
        suggestions.push({
          productType: 'canvas',
          size: fileAnalysis.quality === 'excellent' ? '60x90' : '40x60',
          configuration: {
            edge: 'gallery',
            depth: '38mm',
            texture: 'premium'
          },
          price: fileAnalysis.quality === 'excellent' ? 850 : 650,
          confidence: 95,
          reasoning: 'Пейзажні фото найкраще виглядають на холсті великого розміру',
          benefits: [
            'Створює atmosphere в кімнаті',
            'Галерейна кромка - не потрібна рамка',
            'Преміум холст 380г/м²'
          ],
          preview: '/preview/canvas-landscape.jpg',
          bestFor: ['Гостиная', 'Спальня', 'Офіс']
        });
      }
      
      if (fileAnalysis.hasFaces) {
        suggestions.push({
          productType: 'acrylic',
          size: '40x40',
          configuration: {
            thickness: '8mm',
            mounting: 'standoff',
            lighting: true
          },
          price: 680,
          confidence: 88,
          reasoning: 'Портрети на акрилі з підсвіткою створюють wow-ефект',
          benefits: [
            'Глибина та об\'єм зображення', 
            'LED підсвітка включена',
            'Сучасний дизайн інтер\'єру'
          ],
          preview: '/preview/acrylic-portrait.jpg',
          bestFor: ['Портрети', 'Сімейні фото']
        });
      }
    }

    if (intent.purpose === 'business') {
      suggestions.push({
        productType: 'business-cards',
        size: '90x50',
        configuration: {
          paper: 'premium-350gsm',
          lamination: 'matte',
          corners: 'rounded'
        },
        price: 220,
        confidence: 92,
        reasoning: 'Для бізнесу важливе перше враження - преміум якість обов\'язкова',
        benefits: [
          'Матова ламінація - приємна на дотик',
          'Заокруглені кути - стильно',
          'Картон 350г/м² - солідно'
        ],
        preview: '/preview/business-cards-premium.jpg',
        bestFor: ['Бізнес зустрічі', 'Конференції', 'Нетворкінг']
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Психологически правильное ценообразование
   */
  generatePricingPsychology(basePrice: number, productType: string): PricingPsychology {
    const marketPrice = this.getMarketPrice(productType);
    const savings = Math.round((marketPrice - basePrice) / marketPrice * 100);
    
    return {
      basePrice,
      originalPrice: marketPrice > basePrice ? marketPrice : undefined,
      savings: savings > 0 ? savings : undefined,
      comparisonText: savings > 0 ? `На ${savings}% дешевше ніж у студіях` : 'Чесна ціна без накруток',
      valueProposition: this.getValueProposition(basePrice),
      urgencyText: this.getUrgencyText()
    };
  }

  /**
   * Реалтайм расчет цены с детализацией
   */
  calculateRealTimePrice(configuration: Record<string, any>): {
    breakdown: Array<{ label: string; price: number; type: 'base' | 'option' | 'discount' }>;
    subtotal: number;
    total: number;
    savings?: number;
  } {
    const breakdown: Array<{ label: string; price: number; type: 'base' | 'option' | 'discount' }> = [
      { label: 'Базова вартість', price: 450, type: 'base' },
    ];

    // Добавляем опции
    if (configuration.size === '60x90') {
      breakdown.push({ label: 'Розмір 60×90 см', price: 200, type: 'option' });
    }
    if (configuration.edge === 'gallery') {
      breakdown.push({ label: 'Галерейна кромка', price: 0, type: 'option' });
    }
    if (configuration.depth === '38mm') {
      breakdown.push({ label: 'Підрамник 38мм', price: 100, type: 'option' });
    }

    const subtotal = breakdown.reduce((sum, item) => sum + item.price, 0);
    
    // Скидка за объем или акция
    let savings = 0;
    if (subtotal > 500) {
      savings = 50;
      breakdown.push({ label: 'Знижка від 500₴', price: -50, type: 'discount' as const });
    }

    return {
      breakdown,
      subtotal,
      total: subtotal - savings,
      savings: savings > 0 ? savings : undefined
    };
  }

  // Приватные методы
  private detectFileType(file: File): FileAnalysis['type'] {
    if (file.type.startsWith('image/')) {
      return 'photo';
    }
    return 'document';
  }

  private performImageAnalysis(imageData: ImageData, img: HTMLImageElement): FileAnalysis {
    const { width, height } = img;
    const orientation = width > height ? 'landscape' : width < height ? 'portrait' : 'square';
    
    // Простой анализ качества на основе размера
    let quality: FileAnalysis['quality'] = 'medium';
    const totalPixels = width * height;
    if (totalPixels > 3000000) quality = 'excellent';
    else if (totalPixels > 1000000) quality = 'high';
    else if (totalPixels < 300000) quality = 'low';

    // Определяем подходящие продукты
    const suggestedProducts = [];
    if (orientation === 'landscape' && quality === 'high') {
      suggestedProducts.push('canvas', 'poster');
    }
    if (orientation === 'portrait') {
      suggestedProducts.push('canvas', 'acrylic');
    }

    return {
      type: 'photo',
      orientation,
      quality,
      dpi: Math.min(300, Math.sqrt(totalPixels / 100)), // Приблизительный расчет
      dimensions: { width, height },
      colorProfile: 'rgb',
      dominantColors: ['#000000'], // Упрощенно
      hasText: false, // Нужен OCR для определения
      hasFaces: false, // Нужен face detection
      complexity: totalPixels > 2000000 ? 'complex' : 'medium',
      suggestedProducts
    };
  }

  private getMarketPrice(productType: string): number {
    const marketPrices = {
      'canvas': 750,
      'acrylic': 890,
      'business-cards': 320,
      'poster': 350
    };
    return marketPrices[productType as keyof typeof marketPrices] || 500;
  }

  private getValueProposition(price: number): string {
    if (price < 200) return 'Ціна 1 походу в кафе';
    if (price < 500) return 'Ціна 1 походу в кіно на двох';
    if (price < 1000) return 'Менше ніж витрачаєте на каву за місяць';
    return 'Інвестиція в красу вашого дому';
  }

  private getUrgencyText(): string {
    const hour = new Date().getHours();
    if (hour < 15) {
      return 'Замовлення до 15:00 = доставка завтра';
    }
    return 'Замовлення сьогодні = доставка післязавтра';
  }
}

export const configuratorBrain = new ConfiguratorBrain();