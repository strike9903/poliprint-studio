/**
 * EnhancedConfiguratorBrain - Next-generation AI-powered product configurator
 * Uses deep image analysis for intelligent print recommendations
 */

import { aiImageAnalyzer, type DeepImageAnalysis } from './AIImageAnalyzer';
import { configuratorBrain } from './ConfiguratorBrain';
import type { UserIntent, SmartSuggestion, PricingPsychology } from './ConfiguratorBrain';

export interface EnhancedSmartSuggestion extends SmartSuggestion {
  // Расширенные данные от AI анализа
  aiScore: number; // 0-100, уверенность AI в рекомендации
  technicalFit: number; // насколько хорошо файл подходит технически
  visualImpact: number; // ожидаемый визуальный эффект
  marketPosition: 'budget' | 'standard' | 'premium' | 'luxury';
  
  // Детализированные преимущества
  enhancedBenefits: Array<{
    category: 'technical' | 'visual' | 'durability' | 'cost' | 'uniqueness';
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
  }>;

  // AI инсайты
  aiInsights: {
    whyRecommended: string;
    expectedOutcome: string;
    riskFactors: string[];
    alternativeOptions: string[];
  };

  // Персонализация
  personalization: {
    targetAudience: string;
    emotionalAppeal: string;
    lifestyle: string;
    priceJustification: string;
  };

  // Интерактивные элементы
  interactive: {
    has3DPreview: boolean;
    hasAugmentedReality: boolean;
    hasColorVariants: boolean;
    hasComparison: boolean;
  };
}

export interface MarketIntelligence {
  competitorAnalysis: {
    averagePrice: number;
    ourAdvantage: string;
    marketPosition: string;
    differentiators: string[];
  };
  trendAnalysis: {
    currentTrends: string[];
    seasonality: string;
    predictedDemand: 'low' | 'medium' | 'high';
  };
  customerBehavior: {
    preferredSizes: string[];
    popularMaterials: string[];
    avgOrderValue: number;
    conversionFactors: string[];
  };
}

export class EnhancedConfiguratorBrain {
  private deepAnalysisCache = new Map<string, DeepImageAnalysis>();
  private marketIntelligence: MarketIntelligence | null = null;

  constructor() {
    this.loadMarketIntelligence();
  }

  /**
   * Главная функция: глубокий анализ + умные рекомендации
   */
  async generateEnhancedRecommendations(
    file: File, 
    userIntent: UserIntent,
    priceRange?: { min: number; max: number }
  ): Promise<{
    analysis: DeepImageAnalysis;
    suggestions: EnhancedSmartSuggestion[];
    marketIntelligence: MarketIntelligence;
    processingInsights: {
      analysisQuality: 'excellent' | 'good' | 'fair' | 'poor';
      recommendationConfidence: number;
      processingTime: number;
      optimizationPotential: number;
    };
  }> {
    
    console.log('🧠 Enhanced AI analysis starting...');
    const startTime = performance.now();

    // 1. Глубокий анализ изображения
    const cacheKey = `${file.name}-${file.size}-${file.lastModified}`;
    let analysis = this.deepAnalysisCache.get(cacheKey);
    
    if (!analysis) {
      analysis = await aiImageAnalyzer.analyzeImage(file);
      this.deepAnalysisCache.set(cacheKey, analysis);
    }

    // 2. Генерация умных рекомендаций на основе AI анализа
    const enhancedSuggestions = await this.generateAIBasedSuggestions(
      analysis, 
      userIntent, 
      priceRange
    );

    // 3. Применение рыночной аналитики
    const marketOptimizedSuggestions = this.applyMarketIntelligence(
      enhancedSuggestions,
      analysis
    );

    // 4. Персонализация рекомендаций
    const personalizedSuggestions = this.personalizeRecommendations(
      marketOptimizedSuggestions,
      userIntent,
      analysis
    );

    const processingTime = performance.now() - startTime;

    return {
      analysis,
      suggestions: personalizedSuggestions,
      marketIntelligence: this.marketIntelligence!,
      processingInsights: {
        analysisQuality: this.assessAnalysisQuality(analysis),
        recommendationConfidence: this.calculateRecommendationConfidence(personalizedSuggestions),
        processingTime,
        optimizationPotential: this.calculateOptimizationPotential(analysis)
      }
    };
  }

