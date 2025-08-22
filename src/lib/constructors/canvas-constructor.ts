import { BaseConstructor, ProductConfig, DesignTemplate, DesignElement, TextElement, ImageElement, ShapeElement } from '../constructor-engine';

// Специфичные интерфейсы для холста
export interface CanvasConfig extends ProductConfig {
  category: 'canvas';
  canvasType: 'photo-print' | 'art-reproduction' | 'digital-art' | 'mixed-media' | 'abstract' | 'landscape';
  artworkStyle: 'photographic' | 'painterly' | 'sketchy' | 'watercolor' | 'oil-painting' | 'vector' | 'vintage';
  frameOptions: {
    type: 'gallery-wrap' | 'traditional-frame' | 'floating-frame' | 'none';
    frameColor?: string;
    frameWidth?: number;
    matting?: {
      enabled: boolean;
      color: string;
      width: number;
    };
  };
  canvasProperties: {
    texture: 'smooth' | 'fine-art' | 'canvas-textured' | 'watercolor-paper';
    edgeTreatment: 'gallery-wrap' | 'mirror' | 'white' | 'black' | 'continue-image';
    stretcherDepth: number; // в дюймах
    coating: 'matte' | 'satin' | 'gloss' | 'none';
  };
  imageEnhancements: {
    colorCorrection: {
      enabled: boolean;
      brightness: number; // -100 to 100
      contrast: number; // -100 to 100
      saturation: number; // -100 to 100
      vibrance: number; // -100 to 100
      highlights: number; // -100 to 100
      shadows: number; // -100 to 100
      whites: number; // -100 to 100
      blacks: number; // -100 to 100
    };
    filters: {
      enabled: boolean;
      type: 'vintage' | 'black-white' | 'sepia' | 'cross-process' | 'high-contrast' | 'soft-focus' | 'sharp' | 'none';
      intensity: number; // 0 to 100
    };
    artistic: {
      enabled: boolean;
      effect: 'oil-painting' | 'watercolor' | 'pencil-sketch' | 'charcoal' | 'impressionist' | 'pop-art' | 'none';
      strength: number; // 0 to 100
    };
    upscaling: {
      enabled: boolean;
      algorithm: 'ai-enhance' | 'bicubic' | 'lanczos';
      targetDPI: number;
    };
  };
  displaySettings: {
    hangingHardware: 'sawtooth' | 'wire' | 'keyhole' | 'brackets' | 'none';
    wallMockup: boolean;
    roomVisualization: {
      enabled: boolean;
      roomType: 'living-room' | 'bedroom' | 'office' | 'gallery' | 'custom';
      lightingType: 'natural' | 'warm' | 'cool' | 'gallery';
    };
  };
}

export interface CanvasTemplate extends DesignTemplate {
  productType: 'canvas';
  canvasType: CanvasConfig['canvasType'];
  artworkStyle: CanvasConfig['artworkStyle'];
  aspectRatio: string; // '16:9', '4:3', '1:1', '3:4', '2:3'
  recommendedSize: string;
  colorProfile: 'rgb' | 'cmyk' | 'wide-gamut';
  hasArtisticEffects: boolean;
  isHighResolution: boolean;
}

export class CanvasConstructor extends BaseConstructor {
  private canvasConfig: CanvasConfig;
  private templates: CanvasTemplate[] = [];
  private imageProcessor: any; // Для обработки изображений

  constructor(productConfig: ProductConfig, templateId?: string) {
    super(productConfig, templateId);
    this.canvasConfig = productConfig as CanvasConfig;
    this.initializeCanvasDefaults();
    
    if (templateId) {
      this.loadTemplate(templateId);
    }
  }

