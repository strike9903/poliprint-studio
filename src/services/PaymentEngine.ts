"use client";

import { type PaymentMethod, type Order } from '@/contexts/OrderContext';

// 🧠 Психологический профиль пользователя
export interface UserPaymentPsychology {
  // Поведенческие паттерны
  riskTolerance: 'low' | 'medium' | 'high';
  pricesensitivity: 'low' | 'medium' | 'high';
  conveniencePreference: 'speed' | 'security' | 'cost' | 'familiarity';
  
  // Демографические данные
  ageGroup?: '18-25' | '26-35' | '36-45' | '46-55' | '55+';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  
  // История платежей
  preferredMethods: PaymentMethod[];
  failedAttempts: Array<{
    method: PaymentMethod;
    reason: string;
    timestamp: Date;
  }>;
  
  // Контекст заказа
  orderValue: number;
  isFirstTime: boolean;
  hasApplePay: boolean;
  hasGooglePay: boolean;
  
  // Геолокация и время
  city?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: 'weekday' | 'weekend';
}

// 💳 Детали платежного метода с психологией
export interface PaymentMethodDetails {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: string;
  
  // Финансовые детали
  feePercentage: number;
  feeFixed: number;
  minimumAmount: number;
  maximumAmount: number;
  
  // UX факторы  
  trustScore: number;        // 0-100, доверие пользователей
  convenienceScore: number;  // 0-100, удобство
  speedScore: number;        // 0-100, скорость обработки
  
  // Психологические триггеры
  psychologyTriggers: Array<{
    trigger: 'security' | 'speed' | 'familiarity' | 'status' | 'savings';
    strength: number; // 0-100
    message: string;
  }>;
  
  // Доступность
  isAvailable: boolean;
  unavailableReason?: string;
  estimatedDowntime?: Date;
  
  // Пользовательский опыт
  averageCompletionTime: number; // секунды
  successRate: number;           // 0-100
  userSatisfactionScore: number; // 0-5
  
  // Маркетинговые факторы
  promotion?: {
    type: 'cashback' | 'discount' | 'no_fee' | 'bonus_points';
    value: number;
    description: string;
    validUntil: Date;
  };
  
  // Ограничения и требования
  requirements?: string[];
  supportedCurrencies: string[];
  regions: string[];
}

// 🎯 Рекомендация платежного метода
export interface PaymentRecommendation {
  method: PaymentMethod;
  confidence: number;        // 0-100, уверенность в рекомендации
  reasoning: string[];       // Причины рекомендации
  
  // Психологическое обоснование
  psychologicalMatch: number; // 0-100, соответствие психологии пользователя
  
  // Практические преимущества  
  advantages: string[];
  disadvantages?: string[];
  
  // Финансовое влияние
  totalCost: number;
  savings?: number;
  
  // Пользовательский опыт
  estimatedTime: number;     // секунды до завершения
  userFrictionScore: number; // 0-100, сложность для пользователя
  
  // A/B тестирование
  variant?: 'control' | 'experiment_1' | 'experiment_2';
}

// 🧮 Класс PaymentEngine
export class PaymentEngine {
  private paymentMethods: PaymentMethodDetails[];
  private analytics: {
    totalTransactions: number;
    successRate: Record<PaymentMethod, number>;
    averageAmount: number;
    peakHours: number[];
    popularMethods: PaymentMethod[];
  };

  constructor() {
    this.paymentMethods = this.initializePaymentMethods();
    this.analytics = this.loadAnalytics();
  }

  // 🎯 Основной метод - получение рекомендаций
  public getPaymentRecommendations(
    userPsychology: UserPaymentPsychology,
    order: Partial<Order>
  ): PaymentRecommendation[] {
    
    // 1. Фильтруем доступные методы
    const availableMethods = this.filterAvailableMethods(userPsychology, order);
    
    // 2. Оцениваем каждый метод
    const recommendations = availableMethods.map(method => 
      this.evaluatePaymentMethod(method, userPsychology, order)
    );
    
    // 3. Сортируем по confidence score
    recommendations.sort((a, b) => b.confidence - a.confidence);
    
    // 4. Применяем A/B тесты и персонализацию
    return this.applyPersonalization(recommendations, userPsychology);
  }