  /**
   * Генерация рекомендаций на основе AI анализа
   */
  private async generateAIBasedSuggestions(
    analysis: DeepImageAnalysis,
    userIntent: UserIntent,
    priceRange?: { min: number; max: number }
  ): Promise<EnhancedSmartSuggestion[]> {
    
    const suggestions: EnhancedSmartSuggestion[] = [];
    
    // Базовые рекомендации от старого ConfiguratorBrain
    const baseSuggestions = configuratorBrain.generateSmartSuggestions(
      userIntent, 
      this.convertToLegacyFormat(analysis)
    );

    // Расширяем каждую рекомендацию AI данными
    for (const baseSuggestion of baseSuggestions) {
      const enhanced = await this.enhanceSuggestion(baseSuggestion, analysis, userIntent);
      
      // Фильтруем по ценовому диапазону если указан
      if (!priceRange || (enhanced.price >= priceRange.min && enhanced.price <= priceRange.max)) {
        suggestions.push(enhanced);
      }
    }

    // Добавляем дополнительные AI-генерированные рекомендации
    const aiSuggestions = await this.generatePureAISuggestions(analysis, userIntent);
    suggestions.push(...aiSuggestions);

    // Сортируем по AI score и уверенности
    return suggestions.sort((a, b) => (b.aiScore * b.confidence) - (a.aiScore * a.confidence));
  }

  /**
   * Расширение базовой рекомендации AI данными
   */
  private async enhanceSuggestion(
    baseSuggestion: SmartSuggestion,
    analysis: DeepImageAnalysis,
    userIntent: UserIntent
  ): Promise<EnhancedSmartSuggestion> {
    
    // AI оценка соответствия
    const technicalFit = this.calculateTechnicalFit(baseSuggestion, analysis);
    const visualImpact = this.calculateVisualImpact(baseSuggestion, analysis);
    const aiScore = (technicalFit + visualImpact + analysis.printability.overallScore) / 3;

    // Расширенные преимущества на основе анализа
    const enhancedBenefits = this.generateEnhancedBenefits(baseSuggestion, analysis);

    // AI инсайты
    const aiInsights = this.generateAIInsights(baseSuggestion, analysis, userIntent);

    // Персонализация
    const personalization = this.generatePersonalization(baseSuggestion, analysis, userIntent);

    // Определение рыночной позиции
    const marketPosition = this.determineMarketPosition(baseSuggestion.price, aiScore);

    return {
      ...baseSuggestion,
      aiScore,
      technicalFit,
      visualImpact,
      marketPosition,
      enhancedBenefits,
      aiInsights,
      personalization,
      interactive: {
        has3DPreview: baseSuggestion.productType === 'canvas' || baseSuggestion.productType === 'acrylic',
        hasAugmentedReality: baseSuggestion.productType === 'canvas',
        hasColorVariants: true,
        hasComparison: true
      }
    };
  }

