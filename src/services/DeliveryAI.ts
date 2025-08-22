"use client";

import { type DeliveryMethod, type DeliveryDetails, type Order } from '@/contexts/OrderContext';
import { type CartProject } from '@/contexts/ProjectManagerContext';

// 🌍 Географические данные Украины
export interface UkrainianCity {
  ref: string;           // UUID для API НП
  name: string;          // Название города
  nameUA: string;        // Название украинском
  region: string;        // Область
  regionUA: string;      // Область украинском
  population: number;    // Население
  coordinates: {
    lat: number;
    lng: number;
  };
  
  // Логистические характеристики
  logistics: {
    isRegionalCenter: boolean;
    hasNovaPoshtaHub: boolean;
    averageDeliveryDays: number;
    courierAvailable: boolean;
    warehouseCount: number;
    lastMileQuality: 'excellent' | 'good' | 'average' | 'poor';
  };
}

// 📦 Характеристики упаковки
export interface PackagingDetails {
  dimensions: {
    width: number;   // см
    height: number;  // см
    depth: number;   // см
    weight: number;  // кг
  };
  
  // Типы товаров
  contentTypes: Array<{
    type: 'canvas' | 'acrylic' | 'paper' | 'metal' | 'textile';
    quantity: number;
    isFragile: boolean;
    requiresSpecialHandling: boolean;
    value: number; // для страхования
  }>;
  
  // Требования к упаковке
  packagingRequirements: {
    reinforcement: 'none' | 'light' | 'medium' | 'heavy';
    fragileStickers: boolean;
    moistureProtection: boolean;
    temperatureControl: boolean;
  };
  
  // Расчетные параметры
  volumetricWeight: number;
  shippingWeight: number; // MAX(физический, объемный)
  packagingCost: number;
}

// 🚚 Варианты доставки с AI-анализом
export interface DeliveryOption {
  method: DeliveryMethod;
  provider: 'nova-poshta' | 'ukrposhta' | 'justin' | 'meest' | 'pickup';
  
  // Финансовые параметры
  baseCost: number;
  insuranceCost: number;
  packagingCost: number;
  handlingFee: number;
  totalCost: number;
  
  // Временные параметры
  estimatedDays: {
    min: number;
    max: number;
    most_likely: number;
  };
  deliveryDate: {
    earliest: Date;
    latest: Date;
    expected: Date;
  };
  
  // AI предсказания
  predictions: {
    onTimeDeliveryProbability: number;      // 0-100%
    delayRisk: 'low' | 'medium' | 'high';
    qualityRisk: 'low' | 'medium' | 'high';
    weatherImpact: number;                   // 0-100%
    seasonalFactor: number;                  // множитель для времени доставки
  };
  
  // Пользовательский опыт
  convenience: {
    trackingQuality: 'excellent' | 'good' | 'average' | 'poor';
    customerService: number; // 0-5 рейтинг
    deliveryFlexibility: number; // 0-100%
    returnPolicy: 'easy' | 'moderate' | 'difficult';
  };
  
  // Ограничения и особенности
  restrictions: {
    maxWeight: number;
    maxDimensions: { width: number; height: number; depth: number };
    prohibitedItems: string[];
    specialRequirements: string[];
  };
  
  // Детали локации
  deliveryLocation?: {
    type: 'warehouse' | 'postoffice' | 'postbox' | 'courier' | 'pickup';
    address: string;
    workingHours: string;
    coordinates?: { lat: number; lng: number };
    accessibilityFeatures: string[];
    distanceFromUser: number; // км
  };
  
  // Экологические факторы
  sustainability: {
    carbonFootprint: number;        // кг CO2
    packagingRecyclable: boolean;
    routeOptimization: number;      // 0-100%
  };
}

// 🧠 AI-анализатор доставки
export interface DeliveryAnalysis {
  // Рекомендованная опция
  recommended: DeliveryOption;
  recommendationReasons: string[];
  confidenceScore: number; // 0-100%
  
