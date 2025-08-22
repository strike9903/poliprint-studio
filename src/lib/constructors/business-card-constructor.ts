import { BaseConstructor, ProductConfig, DesignTemplate, DesignElement, TextElement, ImageElement, ShapeElement } from '../constructor-engine';

// Специфичные интерфейсы для визиток
export interface BusinessCardConfig extends ProductConfig {
  category: 'business-cards';
  corporateFields: {
    companyName: string;
    personName: string;
    position: string;
    phone: string;
    email: string;
    website?: string;
    address?: string;
    socialMedia?: Array<{
      platform: string;
      url: string;
    }>;
  };
  qrCode?: {
    enabled: boolean;
    data: string;
    size: number;
    position: { x: number; y: number };
  };
  specialFeatures: {
    roundedCorners: boolean;
    embossing: boolean;
    foiling: boolean;
    spot_uv: boolean;
    laminationGlossy: boolean;
    laminationMatte: boolean;
  };
}

export interface BusinessCardTemplate extends DesignTemplate {
  productType: 'business-cards';
  style: 'corporate' | 'creative' | 'minimal' | 'luxury' | 'modern' | 'classic';
  industry: string[];
  colorScheme: string[];
  hasLogo: boolean;
  hasQR: boolean;
}

export class BusinessCardConstructor extends BaseConstructor {
  private businessCardConfig: BusinessCardConfig;
  private templates: BusinessCardTemplate[] = [];

  constructor(productConfig: ProductConfig, templateId?: string) {
    super(productConfig, templateId);
    this.businessCardConfig = productConfig as BusinessCardConfig;
    this.initializeBusinessCardDefaults();
    
    if (templateId) {
      this.loadTemplate(templateId);
    }
  }

  private initializeBusinessCardDefaults() {
    // Стандартные размеры визиток
    if (!this.businessCardConfig.dimensions) {
      this.businessCardConfig.dimensions = {
        width: 85,
        height: 55,
        unit: 'mm',
        dpi: 300
      };
    }

    // Область печати с отступами
    if (!this.businessCardConfig.printArea) {
      this.businessCardConfig.printArea = {
        x: 2,
        y: 2,
        width: 81,
        height: 51
      };
    }

    // Область блида (обрезки)
    if (!this.businessCardConfig.bleedArea) {
      this.businessCardConfig.bleedArea = {
        top: 2,
        right: 2,
        bottom: 2,
        left: 2
      };
    }

    // Инициализируем корпоративные поля если отсутствуют
    if (!this.businessCardConfig.corporateFields) {
      this.businessCardConfig.corporateFields = {
        companyName: '',
        personName: '',
        position: '',
        phone: '',
        email: '',
        website: '',
        address: ''
      };
    }

    // Инициализируем специальные функции
    if (!this.businessCardConfig.specialFeatures) {
      this.businessCardConfig.specialFeatures = {
        roundedCorners: false,
        embossing: false,
        foiling: false,
        spot_uv: false,
        laminationGlossy: false,
        laminationMatte: true
      };
    }
  }