  /**
   * Чистые AI рекомендации на основе deep learning
   */
  private async generatePureAISuggestions(
    analysis: DeepImageAnalysis,
    userIntent: UserIntent
  ): Promise<EnhancedSmartSuggestion[]> {
    
    const suggestions: EnhancedSmartSuggestion[] = [];

    // AI рекомендация на основе mood analysis
    if (analysis.color.mood === 'dramatic' && analysis.composition.depth > 0.7) {
      suggestions.push(await this.createAISuggestion({
        type: 'acrylic',
        reasoning: 'AI виявив драматичний mood та глибину композиції - ідеально для backlit акрилу',
        confidence: 92,
        analysis,
        userIntent,
        priceBase: 780,
        size: this.calculateOptimalSize(analysis, 'acrylic')
      }));
    }

    // AI рекомендация на основе face detection
    if (analysis.content.faces.count > 0 && analysis.content.faces.quality === 'excellent') {
      suggestions.push(await this.createAISuggestion({
        type: 'metal',
        reasoning: 'Високоякісні портрети виглядають преміально на metal print з HD деталізацією',
        confidence: 88,
        analysis,
        userIntent,
        priceBase: 950,
        size: this.calculateOptimalSize(analysis, 'metal')
      }));
    }

    // AI рекомендация на основе color analysis
    if (analysis.color.saturation > 0.8 && analysis.color.brightness > 0.6) {
      suggestions.push(await this.createAISuggestion({
        type: 'fabric',
        reasoning: 'Яскраві насичені кольори створюють warm atmosphere на текстилі',
        confidence: 76,
        analysis,
        userIntent,
        priceBase: 420,
        size: this.calculateOptimalSize(analysis, 'fabric')
      }));
    }

    return suggestions;
  }

  /**
   * Создание AI suggestion
   */
  private async createAISuggestion(params: {
    type: string;
    reasoning: string;
    confidence: number;
    analysis: DeepImageAnalysis;
    userIntent: UserIntent;
    priceBase: number;
    size: string;
  }): Promise<EnhancedSmartSuggestion> {
    
    const { type, reasoning, confidence, analysis, userIntent, priceBase, size } = params;

    return {
      productType: type as any,
      size,
      configuration: this.generateConfiguration(type, analysis),
      price: this.calculateDynamicPrice(priceBase, analysis, userIntent),
      confidence,
      reasoning,
      benefits: this.generateBenefits(type, analysis),
      preview: `/preview/${type}-${size.replace('×', 'x').toLowerCase()}.jpg`,
      bestFor: this.generateBestFor(type, analysis),
      
      // Enhanced properties
      aiScore: (confidence + analysis.printability.overallScore) / 2,
      technicalFit: this.calculateTechnicalFit({ productType: type } as any, analysis),
      visualImpact: this.calculateVisualImpact({ productType: type } as any, analysis),
      marketPosition: this.determineMarketPosition(priceBase, confidence),
      
      enhancedBenefits: this.generateEnhancedBenefits({ productType: type } as any, analysis),
      aiInsights: this.generateAIInsights({ productType: type, reasoning } as any, analysis, userIntent),
      personalization: this.generatePersonalization({ productType: type } as any, analysis, userIntent),
      
      interactive: {
        has3DPreview: ['canvas', 'acrylic'].includes(type),
        hasAugmentedReality: type === 'canvas',
        hasColorVariants: true,
        hasComparison: true
      }
    };
  }

  /**
   * Применение рыночной аналитики
   */
  private applyMarketIntelligence(
    suggestions: EnhancedSmartSuggestion[],
    analysis: DeepImageAnalysis
  ): EnhancedSmartSuggestion[] {
    
    if (!this.marketIntelligence) return suggestions;

    return suggestions.map(suggestion => {
      // Корректировка цены на основе рыночных данных
      const marketAdjustedPrice = this.adjustPriceByMarket(
        suggestion.price,
        suggestion.productType,
        suggestion.aiScore
      );

      // Добавление рыночных insights
      const marketInsights = this.getMarketInsights(suggestion.productType, analysis);

      return {
        ...suggestion,
        price: marketAdjustedPrice,
        aiInsights: {
          ...suggestion.aiInsights,
          alternativeOptions: [
            ...suggestion.aiInsights.alternativeOptions,
            ...marketInsights.alternatives
          ]
        },
        personalization: {
          ...suggestion.personalization,
          priceJustification: `${suggestion.personalization.priceJustification}. ${marketInsights.justification}`
        }
      };
    });
  }