  // Альтернативы
  alternatives: DeliveryOption[];
  
  // Анализ рисков
  riskAnalysis: {
    weatherRisks: Array<{
      type: 'rain' | 'snow' | 'storm' | 'heat';
      probability: number;
      impact: 'low' | 'medium' | 'high';
      mitigation: string;
    }>;
    
    logisticsRisks: Array<{
      type: 'capacity' | 'strike' | 'holiday' | 'fuel' | 'border';
      probability: number;
      impact: 'low' | 'medium' | 'high';
      affectedRegions: string[];
    }>;
    
    packageRisks: Array<{
      type: 'damage' | 'loss' | 'theft' | 'delay';
      probability: number;
      preventiveMeasures: string[];
    }>;
  };
  
  // Оптимизационные предложения
  optimizations: Array<{
    type: 'cost' | 'speed' | 'reliability' | 'sustainability';
    suggestion: string;
    potentialSaving: number; // в грн или днях
    implementationComplexity: 'easy' | 'medium' | 'hard';
  }>;
}

// 📊 Исторические данные для ML
export interface DeliveryHistoricalData {
  route: string;        // city1-city2-method
  averageTime: number;  // дни
  onTimeRate: number;   // %
  damageRate: number;   // %
  customerSatisfaction: number; // 1-5
  seasonalVariations: Record<string, number>;
  weatherCorrelations: Record<string, number>;
  lastUpdated: Date;
}

// 🏭 Главный класс DeliveryAI
export class DeliveryAI {
  private cities: UkrainianCity[] = [];
  private historicalData: Map<string, DeliveryHistoricalData> = new Map();
  private weatherData: any = null; // В реальности - интеграция с погодным API
  private novaPoshtaAPI: NovaPoshtaAPIClient;
  
  constructor() {
    this.novaPoshtaAPI = new NovaPoshtaAPIClient();
    this.initializeCitiesData();
    this.loadHistoricalData();
  }

  // 🎯 Главный метод - анализ доставки
  public async analyzeDelivery(
    projects: CartProject[],
    destinationCity: string,
    userPreferences: {
      budget: 'low' | 'medium' | 'high';
      speed: 'low' | 'medium' | 'high';
      reliability: 'low' | 'medium' | 'high';
    }
  ): Promise<DeliveryAnalysis> {
    
    // 1. Анализируем товары и создаем упаковку
    const packaging = this.analyzePackaging(projects);
    
    // 2. Получаем все доступные опции доставки
    const deliveryOptions = await this.getDeliveryOptions(destinationCity, packaging);
    
    // 3. Применяем AI-анализ к каждой опции
    const analyzedOptions = await Promise.all(
      deliveryOptions.map(option => this.enhanceWithAI(option, destinationCity, packaging))
    );
    
    // 4. Выбираем рекомендованную опцию
    const recommended = this.selectRecommendedOption(analyzedOptions, userPreferences);
    
    // 5. Анализируем риски
    const riskAnalysis = await this.analyzeRisks(destinationCity, packaging);
    
    // 6. Генерируем оптимизации
    const optimizations = this.generateOptimizations(analyzedOptions, userPreferences);
    
    return {
      recommended,
      recommendationReasons: this.generateRecommendationReasons(recommended, analyzedOptions),
      confidenceScore: this.calculateConfidenceScore(recommended, riskAnalysis),
      alternatives: analyzedOptions.filter(opt => opt !== recommended).slice(0, 3),
      riskAnalysis,
      optimizations,
    };
  }

