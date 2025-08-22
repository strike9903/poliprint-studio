import { BaseConstructor, ProductConfig, DesignTemplate, DesignElement, TextElement, ImageElement, ShapeElement } from '../constructor-engine';

// Специфичные интерфейсы для акрила
export interface AcrylicConfig extends ProductConfig {
  category: 'acrylic';
  acrylicType: 'photo-print' | 'digital-art' | 'typography' | 'logo-display' | 'architectural' | 'signage';
  designStyle: 'minimalist' | 'modern' | 'corporate' | 'artistic' | 'tech' | 'luxury';
  acrylicProperties: {
    thickness: 3 | 5 | 8 | 10 | 12 | 15; // в миллиметрах
    transparency: 'crystal-clear' | 'frosted' | 'semi-transparent' | 'opaque';
    acrylicType: 'standard' | 'premium' | 'uv-resistant' | 'anti-glare' | 'colored';
    colorTint?: string; // для цветного акрила
    surfaceFinish: 'high-gloss' | 'matte' | 'textured' | 'brushed';
    edgeFinish: 'polished' | 'flame-polished' | 'diamond-polished' | 'satin';
  };
  mountingSystem: {
    type: 'standoff-bolts' | 'floating-mount' | 'wall-cleat' | 'easel-back' | 'magnetic' | 'suction-cups';
    hardware: {
      material: 'stainless-steel' | 'chrome' | 'black-oxide' | 'brass' | 'aluminum';
      visible: boolean;
      standoffDistance?: number; // расстояние от стены в мм
    };
    wallDistance: number; // расстояние от стены
  };
  illumination: {
    enabled: boolean;
    type?: 'edge-lit' | 'back-lit' | 'front-lit' | 'ambient';
    ledType?: 'warm-white' | 'cool-white' | 'rgb' | 'programmable';
    power?: 'battery' | 'plug-in' | 'usb';
    brightness?: number; // 0-100
    colorTemperature?: number; // Кельвины
  };
  printingDetails: {
    printType: 'direct-print' | 'reverse-print' | 'double-sided' | 'sandwiched';
    colorProfile: 'standard-rgb' | 'wide-gamut' | 'pantone-matched';
    resolution: 'standard' | 'high' | 'ultra-high';
    uvProtection: boolean;
    scratchResistant: boolean;
  };
  modernFeatures: {
    qrIntegration: {
      enabled: boolean;
      type?: 'laser-etched' | 'printed' | 'embedded';
      functionality?: 'info' | 'portfolio' | 'contact' | 'ar-experience';
    };
    interactivity: {
      enabled: boolean;
      touchSensitive?: boolean;
      proximityLighting?: boolean;
      smartConnectivity?: boolean;
    };
    sustainability: {
      recyclable: boolean;
      ecoFriendlyInks: boolean;
      carbonNeutral: boolean;
    };
  };
}

export interface AcrylicTemplate extends DesignTemplate {
  productType: 'acrylic';
  acrylicType: AcrylicConfig['acrylicType'];
  designStyle: AcrylicConfig['designStyle'];
  recommendedThickness: number;
  hasIllumination: boolean;
  modernFeatures: string[];
  targetAudience: 'corporate' | 'residential' | 'hospitality' | 'retail' | 'gallery';
}

export class AcrylicConstructor extends BaseConstructor {
  private acrylicConfig: AcrylicConfig;
  private templates: AcrylicTemplate[] = [];

  constructor(productConfig: ProductConfig, templateId?: string) {
    super(productConfig, templateId);
    this.acrylicConfig = productConfig as AcrylicConfig;
    this.initializeAcrylicDefaults();
    
    if (templateId) {
      this.loadTemplate(templateId);
    }
  }

