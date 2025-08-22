import { BaseConstructor, ProductConfig, DesignTemplate, DesignElement, TextElement, ImageElement, ShapeElement } from '../constructor-engine';

// Специфичные интерфейсы для наклеек
export interface StickerConfig extends ProductConfig {
  category: 'stickers';
  stickerType: 'vinyl' | 'paper' | 'transparent' | 'holographic' | 'reflective' | 'removable' | 'permanent';
  applicationArea: 'indoor' | 'outdoor' | 'automotive' | 'packaging' | 'promotional' | 'safety' | 'decorative';
  cutType: 'kiss-cut' | 'die-cut' | 'contour-cut' | 'perforation-cut' | 'laser-cut' | 'no-cut';
  stickerProperties: {
    material: 'vinyl' | 'paper' | 'polyester' | 'polypropylene' | 'static-cling' | 'fabric';
    adhesive: 'permanent' | 'removable' | 'repositionable' | 'none' | 'static';
    adhesiveStrength: 'low' | 'medium' | 'high' | 'aggressive';
    finish: 'gloss' | 'matte' | 'semi-gloss' | 'textured' | 'metallic' | 'holographic';
    thickness: number; // в микронах
    weatherResistance: boolean;
    fadeResistance: boolean;
    scratchResistance: boolean;
    temperature: {
      min: number; // минимальная температура применения
      max: number; // максимальная температура применения
    };
  };
  cuttingDetails: {
    cutPath: Array<{x: number, y: number}>; // контур вырубки
    cutComplexity: 'simple' | 'medium' | 'complex' | 'very-complex';
    minimumCutRadius: number; // минимальный радиус поворота в мм
    bridgeWidth: number; // ширина мостиков для удержания
    weedingRequired: boolean; // нужно ли удаление лишнего материала
    cutTolerance: number; // допуск вырубки в мм
  };
  lamination: {
    enabled: boolean;
    type?: 'protective' | 'decorative' | 'anti-graffiti' | 'anti-slip';
    thickness?: number; // толщина ламинации в микронах
    uvProtection?: boolean;
    antiScratch?: boolean;
  };
  packagingOptions: {
    individual: boolean; // поштучная упаковка
    sheets: boolean; // листами
    rolls: boolean; // в рулонах
    transferTape: boolean; // с монтажной пленкой
    applicationInstructions: boolean;
  };
  specialFeatures: {
    qrIntegration: boolean;
    variableData: boolean; // переменные данные (нумерация, коды)
    securityFeatures: boolean; // защитные элементы
    glow: boolean; // светящиеся в темноте
    thermal: boolean; // термочувствительные
    scratch: boolean; // scratch-off покрытие
  };
}

export interface StickerTemplate extends DesignTemplate {
  productType: 'stickers';
  stickerType: StickerConfig['stickerType'];
  applicationArea: StickerConfig['applicationArea'];
  cutType: StickerConfig['cutType'];
  shape: 'circle' | 'square' | 'rectangle' | 'oval' | 'star' | 'custom' | 'logo-shaped';
  hasContourCut: boolean;
  complexity: 'simple' | 'medium' | 'complex';
  weatherproof: boolean;
}

export class StickerConstructor extends BaseConstructor {
  private stickerConfig: StickerConfig;
  private templates: StickerTemplate[] = [];

  constructor(productConfig: ProductConfig, templateId?: string) {
    super(productConfig, templateId);
    this.stickerConfig = productConfig as StickerConfig;
    this.initializeStickerDefaults();
    
    if (templateId) {
      this.loadTemplate(templateId);
    }
  }