  // 📦 Анализ упаковки товаров
  private analyzePackaging(projects: CartProject[]): PackagingDetails {
    let totalWeight = 0;
    let maxWidth = 0, maxHeight = 0;
    let totalDepth = 0;
    let totalValue = 0;
    let hasFragile = false;
    
    const contentTypes: PackagingDetails['contentTypes'] = [];
    
    projects.forEach(project => {
      const config = project.configuration;
      const dimensions = config.dimensions;
      
      // Расчет размеров и веса
      const itemWidth = dimensions.width;
      const itemHeight = dimensions.height;
      const itemDepth = (dimensions.depth || 20) / 10; // мм в см
      
      maxWidth = Math.max(maxWidth, itemWidth);
      maxHeight = Math.max(maxHeight, itemHeight);
      totalDepth += itemDepth * config.quantity;
      
      // Вес зависит от типа продукта
      const weightPerItem = this.calculateItemWeight(config.product.type, dimensions);
      totalWeight += weightPerItem * config.quantity;
      
      totalValue += project.pricing.currentPrice;
      
      // Проверяем хрупкость
      if (['canvas', 'acrylic'].includes(config.product.type)) {
        hasFragile = true;
      }
      
      contentTypes.push({
        type: config.product.type as any,
        quantity: config.quantity,
        isFragile: ['canvas', 'acrylic'].includes(config.product.type),
        requiresSpecialHandling: config.product.type === 'acrylic',
        value: project.pricing.currentPrice,
      });
    });
    
    // Добавляем размеры упаковки (+ защитные материалы)
    const packagingPadding = hasFragile ? 5 : 2; // см со всех сторон
    const finalWidth = maxWidth + packagingPadding * 2;
    const finalHeight = maxHeight + packagingPadding * 2;
    const finalDepth = totalDepth + packagingPadding * 2;
    
    // Объемный вес (для расчета стоимости доставки)
    const volumetricWeight = (finalWidth * finalHeight * finalDepth) / 4000; // стандарт НП
    
    const packagingRequirements: PackagingDetails['packagingRequirements'] = {
      reinforcement: hasFragile ? 'heavy' : totalWeight > 5 ? 'medium' : 'light',
      fragileStickers: hasFragile,
      moistureProtection: contentTypes.some(t => t.type === 'paper'),
      temperatureControl: false,
    };
    
    return {
      dimensions: {
        width: finalWidth,
        height: finalHeight,
        depth: finalDepth,
        weight: totalWeight,
      },
      contentTypes,
      packagingRequirements,
      volumetricWeight,
      shippingWeight: Math.max(totalWeight, volumetricWeight),
      packagingCost: this.calculatePackagingCost(packagingRequirements, totalValue),
    };
  }

  // 🚚 Получение опций доставки
  private async getDeliveryOptions(destinationCity: string, packaging: PackagingDetails): Promise<DeliveryOption[]> {
    const city = this.findCity(destinationCity);
    if (!city) {
      throw new Error(`City ${destinationCity} not found`);
    }
    
    const options: DeliveryOption[] = [];
    
    // Нова Пошта - на отделение
    if (city.logistics.warehouseCount > 0) {
      const npWarehouse = await this.calculateNovaPoshtaWarehouse(city, packaging);
      options.push(npWarehouse);
    }
    
    // Нова Пошта - курьер (если доступен)
    if (city.logistics.courierAvailable) {
      const npCourier = await this.calculateNovaPoshtaCourier(city, packaging);
      options.push(npCourier);
    }
    
    // Альтернативные службы доставки
    const ukrposhta = this.calculateUkrposhta(city, packaging);
    options.push(ukrposhta);
    
    // Самовывоз (если в том же городе)
    if (this.isLocalDeliveryAvailable(city)) {
      const pickup = this.calculatePickup(city, packaging);
      options.push(pickup);
    }
    
    return options;
  }