  /**
   * Персонализация рекомендаций
   */
  private personalizeRecommendations(
    suggestions: EnhancedSmartSuggestion[],
    userIntent: UserIntent,
    analysis: DeepImageAnalysis
  ): EnhancedSmartSuggestion[] {
    
    return suggestions.map(suggestion => ({
      ...suggestion,
      personalization: {
        ...suggestion.personalization,
        targetAudience: this.refineTargetAudience(suggestion.personalization.targetAudience, userIntent, analysis),
        emotionalAppeal: this.enhanceEmotionalAppeal(suggestion.personalization.emotionalAppeal, analysis.color.mood),
        lifestyle: this.determineLifestyle(userIntent, analysis),
        priceJustification: this.createPriceJustification(suggestion.price, suggestion.aiScore, userIntent)
      }
    }));
  }

  // Утилиты и вспомогательные методы

  private loadMarketIntelligence() {
    // В реальной реализации загружались бы актуальные рыночные данные
    this.marketIntelligence = {
      competitorAnalysis: {
        averagePrice: 650,
        ourAdvantage: 'AI-оптимізовані рекомендації та прозоре ціноутворення',
        marketPosition: 'Premium quality, fair pricing',
        differentiators: [
          'AI аналіз зображень',
          '3D превью в реальному часі',
          'Гарантія якості 100%',
          'Експрес виконання 24 години'
        ]
      },
      trendAnalysis: {
        currentTrends: ['Мінімалізм', 'Великі формати', 'Персоналізовані подарунки'],
        seasonality: 'Високий попит перед святами',
        predictedDemand: 'high'
      },
      customerBehavior: {
        preferredSizes: ['40×60', '30×40', '50×70'],
        popularMaterials: ['canvas', 'acrylic', 'metal'],
        avgOrderValue: 580,
        conversionFactors: [
          'Швидка доставка',
          'Гарантія якості', 
          'Можливість перегляду',
          'Прозорі ціни'
        ]
      }
    };
  }

  private convertToLegacyFormat(analysis: DeepImageAnalysis): any {
    // Конвертация в старый формат для совместимости
    return {
      type: analysis.content.style === 'photo' ? 'photo' : 'graphic',
      orientation: analysis.technical.dimensions.width > analysis.technical.dimensions.height ? 'landscape' : 'portrait',
      quality: analysis.technical.dpi > 300 ? 'excellent' : analysis.technical.dpi > 200 ? 'high' : 'medium',
      dpi: analysis.technical.dpi,
      dimensions: analysis.technical.dimensions,
      colorProfile: analysis.technical.colorProfile,
      dominantColors: analysis.color.palette.map(p => p.color),
      hasText: analysis.content.text.detected,
      hasFaces: analysis.content.faces.count > 0,
      complexity: analysis.content.complexity,
      suggestedProducts: analysis.printability.bestProducts.map(p => p.type)
    };
  }

  private calculateTechnicalFit(suggestion: any, analysis: DeepImageAnalysis): number {
    let score = 100;
    
    // Проверка DPI соответствия продукту
    if (suggestion.productType === 'canvas' && analysis.technical.dpi < 200) score -= 20;
    if (suggestion.productType === 'acrylic' && analysis.technical.dpi < 250) score -= 30;
    
    // Проверка цветового профиля
    if (analysis.technical.colorProfile === 'grayscale' && suggestion.productType === 'acrylic') score -= 15;
    
    // Проверка резкости
    if (analysis.technical.sharpnessScore < 0.5) score -= 25;
    
    return Math.max(0, score);
  }