  private initializeAcrylicDefaults() {
    // Стандартные размеры для акрила
    const standardSizes = {
      'small': { width: 20, height: 15 }, // настольные
      'medium': { width: 30, height: 20 }, // настенные
      'large': { width: 50, height: 35 }, // большие панели
      'extra-large': { width: 80, height: 60 }, // архитектурные
      'custom': { width: 30, height: 20 }
    };

    if (!this.acrylicConfig.dimensions) {
      this.acrylicConfig.dimensions = {
        width: 30, // см
        height: 20,
        unit: 'cm',
        dpi: 300
      };
    }

    // Печатная область (весь акрил за вычетом крепежа)
    if (!this.acrylicConfig.printArea) {
      this.acrylicConfig.printArea = {
        x: 1,
        y: 1,
        width: this.acrylicConfig.dimensions.width - 2,
        height: this.acrylicConfig.dimensions.height - 2
      };
    }

    // Минимальный блид для акрила
    if (!this.acrylicConfig.bleedArea) {
      this.acrylicConfig.bleedArea = {
        top: 0.5,
        right: 0.5,
        bottom: 0.5,
        left: 0.5
      };
    }

    // Инициализация типа акрила
    if (!this.acrylicConfig.acrylicType) {
      this.acrylicConfig.acrylicType = 'photo-print';
    }

    if (!this.acrylicConfig.designStyle) {
      this.acrylicConfig.designStyle = 'modern';
    }

    // Свойства акрила
    if (!this.acrylicConfig.acrylicProperties) {
      this.acrylicConfig.acrylicProperties = {
        thickness: 5,
        transparency: 'crystal-clear',
        acrylicType: 'premium',
        surfaceFinish: 'high-gloss',
        edgeFinish: 'diamond-polished'
      };
    }

    // Система крепления
    if (!this.acrylicConfig.mountingSystem) {
      this.acrylicConfig.mountingSystem = {
        type: 'standoff-bolts',
        hardware: {
          material: 'stainless-steel',
          visible: true,
          standoffDistance: 15
        },
        wallDistance: 15
      };
    }

    // Подсветка
    if (!this.acrylicConfig.illumination) {
      this.acrylicConfig.illumination = {
        enabled: false,
        type: 'edge-lit',
        ledType: 'cool-white',
        power: 'plug-in',
        brightness: 80,
        colorTemperature: 6500
      };
    }

    // Детали печати
    if (!this.acrylicConfig.printingDetails) {
      this.acrylicConfig.printingDetails = {
        printType: 'reverse-print',
        colorProfile: 'wide-gamut',
        resolution: 'high',
        uvProtection: true,
        scratchResistant: true
      };
    }

    // Современные функции
    if (!this.acrylicConfig.modernFeatures) {
      this.acrylicConfig.modernFeatures = {
        qrIntegration: {
          enabled: false,
          type: 'laser-etched',
          functionality: 'info'
        },
        interactivity: {
          enabled: false,
          touchSensitive: false,
          proximityLighting: false,
          smartConnectivity: false
        },
        sustainability: {
          recyclable: true,
          ecoFriendlyInks: true,
          carbonNeutral: false
        }
      };
    }
  }