  // 🤖 AI-улучшение опций доставки
  private async enhanceWithAI(
    option: DeliveryOption,
    destinationCity: string,
    packaging: PackagingDetails
  ): Promise<DeliveryOption> {
    
    const routeKey = `kyiv-${destinationCity}-${option.method}`;
    const historical = this.historicalData.get(routeKey);
    
    // Предсказание времени доставки на основе исторических данных
    if (historical) {
      option.estimatedDays = this.adjustTimeEstimate(option.estimatedDays, historical);
      option.predictions.onTimeDeliveryProbability = historical.onTimeRate;
    }
    
    // Анализ погодных рисков
    const weatherImpact = await this.analyzeWeatherImpact(destinationCity);
    option.predictions.weatherImpact = weatherImpact;
    
    // Сезонные факторы
    const seasonalFactor = this.calculateSeasonalFactor();
    option.predictions.seasonalFactor = seasonalFactor;
    
    // Анализ рисков повреждения
    option.predictions.qualityRisk = this.assessQualityRisk(packaging, option);
    
    // Корректируем даты доставки
    option.deliveryDate = this.calculateDeliveryDates(option.estimatedDays, seasonalFactor);
    
    return option;
  }

  // 🎯 Выбор рекомендованной опции
  private selectRecommendedOption(
    options: DeliveryOption[],
    preferences: { budget: string; speed: string; reliability: string }
  ): DeliveryOption {
    
    let bestOption = options[0];
    let bestScore = 0;
    
    options.forEach(option => {
      let score = 0;
      
      // Анализ бюджета (40% веса)
      if (preferences.budget === 'low') {
        const costRank = options.length - options.sort((a, b) => a.totalCost - b.totalCost).indexOf(option);
        score += (costRank / options.length) * 40;
      } else if (preferences.budget === 'high') {
        score += 30; // Не учитываем стоимость сильно
      }
      
      // Анализ скорости (35% веса)
      if (preferences.speed === 'high') {
        const speedRank = options.length - options.sort((a, b) => a.estimatedDays.most_likely - b.estimatedDays.most_likely).indexOf(option);
        score += (speedRank / options.length) * 35;
      }
      
      // Анализ надежности (25% веса)  
      if (preferences.reliability === 'high') {
        score += option.predictions.onTimeDeliveryProbability * 0.25;
      }
      
      // Бонусы за качество сервиса
      if (option.convenience.trackingQuality === 'excellent') score += 5;
      if (option.convenience.customerService >= 4) score += 3;
      
      if (score > bestScore) {
        bestScore = score;
        bestOption = option;
      }
    });
    
    return bestOption;
  }

  // ⚠️ Анализ рисков доставки  
  private async analyzeRisks(destinationCity: string, packaging: PackagingDetails): Promise<DeliveryAnalysis['riskAnalysis']> {
    return {
      weatherRisks: [
        {
          type: 'rain',
          probability: 30,
          impact: 'low',
          mitigation: 'Усиленная влагозащитная упаковка',
        },
      ],
      logisticsRisks: [
        {
          type: 'holiday',
          probability: this.calculateHolidayRisk(),
          impact: 'medium',
          affectedRegions: ['all'],
        },
      ],
      packageRisks: [
        {
          type: 'damage',
          probability: packaging.contentTypes.some(t => t.isFragile) ? 15 : 5,
          preventiveMeasures: ['Усиленная упаковка', 'Страхование', 'Маркировка "Хрупкое"'],
        },
      ],
    };
  }

  // 🛠️ Утилиты
  private calculateItemWeight(productType: string, dimensions: any): number {
    const volume = (dimensions.width * dimensions.height * (dimensions.depth || 20)) / 1000000; // м³
    
    const densities = {
      canvas: 800,        // кг/м³
      acrylic: 1200,      // кг/м³
      'business-cards': 900,
      poster: 80,
      banner: 500,
    };
    
    return volume * (densities[productType as keyof typeof densities] || 500);
  }

  private calculatePackagingCost(requirements: PackagingDetails['packagingRequirements'], value: number): number {
    let cost = 25; // базовая упаковка
    
    if (requirements.reinforcement === 'heavy') cost += 50;
    else if (requirements.reinforcement === 'medium') cost += 25;
    
    if (requirements.fragileStickers) cost += 10;
    if (requirements.moistureProtection) cost += 15;
    
    // Страхование 2% от стоимости
    if (value > 1000) cost += value * 0.02;
    
    return cost;
  }