  private calculateVisualImpact(suggestion: any, analysis: DeepImageAnalysis): number {
    let score = 50; // базовый score
    
    // Композиционные факторы
    if (analysis.composition.ruleOfThirds) score += 15;
    if (analysis.composition.leadingLines) score += 10;
    if (analysis.composition.depth > 0.7) score += 20;
    
    // Цветовые факторы
    if (analysis.color.contrast > 0.6) score += 15;
    if (analysis.color.saturation > 0.7) score += 10;
    
    // Соответствие материала content type
    if (suggestion.productType === 'canvas' && analysis.content.type === 'landscape') score += 20;
    if (suggestion.productType === 'acrylic' && analysis.content.faces.count > 0) score += 25;
    
    return Math.min(100, score);
  }

  private determineMarketPosition(price: number, aiScore: number): 'budget' | 'standard' | 'premium' | 'luxury' {
    if (price < 300 && aiScore < 70) return 'budget';
    if (price < 600 && aiScore < 85) return 'standard';
    if (price < 1000 && aiScore >= 85) return 'premium';
    return 'luxury';
  }

  private generateEnhancedBenefits(suggestion: any, analysis: DeepImageAnalysis): any[] {
    const benefits = [];
    
    if (analysis.technical.dpi > 300) {
      benefits.push({
        category: 'technical',
        title: 'Ultra HD якість',
        description: `${analysis.technical.dpi} DPI забезпечує кристальну чіткість`,
        impact: 'high'
      });
    }
    
    if (analysis.color.contrast > 0.7) {
      benefits.push({
        category: 'visual',
        title: 'Драматичний контраст',
        description: 'Високий контраст створює wow-ефект',
        impact: 'high'
      });
    }
    
    if (analysis.content.faces.count > 0) {
      benefits.push({
        category: 'uniqueness',
        title: 'Персональна цінність',
        description: 'Портрети завжди мають особливе значення',
        impact: 'critical'
      });
    }
    
    return benefits;
  }

  private generateAIInsights(suggestion: any, analysis: DeepImageAnalysis, userIntent: UserIntent): any {
    return {
      whyRecommended: `AI виявив ${analysis.content.type} з ${analysis.color.mood} mood, що ідеально підходить для ${suggestion.productType}`,
      expectedOutcome: `Очікуваний результат: ${this.predictOutcome(suggestion, analysis)}`,
      riskFactors: this.identifyRiskFactors(analysis),
      alternativeOptions: this.suggestAlternatives(suggestion, analysis)
    };
  }

  private generatePersonalization(suggestion: any, analysis: DeepImageAnalysis, userIntent: UserIntent): any {
    return {
      targetAudience: this.identifyTargetAudience(analysis, userIntent),
      emotionalAppeal: this.generateEmotionalAppeal(analysis.color.mood, analysis.content.type),
      lifestyle: this.inferLifestyle(userIntent, analysis),
      priceJustification: this.justifyPrice(suggestion.price, analysis.printability.overallScore)
    };
  }

  private calculateOptimalSize(analysis: DeepImageAnalysis, productType: string): string {
    const ratio = analysis.technical.dimensions.width / analysis.technical.dimensions.height;
    
    if (productType === 'canvas') {
      if (ratio > 1.5) return '60×40';
      if (ratio < 0.7) return '40×60';
      return '50×50';
    }
    
    if (productType === 'acrylic') {
      if (analysis.content.faces.count > 0) return '30×40';
      return '40×40';
    }
    
    return '40×60';
  }

  private generateConfiguration(type: string, analysis: DeepImageAnalysis): Record<string, any> {
    const baseConfigs = {
      canvas: {
        edge: analysis.composition.balance === 'centered' ? 'gallery' : 'mirror',
        depth: analysis.composition.depth > 0.7 ? '38mm' : '20mm',
        texture: analysis.technical.sharpnessScore > 0.7 ? 'fine' : 'standard'
      },
      acrylic: {
        thickness: analysis.content.faces.count > 0 ? '8mm' : '5mm',
        mounting: 'standoff',
        lighting: analysis.color.mood === 'dramatic'
      }
    };
    
    return baseConfigs[type as keyof typeof baseConfigs] || {};
  }