  // 🎨 Психологический анализ пользователя
  public analyzeUserPsychology(context: {
    userAgent: string;
    orderHistory: any[];
    currentOrder: Partial<Order>;
    timestamp: Date;
  }): UserPaymentPsychology {
    
    const deviceType = this.detectDeviceType(context.userAgent);
    const timeOfDay = this.getTimeOfDay(context.timestamp);
    const dayOfWeek = this.getDayOfWeek(context.timestamp);
    
    // Анализируем риск-профиль на основе заказа
    const riskTolerance = this.analyzeRiskTolerance(context.orderHistory, context.currentOrder);
    
    // Анализируем ценовую чувствительность
    const pricesensitivity = this.analyzePriceSensitivity(context.orderHistory);
    
    // Определяем предпочтения удобства
    const conveniencePreference = this.analyzeConveniencePreference(
      deviceType, 
      context.orderHistory
    );
    
    return {
      riskTolerance,
      pricesensitivity,
      conveniencePreference,
      deviceType,
      orderValue: context.currentOrder.pricing?.total || 0,
      isFirstTime: context.orderHistory.length === 0,
      hasApplePay: deviceType === 'mobile' && context.userAgent.includes('iPhone'),
      hasGooglePay: deviceType === 'mobile' && context.userAgent.includes('Android'),
      timeOfDay,
      dayOfWeek,
      preferredMethods: this.extractPreferredMethods(context.orderHistory),
      failedAttempts: [],
    };
  }

  // 💰 Калькулятор полной стоимости
  public calculateTotalCost(
    method: PaymentMethod, 
    orderAmount: number
  ): {
    originalAmount: number;
    fee: number;
    total: number;
    savings?: number;
    promotion?: {
      type: string;
      discount: number;
      description: string;
    };
  } {
    
    const methodDetails = this.getMethodDetails(method);
    if (!methodDetails) {
      throw new Error(`Payment method ${method} not found`);
    }
    
    // Базовая комиссия
    const percentageFee = (orderAmount * methodDetails.feePercentage) / 100;
    const totalFee = percentageFee + methodDetails.feeFixed;
    
    let finalFee = totalFee;
    let promotion;
    
    // Применяем акции
    if (methodDetails.promotion) {
      switch (methodDetails.promotion.type) {
        case 'no_fee':
          finalFee = 0;
          promotion = {
            type: 'Безкоштовна оплата',
            discount: totalFee,
            description: methodDetails.promotion.description,
          };
          break;
          
        case 'discount':
          const discount = (orderAmount * methodDetails.promotion.value) / 100;
          promotion = {
            type: 'Знижка',
            discount,
            description: methodDetails.promotion.description,
          };
          break;
      }
    }
    
    return {
      originalAmount: orderAmount,
      fee: finalFee,
      total: orderAmount + finalFee,
      savings: promotion?.discount,
      promotion,
    };
  }