  async getAvailableTemplates(): Promise<DesignTemplate[]> {
    // В реальном приложении это будет загрузка с сервера
    const mockTemplates: BusinessCardTemplate[] = [
      {
        id: 'bc_corporate_001',
        name: 'Корпоративний класичний',
        category: 'business-cards',
        subcategory: 'corporate',
        productType: 'business-cards',
        thumbnail: '/templates/business-cards/corporate-classic.jpg',
        isPremium: false,
        tags: ['corporate', 'classic', 'professional'],
        style: 'corporate',
        industry: ['consulting', 'finance', 'law', 'real-estate'],
        colorScheme: ['#1f2937', '#ffffff', '#3b82f6'],
        hasLogo: true,
        hasQR: false,
        elements: [
          // Фон
          {
            id: 'bg_001',
            type: 'shape',
            x: 0,
            y: 0,
            width: 85,
            height: 55,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: true,
            visible: true,
            data: {
              shape: 'rectangle',
              fill: '#ffffff',
              stroke: 'none',
              strokeWidth: 0
            }
          } as ShapeElement,
          // Логотип
          {
            id: 'logo_001',
            type: 'image',
            x: 5,
            y: 5,
            width: 20,
            height: 15,
            rotation: 0,
            opacity: 1,
            layer: 1,
            locked: false,
            visible: true,
            data: {
              src: '/placeholder-logo.svg',
              alt: 'Company Logo',
              brightness: 1,
              contrast: 1,
              saturation: 1,
              blur: 0,
              cropX: 0,
              cropY: 0,
              cropWidth: 100,
              cropHeight: 100
            }
          } as ImageElement,
          // Название компании
          {
            id: 'company_name',
            type: 'text',
            x: 30,
            y: 8,
            width: 50,
            height: 10,
            rotation: 0,
            opacity: 1,
            layer: 2,
            locked: false,
            visible: true,
            data: {
              text: '{{companyName}}',
              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: 'bold',
              fontStyle: 'normal',
              color: '#1f2937',
              textAlign: 'left',
              lineHeight: 1.2,
              letterSpacing: 0,
              textDecoration: 'none'
            }
          } as TextElement,
          // Имя сотрудника
          {
            id: 'person_name',
            type: 'text',
            x: 5,
            y: 25,
            width: 40,
            height: 8,
            rotation: 0,
            opacity: 1,
            layer: 2,
            locked: false,
            visible: true,
            data: {
              text: '{{personName}}',
              fontFamily: 'Inter',
              fontSize: 14,
              fontWeight: '600',
              fontStyle: 'normal',
              color: '#1f2937',
              textAlign: 'left',
              lineHeight: 1.2,
              letterSpacing: 0,
              textDecoration: 'none'
            }
          } as TextElement,
          // Должность
          {
            id: 'position',
            type: 'text',
            x: 5,
            y: 33,
            width: 40,
            height: 6,
            rotation: 0,
            opacity: 1,
            layer: 2,
            locked: false,
            visible: true,
            data: {
              text: '{{position}}',
              fontFamily: 'Inter',
              fontSize: 10,
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#6b7280',
              textAlign: 'left',
              lineHeight: 1.2,
              letterSpacing: 0,
              textDecoration: 'none'
            }
          } as TextElement,
          // Контактная информация
          {
            id: 'contact_info',
            type: 'text',
            x: 5,
            y: 40,
            width: 75,
            height: 12,
            rotation: 0,
            opacity: 1,
            layer: 2,
            locked: false,
            visible: true,
            data: {
              text: '{{phone}} | {{email}}\n{{website}}',
              fontFamily: 'Inter',
              fontSize: 8,
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#374151',
              textAlign: 'left',
              lineHeight: 1.3,
              letterSpacing: 0,
              textDecoration: 'none'
            }
          } as TextElement
        ],
        metadata: {
          author: 'Poliprint Design Team',
          description: 'Классический корпоративный шаблон визитки',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 245,
          rating: 4.8
        }
      },
      {
        id: 'bc_creative_001',
        name: 'Креативний дизайн',
        category: 'business-cards',
        subcategory: 'creative',
        productType: 'business-cards',
        thumbnail: '/templates/business-cards/creative-modern.jpg',
        isPremium: true,
        tags: ['creative', 'modern', 'gradient', 'colorful'],
        style: 'creative',
        industry: ['design', 'marketing', 'tech', 'startup'],
        colorScheme: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'],
        hasLogo: true,
        hasQR: true,
        elements: [
          // Градиентный фон
          {
            id: 'gradient_bg',
            type: 'shape',
            x: 0,
            y: 0,
            width: 85,
            height: 55,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: true,
            visible: true,
            data: {
              shape: 'rectangle',
              fill: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              stroke: 'none',
              strokeWidth: 0
            }
          } as ShapeElement,
          // Декоративные элементы
          {
            id: 'deco_circle',
            type: 'shape',
            x: 60,
            y: -10,
            width: 35,
            height: 35,
            rotation: 0,
            opacity: 0.1,
            layer: 1,
            locked: true,
            visible: true,
            data: {
              shape: 'circle',
              fill: '#ffffff',
              stroke: 'none',
              strokeWidth: 0
            }
          } as ShapeElement
        ],
        metadata: {
          author: 'Poliprint Design Team',
          description: 'Креативный современный шаблон с градиентами',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 189,
          rating: 4.9
        }
      },
      {
        id: 'bc_minimal_001',
        name: 'Мінімалістичний стиль',
        category: 'business-cards',
        subcategory: 'minimal',
        productType: 'business-cards',
        thumbnail: '/templates/business-cards/minimal-clean.jpg',
        isPremium: false,
        tags: ['minimal', 'clean', 'typography', 'simple'],
        style: 'minimal',
        industry: ['architecture', 'consulting', 'photography', 'freelance'],
        colorScheme: ['#000000', '#ffffff', '#f3f4f6'],
        hasLogo: false,
        hasQR: false,
        elements: [],
        metadata: {
          author: 'Poliprint Design Team',
          description: 'Минималистичный дизайн с акцентом на типографику',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 156,
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

    // Проверка текстовых элементов
    const textElements = allElements.filter(el => el.type === 'text') as TextElement[];
    
    textElements.forEach(element => {
      // Минимальный размер шрифта
      if (element.data.fontSize < this.businessCardConfig.constraints.minFontSize) {
        errors.push(`Размер шрифта "${element.data.fontSize}px" слишком мал. Минимум: ${this.businessCardConfig.constraints.minFontSize}px`);
      }

      // Проверка контраста (упрощенная)
      if (element.data.color === element.data.backgroundColor) {
        errors.push('Цвет текста совпадает с цветом фона - текст будет невидим');
      }
    });

    // Проверка обязательных полей
    const requiredFields = ['companyName', 'personName', 'phone'];
    requiredFields.forEach(field => {
      if (!this.businessCardConfig.corporateFields[field as keyof typeof this.businessCardConfig.corporateFields]) {
        errors.push(`Обязательное поле "${field}" не заполнено`);
      }
    });

    // Проверка валидности email
    if (this.businessCardConfig.corporateFields.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.businessCardConfig.corporateFields.email)) {
        errors.push('Неверный формат email адреса');
      }
    }

    // Проверка границ печати
    allElements.forEach(element => {
      const printArea = this.businessCardConfig.printArea;
      
      if (element.x < printArea.x || 
          element.y < printArea.y ||
          element.x + element.width > printArea.x + printArea.width ||
          element.y + element.height > printArea.y + printArea.height) {
        errors.push(`Элемент "${element.id}" выходит за границы области печати`);
      }
    });

    // Проверка QR кода
    if (this.businessCardConfig.qrCode?.enabled) {
      if (!this.businessCardConfig.qrCode.data) {
        errors.push('QR код включен, но данные не указаны');
      }
      
      if (this.businessCardConfig.qrCode.size < 10) {
        errors.push('Размер QR кода слишком мал (минимум 10мм)');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async calculatePrice(quantity: number): Promise<{total: number, breakdown: any}> {
    const basePrice = this.businessCardConfig.basePrice;
    const pricePerUnit = this.businessCardConfig.pricePerUnit;

    // Скидки за количество
    let quantityDiscount = 0;
    if (quantity >= 1000) quantityDiscount = 0.15;
    else if (quantity >= 500) quantityDiscount = 0.1;
    else if (quantity >= 250) quantityDiscount = 0.05;

    // Надбавки за материалы
    let materialMultiplier = 1;
    const materials = this.businessCardConfig.materials;
    
    if (materials.includes('thick_cardstock')) materialMultiplier += 0.2;
    if (materials.includes('textured_paper')) materialMultiplier += 0.15;
    if (materials.includes('recycled_paper')) materialMultiplier += 0.1;

    // Надбавки за специальные эффекты
    let effectsPrice = 0;
    const features = this.businessCardConfig.specialFeatures;
    
    if (features.roundedCorners) effectsPrice += quantity * 0.05;
    if (features.embossing) effectsPrice += quantity * 0.3;
    if (features.foiling) effectsPrice += quantity * 0.5;
    if (features.spot_uv) effectsPrice += quantity * 0.2;
    if (features.laminationGlossy || features.laminationMatte) effectsPrice += quantity * 0.1;

    // Двусторонняя печать
    let sidesMultiplier = this.businessCardConfig.sides === 2 ? 1.6 : 1;

    // Расчет итоговой цены
    const subtotal = (basePrice + (pricePerUnit * quantity)) * materialMultiplier * sidesMultiplier;
    const discountAmount = subtotal * quantityDiscount;
    const subtotalWithDiscount = subtotal - discountAmount;
    const total = subtotalWithDiscount + effectsPrice;

    const breakdown = {
      basePrice,
      quantity,
      pricePerUnit,
      subtotal,
      materialMultiplier,
      sidesMultiplier,
      quantityDiscount,
      discountAmount,
      effectsPrice,
      total,
      currency: 'UAH',
      details: {
        materials: materials.join(', '),
        sides: this.businessCardConfig.sides,
        specialFeatures: Object.entries(features)
          .filter(([_, enabled]) => enabled)
          .map(([feature, _]) => feature)
      }
    };

    return { total, breakdown };
  }

  async exportDesign(format: 'pdf' | 'png' | 'jpg' | 'svg'): Promise<Blob> {
    // В реальном приложении здесь будет интеграция с библиотекой рендеринга
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Устанавливаем размер в пикселях для DPI 300
    const dpi = this.businessCardConfig.dimensions.dpi;
    const mmToPx = dpi / 25.4; // конвертация мм в пиксели
    
    canvas.width = this.businessCardConfig.dimensions.width * mmToPx;
    canvas.height = this.businessCardConfig.dimensions.height * mmToPx;

    // Белый фон
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рендерим элементы
    const elements = this.getAllElements().sort((a, b) => a.layer - b.layer);
    
    for (const element of elements) {
      if (!element.visible) continue;

      ctx.save();
      ctx.globalAlpha = element.opacity;
      
      // Применяем трансформации
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

      // Рендерим в зависимости от типа
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

    // Конвертируем в нужный формат
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, `image/${format === 'jpg' ? 'jpeg' : format}`);
    });
  }

  private async renderTextElement(ctx: CanvasRenderingContext2D, element: TextElement, width: number, height: number) {
    const data = element.data;
    
    // Подстановка переменных
    let text = data.text;
    const fields = this.businessCardConfig.corporateFields;
    
    text = text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = fields[key as keyof typeof fields];
      return typeof value === 'string' ? value : (match);
    });

    // Настройка шрифта
    ctx.font = `${data.fontStyle} ${data.fontWeight} ${data.fontSize}px ${data.fontFamily}`;
    ctx.fillStyle = data.color;
    ctx.textAlign = data.textAlign as CanvasTextAlign;

    // Рендер текста с переносами
    const lines = text.split('\n');
    const lineHeight = data.fontSize * data.lineHeight;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 0, index * lineHeight + data.fontSize);
    });
  }

  private async renderShapeElement(ctx: CanvasRenderingContext2D, element: ShapeElement, width: number, height: number) {
    const data = element.data;
    
    ctx.fillStyle = data.fill;
    if (data.stroke && data.stroke !== 'none') {
      ctx.strokeStyle = data.stroke;
      ctx.lineWidth = data.strokeWidth;
    }

    switch (data.shape) {
      case 'rectangle':
        ctx.fillRect(0, 0, width, height);
        if (data.stroke && data.stroke !== 'none') {
          ctx.strokeRect(0, 0, width, height);
        }
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(width/2, height/2, Math.min(width, height)/2, 0, 2 * Math.PI);
        ctx.fill();
        if (data.stroke && data.stroke !== 'none') {
          ctx.stroke();
        }
        break;
    }
  }

  private async renderImageElement(ctx: CanvasRenderingContext2D, element: ImageElement, width: number, height: number) {
    const data = element.data;
    
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Применяем обрезку если есть
        const sx = (data.cropX / 100) * img.width;
        const sy = (data.cropY / 100) * img.height;
        const sw = (data.cropWidth / 100) * img.width;
        const sh = (data.cropHeight / 100) * img.height;
        
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
        resolve();
      };
      img.onerror = () => resolve(); // Пропускаем если изображение не загружается
      img.src = data.src;
    });
  }

  // Специфичные методы для визиток
  updateCorporateField(field: keyof BusinessCardConfig['corporateFields'], value: string) {
    this.businessCardConfig.corporateFields[field] = value as any;
    this.updateDynamicText();
    this.emit('corporateFieldUpdated', { field, value });
  }

  private updateDynamicText() {
    // Обновляем все текстовые элементы с переменными
    const textElements = this.getAllElements().filter(el => el.type === 'text') as TextElement[];
    
    textElements.forEach(element => {
      if (element.data.text.includes('{{')) {
        this.emit('elementUpdated', element);
      }
    });
  }

  addQRCode(data: string, size: number = 15, position: { x: number; y: number } = { x: 65, y: 35 }) {
    this.businessCardConfig.qrCode = {
      enabled: true,
      data,
      size,
      position
    };

    // Добавляем QR код как элемент изображения
    const qrElement: ImageElement = {
      id: 'qr_code',
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
    // В реальном приложении использовать библиотеку QR кодов
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  }

  removeQRCode() {
    if (this.businessCardConfig.qrCode?.enabled) {
      this.removeElement('qr_code');
      this.businessCardConfig.qrCode.enabled = false;
      this.emit('qrCodeRemoved');
    }
  }

  updateSpecialFeature(feature: keyof BusinessCardConfig['specialFeatures'], enabled: boolean) {
    this.businessCardConfig.specialFeatures[feature] = enabled;
    this.emit('specialFeatureUpdated', { feature, enabled });
  }

  // Получение информации о конфигурации
  getCorporateFields(): BusinessCardConfig['corporateFields'] {
    return { ...this.businessCardConfig.corporateFields };
  }

  getSpecialFeatures(): BusinessCardConfig['specialFeatures'] {
    return { ...this.businessCardConfig.specialFeatures };
  }

  getQRCodeConfig(): BusinessCardConfig['qrCode'] {
    return this.businessCardConfig.qrCode ? { ...this.businessCardConfig.qrCode } : undefined;
  }

  // Предустановленные стили
  applyStyle(style: BusinessCardTemplate['style']) {
    const templates = this.templates.filter(t => t.style === style);
    if (templates.length > 0) {
      this.loadTemplate(templates[0].id);
    }
  }

  // Быстрые шаблоны по индустрии
  getTemplatesByIndustry(industry: string): BusinessCardTemplate[] {
    return this.templates.filter(t => t.industry.includes(industry));
  }

  // Экспорт конфигурации для сохранения
  exportConfig(): BusinessCardConfig {
    return JSON.parse(JSON.stringify(this.businessCardConfig));
  }

  // Импорт конфигурации
  importConfig(config: BusinessCardConfig) {
    this.businessCardConfig = config;
    this.emit('configImported', config);
  }
}