  private initializeStickerDefaults() {
    // Стандартные размеры наклеек
    if (!this.stickerConfig.dimensions) {
      this.stickerConfig.dimensions = {
        width: 50, // мм
        height: 50,
        unit: 'mm',
        dpi: 300
      };
    }

    // Печатная область (учитываем вырубку)
    if (!this.stickerConfig.printArea) {
      this.stickerConfig.printArea = {
        x: 2,
        y: 2,
        width: this.stickerConfig.dimensions.width - 4,
        height: this.stickerConfig.dimensions.height - 4
      };
    }

    // Блид для наклеек
    if (!this.stickerConfig.bleedArea) {
      this.stickerConfig.bleedArea = {
        top: 2,
        right: 2,
        bottom: 2,
        left: 2
      };
    }

    // Инициализация типа наклейки
    if (!this.stickerConfig.stickerType) {
      this.stickerConfig.stickerType = 'vinyl';
    }

    if (!this.stickerConfig.applicationArea) {
      this.stickerConfig.applicationArea = 'indoor';
    }

    if (!this.stickerConfig.cutType) {
      this.stickerConfig.cutType = 'contour-cut';
    }

    // Свойства наклейки
    if (!this.stickerConfig.stickerProperties) {
      this.stickerConfig.stickerProperties = {
        material: 'vinyl',
        adhesive: 'permanent',
        adhesiveStrength: 'medium',
        finish: 'gloss',
        thickness: 80, // микрон
        weatherResistance: false,
        fadeResistance: true,
        scratchResistance: false,
        temperature: {
          min: -10,
          max: 60
        }
      };
    }

    // Детали вырубки
    if (!this.stickerConfig.cuttingDetails) {
      this.stickerConfig.cuttingDetails = {
        cutPath: this.generateDefaultCutPath(),
        cutComplexity: 'simple',
        minimumCutRadius: 1,
        bridgeWidth: 2,
        weedingRequired: false,
        cutTolerance: 0.1
      };
    }

    // Ламинация
    if (!this.stickerConfig.lamination) {
      this.stickerConfig.lamination = {
        enabled: false,
        type: 'protective',
        thickness: 25,
        uvProtection: false,
        antiScratch: false
      };
    }

    // Упаковка
    if (!this.stickerConfig.packagingOptions) {
      this.stickerConfig.packagingOptions = {
        individual: true,
        sheets: false,
        rolls: false,
        transferTape: false,
        applicationInstructions: false
      };
    }

    // Специальные функции
    if (!this.stickerConfig.specialFeatures) {
      this.stickerConfig.specialFeatures = {
        qrIntegration: false,
        variableData: false,
        securityFeatures: false,
        glow: false,
        thermal: false,
        scratch: false
      };
    }
  }

  private generateDefaultCutPath(): Array<{x: number, y: number}> {
    // Генерируем простой прямоугольный контур по умолчанию
    const w = this.stickerConfig.dimensions.width;
    const h = this.stickerConfig.dimensions.height;
    
    return [
      {x: 0, y: 0},
      {x: w, y: 0},
      {x: w, y: h},
      {x: 0, y: h},
      {x: 0, y: 0}
    ];
  }