  private calculateDynamicPrice(basePrice: number, analysis: DeepImageAnalysis, userIntent: UserIntent): number {
    let price = basePrice;
    
    // Корректировки на основе качества
    if (analysis.printability.overallScore > 90) price += 50;
    if (analysis.technical.dpi > 300) price += 30;
    if (analysis.content.complexity === 'very-complex') price += 40;
    
    // Корректировки на основе намерений пользователя
    if (userIntent.budget === 'premium') price *= 1.2;
    if (userIntent.urgency === 'express') price *= 1.5;
    
    return Math.round(price);
  }

  private generateBenefits(type: string, analysis: DeepImageAnalysis): string[] {
    const baseBenefits = {
      canvas: ['Класичний вигляд', 'Не потребує рамки', 'Готовий до вішання'],
      acrylic: ['Сучасний стиль', 'Можлива підсвітка', 'Стійкість до UV'],
      metal: ['Преміум якість', 'Яскравість кольорів', 'Довговічність'],
      fabric: ['М\'який текстиль', 'Тепла атмосфера', 'Акустичні властивості']
    };
    
    const benefits = [...(baseBenefits[type as keyof typeof baseBenefits] || [])];
    
    // Додаткові переваги на основе анализу
    if (analysis.color.saturation > 0.8) benefits.push('Ідеально для яскравих кольорів');
    if (analysis.content.faces.count > 0) benefits.push('Оптимізовано для портретів');
    
    return benefits;
  }

  private generateBestFor(type: string, analysis: DeepImageAnalysis): string[] {
    const baseUseCases = {
      canvas: ['Гостиная', 'Спальня', 'Офіс'],
      acrylic: ['Сучасний інтер\'єр', 'Портрети', 'Реклама'],
      metal: ['Елітний декор', 'Галереї', 'Презентації'],
      fabric: ['Дитяча кімната', 'Готелі', 'Акустичні панелі']
    };
    
    const useCases = [...(baseUseCases[type as keyof typeof baseUseCases] || [])];
    
    if (analysis.content.faces.count > 2) useCases.push('Сімейні фото');
    if (analysis.color.mood === 'energetic') useCases.push('Активні зони');
    
    return useCases;
  }

  private adjustPriceByMarket(price: number, productType: string, aiScore: number): number {
    if (!this.marketIntelligence) return price;
    
    const avgMarketPrice = this.marketIntelligence.competitorAnalysis.averagePrice;
    
    // Если наш AI score высокий, можем быть чуть дороже рынка
    if (aiScore > 85) {
      return Math.min(price * 1.05, avgMarketPrice * 1.1);
    }
    
    // Иначе держимся ниже рынка
    return Math.min(price, avgMarketPrice * 0.95);
  }

  private getMarketInsights(productType: string, analysis: DeepImageAnalysis): { alternatives: string[]; justification: string } {
    return {
      alternatives: ['Розгляньте також metal print для преміум варіанту'],
      justification: 'Ціна враховує поточні ринкові тенденції та унікальність вашого проекту'
    };
  }

  // Дополнительные утилиты...
  
  private assessAnalysisQuality(analysis: DeepImageAnalysis): 'excellent' | 'good' | 'fair' | 'poor' {
    const score = analysis.aiInsights.confidence;
    if (score > 90) return 'excellent';
    if (score > 75) return 'good'; 
    if (score > 60) return 'fair';
    return 'poor';
  }

  private calculateRecommendationConfidence(suggestions: EnhancedSmartSuggestion[]): number {
    if (suggestions.length === 0) return 0;
    return suggestions.reduce((sum, s) => sum + s.aiScore, 0) / suggestions.length;
  }

  private calculateOptimizationPotential(analysis: DeepImageAnalysis): number {
    return analysis.aiInsights.recommendations.reduce((sum, rec) => {
      return sum + (rec.impact === 'high' ? 30 : rec.impact === 'medium' ? 15 : 5);
    }, 0);
  }