  private initializeCanvasDefaults() {
    // Стандартные размеры холста
    const standardSizes = {
      'small': { width: 40, height: 30 }, // 16x12 дюймов
      'medium': { width: 60, height: 40 }, // 24x16 дюймов
      'large': { width: 75, height: 50 }, // 30x20 дюймов
      'extra-large': { width: 100, height: 75 }, // 40x30 дюймов
      'custom': { width: 60, height: 40 }
    };

    if (!this.canvasConfig.dimensions) {
      this.canvasConfig.dimensions = {
        width: 60, // см
        height: 40,
        unit: 'cm',
        dpi: 300
      };
    }

    // Печатная область (весь холст)
    if (!this.canvasConfig.printArea) {
      this.canvasConfig.printArea = {
        x: 0,
        y: 0,
        width: this.canvasConfig.dimensions.width,
        height: this.canvasConfig.dimensions.height
      };
    }

    // Блид для холста минимален
    if (!this.canvasConfig.bleedArea) {
      this.canvasConfig.bleedArea = {
        top: 1,
        right: 1,
        bottom: 1,
        left: 1
      };
    }

    // Инициализация типа холста
    if (!this.canvasConfig.canvasType) {
      this.canvasConfig.canvasType = 'photo-print';
    }

    if (!this.canvasConfig.artworkStyle) {
      this.canvasConfig.artworkStyle = 'photographic';
    }

    // Настройки рамы
    if (!this.canvasConfig.frameOptions) {
      this.canvasConfig.frameOptions = {
        type: 'gallery-wrap',
        frameColor: '#8B4513',
        frameWidth: 3,
        matting: {
          enabled: false,
          color: '#ffffff',
          width: 5
        }
      };
    }

    // Свойства холста
    if (!this.canvasConfig.canvasProperties) {
      this.canvasConfig.canvasProperties = {
        texture: 'fine-art',
        edgeTreatment: 'gallery-wrap',
        stretcherDepth: 1.5,
        coating: 'satin'
      };
    }

    // Улучшения изображения
    if (!this.canvasConfig.imageEnhancements) {
      this.canvasConfig.imageEnhancements = {
        colorCorrection: {
          enabled: false,
          brightness: 0,
          contrast: 0,
          saturation: 0,
          vibrance: 0,
          highlights: 0,
          shadows: 0,
          whites: 0,
          blacks: 0
        },
        filters: {
          enabled: false,
          type: 'none',
          intensity: 50
        },
        artistic: {
          enabled: false,
          effect: 'none',
          strength: 50
        },
        upscaling: {
          enabled: false,
          algorithm: 'ai-enhance',
          targetDPI: 300
        }
      };
    }

    // Настройки отображения
    if (!this.canvasConfig.displaySettings) {
      this.canvasConfig.displaySettings = {
        hangingHardware: 'wire',
        wallMockup: true,
        roomVisualization: {
          enabled: false,
          roomType: 'living-room',
          lightingType: 'natural'
        }
      };
    }
  }