  async getAvailableTemplates(): Promise<DesignTemplate[]> {
    const mockTemplates: StickerTemplate[] = [
      {
        id: 'st_logo_001',
        name: 'Логотип компанії',
        category: 'stickers',
        subcategory: 'corporate',
        productType: 'stickers',
        thumbnail: '/templates/stickers/corporate-logo.jpg',
        isPremium: false,
        tags: ['logo', 'corporate', 'contour-cut', 'professional'],
        stickerType: 'vinyl',
        applicationArea: 'promotional',
        cutType: 'contour-cut',
        shape: 'logo-shaped',
        hasContourCut: true,
        complexity: 'medium',
        weatherproof: true,
        elements: [
          {
            id: 'logo_shape',
            type: 'image',
            x: 5,
            y: 5,
            width: 40,
            height: 40,
            rotation: 0,
            opacity: 1,
            layer: 1,
            locked: false,
            visible: true,
            data: {
              src: '/placeholder-company-logo.svg',
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
          author: 'Poliprint Sticker Team',
          description: 'Контурная вырубка логотипа для брендинга',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 156,
          rating: 4.7
        }
      },
      {
        id: 'st_warning_001',
        name: 'Попереджувальна наклейка',
        category: 'stickers',
        subcategory: 'safety',
        productType: 'stickers',
        thumbnail: '/templates/stickers/warning-safety.jpg',
        isPremium: false,
        tags: ['warning', 'safety', 'outdoor', 'durable'],
        stickerType: 'reflective',
        applicationArea: 'safety',
        cutType: 'die-cut',
        shape: 'rectangle',
        hasContourCut: false,
        complexity: 'simple',
        weatherproof: true,
        elements: [
          {
            id: 'warning_bg',
            type: 'shape',
            x: 0,
            y: 0,
            width: 80,
            height: 30,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: true,
            visible: true,
            data: {
              shape: 'rectangle',
              fill: '#ff6b35',
              stroke: '#ffffff',
              strokeWidth: 2
            }
          } as ShapeElement,
          {
            id: 'warning_text',
            type: 'text',
            x: 5,
            y: 8,
            width: 70,
            height: 14,
            rotation: 0,
            opacity: 1,
            layer: 2,
            locked: false,
            visible: true,
            data: {
              text: 'УВАГА!',
              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: 'bold',
              fontStyle: 'normal',
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: 1,
              textDecoration: 'none'
            }
          } as TextElement
        ],
        metadata: {
          author: 'Poliprint Sticker Team',
          description: 'Светоотражающая предупреждающая наклейка',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 89,
          rating: 4.9
        }
      },
      {
        id: 'st_holographic_001',
        name: 'Голографічна етикетка',
        category: 'stickers',
        subcategory: 'security',
        productType: 'stickers',
        thumbnail: '/templates/stickers/holographic-security.jpg',
        isPremium: true,
        tags: ['holographic', 'security', 'anti-counterfeit', 'premium'],
        stickerType: 'holographic',
        applicationArea: 'packaging',
        cutType: 'kiss-cut',
        shape: 'custom',
        hasContourCut: true,
        complexity: 'complex',
        weatherproof: false,
        elements: [
          {
            id: 'holo_pattern',
            type: 'shape',
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: false,
            visible: true,
            data: {
              shape: 'circle',
              fill: 'radial-gradient(circle, rgba(255,215,0,0.8), rgba(255,20,147,0.8))',
              stroke: '#silver',
              strokeWidth: 1
            }
          } as ShapeElement,
          {
            id: 'security_text',
            type: 'text',
            x: 8,
            y: 16,
            width: 24,
            height: 8,
            rotation: 0,
            opacity: 1,
            layer: 1,
            locked: false,
            visible: true,
            data: {
              text: 'ORIGINAL',
              fontFamily: 'Inter',
              fontSize: 6,
              fontWeight: 'bold',
              fontStyle: 'normal',
              color: '#000000',
              textAlign: 'center',
              lineHeight: 1,
              letterSpacing: 0.5,
              textDecoration: 'none'
            }
          } as TextElement
        ],
        metadata: {
          author: 'Poliprint Sticker Team',
          description: 'Защитная голографическая этикетка против подделок',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 45,
          rating: 4.8
        }
      }
    ];

    this.templates = mockTemplates;
    return mockTemplates;
  }

  async validateDesign(): Promise<{valid: boolean, errors: string[]}> {
    const errors: string[] = [];
    const allElements = this.getAllElements();

    // Проверка минимальных размеров элементов
    allElements.forEach(element => {
      if (element.width < 3 || element.height < 3) {
        errors.push(`Элемент "${element.id}" слишком мал для качественной печати (минимум 3мм)`);
      }
    });

    // Проверка текста для мелких наклеек
    const textElements = allElements.filter(el => el.type === 'text') as TextElement[];
    textElements.forEach(element => {
      const maxDimension = Math.max(this.stickerConfig.dimensions.width, this.stickerConfig.dimensions.height);
      const minFontSize = maxDimension < 30 ? 6 : 4;
      
      if (element.data.fontSize < minFontSize) {
        errors.push(`Размер шрифта "${element.data.fontSize}px" слишком мал для наклейки размером ${maxDimension}мм`);
      }
    });

    // Проверка контурной вырубки
    if (this.stickerConfig.cutType === 'contour-cut') {
      const complexity = this.analyzeCutComplexity();
      
      if (complexity.tooComplex) {
        errors.push('Контур вырубки слишком сложный. Упростите форму или используйте kiss-cut');
      }
      
      if (complexity.tightCorners) {
        errors.push(`Минимальный радиус поворота должен быть не менее ${this.stickerConfig.cuttingDetails.minimumCutRadius}мм`);
      }
      
      if (complexity.thinBridges) {
        errors.push(`Мостики должны быть не уже ${this.stickerConfig.cuttingDetails.bridgeWidth}мм`);
      }
    }

    // Проверка материала и применения
    const material = this.stickerConfig.stickerProperties;
    const application = this.stickerConfig.applicationArea;
    
    if (application === 'outdoor' && !material.weatherResistance) {
      errors.push('Для наружного применения требуется погодостойкий материал');
    }
    
    if (application === 'automotive' && material.adhesiveStrength === 'low') {
      errors.push('Для автомобильных наклеек требуется сильный клей');
    }
    
    if (application === 'safety' && this.stickerConfig.stickerType !== 'reflective') {
      errors.push('Предупреждающие наклейки должны быть светоотражающими');
    }

    // Проверка температурных условий
    if (application === 'automotive' || application === 'outdoor') {
      if (material.temperature.max < 80) {
        errors.push('Для наружного применения материал должен выдерживать температуру до 80°C');
      }
      if (material.temperature.min > -20) {
        errors.push('Для наружного применения материал должен работать при температуре от -20°C');
      }
    }

    // Проверка ламинации для наружного применения
    if (application === 'outdoor' && !this.stickerConfig.lamination.enabled) {
      errors.push('Для наружного применения рекомендуется ламинация');
    }

    // Проверка специальных функций
    if (this.stickerConfig.specialFeatures.qrIntegration) {
      const qrElements = allElements.filter(el => el.id.includes('qr'));
      if (qrElements.length === 0) {
        errors.push('QR-код включен, но элементы QR-кода не найдены');
      }
    }

    // Проверка переменных данных
    if (this.stickerConfig.specialFeatures.variableData) {
      const hasVariableElements = textElements.some(el => 
        el.data.text.includes('{{') || el.data.text.includes('###')
      );
      if (!hasVariableElements) {
        errors.push('Переменные данные включены, но переменные элементы не найдены');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private analyzeCutComplexity(): {
    tooComplex: boolean,
    tightCorners: boolean,
    thinBridges: boolean,
    complexity: StickerConfig['cuttingDetails']['cutComplexity']
  } {
    const cutPath = this.stickerConfig.cuttingDetails.cutPath;
    const minRadius = this.stickerConfig.cuttingDetails.minimumCutRadius;
    
    let complexity: StickerConfig['cuttingDetails']['cutComplexity'] = 'simple';
    let tightCorners = false;
    let thinBridges = false;
    let tooComplex = false;

    // Анализируем количество точек
    if (cutPath.length > 100) {
      complexity = 'very-complex';
      tooComplex = true;
    } else if (cutPath.length > 50) {
      complexity = 'complex';
    } else if (cutPath.length > 20) {
      complexity = 'medium';
    }

    // Проверяем острые углы
    for (let i = 1; i < cutPath.length - 1; i++) {
      const prev = cutPath[i - 1];
      const curr = cutPath[i];
      const next = cutPath[i + 1];
      
      const angle = this.calculateAngle(prev, curr, next);
      if (angle < 30) { // Острый угол
        tightCorners = true;
      }
    }

    return { tooComplex, tightCorners, thinBridges, complexity };
  }

  private calculateAngle(p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}): number {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    const cos = dot / (mag1 * mag2);
    return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
  }

  async calculatePrice(quantity: number): Promise<{total: number, breakdown: any}> {
    const basePrice = this.stickerConfig.basePrice;
    const pricePerUnit = this.stickerConfig.pricePerUnit;

    // Агрессивные скидки за количество для наклеек
    let quantityDiscount = 0;
    if (quantity >= 10000) quantityDiscount = 0.3;
    else if (quantity >= 5000) quantityDiscount = 0.25;
    else if (quantity >= 1000) quantityDiscount = 0.2;
    else if (quantity >= 500) quantityDiscount = 0.15;
    else if (quantity >= 250) quantityDiscount = 0.1;
    else if (quantity >= 100) quantityDiscount = 0.05;

    // Надбавки за размер
    const area = this.stickerConfig.dimensions.width * this.stickerConfig.dimensions.height / 100; // см²
    let sizeMultiplier = 1;
    if (area > 100) sizeMultiplier = 2.5; // Очень большие
    else if (area > 50) sizeMultiplier = 2.0; // Большие
    else if (area > 25) sizeMultiplier = 1.5; // Средние
    else if (area > 10) sizeMultiplier = 1.2; // Маленькие
    else if (area < 5) sizeMultiplier = 1.8; // Очень маленькие (сложнее печатать)

    // Надбавки за тип материала
    let materialMultiplier = 1;
    switch (this.stickerConfig.stickerType) {
      case 'vinyl': materialMultiplier = 1; break;
      case 'paper': materialMultiplier = 0.7; break;
      case 'transparent': materialMultiplier = 1.3; break;
      case 'holographic': materialMultiplier = 2.5; break;
      case 'reflective': materialMultiplier = 3.0; break;
      case 'removable': materialMultiplier = 1.4; break;
      case 'permanent': materialMultiplier = 1.1; break;
    }

    // Надбавки за тип вырубки
    let cuttingMultiplier = 1;
    const cutting = this.stickerConfig.cuttingDetails;
    
    switch (this.stickerConfig.cutType) {
      case 'kiss-cut': cuttingMultiplier = 1; break;
      case 'die-cut': cuttingMultiplier = 1.2; break;
      case 'contour-cut': 
        switch (cutting.cutComplexity) {
          case 'simple': cuttingMultiplier = 1.3; break;
          case 'medium': cuttingMultiplier = 1.6; break;
          case 'complex': cuttingMultiplier = 2.2; break;
          case 'very-complex': cuttingMultiplier = 3.5; break;
        }
        break;
      case 'laser-cut': cuttingMultiplier = 1.8; break;
      case 'perforation-cut': cuttingMultiplier = 1.4; break;
    }

    // Надбавки за ламинацию
    let laminationPrice = 0;
    if (this.stickerConfig.lamination.enabled) {
      const lamination = this.stickerConfig.lamination;
      laminationPrice = quantity * area * 5; // 5 грн за см²
      
      if (lamination.uvProtection) laminationPrice *= 1.3;
      if (lamination.antiScratch) laminationPrice *= 1.2;
      if (lamination.type === 'anti-graffiti') laminationPrice *= 1.8;
    }

    // Надбавки за специальные функции
    let specialFeaturesPrice = 0;
    const special = this.stickerConfig.specialFeatures;
    
    if (special.qrIntegration) specialFeaturesPrice += quantity * 2;
    if (special.variableData) specialFeaturesPrice += quantity * 5;
    if (special.securityFeatures) specialFeaturesPrice += quantity * 10;
    if (special.glow) specialFeaturesPrice += quantity * 8;
    if (special.thermal) specialFeaturesPrice += quantity * 6;
    if (special.scratch) specialFeaturesPrice += quantity * 12;

    // Надбавки за упаковку
    let packagingPrice = 0;
    const packaging = this.stickerConfig.packagingOptions;
    
    if (packaging.individual) packagingPrice += quantity * 1;
    if (packaging.transferTape) packagingPrice += quantity * 3;
    if (packaging.applicationInstructions) packagingPrice += quantity * 0.5;

    // Надбавки за weeding (удаление лишнего материала)
    let weedingPrice = 0;
    if (cutting.weedingRequired) {
      weedingPrice = quantity * area * 2; // 2 грн за см² для weeding
    }

    // Расчет итоговой цены
    const subtotal = (basePrice + (pricePerUnit * quantity)) * 
                    sizeMultiplier * materialMultiplier * cuttingMultiplier;
    const discountAmount = subtotal * quantityDiscount;
    const subtotalWithDiscount = subtotal - discountAmount;
    const total = subtotalWithDiscount + laminationPrice + specialFeaturesPrice + 
                  packagingPrice + weedingPrice;

    const breakdown = {
      basePrice,
      quantity,
      pricePerUnit,
      subtotal,
      sizeMultiplier,
      materialMultiplier,
      cuttingMultiplier,
      quantityDiscount,
      discountAmount,
      laminationPrice,
      specialFeaturesPrice,
      packagingPrice,
      weedingPrice,
      total,
      currency: 'UAH',
      details: {
        size: `${this.stickerConfig.dimensions.width}x${this.stickerConfig.dimensions.height}мм`,
        area: `${area.toFixed(1)}см²`,
        material: this.stickerConfig.stickerType,
        cutType: this.stickerConfig.cutType,
        cutComplexity: cutting.cutComplexity,
        hasLamination: this.stickerConfig.lamination.enabled,
        specialFeatures: Object.entries(special)
          .filter(([_, enabled]) => enabled)
          .map(([name, _]) => name)
      }
    };

    return { total, breakdown };
  }

  async exportDesign(format: 'pdf' | 'png' | 'jpg' | 'svg'): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Высокое разрешение для наклеек
    const dpi = Math.max(this.stickerConfig.dimensions.dpi, 300);
    const mmToPx = dpi / 25.4;
    
    canvas.width = this.stickerConfig.dimensions.width * mmToPx;
    canvas.height = this.stickerConfig.dimensions.height * mmToPx;

    // Фон (обычно прозрачный для наклеек)
    if (this.stickerConfig.stickerType !== 'transparent') {
      ctx.fillStyle = this.getStickerBackgroundColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        case 'image':
          await this.renderStickerImageElement(ctx, element as ImageElement, width, height);
          break;
        case 'shape':
          await this.renderStickerShapeElement(ctx, element as ShapeElement, width, height);
          break;
        case 'text':
          await this.renderStickerTextElement(ctx, element as TextElement, width, height);
          break;
      }

      ctx.restore();
    }

    // Добавляем контур вырубки (если экспорт в PDF)
    if (format === 'pdf' && this.stickerConfig.cutType === 'contour-cut') {
      this.drawCutPath(ctx, mmToPx);
    }

    // Применяем эффекты материала
    this.applyStickerEffects(ctx, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, `image/${format === 'jpg' ? 'jpeg' : format}`, 1.0);
    });
  }