  private async calculateNovaPoshtaWarehouse(city: UkrainianCity, packaging: PackagingDetails): Promise<DeliveryOption> {
    // Интеграция с реальным API Новой Почты
    const baseCost = await this.novaPoshtaAPI.calculateCost({
      citySender: 'Kiev',
      cityRecipient: city.name,
      weight: packaging.shippingWeight,
      serviceType: 'WarehouseWarehouse',
    });
    
    return {
      method: 'nova-poshta-warehouse',
      provider: 'nova-poshta',
      baseCost,
      insuranceCost: packaging.contentTypes.reduce((sum, item) => sum + item.value, 0) * 0.02,
      packagingCost: packaging.packagingCost,
      handlingFee: 0,
      totalCost: baseCost + packaging.packagingCost + (packaging.contentTypes.reduce((sum, item) => sum + item.value, 0) * 0.02),
      estimatedDays: {
        min: city.logistics.averageDeliveryDays,
        max: city.logistics.averageDeliveryDays + 1,
        most_likely: city.logistics.averageDeliveryDays,
      },
      deliveryDate: {
        earliest: new Date(),
        latest: new Date(),
        expected: new Date(),
      },
      predictions: {
        onTimeDeliveryProbability: 85,
        delayRisk: 'low',
        qualityRisk: 'low',
        weatherImpact: 10,
        seasonalFactor: 1.0,
      },
      convenience: {
        trackingQuality: 'excellent',
        customerService: 4.2,
        deliveryFlexibility: 80,
        returnPolicy: 'easy',
      },
      restrictions: {
        maxWeight: 30,
        maxDimensions: { width: 100, height: 100, depth: 100 },
        prohibitedItems: [],
        specialRequirements: [],
      },
      sustainability: {
        carbonFootprint: this.calculateCarbonFootprint(city, packaging.shippingWeight),
        packagingRecyclable: true,
        routeOptimization: 85,
      },
    };
  }

  private async calculateNovaPoshtaCourier(city: UkrainianCity, packaging: PackagingDetails): Promise<DeliveryOption> {
    const baseCost = await this.novaPoshtaAPI.calculateCost({
      citySender: 'Kiev',
      cityRecipient: city.name,
      weight: packaging.shippingWeight,
      serviceType: 'WarehouseDoors',
    });
    
    return {
      method: 'nova-poshta-courier',
      provider: 'nova-poshta',
      baseCost,
      insuranceCost: packaging.contentTypes.reduce((sum, item) => sum + item.value, 0) * 0.02,
      packagingCost: packaging.packagingCost,
      handlingFee: 0,
      totalCost: baseCost + packaging.packagingCost + (packaging.contentTypes.reduce((sum, item) => sum + item.value, 0) * 0.02),
      estimatedDays: {
        min: city.logistics.averageDeliveryDays,
        max: city.logistics.averageDeliveryDays + 2,
        most_likely: city.logistics.averageDeliveryDays + 1,
      },
      deliveryDate: {
        earliest: new Date(),
        latest: new Date(),
        expected: new Date(),
      },
      predictions: {
        onTimeDeliveryProbability: 75,
        delayRisk: 'medium',
        qualityRisk: 'low',
        weatherImpact: 25,
        seasonalFactor: 1.2,
      },
      convenience: {
        trackingQuality: 'excellent',
        customerService: 4.2,
        deliveryFlexibility: 95,
        returnPolicy: 'easy',
      },
      restrictions: {
        maxWeight: 30,
        maxDimensions: { width: 100, height: 100, depth: 100 },
        prohibitedItems: [],
        specialRequirements: [],
      },
      sustainability: {
        carbonFootprint: this.calculateCarbonFootprint(city, packaging.shippingWeight) * 1.3, // курьер менее эко
        packagingRecyclable: true,
        routeOptimization: 70,
      },
    };
  }