  // 🔍 Приватные методы для анализа
  private initializePaymentMethods(): PaymentMethodDetails[] {
    return [
      {
        id: 'liqpay-card',
        name: 'Картка (LiqPay)',
        description: 'Visa, MasterCard через ПриватБанк',
        icon: '💳',
        feePercentage: 2.75,
        feeFixed: 0,
        minimumAmount: 1,
        maximumAmount: 100000,
        trustScore: 95,
        convenienceScore: 90,
        speedScore: 85,
        psychologyTriggers: [
          { trigger: 'familiarity', strength: 90, message: 'Найпопулярніший спосіб оплати в Україні' },
          { trigger: 'security', strength: 85, message: 'Захищено банком ПриватБанк' },
        ],
        isAvailable: true,
        averageCompletionTime: 45,
        successRate: 94,
        userSatisfactionScore: 4.3,
        supportedCurrencies: ['UAH'],
        regions: ['UA'],
      },
      
      {
        id: 'mono-card',
        name: 'Картка (Mono)',
        description: 'Оплата через Mono Bank',
        icon: '🖤',
        feePercentage: 2.5,
        feeFixed: 0,
        minimumAmount: 1,
        maximumAmount: 100000,
        trustScore: 88,
        convenienceScore: 95,
        speedScore: 95,
        psychologyTriggers: [
          { trigger: 'speed', strength: 95, message: 'Найшвидша оплата в Україні' },
          { trigger: 'status', strength: 70, message: 'Сучасний банк для прогресивних людей' },
        ],
        isAvailable: true,
        averageCompletionTime: 20,
        successRate: 96,
        userSatisfactionScore: 4.6,
        promotion: {
          type: 'discount',
          value: 1,
          description: 'Кешбек 1% за оплату Mono',
          validUntil: new Date('2024-12-31'),
        },
        supportedCurrencies: ['UAH'],
        regions: ['UA'],
      },
      
      {
        id: 'apple-pay',
        name: 'Apple Pay',
        description: 'Оплата через Apple Pay',
        icon: '🍎',
        feePercentage: 2.75,
        feeFixed: 0,
        minimumAmount: 1,
        maximumAmount: 100000,
        trustScore: 98,
        convenienceScore: 100,
        speedScore: 100,
        psychologyTriggers: [
          { trigger: 'security', strength: 98, message: 'Максимальна безпека з Touch ID / Face ID' },
          { trigger: 'speed', strength: 100, message: 'Оплата одним торканням' },
          { trigger: 'status', strength: 80, message: 'Преміум досвід оплати' },
        ],
        isAvailable: true,
        averageCompletionTime: 8,
        successRate: 99,
        userSatisfactionScore: 4.9,
        requirements: ['iPhone або iPad', 'iOS 14+', 'Touch ID або Face ID'],
        supportedCurrencies: ['UAH'],
        regions: ['UA'],
      },
      
      {
        id: 'google-pay',
        name: 'Google Pay',
        description: 'Оплата через Google Pay',
        icon: '📱',
        feePercentage: 2.75,
        feeFixed: 0,
        minimumAmount: 1,
        maximumAmount: 100000,
        trustScore: 95,
        convenienceScore: 98,
        speedScore: 98,
        psychologyTriggers: [
          { trigger: 'security', strength: 95, message: 'Захищено Google' },
          { trigger: 'speed', strength: 98, message: 'Миттєва оплата' },
          { trigger: 'familiarity', strength: 85, message: 'Знайомий інтерфейс Android' },
        ],
        isAvailable: true,
        averageCompletionTime: 12,
        successRate: 97,
        userSatisfactionScore: 4.7,
        requirements: ['Android 5.0+', 'NFC', 'Блокування екрану'],
        supportedCurrencies: ['UAH'],
        regions: ['UA'],
      },
      
      {
        id: 'cash-on-delivery',
        name: 'Накладений платіж',
        description: 'Оплата при отриманні',
        icon: '💵',
        feePercentage: 0,
        feeFixed: 20, // Комиссия за наложенный платеж
        minimumAmount: 100,
        maximumAmount: 30000,
        trustScore: 85,
        convenienceScore: 60,
        speedScore: 40,
        psychologyTriggers: [
          { trigger: 'security', strength: 95, message: 'Оплачуйте тільки після перевірки товару' },
          { trigger: 'familiarity', strength: 80, message: 'Звичний спосіб для багатьох українців' },
        ],
        isAvailable: true,
        averageCompletionTime: 0, // Не потрібно часу на оплату зараз
        successRate: 85, // Нижче через відмови при доставці
        userSatisfactionScore: 3.8,
        supportedCurrencies: ['UAH'],
        regions: ['UA'],
      },
    ];
  }

  private filterAvailableMethods(
    userPsychology: UserPaymentPsychology,
    order: Partial<Order>
  ): PaymentMethodDetails[] {
    return this.paymentMethods.filter(method => {
      // Проверяем доступность
      if (!method.isAvailable) return false;
      
      // Проверяем лимиты суммы
      const orderAmount = order.pricing?.total || 0;
      if (orderAmount < method.minimumAmount || orderAmount > method.maximumAmount) {
        return false;
      }
      
      // Проверяем специфические требования
      if (method.id === 'apple-pay' && !userPsychology.hasApplePay) return false;
      if (method.id === 'google-pay' && !userPsychology.hasGooglePay) return false;
      
      return true;
    });
  }