  private refineTargetAudience(current: string, userIntent: UserIntent, analysis: DeepImageAnalysis): string {
    if (userIntent.purpose === 'gift' && analysis.content.faces.count > 0) {
      return 'Люди які цінують персональні подарунки';
    }
    return current;
  }

  private enhanceEmotionalAppeal(current: string, mood: string): string {
    const moodEnhancements = {
      energetic: 'Надихає та мотивує',
      calm: 'Створює атмосферу спокою',
      dramatic: 'Приковує увагу та вражає',
      cheerful: 'Піднімає настрій'
    };
    return moodEnhancements[mood as keyof typeof moodEnhancements] || current;
  }

  private determineLifestyle(userIntent: UserIntent, analysis: DeepImageAnalysis): string {
    if (userIntent.purpose === 'business') return 'Професійний';
    if (userIntent.purpose === 'home-decor') return 'Домашній затишок';
    if (analysis.color.mood === 'energetic') return 'Активний';
    return 'Універсальний';
  }

  private createPriceJustification(price: number, aiScore: number, userIntent: UserIntent): string {
    let justification = `Ціна ${price}₴ відображає `;
    
    if (aiScore > 85) justification += 'преміум якість та AI оптимізацію ';
    if (userIntent.urgency === 'express') justification += 'експрес виконання ';
    
    justification += 'з гарантією результату';
    return justification;
  }

  private predictOutcome(suggestion: any, analysis: DeepImageAnalysis): string {
    if (analysis.printability.overallScore > 85) {
      return 'Відмінний результат, який перевищить очікування';
    }
    return 'Хороший результат відповідно до якості оригіналу';
  }

  private identifyRiskFactors(analysis: DeepImageAnalysis): string[] {
    const risks = [];
    
    if (analysis.technical.dpi < 200) risks.push('Низька роздільна здатність може вплинути на деталі');
    if (analysis.technical.noiseLevel > 0.5) risks.push('Наявність шуму на зображенні');
    if (analysis.technical.sharpnessScore < 0.3) risks.push('Зображення може виглядати розмитим');
    
    return risks;
  }

  private suggestAlternatives(suggestion: any, analysis: DeepImageAnalysis): string[] {
    const alternatives = [];
    
    if (suggestion.productType === 'canvas') alternatives.push('Розгляньте акрил для сучасного вигляду');
    if (analysis.content.faces.count > 0) alternatives.push('Metal print для максимальної чіткості портретів');
    
    return alternatives;
  }

  private identifyTargetAudience(analysis: DeepImageAnalysis, userIntent: UserIntent): string {
    if (analysis.content.faces.count > 2) return 'Родини з дітьми';
    if (userIntent.purpose === 'business') return 'Бізнес клієнти';
    if (analysis.content.type === 'landscape') return 'Любителі природи';
    return 'Широка аудиторія';
  }

  private generateEmotionalAppeal(mood: string, contentType: string): string {
    if (contentType === 'portrait') return 'Збереже дорогі спогади назавжди';
    if (mood === 'energetic') return 'Заряджає енергією та позитивом';
    if (mood === 'calm') return 'Створює атмосферу гармонії';
    return 'Прикрасить будь-який простір';
  }

  private inferLifestyle(userIntent: UserIntent, analysis: DeepImageAnalysis): string {
    if (userIntent.budget === 'premium') return 'Розкішний';
    if (analysis.color.mood === 'calm') return 'Мінімалістичний';
    if (analysis.content.complexity === 'complex') return 'Творчий';
    return 'Практичний';
  }

  private justifyPrice(price: number, qualityScore: number): string {
    if (qualityScore > 90) return `${price}₴ за преміум якість - це інвестиція в красу`;
    if (qualityScore > 75) return `${price}₴ - оптимальне співвідношення ціни та якості`;
    return `${price}₴ - доступна ціна для гарного результату`;
  }
}

export const enhancedConfiguratorBrain = new EnhancedConfiguratorBrain();