  private calculateUkrposhta(city: UkrainianCity, packaging: PackagingDetails): DeliveryOption {
    return {
      method: 'ukrposhta',
      provider: 'ukrposhta',
      baseCost: Math.max(35, packaging.shippingWeight * 8),
      insuranceCost: 0,
      packagingCost: packaging.packagingCost * 0.7, // дешевле упаковка
      handlingFee: 5,
      totalCost: 0,
      estimatedDays: {
        min: city.logistics.averageDeliveryDays + 2,
        max: city.logistics.averageDeliveryDays + 7,
        most_likely: city.logistics.averageDeliveryDays + 4,
      },
      deliveryDate: {
        earliest: new Date(),
        latest: new Date(),
        expected: new Date(),
      },
      predictions: {
        onTimeDeliveryProbability: 60,
        delayRisk: 'high',
        qualityRisk: 'medium',
        weatherImpact: 40,
        seasonalFactor: 1.5,
      },
      convenience: {
        trackingQuality: 'average',
        customerService: 2.8,
        deliveryFlexibility: 40,
        returnPolicy: 'difficult',
      },
      restrictions: {
        maxWeight: 20,
        maxDimensions: { width: 80, height: 80, depth: 80 },
        prohibitedItems: [],
        specialRequirements: [],
      },
      sustainability: {
        carbonFootprint: this.calculateCarbonFootprint(city, packaging.shippingWeight) * 0.8,
        packagingRecyclable: false,
        routeOptimization: 50,
      },
    };
  }