  private evaluatePaymentMethod(
    method: PaymentMethodDetails,
    userPsychology: UserPaymentPsychology,
    order: Partial<Order>
  ): PaymentRecommendation {
    
    let confidence = 0;
    const reasoning: string[] = [];
    const advantages: string[] = [];
    const disadvantages: string[] = [];
    
    // 1. Анализируем психологическое соответствие
    const psychologicalMatch = this.calculatePsychologicalMatch(method, userPsychology);
    confidence += psychologicalMatch * 0.4; // 40% веса
    
    if (psychologicalMatch > 80) {
      reasoning.push(`Відмінно підходить для вашого профілю (${psychologicalMatch}% сумісність)`);
    }
    
    // 2. Анализируем удобство для устройства  
    if (userPsychology.deviceType === 'mobile') {
      if (['apple-pay', 'google-pay'].includes(method.id)) {
        confidence += 25;
        reasoning.push('Оптимально для мобільного пристрою');
        advantages.push('Швидка оплата одним торканням');
      }
    }
    
    // 3. Анализируем ценовую чувствительность
    const costAnalysis = this.calculateTotalCost(method.id, order.pricing?.total || 0);
    if (userPsychology.pricesensitivity === 'high') {
      if (costAnalysis.fee === 0) {
        confidence += 20;
        reasoning.push('Без комісії');
        advantages.push('Економія на комісії');
      } else if (costAnalysis.fee < 50) {
        confidence += 10;
        reasoning.push('Низька комісія');
      } else {
        confidence -= 10;
        disadvantages.push(`Комісія ${costAnalysis.fee} ₴`);
      }
    }
    
    // 4. Анализируем скорость
    if (userPsychology.conveniencePreference === 'speed') {
      confidence += method.speedScore * 0.3;
      if (method.averageCompletionTime < 30) {
        reasoning.push('Дуже швидка оплата');
        advantages.push(`Оплата за ${method.averageCompletionTime} секунд`);
      }
    }
    
    // 5. Анализируем надежность  
    if (userPsychology.riskTolerance === 'low') {
      confidence += method.trustScore * 0.2;
      if (method.successRate > 95) {
        reasoning.push('Висока надійність');
        advantages.push(`${method.successRate}% успішних платежів`);
      }
    }
    
    // 6. Учитываем промоции
    if (method.promotion) {
      confidence += 15;
      reasoning.push(`Акція: ${method.promotion.description}`);
      advantages.push(method.promotion.description);
    }
    
    // 7. Учитываем историю пользователя
    if (userPsychology.preferredMethods.includes(method.id)) {
      confidence += 20;
      reasoning.push('Ваш улюблений спосіб оплати');
    }
    
    // 8. Контекстуальные факторы
    if (userPsychology.isFirstTime && ['liqpay-card', 'cash-on-delivery'].includes(method.id)) {
      confidence += 10;
      reasoning.push('Рекомендується для першого замовлення');
    }
    
    // Нормализуем confidence (0-100)
    confidence = Math.min(100, Math.max(0, confidence));
    
    return {
      method: method.id,
      confidence,
      reasoning,
      psychologicalMatch,
      advantages,
      disadvantages: disadvantages.length > 0 ? disadvantages : undefined,
      totalCost: costAnalysis.total,
      savings: costAnalysis.savings,
      estimatedTime: method.averageCompletionTime,
      userFrictionScore: this.calculateUserFriction(method, userPsychology),
    };
  }

  private calculatePsychologicalMatch(
    method: PaymentMethodDetails,
    userPsychology: UserPaymentPsychology
  ): number {
    let match = 0;
    
    // Анализируем триггеры метода против предпочтений пользователя
    method.psychologyTriggers.forEach(trigger => {
      switch (trigger.trigger) {
        case 'speed':
          if (userPsychology.conveniencePreference === 'speed') {
            match += trigger.strength * 0.8;
          }
          break;
          
        case 'security':
          if (userPsychology.riskTolerance === 'low') {
            match += trigger.strength * 0.8;
          }
          break;
          
        case 'familiarity':
          if (userPsychology.conveniencePreference === 'familiarity') {
            match += trigger.strength * 0.8;
          }
          break;
          
        case 'savings':
          if (userPsychology.pricesensitivity === 'high') {
            match += trigger.strength * 0.9;
          }
          break;
          
        case 'status':
          if (userPsychology.ageGroup === '26-35' || userPsychology.ageGroup === '18-25') {
            match += trigger.strength * 0.6;
          }
          break;
      }
    });
    
    return Math.min(100, match / method.psychologyTriggers.length);
  }

  private calculateUserFriction(
    method: PaymentMethodDetails,
    userPsychology: UserPaymentPsychology
  ): number {
    let friction = 0;
    
    // Базовый фрикшен основанный на сложности метода
    const baseFriction = {
      'apple-pay': 5,
      'google-pay': 5,
      'mono-card': 15,
      'liqpay-card': 20,
      'liqpay-privat24': 18,
      'cash-on-delivery': 10,
      'bank-transfer': 40,
    }[method.id] || 25;
    
    friction += baseFriction;
    
    // Увеличиваем фрикшен для незнакомых методов
    if (!userPsychology.preferredMethods.includes(method.id)) {
      friction += 10;
    }
    
    // Учитываем неудачные попытки
    const failedAttempts = userPsychology.failedAttempts.filter(
      attempt => attempt.method === method.id
    ).length;
    friction += failedAttempts * 15;
    
    // Учитываем требования метода
    if (method.requirements && method.requirements.length > 0) {
      friction += method.requirements.length * 5;
    }
    
    return Math.min(100, friction);
  }