  async getAvailableTemplates(): Promise<DesignTemplate[]> {
    const mockTemplates: AcrylicTemplate[] = [
      {
        id: 'ac_corporate_001',
        name: 'Корпоративний логотип',
        category: 'acrylic',
        subcategory: 'corporate',
        productType: 'acrylic',
        thumbnail: '/templates/acrylic/corporate-logo.jpg',
        isPremium: false,
        tags: ['corporate', 'logo', 'minimalist', 'professional'],
        acrylicType: 'logo-display',
        designStyle: 'corporate',
        recommendedThickness: 8,
        hasIllumination: false,
        modernFeatures: ['uv-protection', 'scratch-resistant'],
        targetAudience: 'corporate',
        elements: [
          {
            id: 'corp_bg',
            type: 'shape',
            x: 0,
            y: 0,
            width: 30,
            height: 20,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: true,
            visible: true,
            data: {
              shape: 'rectangle',
              fill: 'transparent',
              stroke: 'none',
              strokeWidth: 0
            }
          } as ShapeElement,
          {
            id: 'company_logo',
            type: 'image',
            x: 5,
            y: 5,
            width: 20,
            height: 10,
            rotation: 0,
            opacity: 1,
            layer: 1,
            locked: false,
            visible: true,
            data: {
              src: '/placeholder-corporate-logo.svg',
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
          } as ImageElement
        ],
        metadata: {
          author: 'Poliprint Acrylic Team',
          description: 'Элегантное корпоративное решение для офисов',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 78,
          rating: 4.8
        }
      },
      {
        id: 'ac_modern_001',
        name: 'Сучасне мистецтво з підсвіткою',
        category: 'acrylic',
        subcategory: 'modern-art',
        productType: 'acrylic',
        thumbnail: '/templates/acrylic/modern-illuminated.jpg',
        isPremium: true,
        tags: ['modern', 'illuminated', 'artistic', 'premium'],
        acrylicType: 'digital-art',
        designStyle: 'artistic',
        recommendedThickness: 10,
        hasIllumination: true,
        modernFeatures: ['edge-lit', 'rgb-lighting', 'smart-connectivity'],
        targetAudience: 'residential',
        elements: [
          {
            id: 'modern_art_bg',
            type: 'shape',
            x: 0,
            y: 0,
            width: 40,
            height: 30,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: false,
            visible: true,
            data: {
              shape: 'rectangle',
              fill: 'linear-gradient(45deg, rgba(139, 69, 19, 0.1), rgba(255, 215, 0, 0.1))',
              stroke: 'none',
              strokeWidth: 0
            }
          } as ShapeElement,
          {
            id: 'geometric_pattern',
            type: 'shape',
            x: 10,
            y: 8,
            width: 20,
            height: 14,
            rotation: 0,
            opacity: 0.8,
            layer: 1,
            locked: false,
            visible: true,
            data: {
              shape: 'polygon',
              fill: '#667eea',
              stroke: '#764ba2',
              strokeWidth: 2,
              points: [
                {x: 0, y: 7}, {x: 10, y: 0}, {x: 20, y: 7}, {x: 10, y: 14}
              ]
            }
          } as ShapeElement
        ],
        metadata: {
          author: 'Poliprint Acrylic Team',
          description: 'Современное искусство с RGB подсветкой для интерьеров',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 34,
          rating: 4.9
        }
      },
      {
        id: 'ac_tech_001',
        name: 'Tech стиль з QR-кодом',
        category: 'acrylic',
        subcategory: 'technology',
        productType: 'acrylic',
        thumbnail: '/templates/acrylic/tech-qr.jpg',
        isPremium: true,
        tags: ['tech', 'qr-code', 'interactive', 'futuristic'],
        acrylicType: 'signage',
        designStyle: 'tech',
        recommendedThickness: 5,
        hasIllumination: true,
        modernFeatures: ['laser-etched-qr', 'proximity-lighting', 'ar-experience'],
        targetAudience: 'corporate',
        elements: [
          {
            id: 'tech_grid_bg',
            type: 'shape',
            x: 0,
            y: 0,
            width: 25,
            height: 25,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: true,
            visible: true,
            data: {
              shape: 'rectangle',
              fill: 'radial-gradient(circle, rgba(0, 255, 255, 0.1), transparent)',
              stroke: 'none',
              strokeWidth: 0
            }
          } as ShapeElement,
          {
            id: 'qr_code_area',
            type: 'shape',
            x: 18,
            y: 18,
            width: 5,
            height: 5,
            rotation: 0,
            opacity: 1,
            layer: 2,
            locked: false,
            visible: true,
            data: {
              shape: 'rectangle',
              fill: '#00ffff',
              stroke: '#ffffff',
              strokeWidth: 1
            }
          } as ShapeElement
        ],
        metadata: {
          author: 'Poliprint Acrylic Team',
          description: 'Технологичный дизайн с интерактивными элементами',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 25,
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

    // Проверка толщины акрила для размера
    const area = this.acrylicConfig.dimensions.width * this.acrylicConfig.dimensions.height / 100; // дм²
    const thickness = this.acrylicConfig.acrylicProperties.thickness;
    
    if (area > 25 && thickness < 8) {
      errors.push('Для больших панелей (более 25 дм²) рекомендуется толщина не менее 8мм');
    }
    
    if (area > 50 && thickness < 10) {
      errors.push('Для очень больших панелей (более 50 дм²) рекомендуется толщина не менее 10мм');
    }

    // Проверка крепежа
    const mounting = this.acrylicConfig.mountingSystem;
    if (mounting.type === 'standoff-bolts') {
      const maxDimension = Math.max(this.acrylicConfig.dimensions.width, this.acrylicConfig.dimensions.height);
      if (maxDimension > 60 && mounting.hardware.standoffDistance! < 20) {
        errors.push('Для больших панелей рекомендуется увеличить расстояние стойки до 20мм или более');
      }
    }

    // Проверка элементов относительно крепежа
    allElements.forEach(element => {
      if (this.isElementInMountingArea(element)) {
        errors.push(`Элемент "${element.id}" может конфликтовать с системой крепления`);
      }
    });

    // Проверка подсветки
    if (this.acrylicConfig.illumination.enabled) {
      const illum = this.acrylicConfig.illumination;
      
      if (illum.type === 'edge-lit' && thickness < 5) {
        errors.push('Для торцевой подсветки рекомендуется толщина не менее 5мм');
      }
      
      if (illum.type === 'back-lit' && this.acrylicConfig.acrylicProperties.transparency === 'opaque') {
        errors.push('Обратная подсветка неэффективна с непрозрачным акрилом');
      }
      
      if (illum.ledType === 'rgb' && !illum.power) {
        errors.push('RGB подсветка требует указания источника питания');
      }
    }

    // Проверка печати
    if (this.acrylicConfig.printingDetails.printType === 'reverse-print') {
      const imageElements = allElements.filter(el => el.type === 'image') as ImageElement[];
      if (imageElements.length === 0) {
        errors.push('Обратная печать обычно используется для изображений');
      }
    }

    // Проверка QR-кода
    if (this.acrylicConfig.modernFeatures.qrIntegration.enabled) {
      const qr = this.acrylicConfig.modernFeatures.qrIntegration;
      if (qr.type === 'laser-etched' && this.acrylicConfig.acrylicProperties.surfaceFinish === 'high-gloss') {
        errors.push('Лазерная гравировка может быть плохо видна на глянцевой поверхности');
      }
    }

    // Проверка устойчивости
    if (this.acrylicConfig.modernFeatures.sustainability.carbonNeutral) {
      if (!this.acrylicConfig.modernFeatures.sustainability.ecoFriendlyInks) {
        errors.push('Для углеродно-нейтрального продукта рекомендуется использовать экологичные чернила');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private isElementInMountingArea(element: DesignElement): boolean {
    // Упрощенная проверка - элементы не должны попадать в углы где крепеж
    const corners = [
      { x: 0, y: 0, width: 3, height: 3 },
      { x: this.acrylicConfig.dimensions.width - 3, y: 0, width: 3, height: 3 },
      { x: 0, y: this.acrylicConfig.dimensions.height - 3, width: 3, height: 3 },
      { x: this.acrylicConfig.dimensions.width - 3, y: this.acrylicConfig.dimensions.height - 3, width: 3, height: 3 }
    ];

    return corners.some(corner => 
      element.x < corner.x + corner.width &&
      element.x + element.width > corner.x &&
      element.y < corner.y + corner.height &&
      element.y + element.height > corner.y
    );
  }

  async calculatePrice(quantity: number): Promise<{total: number, breakdown: any}> {
    const basePrice = this.acrylicConfig.basePrice;
    const pricePerUnit = this.acrylicConfig.pricePerUnit;

    // Скидки за количество (умеренные для акрила)
    let quantityDiscount = 0;
    if (quantity >= 20) quantityDiscount = 0.15;
    else if (quantity >= 10) quantityDiscount = 0.1;
    else if (quantity >= 5) quantityDiscount = 0.05;

    // Надбавки за площадь и толщину
    const area = this.acrylicConfig.dimensions.width * this.acrylicConfig.dimensions.height / 100; // дм²
    const thickness = this.acrylicConfig.acrylicProperties.thickness;
    
    let materialMultiplier = 1 + (area * 0.1) + (thickness * 0.05);
    
    // Надбавки за тип акрила
    switch (this.acrylicConfig.acrylicProperties.acrylicType) {
      case 'premium': materialMultiplier += 0.3; break;
      case 'uv-resistant': materialMultiplier += 0.4; break;
      case 'anti-glare': materialMultiplier += 0.5; break;
      case 'colored': materialMultiplier += 0.2; break;
    }

    // Надбавки за финиш
    switch (this.acrylicConfig.acrylicProperties.edgeFinish) {
      case 'flame-polished': materialMultiplier += 0.2; break;
      case 'diamond-polished': materialMultiplier += 0.4; break;
    }

    // Надбавки за крепление
    let mountingPrice = 0;
    const mounting = this.acrylicConfig.mountingSystem;
    switch (mounting.type) {
      case 'standoff-bolts':
        mountingPrice = quantity * 200; // базовая стоимость
        if (mounting.hardware.material === 'stainless-steel') mountingPrice *= 1.5;
        if (mounting.hardware.material === 'brass') mountingPrice *= 2;
        break;
      case 'floating-mount':
        mountingPrice = quantity * 150;
        break;
      case 'magnetic':
        mountingPrice = quantity * 300;
        break;
    }

    // Надбавки за подсветку
    let illuminationPrice = 0;
    if (this.acrylicConfig.illumination.enabled) {
      const illum = this.acrylicConfig.illumination;
      
      switch (illum.type) {
        case 'edge-lit':
          illuminationPrice = quantity * 500;
          break;
        case 'back-lit':
          illuminationPrice = quantity * 800;
          break;
        case 'ambient':
          illuminationPrice = quantity * 1200;
          break;
      }
      
      if (illum.ledType === 'rgb') illuminationPrice *= 1.5;
      if (illum.power === 'battery') illuminationPrice += quantity * 200;
    }

    // Надбавки за печать
    let printingMultiplier = 1;
    const printing = this.acrylicConfig.printingDetails;
    
    switch (printing.printType) {
      case 'reverse-print': printingMultiplier += 0.3; break;
      case 'double-sided': printingMultiplier += 0.8; break;
      case 'sandwiched': printingMultiplier += 1.2; break;
    }
    
    if (printing.colorProfile === 'wide-gamut') printingMultiplier += 0.2;
    if (printing.colorProfile === 'pantone-matched') printingMultiplier += 0.4;
    if (printing.resolution === 'ultra-high') printingMultiplier += 0.3;

    // Надбавки за современные функции
    let modernFeaturesPrice = 0;
    const modern = this.acrylicConfig.modernFeatures;
    
    if (modern.qrIntegration.enabled) {
      switch (modern.qrIntegration.type) {
        case 'laser-etched': modernFeaturesPrice += quantity * 150; break;
        case 'embedded': modernFeaturesPrice += quantity * 300; break;
      }
    }
    
    if (modern.interactivity.enabled) {
      if (modern.interactivity.touchSensitive) modernFeaturesPrice += quantity * 800;
      if (modern.interactivity.proximityLighting) modernFeaturesPrice += quantity * 600;
      if (modern.interactivity.smartConnectivity) modernFeaturesPrice += quantity * 1000;
    }

    // Надбавки за экологичность
    if (modern.sustainability.carbonNeutral) {
      modernFeaturesPrice += quantity * 100; // компенсация углерода
    }

    // Расчет итоговой цены
    const subtotal = (basePrice + (pricePerUnit * quantity)) * 
                    materialMultiplier * printingMultiplier;
    const discountAmount = subtotal * quantityDiscount;
    const subtotalWithDiscount = subtotal - discountAmount;
    const total = subtotalWithDiscount + mountingPrice + illuminationPrice + modernFeaturesPrice;

    const breakdown = {
      basePrice,
      quantity,
      pricePerUnit,
      subtotal,
      materialMultiplier,
      printingMultiplier,
      quantityDiscount,
      discountAmount,
      mountingPrice,
      illuminationPrice,
      modernFeaturesPrice,
      total,
      currency: 'UAH',
      details: {
        size: `${this.acrylicConfig.dimensions.width}x${this.acrylicConfig.dimensions.height}см`,
        thickness: `${thickness}мм`,
        area: `${area.toFixed(1)}дм²`,
        acrylicType: this.acrylicConfig.acrylicProperties.acrylicType,
        mounting: mounting.type,
        hasIllumination: this.acrylicConfig.illumination.enabled,
        modernFeatures: Object.entries(modern)
          .filter(([_, config]: [string, any]) => config.enabled)
          .map(([name, _]) => name)
      }
    };

    return { total, breakdown };
  }

  async exportDesign(format: 'pdf' | 'png' | 'jpg' | 'svg'): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Высокое разрешение для акрила
    const dpi = Math.max(this.acrylicConfig.dimensions.dpi, 300);
    const mmToPx = dpi / 25.4;
    
    canvas.width = this.acrylicConfig.dimensions.width * mmToPx;
    canvas.height = this.acrylicConfig.dimensions.height * mmToPx;

    // Фон акрила (прозрачность)
    if (this.acrylicConfig.acrylicProperties.transparency !== 'crystal-clear') {
      ctx.fillStyle = this.getAcrylicBackgroundColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Рендерим элементы
    const elements = this.getAllElements().sort((a, b) => a.layer - b.layer);
    
    for (const element of elements) {
      if (!element.visible) continue;

      ctx.save();
      
      // Применяем эффекты акрила
      if (this.acrylicConfig.illumination.enabled) {
        this.applyIlluminationEffect(ctx, element);
      }
      
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
        case 'image':
          await this.renderAcrylicImageElement(ctx, element as ImageElement, width, height);
          break;
        case 'shape':
          await this.renderAcrylicShapeElement(ctx, element as ShapeElement, width, height);
          break;
        case 'text':
          await this.renderAcrylicTextElement(ctx, element as TextElement, width, height);
          break;
      }

      ctx.restore();
    }

    // Добавляем эффекты акрила
    this.applyAcrylicEffects(ctx, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, `image/${format === 'jpg' ? 'jpeg' : format}`, 1.0);
    });
  }

  private getAcrylicBackgroundColor(): string {
    switch (this.acrylicConfig.acrylicProperties.transparency) {
      case 'frosted': return 'rgba(255, 255, 255, 0.3)';
      case 'semi-transparent': return 'rgba(255, 255, 255, 0.1)';
      case 'opaque': return '#ffffff';
      default: return 'transparent';
    }
  }

  private applyIlluminationEffect(ctx: CanvasRenderingContext2D, element: DesignElement) {
    if (!this.acrylicConfig.illumination.enabled) return;
    
    const illum = this.acrylicConfig.illumination;
    const brightness = illum.brightness! / 100;
    
    switch (illum.type) {
      case 'edge-lit':
        // Эффект свечения по краям
        ctx.shadowColor = this.getLEDColor();
        ctx.shadowBlur = 10 * brightness;
        break;
      case 'back-lit':
        // Общий эффект подсветки
        ctx.filter = `brightness(${1 + brightness * 0.3}) contrast(${1 + brightness * 0.2})`;
        break;
      case 'ambient':
        // Динамическая подсветка
        ctx.shadowColor = this.getRGBColor();
        ctx.shadowBlur = 15 * brightness;
        break;
    }
  }

  private getLEDColor(): string {
    const illum = this.acrylicConfig.illumination;
    switch (illum.ledType) {
      case 'warm-white': return '#fff8dc';
      case 'cool-white': return '#f0f8ff';
      case 'rgb': return this.getRGBColor();
      default: return '#ffffff';
    }
  }

  private getRGBColor(): string {
    // Динамический цвет для RGB (в реальности - анимированный)
    const hue = (Date.now() / 50) % 360;
    return `hsl(${hue}, 100%, 70%)`;
  }

  private async renderAcrylicImageElement(ctx: CanvasRenderingContext2D, element: ImageElement, width: number, height: number) {
    const data = element.data;
    
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        
        // Применяем эффекты высокого качества для акрила
        ctx.filter = `saturate(110%) contrast(105%) brightness(105%)`;
        
        const sx = (data.cropX / 100) * img.width;
        const sy = (data.cropY / 100) * img.height;
        const sw = (data.cropWidth / 100) * img.width;
        const sh = (data.cropHeight / 100) * img.height;
        
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
        
        // Добавляем глянцевый эффект если нужно
        if (this.acrylicConfig.acrylicProperties.surfaceFinish === 'high-gloss') {
          this.addGlossEffect(ctx, width, height);
        }
        
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = data.src;
    });
  }

  private async renderAcrylicShapeElement(ctx: CanvasRenderingContext2D, element: ShapeElement, width: number, height: number) {
    const data = element.data;
    
    // Высококачественные градиенты для акрила
    if (data.fill.includes('gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
      gradient.addColorStop(1, 'rgba(118, 75, 162, 0.8)');
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
        ctx.fillRect(0, 0, width, height);
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
            const x = (point.x / 20) * width; // Нормализация для полигонов
            const y = (point.y / 14) * height;
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

  private async renderAcrylicTextElement(ctx: CanvasRenderingContext2D, element: TextElement, width: number, height: number) {
    const data = element.data;
    
    ctx.font = `${data.fontStyle} ${data.fontWeight} ${data.fontSize}px ${data.fontFamily}`;
    ctx.fillStyle = data.color;
    ctx.textAlign = data.textAlign as CanvasTextAlign;

    // Добавляем эффект глубины для текста на акриле
    if (this.acrylicConfig.acrylicProperties.transparency !== 'opaque') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 2;
    }

    const lines = data.text.split('\n');
    const lineHeight = data.fontSize * data.lineHeight;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 0, index * lineHeight + data.fontSize);
    });

    ctx.shadowColor = 'transparent';
  }

  private addGlossEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Эффект глянца
    const gradient = ctx.createLinearGradient(0, 0, width, height/4);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height/4);
  }

  private applyAcrylicEffects(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Применяем финальные эффекты акрила
    if (this.acrylicConfig.acrylicProperties.surfaceFinish === 'high-gloss') {
      // Общий глянцевый эффект
      const glossGradient = ctx.createRadialGradient(width/2, height/4, 0, width/2, height/4, width);
      glossGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      glossGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = glossGradient;
      ctx.fillRect(0, 0, width, height);
    }
  }

  // Специфичные методы для акрила
  updateAcrylicType(type: AcrylicConfig['acrylicType']) {
    this.acrylicConfig.acrylicType = type;
    
    // Применяем предустановки
    switch (type) {
      case 'logo-display':
        this.acrylicConfig.designStyle = 'corporate';
        this.acrylicConfig.acrylicProperties.thickness = 8;
        break;
      case 'digital-art':
        this.acrylicConfig.designStyle = 'artistic';
        this.acrylicConfig.illumination.enabled = true;
        break;
      case 'signage':
        this.acrylicConfig.designStyle = 'modern';
        this.acrylicConfig.modernFeatures.qrIntegration.enabled = true;
        break;
    }
    
    this.emit('acrylicTypeChanged', type);
  }

  updateAcrylicProperties(properties: Partial<AcrylicConfig['acrylicProperties']>) {
    this.acrylicConfig.acrylicProperties = { 
      ...this.acrylicConfig.acrylicProperties, 
      ...properties 
    };
    this.emit('acrylicPropertiesUpdated', this.acrylicConfig.acrylicProperties);
  }

  updateMountingSystem(mounting: Partial<AcrylicConfig['mountingSystem']>) {
    this.acrylicConfig.mountingSystem = { 
      ...this.acrylicConfig.mountingSystem, 
      ...mounting 
    };
    this.emit('mountingSystemUpdated', this.acrylicConfig.mountingSystem);
  }

  updateIllumination(illumination: Partial<AcrylicConfig['illumination']>) {
    this.acrylicConfig.illumination = { 
      ...this.acrylicConfig.illumination, 
      ...illumination 
    };
    this.emit('illuminationUpdated', this.acrylicConfig.illumination);
  }

  updateModernFeatures(features: Partial<AcrylicConfig['modernFeatures']>) {
    this.acrylicConfig.modernFeatures = { 
      ...this.acrylicConfig.modernFeatures, 
      ...features 
    };
    this.emit('modernFeaturesUpdated', this.acrylicConfig.modernFeatures);
  }

  addQRCode(data: string, type: 'laser-etched' | 'printed' | 'embedded' = 'laser-etched') {
    this.acrylicConfig.modernFeatures.qrIntegration = {
      enabled: true,
      type,
      functionality: 'info'
    };

    // Добавляем QR как элемент
    const qrElement: ShapeElement = {
      id: 'acrylic_qr_code',
      type: 'shape',
      x: this.acrylicConfig.dimensions.width - 8,
      y: this.acrylicConfig.dimensions.height - 8,
      width: 6,
      height: 6,
      rotation: 0,
      opacity: type === 'laser-etched' ? 0.8 : 1,
      layer: 10,
      locked: false,
      visible: true,
      data: {
        shape: 'rectangle',
        fill: type === 'laser-etched' ? '#ffffff' : '#000000',
        stroke: type === 'laser-etched' ? '#cccccc' : 'none',
        strokeWidth: type === 'laser-etched' ? 1 : 0
      }
    };

    this.addElement(qrElement);
    this.emit('qrCodeAdded', { type, data });
  }

  enableSmartFeatures(features: { 
    touchSensitive?: boolean, 
    proximityLighting?: boolean, 
    smartConnectivity?: boolean 
  }) {
    this.acrylicConfig.modernFeatures.interactivity = {
      enabled: true,
      ...features
    };
    
    // Автоматически включаем подсветку для смарт-функций
    if (features.proximityLighting && !this.acrylicConfig.illumination.enabled) {
      this.acrylicConfig.illumination = {
        enabled: true,
        type: 'edge-lit',
        ledType: 'rgb',
        power: 'plug-in',
        brightness: 60,
        colorTemperature: 6500
      };
    }
    
    this.emit('smartFeaturesEnabled', features);
  }

  applyDesignPreset(preset: 'corporate' | 'modern' | 'luxury' | 'tech') {
    switch (preset) {
      case 'corporate':
        this.updateAcrylicProperties({
          thickness: 8,
          transparency: 'crystal-clear',
          surfaceFinish: 'high-gloss',
          edgeFinish: 'diamond-polished'
        });
        this.updateMountingSystem({
          type: 'standoff-bolts',
          hardware: { material: 'stainless-steel', visible: true, standoffDistance: 15 }
        });
        break;
      case 'modern':
        this.updateAcrylicProperties({
          thickness: 5,
          transparency: 'semi-transparent',
          surfaceFinish: 'matte',
          edgeFinish: 'polished'
        });
        this.updateIllumination({
          enabled: true,
          type: 'edge-lit',
          ledType: 'cool-white'
        });
        break;
      case 'luxury':
        this.updateAcrylicProperties({
          thickness: 12,
          transparency: 'crystal-clear',
          acrylicType: 'premium',
          surfaceFinish: 'high-gloss',
          edgeFinish: 'diamond-polished'
        });
        this.updateMountingSystem({
          type: 'floating-mount',
          hardware: { material: 'brass', visible: false }
        });
        break;
      case 'tech':
        this.updateAcrylicProperties({
          thickness: 5,
          transparency: 'frosted',
          surfaceFinish: 'matte'
        });
        this.updateIllumination({
          enabled: true,
          type: 'ambient',
          ledType: 'rgb',
          brightness: 80
        });
        this.enableSmartFeatures({
          proximityLighting: true,
          smartConnectivity: true
        });
        break;
    }
    
    this.emit('presetApplied', preset);
  }

  // Получение рекомендаций
  getThicknessRecommendations(): Array<{thickness: number, description: string}> {
    const area = this.acrylicConfig.dimensions.width * this.acrylicConfig.dimensions.height / 100;
    
    if (area < 10) {
      return [
        { thickness: 3, description: 'Тонкий, экономичный вариант' },
        { thickness: 5, description: 'Стандартный, оптимальный выбор' }
      ];
    } else if (area < 25) {
      return [
        { thickness: 5, description: 'Стандартная толщина' },
        { thickness: 8, description: 'Повышенная прочность' }
      ];
    } else {
      return [
        { thickness: 8, description: 'Минимум для больших панелей' },
        { thickness: 10, description: 'Рекомендуемая толщина' },
        { thickness: 12, description: 'Максимальная прочность' }
      ];
    }
  }

  // Получение информации о конфигурации
  getAcrylicProperties(): AcrylicConfig['acrylicProperties'] {
    return { ...this.acrylicConfig.acrylicProperties };
  }

  getMountingSystem(): AcrylicConfig['mountingSystem'] {
    return { ...this.acrylicConfig.mountingSystem };
  }

  getIllumination(): AcrylicConfig['illumination'] {
    return { ...this.acrylicConfig.illumination };
  }

  getModernFeatures(): AcrylicConfig['modernFeatures'] {
    return { ...this.acrylicConfig.modernFeatures };
  }

  // Экспорт конфигурации
  exportConfig(): AcrylicConfig {
    return JSON.parse(JSON.stringify(this.acrylicConfig));
  }

  // Импорт конфигурации
  importConfig(config: AcrylicConfig) {
    this.acrylicConfig = config;
    this.emit('configImported', config);
  }
}