  private calculatePickup(city: UkrainianCity, packaging: PackagingDetails): DeliveryOption {
    return {
      method: 'pickup',
      provider: 'pickup',
      baseCost: 0,
      insuranceCost: 0,
      packagingCost: packaging.packagingCost * 0.5, // минимальная упаковка
      handlingFee: 0,
      totalCost: packaging.packagingCost * 0.5,
      estimatedDays: { min: 1, max: 3, most_likely: 2 },
      deliveryDate: {
        earliest: new Date(Date.now() + 24 * 60 * 60 * 1000),
        latest: new Date(Date.now() + 72 * 60 * 60 * 1000),
        expected: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
      predictions: {
        onTimeDeliveryProbability: 99,
        delayRisk: 'low',
        qualityRisk: 'low',
        weatherImpact: 0,
        seasonalFactor: 1.0,
      },
      convenience: {
        trackingQuality: 'excellent',
        customerService: 5.0,
        deliveryFlexibility: 100,
        returnPolicy: 'easy',
      },
      restrictions: {
        maxWeight: 100,
        maxDimensions: { width: 200, height: 200, depth: 200 },
        prohibitedItems: [],
        specialRequirements: [],
      },
      sustainability: {
        carbonFootprint: 0,
        packagingRecyclable: true,
        routeOptimization: 100,
      },
    };
  }

  // Заглушки для дополнительных методов
  private generateRecommendationReasons(recommended: DeliveryOption, all: DeliveryOption[]): string[] {
    return [`Найкращий баланс ціни та якості`, `Висока надійність (${recommended.predictions.onTimeDeliveryProbability}%)`];
  }

  private calculateConfidenceScore(recommended: DeliveryOption, risks: any): number {
    return 85 + Math.random() * 10; // Упрощенно
  }

  private generateOptimizations(options: DeliveryOption[], preferences: any): DeliveryAnalysis['optimizations'] {
    return [
      {
        type: 'cost',
        suggestion: 'Використовуйте самовывіз для економії',
        potentialSaving: 50,
        implementationComplexity: 'easy',
      },
    ];
  }

  private findCity(cityName: string): UkrainianCity | undefined {
    return this.cities.find(city => 
      city.name.toLowerCase() === cityName.toLowerCase() ||
      city.nameUA.toLowerCase() === cityName.toLowerCase()
    );
  }

  private isLocalDeliveryAvailable(city: UkrainianCity): boolean {
    return city.name === 'Kiev' || city.name === 'Kyiv';
  }

  private adjustTimeEstimate(current: any, historical: DeliveryHistoricalData): any {
    return current; // Упрощенно
  }

  private async analyzeWeatherImpact(city: string): Promise<number> {
    return 10 + Math.random() * 20; // Упрощенно
  }

  private calculateSeasonalFactor(): number {
    const month = new Date().getMonth();
    if (month >= 11 || month <= 1) return 1.3; // Зима
    if (month >= 5 && month <= 8) return 0.9;  // Лето
    return 1.0;
  }

  private assessQualityRisk(packaging: PackagingDetails, option: DeliveryOption): 'low' | 'medium' | 'high' {
    if (packaging.contentTypes.some(t => t.isFragile) && option.provider !== 'nova-poshta') {
      return 'medium';
    }
    return 'low';
  }

  private calculateDeliveryDates(estimatedDays: any, seasonalFactor: number): any {
    const base = Date.now();
    return {
      earliest: new Date(base + estimatedDays.min * 24 * 60 * 60 * 1000 * seasonalFactor),
      latest: new Date(base + estimatedDays.max * 24 * 60 * 60 * 1000 * seasonalFactor),
      expected: new Date(base + estimatedDays.most_likely * 24 * 60 * 60 * 1000 * seasonalFactor),
    };
  }

  private calculateHolidayRisk(): number {
    // Анализ календаря праздников
    return 20;
  }

  private calculateCarbonFootprint(city: UkrainianCity, weight: number): number {
    const distance = this.calculateDistance({ lat: 50.4501, lng: 30.5234 }, city.coordinates);
    return (distance * weight * 0.1) / 1000; // кг CO2
  }

  private calculateDistance(from: { lat: number; lng: number }, to: { lat: number; lng: number }): number {
    // Упрощенный расчет расстояния
    const R = 6371; // Радиус Земли в км
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLng = (to.lng - from.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private initializeCitiesData(): void {
    // Заглушка - в реальности загружали бы из API
    this.cities = [
      {
        ref: '8d5a980d-391c-11dd-90d9-001a92567626',
        name: 'Kiev',
        nameUA: 'Київ',
        region: 'Kyiv',
        regionUA: 'Київська',
        population: 3000000,
        coordinates: { lat: 50.4501, lng: 30.5234 },
        logistics: {
          isRegionalCenter: true,
          hasNovaPoshtaHub: true,
          averageDeliveryDays: 1,
          courierAvailable: true,
          warehouseCount: 200,
          lastMileQuality: 'excellent',
        },
      },
    ];
  }

  private loadHistoricalData(): void {
    // Заглушка для исторических данных
  }
}

// 🔌 API клиент для Новой Почты
class NovaPoshtaAPIClient {
  private apiKey: string = process.env.NOVA_POSHTA_API_KEY || 'demo_key';
  private baseUrl: string = 'https://api.novaposhta.ua/v2.0/json/';
  
  async calculateCost(params: {
    citySender: string;
    cityRecipient: string;
    weight: number;
    serviceType: string;
  }): Promise<number> {
    // В реальности - вызов к API
    // const response = await fetch(this.baseUrl, { ... });
    
    // Заглушка с реалистичными ценами
    const baseRate = 45;
    const weightMultiplier = Math.max(1, params.weight);
    const serviceMultiplier = params.serviceType === 'WarehouseDoors' ? 1.5 : 1.0;
    
    return Math.round(baseRate * weightMultiplier * serviceMultiplier);
  }
  
  async getCities(): Promise<UkrainianCity[]> {
    // Заглушка
    return [];
  }
  
  async getWarehouses(cityRef: string): Promise<any[]> {
    // Заглушка
    return [];
  }
}

// 🏭 Singleton
export const deliveryAI = new DeliveryAI();