  private applyPersonalization(
    recommendations: PaymentRecommendation[],
    userPsychology: UserPaymentPsychology
  ): PaymentRecommendation[] {
    
    // A/B тестирование - показываем разные порядки для разных групп
    const testGroup = Math.random();
    
    if (testGroup < 0.33) {
      // Группа A: сортировка по confidence
      return recommendations.map(rec => ({ ...rec, variant: 'control' }));
    } else if (testGroup < 0.66) {
      // Группа B: приоритет mobile-first методам на мобильных
      if (userPsychology.deviceType === 'mobile') {
        const mobileFirst = recommendations.sort((a, b) => {
          const aMobile = ['apple-pay', 'google-pay'].includes(a.method) ? 1 : 0;
          const bMobile = ['apple-pay', 'google-pay'].includes(b.method) ? 1 : 0;
          return bMobile - aMobile || b.confidence - a.confidence;
        });
        return mobileFirst.map(rec => ({ ...rec, variant: 'experiment_1' }));
      }
      return recommendations.map(rec => ({ ...rec, variant: 'experiment_1' }));
    } else {
      // Группа C: приоритет методам с промоциями
      const promotionFirst = recommendations.sort((a, b) => {
        const aPromo = a.savings ? 1 : 0;
        const bPromo = b.savings ? 1 : 0;
        return bPromo - aPromo || b.confidence - a.confidence;
      });
      return promotionFirst.map(rec => ({ ...rec, variant: 'experiment_2' }));
    }
  }

  // Утилиты для анализа пользователя
  private detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    if (/Mobile|Android|iPhone/.test(userAgent)) return 'mobile';
    if (/iPad|Tablet/.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  private getTimeOfDay(timestamp: Date): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = timestamp.getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  }

  private getDayOfWeek(timestamp: Date): 'weekday' | 'weekend' {
    const day = timestamp.getDay();
    return day === 0 || day === 6 ? 'weekend' : 'weekday';
  }

  private analyzeRiskTolerance(orderHistory: any[], currentOrder: Partial<Order>): 'low' | 'medium' | 'high' {
    // Упрощенная логика - в реальности анализировали бы историю
    const orderValue = currentOrder.pricing?.total || 0;
    if (orderValue > 5000) return 'low';      // Большие суммы = низкий риск-толеранс
    if (orderValue > 1000) return 'medium';
    return 'high';
  }

  private analyzePriceSensitivity(orderHistory: any[]): 'low' | 'medium' | 'high' {
    // Анализ истории на предмет выбора дешевых опций
    return orderHistory.length === 0 ? 'medium' : 'high'; // Новые клиенты более чувствительны к цене
  }

  private analyzeConveniencePreference(
    deviceType: 'mobile' | 'tablet' | 'desktop',
    orderHistory: any[]
  ): 'speed' | 'security' | 'cost' | 'familiarity' {
    if (deviceType === 'mobile') return 'speed';
    return orderHistory.length === 0 ? 'security' : 'familiarity';
  }

  private extractPreferredMethods(orderHistory: any[]): PaymentMethod[] {
    // В реальности анализировали бы историю заказов
    return [];
  }

  private getMethodDetails(method: PaymentMethod): PaymentMethodDetails | undefined {
    return this.paymentMethods.find(m => m.id === method);
  }

  private loadAnalytics() {
    // В реальности загружали бы из API
    return {
      totalTransactions: 10000,
      successRate: {
        'liqpay-card': 94,
        'liqpay-privat24': 95,
        'mono-card': 96,
        'apple-pay': 99,
        'google-pay': 97,
        'cash-on-delivery': 85,
        'bank-transfer': 92,
      } as Record<PaymentMethod, number>,
      averageAmount: 850,
      peakHours: [10, 14, 19, 21],
      popularMethods: ['liqpay-card', 'mono-card', 'apple-pay'] as PaymentMethod[],
    };
  }

  // 💰 Расчет комиссии за платеж
  public calculatePaymentFee(method: PaymentMethod, amount: number): number {
    const methodDetails = this.paymentMethods.find(m => m.id === method);
    if (!methodDetails) return 0;
    
    const feeFixed = methodDetails.feeFixed || 0;
    const feePercentage = (methodDetails.feePercentage || 0) / 100;
    
    return feeFixed + (amount * feePercentage);
  }
}

// 🏭 Singleton instance
export const paymentEngine = new PaymentEngine();