  private getStickerBackgroundColor(): string {
    switch (this.stickerConfig.stickerType) {
      case 'paper': return '#ffffff';
      case 'vinyl': return '#ffffff';
      case 'holographic': return 'linear-gradient(45deg, #ffd700, #ff69b4)';
      case 'reflective': return '#c0c0c0';
      default: return '#ffffff';
    }
  }

  private drawCutPath(ctx: CanvasRenderingContext2D, mmToPx: number) {
    const cutPath = this.stickerConfig.cuttingDetails.cutPath;
    
    ctx.strokeStyle = '#ff0000'; // Красный для контура вырубки
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 2]);
    
    ctx.beginPath();
    cutPath.forEach((point, index) => {
      const x = point.x * mmToPx;
      const y = point.y * mmToPx;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private async renderStickerImageElement(ctx: CanvasRenderingContext2D, element: ImageElement, width: number, height: number) {
    const data = element.data;
    
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        
        // Высокое качество для наклеек
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        const sx = (data.cropX / 100) * img.width;
        const sy = (data.cropY / 100) * img.height;
        const sw = (data.cropWidth / 100) * img.width;
        const sh = (data.cropHeight / 100) * img.height;
        
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = data.src;
    });
  }

  private async renderStickerShapeElement(ctx: CanvasRenderingContext2D, element: ShapeElement, width: number, height: number) {
    const data = element.data;
    
    // Специальные эффекты для голографических наклеек
    if (this.stickerConfig.stickerType === 'holographic' && data.fill.includes('gradient')) {
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
      gradient.addColorStop(0, '#ffd700');
      gradient.addColorStop(0.5, '#ff69b4');
      gradient.addColorStop(1, '#00ffff');
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
            const x = (point.x / Math.max(...data.points!.map(p => p.x))) * width;
            const y = (point.y / Math.max(...data.points!.map(p => p.y))) * height;
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

  private async renderStickerTextElement(ctx: CanvasRenderingContext2D, element: TextElement, width: number, height: number) {
    const data = element.data;
    
    // Обработка переменных данных
    let text = data.text;
    if (this.stickerConfig.specialFeatures.variableData) {
      text = this.processVariableData(text);
    }
    
    ctx.font = `${data.fontStyle} ${data.fontWeight} ${data.fontSize}px ${data.fontFamily}`;
    ctx.fillStyle = data.color;
    ctx.textAlign = data.textAlign as CanvasTextAlign;

    // Контур для лучшей читаемости на цветных фонах
    if (this.stickerConfig.stickerType === 'holographic' || this.stickerConfig.stickerType === 'reflective') {
      ctx.strokeStyle = this.getContrastColor(data.color);
      ctx.lineWidth = 1;
      ctx.strokeText(text, width/2, height/2);
    }

    const lines = text.split('\n');
    const lineHeight = data.fontSize * data.lineHeight;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 0, index * lineHeight + data.fontSize);
    });
  }

  private processVariableData(text: string): string {
    // Замена переменных на примеры
    return text
      .replace(/\{\{(\w+)\}\}/g, (match, variable) => {
        switch (variable) {
          case 'number': return '001';
          case 'code': return 'ABC123';
          case 'date': return new Date().toLocaleDateString();
          default: return match;
        }
      })
      .replace(/###/g, '001'); // Нумерация
  }

  private getContrastColor(color: string): string {
    // Упрощенное определение контрастного цвета
    return color === '#ffffff' || color === 'white' ? '#000000' : '#ffffff';
  }

  private applyStickerEffects(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Применяем специальные эффекты в зависимости от типа наклейки
    switch (this.stickerConfig.stickerType) {
      case 'holographic':
        this.addHolographicEffect(ctx, width, height);
        break;
      case 'reflective':
        this.addReflectiveEffect(ctx, width, height);
        break;
    }

    // Эффект ламинации
    if (this.stickerConfig.lamination.enabled) {
      this.addLaminationEffect(ctx, width, height);
    }
  }

  private addHolographicEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Радужный эффект
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.1)');
    gradient.addColorStop(0.2, 'rgba(255, 165, 0, 0.1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 0, 0.1)');
    gradient.addColorStop(0.6, 'rgba(0, 255, 0, 0.1)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(128, 0, 128, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  private addReflectiveEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Металлический блеск
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(192, 192, 192, 0.2)');
    gradient.addColorStop(1, 'rgba(128, 128, 128, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  private addLaminationEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Эффект глянцевой ламинации
    const gradient = ctx.createLinearGradient(0, 0, width, height/3);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height/3);
  }

  // Специфичные методы для наклеек
  updateStickerType(type: StickerConfig['stickerType']) {
    this.stickerConfig.stickerType = type;
    
    // Применяем предустановки
    switch (type) {
      case 'vinyl':
        this.stickerConfig.stickerProperties.weatherResistance = true;
        this.stickerConfig.stickerProperties.adhesiveStrength = 'high';
        break;
      case 'paper':
        this.stickerConfig.stickerProperties.weatherResistance = false;
        this.stickerConfig.stickerProperties.adhesiveStrength = 'medium';
        break;
      case 'holographic':
        this.stickerConfig.specialFeatures.securityFeatures = true;
        break;
      case 'reflective':
        this.stickerConfig.applicationArea = 'safety';
        break;
    }
    
    this.emit('stickerTypeChanged', type);
  }

  updateCutType(cutType: StickerConfig['cutType']) {
    this.stickerConfig.cutType = cutType;
    
    // Обновляем настройки вырубки
    switch (cutType) {
      case 'contour-cut':
        this.stickerConfig.cuttingDetails.weedingRequired = true;
        break;
      case 'kiss-cut':
        this.stickerConfig.cuttingDetails.weedingRequired = false;
        break;
      case 'laser-cut':
        this.stickerConfig.cuttingDetails.minimumCutRadius = 0.5;
        break;
    }
    
    this.emit('cutTypeChanged', cutType);
  }

  updateCutPath(path: Array<{x: number, y: number}>) {
    this.stickerConfig.cuttingDetails.cutPath = path;
    
    // Автоматически определяем сложность
    const complexity = this.analyzeCutComplexity();
    this.stickerConfig.cuttingDetails.cutComplexity = complexity.complexity;
    
    this.emit('cutPathUpdated', { path, complexity: complexity.complexity });
  }

  generateCutPathFromElement(elementId: string): boolean {
    const element = this.getElement(elementId);
    if (!element) return false;

    let cutPath: Array<{x: number, y: number}> = [];

    switch (element.type) {
      case 'shape':
        cutPath = this.generateCutPathFromShape(element as ShapeElement);
        break;
      case 'image':
        cutPath = this.generateCutPathFromImage(element as ImageElement);
        break;
      case 'text':
        cutPath = this.generateCutPathFromText(element as TextElement);
        break;
    }

    if (cutPath.length > 0) {
      this.updateCutPath(cutPath);
      return true;
    }

    return false;
  }

  private generateCutPathFromShape(element: ShapeElement): Array<{x: number, y: number}> {
    const data = element.data;
    const path: Array<{x: number, y: number}> = [];

    switch (data.shape) {
      case 'rectangle':
        path.push(
          { x: element.x, y: element.y },
          { x: element.x + element.width, y: element.y },
          { x: element.x + element.width, y: element.y + element.height },
          { x: element.x, y: element.y + element.height },
          { x: element.x, y: element.y }
        );
        break;
      case 'circle':
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        const radius = Math.min(element.width, element.height) / 2;
        
        for (let i = 0; i <= 360; i += 10) {
          const angle = (i * Math.PI) / 180;
          path.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          });
        }
        break;
    }

    return path;
  }

  private generateCutPathFromImage(element: ImageElement): Array<{x: number, y: number}> {
    // Для изображений создаем прямоугольный контур
    return [
      { x: element.x, y: element.y },
      { x: element.x + element.width, y: element.y },
      { x: element.x + element.width, y: element.y + element.height },
      { x: element.x, y: element.y + element.height },
      { x: element.x, y: element.y }
    ];
  }

  private generateCutPathFromText(element: TextElement): Array<{x: number, y: number}> {
    // Для текста создаем прямоугольный контур с отступами
    const margin = 2;
    return [
      { x: element.x - margin, y: element.y - margin },
      { x: element.x + element.width + margin, y: element.y - margin },
      { x: element.x + element.width + margin, y: element.y + element.height + margin },
      { x: element.x - margin, y: element.y + element.height + margin },
      { x: element.x - margin, y: element.y - margin }
    ];
  }

  addQRCodeSticker(data: string, size: number = 15) {
    this.stickerConfig.specialFeatures.qrIntegration = true;

    const qrElement: ShapeElement = {
      id: 'sticker_qr_code',
      type: 'shape',
      x: this.stickerConfig.dimensions.width - size - 2,
      y: this.stickerConfig.dimensions.height - size - 2,
      width: size,
      height: size,
      rotation: 0,
      opacity: 1,
      layer: 10,
      locked: false,
      visible: true,
      data: {
        shape: 'rectangle',
        fill: '#000000',
        stroke: 'none',
        strokeWidth: 0
      }
    };

    this.addElement(qrElement);
    this.emit('qrCodeAdded', { data, size });
  }

  addVariableDataField(fieldName: string, position: {x: number, y: number}, format: string = '###') {
    this.stickerConfig.specialFeatures.variableData = true;

    const variableElement: TextElement = {
      id: `variable_${fieldName}`,
      type: 'text',
      x: position.x,
      y: position.y,
      width: 20,
      height: 8,
      rotation: 0,
      opacity: 1,
      layer: 5,
      locked: false,
      visible: true,
      data: {
        text: format,
        fontFamily: 'Inter',
        fontSize: 8,
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        textAlign: 'left',
        lineHeight: 1,
        letterSpacing: 0,
        textDecoration: 'none'
      }
    };

    this.addElement(variableElement);
    this.emit('variableDataAdded', { fieldName, format });
  }

  // Получение информации о конфигурации
  getStickerProperties(): StickerConfig['stickerProperties'] {
    return { ...this.stickerConfig.stickerProperties };
  }

  getCuttingDetails(): StickerConfig['cuttingDetails'] {
    return { ...this.stickerConfig.cuttingDetails };
  }

  getSpecialFeatures(): StickerConfig['specialFeatures'] {
    return { ...this.stickerConfig.specialFeatures };
  }

  // Рекомендации
  getMaterialRecommendations(application: StickerConfig['applicationArea']): Array<{material: string, description: string}> {
    switch (application) {
      case 'outdoor':
        return [
          { material: 'vinyl', description: 'Виниловые - погодостойкие, долговечные' },
          { material: 'reflective', description: 'Светоотражающие - для безопасности' }
        ];
      case 'automotive':
        return [
          { material: 'vinyl', description: 'Виниловые - выдерживают высокие температуры' },
          { material: 'reflective', description: 'Светоотражающие - для номерных знаков' }
        ];
      case 'packaging':
        return [
          { material: 'paper', description: 'Бумажные - экономичные для упаковки' },
          { material: 'transparent', description: 'Прозрачные - для брендинга' }
        ];
      default:
        return [
          { material: 'vinyl', description: 'Виниловые - универсальное решение' },
          { material: 'paper', description: 'Бумажные - экономичный вариант' }
        ];
    }
  }

  // Экспорт конфигурации
  exportConfig(): StickerConfig {
    return JSON.parse(JSON.stringify(this.stickerConfig));
  }

  // Импорт конфигурации
  importConfig(config: StickerConfig) {
    this.stickerConfig = config;
    this.emit('configImported', config);
  }
}