  async getAvailableTemplates(): Promise<DesignTemplate[]> {
    const mockTemplates: CanvasTemplate[] = [
      {
        id: 'cv_photo_001',
        name: 'Фотопринт високої якості',
        category: 'canvas',
        subcategory: 'photography',
        productType: 'canvas',
        thumbnail: '/templates/canvas/photo-print.jpg',
        isPremium: false,
        tags: ['photography', 'high-quality', 'portrait', 'landscape'],
        canvasType: 'photo-print',
        artworkStyle: 'photographic',
        aspectRatio: '3:2',
        recommendedSize: '60x40cm',
        colorProfile: 'rgb',
        hasArtisticEffects: false,
        isHighResolution: true,
        elements: [
          {
            id: 'main_photo',
            type: 'image',
            x: 0,
            y: 0,
            width: 60,
            height: 40,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: false,
            visible: true,
            data: {
              src: '/placeholder-photo.jpg',
              alt: 'Main Photo',
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
          author: 'Poliprint Canvas Team',
          description: 'Профессиональный фотопринт на холсте',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 89,
          rating: 4.8
        }
      },
      {
        id: 'cv_art_001',
        name: 'Художня репродукція',
        category: 'canvas',
        subcategory: 'fine-art',
        productType: 'canvas',
        thumbnail: '/templates/canvas/art-reproduction.jpg',
        isPremium: true,
        tags: ['fine-art', 'painting', 'reproduction', 'museum-quality'],
        canvasType: 'art-reproduction',
        artworkStyle: 'painterly',
        aspectRatio: '4:3',
        recommendedSize: '75x50cm',
        colorProfile: 'wide-gamut',
        hasArtisticEffects: true,
        isHighResolution: true,
        elements: [
          {
            id: 'art_background',
            type: 'shape',
            x: 0,
            y: 0,
            width: 75,
            height: 50,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: true,
            visible: true,
            data: {
              shape: 'rectangle',
              fill: '#f8f6f0',
              stroke: 'none',
              strokeWidth: 0
            }
          } as ShapeElement,
          {
            id: 'artwork_main',
            type: 'image',
            x: 5,
            y: 5,
            width: 65,
            height: 40,
            rotation: 0,
            opacity: 1,
            layer: 1,
            locked: false,
            visible: true,
            data: {
              src: '/placeholder-artwork.jpg',
              alt: 'Fine Art Reproduction',
              brightness: 1,
              contrast: 1.05,
              saturation: 1.1,
              blur: 0,
              cropX: 0,
              cropY: 0,
              cropWidth: 100,
              cropHeight: 100
            }
          } as ImageElement
        ],
        metadata: {
          author: 'Poliprint Canvas Team',
          description: 'Музейное качество репродукции произведений искусства',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 45,
          rating: 4.9
        }
      },
      {
        id: 'cv_abstract_001',
        name: 'Абстрактне мистецтво',
        category: 'canvas',
        subcategory: 'modern-art',
        productType: 'canvas',
        thumbnail: '/templates/canvas/abstract-modern.jpg',
        isPremium: true,
        tags: ['abstract', 'modern', 'contemporary', 'geometric'],
        canvasType: 'abstract',
        artworkStyle: 'vector',
        aspectRatio: '1:1',
        recommendedSize: '60x60cm',
        colorProfile: 'rgb',
        hasArtisticEffects: true,
        isHighResolution: true,
        elements: [
          {
            id: 'abstract_bg',
            type: 'shape',
            x: 0,
            y: 0,
            width: 60,
            height: 60,
            rotation: 0,
            opacity: 1,
            layer: 0,
            locked: false,
            visible: true,
            data: {
              shape: 'rectangle',
              fill: 'linear-gradient(45deg, #667eea, #764ba2)',
              stroke: 'none',
              strokeWidth: 0
            }
          } as ShapeElement
        ],
        metadata: {
          author: 'Poliprint Canvas Team',
          description: 'Современное абстрактное искусство для интерьера',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 67,
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

    // Проверка разрешения изображений
    const imageElements = allElements.filter(el => el.type === 'image') as ImageElement[];
    
    for (const element of imageElements) {
      // Проверка размера изображения относительно холста
      const imageSize = element.width * element.height; // в см²
      const canvasSize = this.canvasConfig.dimensions.width * this.canvasConfig.dimensions.height;
      
      if (imageSize > canvasSize * 0.8) { // Изображение занимает более 80% холста
        const requiredDPI = this.calculateRequiredDPI(element);
        if (requiredDPI > 300) {
          errors.push(`Изображение "${element.id}" может быть пикселизированным при печати. Рекомендуется изображение с разрешением не менее ${requiredDPI} DPI`);
        }
      }
    }

    // Проверка цветового профиля
    if (this.canvasConfig.canvasType === 'art-reproduction') {
      if (!this.hasWideGamutSupport()) {
        errors.push('Для качественной репродукции искусства рекомендуется использовать изображения в широком цветовом охвате');
      }
    }

    // Проверка соответствия размера и разрешения
    const minDPI = this.getMinimumDPI();
    if (this.canvasConfig.dimensions.dpi < minDPI) {
      errors.push(`Для холста размером ${this.canvasConfig.dimensions.width}x${this.canvasConfig.dimensions.height}см требуется разрешение не менее ${minDPI} DPI`);
    }

    // Проверка совместимости эффектов
    if (this.canvasConfig.imageEnhancements.artistic.enabled && 
        this.canvasConfig.canvasType === 'photo-print') {
      if (this.canvasConfig.imageEnhancements.artistic.effect === 'oil-painting' && 
          this.canvasConfig.imageEnhancements.artistic.strength > 70) {
        errors.push('Высокая интенсивность эффекта масляной живописи может исказить фотографию');
      }
    }

    // Проверка обрезки для gallery-wrap
    if (this.canvasConfig.canvasProperties.edgeTreatment === 'gallery-wrap') {
      imageElements.forEach(element => {
        if (element.x === 0 || element.y === 0 || 
            element.x + element.width === this.canvasConfig.dimensions.width ||
            element.y + element.height === this.canvasConfig.dimensions.height) {
          errors.push(`Изображение "${element.id}" касается краев холста. При gallery-wrap часть изображения будет загнута на боковые стороны`);
        }
      });
    }

    // Проверка размера для художественных эффектов
    if (this.canvasConfig.imageEnhancements.upscaling.enabled) {
      const targetDPI = this.canvasConfig.imageEnhancements.upscaling.targetDPI;
      if (targetDPI > 600) {
        errors.push('Увеличение разрешения более 600 DPI может привести к артефактам');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private calculateRequiredDPI(element: ImageElement): number {
    // Упрощенный расчет требуемого DPI на основе размера
    const elementSizeCm = Math.sqrt(element.width * element.height);
    if (elementSizeCm > 50) return 350;
    if (elementSizeCm > 30) return 300;
    if (elementSizeCm > 20) return 250;
    return 200;
  }

  private hasWideGamutSupport(): boolean {
    // В реальном приложении проверка цветового профиля изображения
    return true;
  }

  private getMinimumDPI(): number {
    const maxDimension = Math.max(this.canvasConfig.dimensions.width, this.canvasConfig.dimensions.height);
    if (maxDimension > 100) return 200; // Очень большие холсты
    if (maxDimension > 60) return 250;  // Большие холсты
    if (maxDimension > 40) return 300;  // Средние холсты
    return 350; // Маленькие холсты требуют высокого разрешения
  }

  async calculatePrice(quantity: number): Promise<{total: number, breakdown: any}> {
    const basePrice = this.canvasConfig.basePrice;
    const pricePerUnit = this.canvasConfig.pricePerUnit;

    // Скидки за количество (более скромные для холста)
    let quantityDiscount = 0;
    if (quantity >= 10) quantityDiscount = 0.1;
    else if (quantity >= 5) quantityDiscount = 0.05;
    else if (quantity >= 3) quantityDiscount = 0.03;

    // Надбавки за размер (нелинейные для холста)
    const area = this.canvasConfig.dimensions.width * this.canvasConfig.dimensions.height / 100; // в дм²
    let sizeMultiplier = 1;
    if (area > 100) sizeMultiplier = 3.5; // Очень большие
    else if (area > 50) sizeMultiplier = 2.5; // Большие
    else if (area > 25) sizeMultiplier = 1.8; // Средние
    else if (area > 10) sizeMultiplier = 1.3; // Маленькие

    // Надбавки за тип холста
    let canvasTypeMultiplier = 1;
    switch (this.canvasConfig.canvasType) {
      case 'art-reproduction': canvasTypeMultiplier = 1.5; break;
      case 'digital-art': canvasTypeMultiplier = 1.3; break;
      case 'mixed-media': canvasTypeMultiplier = 1.4; break;
      case 'photo-print': canvasTypeMultiplier = 1.0; break;
    }

    // Надбавки за текстуру и покрытие
    let materialMultiplier = 1;
    switch (this.canvasConfig.canvasProperties.texture) {
      case 'fine-art': materialMultiplier += 0.3; break;
      case 'watercolor-paper': materialMultiplier += 0.4; break;
      case 'canvas-textured': materialMultiplier += 0.2; break;
    }

    switch (this.canvasConfig.canvasProperties.coating) {
      case 'gloss': materialMultiplier += 0.1; break;
      case 'satin': materialMultiplier += 0.05; break;
    }

    // Надбавки за раму
    let framePrice = 0;
    const frameOptions = this.canvasConfig.frameOptions;
    if (frameOptions.type !== 'none' && frameOptions.type !== 'gallery-wrap') {
      const perimeter = 2 * (this.canvasConfig.dimensions.width + this.canvasConfig.dimensions.height);
      switch (frameOptions.type) {
        case 'traditional-frame':
          framePrice = quantity * perimeter * 8; // 8 грн за см периметра
          break;
        case 'floating-frame':
          framePrice = quantity * perimeter * 12;
          break;
      }
      
      if (frameOptions.matting?.enabled) {
        framePrice += quantity * area * 15; // 15 грн за дм² паспарту
      }
    }

    // Надбавки за обработку изображения
    let processingPrice = 0;
    const enhancements = this.canvasConfig.imageEnhancements;
    
    if (enhancements.colorCorrection.enabled) {
      processingPrice += quantity * 50; // Цветокоррекция
    }
    
    if (enhancements.filters.enabled && enhancements.filters.type !== 'none') {
      processingPrice += quantity * 30; // Фильтры
    }
    
    if (enhancements.artistic.enabled && enhancements.artistic.effect !== 'none') {
      processingPrice += quantity * 100; // Художественные эффекты
    }
    
    if (enhancements.upscaling.enabled) {
      processingPrice += quantity * 150; // AI-апскейлинг
    }

    // Глубина подрамника
    const depthMultiplier = this.canvasConfig.canvasProperties.stretcherDepth > 1.5 ? 1.2 : 1;

    // Расчет итоговой цены
    const subtotal = (basePrice + (pricePerUnit * quantity)) * 
                    sizeMultiplier * canvasTypeMultiplier * materialMultiplier * depthMultiplier;
    const discountAmount = subtotal * quantityDiscount;
    const subtotalWithDiscount = subtotal - discountAmount;
    const total = subtotalWithDiscount + framePrice + processingPrice;

    const breakdown = {
      basePrice,
      quantity,
      pricePerUnit,
      subtotal,
      sizeMultiplier,
      canvasTypeMultiplier,
      materialMultiplier,
      depthMultiplier,
      quantityDiscount,
      discountAmount,
      framePrice,
      processingPrice,
      total,
      currency: 'UAH',
      details: {
        size: `${this.canvasConfig.dimensions.width}x${this.canvasConfig.dimensions.height}см`,
        area: `${area.toFixed(1)}дм²`,
        canvasType: this.canvasConfig.canvasType,
        texture: this.canvasConfig.canvasProperties.texture,
        frameType: frameOptions.type,
        depthCm: this.canvasConfig.canvasProperties.stretcherDepth * 2.54,
        enhancements: Object.entries(enhancements)
          .filter(([_, config]: [string, any]) => config.enabled)
          .map(([name, _]) => name)
      }
    };

    return { total, breakdown };
  }

  async exportDesign(format: 'pdf' | 'png' | 'jpg' | 'svg'): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Высокое разрешение для холста
    const dpi = Math.max(this.canvasConfig.dimensions.dpi, 300);
    const mmToPx = dpi / 25.4;
    
    canvas.width = this.canvasConfig.dimensions.width * mmToPx;
    canvas.height = this.canvasConfig.dimensions.height * mmToPx;

    // Применяем улучшения изображения
    if (this.canvasConfig.imageEnhancements.colorCorrection.enabled) {
      this.applyColorCorrection(ctx);
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
          await this.renderEnhancedImageElement(ctx, element as ImageElement, width, height);
          break;
        case 'shape':
          await this.renderShapeElement(ctx, element as ShapeElement, width, height);
          break;
        case 'text':
          await this.renderTextElement(ctx, element as TextElement, width, height);
          break;
      }

      ctx.restore();
    }

    // Применяем финальные эффекты
    if (this.canvasConfig.imageEnhancements.filters.enabled) {
      this.applyFilters(ctx, canvas.width, canvas.height);
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, `image/${format === 'jpg' ? 'jpeg' : format}`, 1.0); // Максимальное качество
    });
  }

  private applyColorCorrection(ctx: CanvasRenderingContext2D) {
    const corrections = this.canvasConfig.imageEnhancements.colorCorrection;
    
    // Применяем фильтры CSS для цветокоррекции
    let filter = '';
    
    if (corrections.brightness !== 0) {
      filter += `brightness(${100 + corrections.brightness}%) `;
    }
    if (corrections.contrast !== 0) {
      filter += `contrast(${100 + corrections.contrast}%) `;
    }
    if (corrections.saturation !== 0) {
      filter += `saturate(${100 + corrections.saturation}%) `;
    }
    
    ctx.filter = filter.trim() || 'none';
  }

  private async renderEnhancedImageElement(ctx: CanvasRenderingContext2D, element: ImageElement, width: number, height: number) {
    const data = element.data;
    
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Сохраняем текущее состояние
        ctx.save();
        
        // Применяем улучшения изображения
        const enhancements = this.canvasConfig.imageEnhancements;
        
        if (enhancements.filters.enabled && enhancements.filters.type !== 'none') {
          ctx.filter = this.getFilterCSS(enhancements.filters.type, enhancements.filters.intensity);
        }
        
        // Применяем обрезку
        const sx = (data.cropX / 100) * img.width;
        const sy = (data.cropY / 100) * img.height;
        const sw = (data.cropWidth / 100) * img.width;
        const sh = (data.cropHeight / 100) * img.height;
        
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
        
        // Применяем художественные эффекты поверх изображения
        if (enhancements.artistic.enabled && enhancements.artistic.effect !== 'none') {
          this.applyArtisticEffect(ctx, width, height, enhancements.artistic);
        }
        
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = data.src;
    });
  }

  private getFilterCSS(filterType: string, intensity: number): string {
    const normalizedIntensity = intensity / 100;
    
    switch (filterType) {
      case 'vintage':
        return `sepia(${normalizedIntensity * 0.8}) contrast(${1 + normalizedIntensity * 0.2}) brightness(${1 + normalizedIntensity * 0.1})`;
      case 'black-white':
        return `grayscale(${normalizedIntensity})`;
      case 'sepia':
        return `sepia(${normalizedIntensity})`;
      case 'high-contrast':
        return `contrast(${1 + normalizedIntensity * 0.5})`;
      case 'soft-focus':
        return `blur(${normalizedIntensity * 2}px)`;
      case 'sharp':
        return `contrast(${1 + normalizedIntensity * 0.3}) brightness(${1 + normalizedIntensity * 0.05})`;
      default:
        return 'none';
    }
  }

  private applyArtisticEffect(ctx: CanvasRenderingContext2D, width: number, height: number, artistic: any) {
    const strength = artistic.strength / 100;
    
    switch (artistic.effect) {
      case 'oil-painting':
        // Эмуляция масляной живописи через размытие и повышение контраста
        ctx.filter = `blur(${strength * 2}px) contrast(${1 + strength * 0.3})`;
        break;
      case 'watercolor':
        // Эмуляция акварели
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.1 + strength * 0.2;
        break;
      case 'pencil-sketch':
        // Эмуляция карандашного наброска
        ctx.filter = `grayscale(${strength}) contrast(${1 + strength * 0.5})`;
        break;
      case 'impressionist':
        // Импрессионистский эффект
        ctx.filter = `blur(${strength * 1.5}px) saturate(${1 + strength * 0.5})`;
        break;
    }
  }

  private applyFilters(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Применение финальных фильтров ко всему холсту
    const filters = this.canvasConfig.imageEnhancements.filters;
    if (filters.enabled && filters.type !== 'none') {
      ctx.filter = this.getFilterCSS(filters.type, filters.intensity);
      // Перерисовка с фильтром применяется автоматически
    }
  }

  private async renderShapeElement(ctx: CanvasRenderingContext2D, element: ShapeElement, width: number, height: number) {
    const data = element.data;
    
    // Поддержка градиентов для художественных эффектов
    if (data.fill.includes('gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
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

  private async renderTextElement(ctx: CanvasRenderingContext2D, element: TextElement, width: number, height: number) {
    const data = element.data;
    
    ctx.font = `${data.fontStyle} ${data.fontWeight} ${data.fontSize}px ${data.fontFamily}`;
    ctx.fillStyle = data.color;
    ctx.textAlign = data.textAlign as CanvasTextAlign;

    const lines = data.text.split('\n');
    const lineHeight = data.fontSize * data.lineHeight;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 0, index * lineHeight + data.fontSize);
    });
  }

  // Специфичные методы для холста
  updateCanvasType(type: CanvasConfig['canvasType']) {
    this.canvasConfig.canvasType = type;
    
    // Применяем предустановки в зависимости от типа
    switch (type) {
      case 'photo-print':
        this.canvasConfig.artworkStyle = 'photographic';
        this.canvasConfig.canvasProperties.texture = 'fine-art';
        break;
      case 'art-reproduction':
        this.canvasConfig.artworkStyle = 'painterly';
        this.canvasConfig.canvasProperties.texture = 'canvas-textured';
        break;
      case 'digital-art':
        this.canvasConfig.artworkStyle = 'vector';
        this.canvasConfig.canvasProperties.texture = 'smooth';
        break;
    }
    
    this.emit('canvasTypeChanged', type);
  }

  updateFrameOptions(options: Partial<CanvasConfig['frameOptions']>) {
    this.canvasConfig.frameOptions = { ...this.canvasConfig.frameOptions, ...options };
    this.emit('frameOptionsUpdated', this.canvasConfig.frameOptions);
  }

  updateCanvasProperties(properties: Partial<CanvasConfig['canvasProperties']>) {
    this.canvasConfig.canvasProperties = { ...this.canvasConfig.canvasProperties, ...properties };
    this.emit('canvasPropertiesUpdated', this.canvasConfig.canvasProperties);
  }

  updateImageEnhancements(enhancements: Partial<CanvasConfig['imageEnhancements']>) {
    this.canvasConfig.imageEnhancements = { 
      ...this.canvasConfig.imageEnhancements, 
      ...enhancements 
    };
    this.emit('imageEnhancementsUpdated', this.canvasConfig.imageEnhancements);
  }

  updateColorCorrection(corrections: Partial<CanvasConfig['imageEnhancements']['colorCorrection']>) {
    this.canvasConfig.imageEnhancements.colorCorrection = {
      ...this.canvasConfig.imageEnhancements.colorCorrection,
      ...corrections
    };
    this.emit('colorCorrectionUpdated', this.canvasConfig.imageEnhancements.colorCorrection);
  }

  applyPreset(preset: 'portrait' | 'landscape' | 'abstract' | 'vintage' | 'modern') {
    switch (preset) {
      case 'portrait':
        this.updateImageEnhancements({
          colorCorrection: {
            enabled: true,
            brightness: 5,
            contrast: 10,
            saturation: 15,
            vibrance: 20,
            highlights: -10,
            shadows: 10,
            whites: 5,
            blacks: -5
          }
        });
        break;
      case 'landscape':
        this.updateImageEnhancements({
          colorCorrection: {
            enabled: true,
            brightness: 0,
            contrast: 15,
            saturation: 25,
            vibrance: 30,
            highlights: -15,
            shadows: 15,
            whites: 0,
            blacks: -10
          }
        });
        break;
      case 'vintage':
        this.updateImageEnhancements({
          filters: {
            enabled: true,
            type: 'vintage',
            intensity: 60
          },
          colorCorrection: {
            enabled: true,
            brightness: -5,
            contrast: 20,
            saturation: -20,
            vibrance: -10,
            highlights: -20,
            shadows: 20,
            whites: -10,
            blacks: 10
          }
        });
        break;
    }
    
    this.emit('presetApplied', preset);
  }

  // Получение предпросмотра для разных комнат
  generateRoomVisualization(roomType: CanvasConfig['displaySettings']['roomVisualization']['roomType']) {
    this.canvasConfig.displaySettings.roomVisualization = {
      enabled: true,
      roomType,
      lightingType: 'natural'
    };
    
    this.emit('roomVisualizationGenerated', roomType);
  }

  // Рекомендации по размеру для комнаты
  getRecommendedSizes(roomType: string): Array<{size: string, description: string}> {
    switch (roomType) {
      case 'living-room':
        return [
          { size: '80x60cm', description: 'Стандартный размер для гостиной' },
          { size: '100x75cm', description: 'Большой холст для акцентной стены' },
          { size: '120x80cm', description: 'Доминирующий элемент интерьера' }
        ];
      case 'bedroom':
        return [
          { size: '60x40cm', description: 'Уютный размер для спальни' },
          { size: '80x60cm', description: 'Средний размер над кроватью' }
        ];
      case 'office':
        return [
          { size: '40x30cm', description: 'Компактный для рабочего стола' },
          { size: '60x40cm', description: 'Стандартный для офиса' }
        ];
      default:
        return [
          { size: '60x40cm', description: 'Универсальный размер' }
        ];
    }
  }

  // Получение информации о конфигурации
  getCanvasProperties(): CanvasConfig['canvasProperties'] {
    return { ...this.canvasConfig.canvasProperties };
  }

  getFrameOptions(): CanvasConfig['frameOptions'] {
    return { ...this.canvasConfig.frameOptions };
  }

  getImageEnhancements(): CanvasConfig['imageEnhancements'] {
    return { ...this.canvasConfig.imageEnhancements };
  }

  getDisplaySettings(): CanvasConfig['displaySettings'] {
    return { ...this.canvasConfig.displaySettings };
  }

  // Экспорт конфигурации
  exportConfig(): CanvasConfig {
    return JSON.parse(JSON.stringify(this.canvasConfig));
  }

  // Импорт конфигурации
  importConfig(config: CanvasConfig) {
    this.canvasConfig = config;
    this.emit('configImported', config);
  }
}