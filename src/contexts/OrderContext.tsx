"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { type CartProject } from './ProjectManagerContext';

// 🎯 Основные типы заказа
export type OrderStatus = 
  | 'draft'           // Черновик
  | 'payment-pending' // Ожидает оплаты
  | 'paid'           // Оплачен  
  | 'production'     // В производстве
  | 'printing'       // Печать
  | 'quality-check'  // Контроль качества
  | 'packaging'      // Упаковка
  | 'shipped'        // Отправлен
  | 'delivered'      // Доставлен
  | 'completed'      // Завершен
  | 'cancelled'      // Отменен
  | 'refunded';      // Возвращен

export type PaymentMethod = 
  | 'liqpay-card'        // LiqPay карта
  | 'liqpay-privat24'    // LiqPay Приват24
  | 'mono-card'          // Mono карта
  | 'apple-pay'          // Apple Pay  
  | 'google-pay'         // Google Pay
  | 'cash-on-delivery'   // Наложенный платеж
  | 'bank-transfer';     // Банковский перевод

export type DeliveryMethod =
  | 'nova-poshta-warehouse'  // Нова Пошта на отделение
  | 'nova-poshta-courier'    // Нова Пошта курьер
  | 'ukrposhta'             // Укрпошта
  | 'justin'                // Justin
  | 'pickup'                // Самовывоз
  | 'international';        // Международная доставка

// 💰 Детализация финансов
export interface OrderPricing {
  subtotal: number;        // Сумма товаров
  productionFee: number;   // Стоимость производства
  deliveryFee: number;     // Доставка
  packagingFee: number;    // Упаковка 
  insuranceFee: number;    // Страхование
  urgencyFee: number;      // Доплата за срочность
  paymentFee: number;      // Комиссия платежной системы
  discount: number;        // Скидка
  total: number;           // Итого
  currency: 'UAH' | 'USD' | 'EUR';
  
  // Налоги и документы
  vatIncluded: boolean;    // НДС включен
  vatAmount?: number;      // Сумма НДС
  invoiceRequired: boolean; // Нужна ли накладная
}

// 🚚 Детализация доставки  
export interface DeliveryDetails {
  method: DeliveryMethod;
  
  // Адрес
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  
  // Для Новой Пошты
  city?: string;
  warehouse?: string;
  warehouseNumber?: string;
  
  // Для курьера
  address?: string;
  street?: string;
  building?: string;
  apartment?: string;
  
  // Временные рамки
  estimatedDeliveryDate: Date;
  deliveryTimeSlot?: string;
  
  // Отслеживание
  trackingNumber?: string;
  carrierDetails?: {
    name: string;
    phone?: string;
    vehicle?: string;
  };
  
  // Стоимость и страхование
  cost: number;
  insuranceValue?: number;
  isFragile: boolean;
  packageDimensions: {
    width: number;
    height: number; 
    depth: number;
    weight: number;
  };
}

// 💳 Детализация платежа
export interface PaymentDetails {
  method: PaymentMethod;
  
  // Статус платежа
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  
  // Реквизиты
  transactionId?: string;
  paymentSystemRef?: string;
  
  // Для карт
  cardMask?: string;    // **** **** **** 1234
  cardType?: string;    // Visa, MasterCard
  
  // Временные метки
  initiatedAt: Date;
  completedAt?: Date;
  
  // Безопасность
  is3DSecure?: boolean;
  fraudScore?: number;
  
  // Документы
  receiptUrl?: string;
  invoiceUrl?: string;
  
  // Возврат средств
  refundable: boolean;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
}

// 📊 AI-аналитика заказа
export interface OrderAnalytics {
  // Скорость обработки
  expectedProductionTime: number; // в часах
  actualProductionTime?: number;
  bottlenecks: Array<{
    stage: OrderStatus;
    delay: number;
    reason: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  
  // Качественные метрики
  qualityScore?: number;        // 0-100
  customerSatisfaction?: number; // 0-5
  
  // Предсказательная аналитика
  deliveryConfidence: number;    // Вероятность доставки вовремя
  qualityRisk: 'low' | 'medium' | 'high';
  
  // Рекомендации для оптимизации
  optimizationSuggestions: Array<{
    type: 'cost' | 'speed' | 'quality';
    description: string;
    potentialSaving: number;
    implementationComplexity: 'easy' | 'medium' | 'hard';
  }>;
}

// 📱 Уведомления и коммуникация
export interface OrderCommunication {
  // Предпочтения уведомлений
  notifications: {
    sms: boolean;
    email: boolean;
    telegram: boolean;
    push: boolean;
  };
  
  // История уведомлений
  sentNotifications: Array<{
    id: string;
    type: 'status_change' | 'delay' | 'quality_issue' | 'delivery_update';
    channel: 'sms' | 'email' | 'telegram' | 'push';
    content: string;
    sentAt: Date;
    delivered: boolean;
    clicked?: boolean;
  }>;
  
  // Обратная связь от клиента
  customerFeedback: Array<{
    stage: OrderStatus;
    rating: number; // 1-5
    comment?: string;
    timestamp: Date;
    resolved?: boolean;
  }>;
  
  // Вопросы от клиента
  customerQueries: Array<{
    id: string;
    question: string;
    response?: string;
    respondedAt?: Date;
    respondedBy?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }>;
}

// 🎯 Основная структура заказа
export interface Order {
  // Основные данные
  id: string;
  number: string;              // Человекочитаемый номер заказа
  status: OrderStatus;
  
  // Связанные проекты
  projects: Array<{
    projectId: string;
    project: CartProject;
    quantity: number;
    customizations?: Record<string, any>; // Дополнительные настройки
  }>;
  
  // Финансы
  pricing: OrderPricing;
  payment: PaymentDetails;
  
  // Логистика
  delivery: DeliveryDetails;
  
  // Производство
  production: {
    estimatedStartDate: Date;
    estimatedCompletionDate: Date;
    actualStartDate?: Date;
    actualCompletionDate?: Date;
    
    // Детали производства
    stages: Array<{
      name: string;
      status: 'pending' | 'in_progress' | 'completed' | 'failed';
      startedAt?: Date;
      completedAt?: Date;
      assignedTo?: string;
      notes?: string;
      qualityCheckPassed?: boolean;
    }>;
    
    // Файлы для производства
    productionFiles: Array<{
      projectId: string;
      fileUrl: string;
      fileType: 'original' | 'processed' | 'print_ready';
      processingNotes?: string;
    }>;
  };
  
  // Метаданные
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string; // User ID
    channel: 'web' | 'mobile' | 'api' | 'admin';
    
    // Источники трафика
    source?: string;     // utm_source
    medium?: string;     // utm_medium  
    campaign?: string;   // utm_campaign
    
    // A/B тесты
    experiments?: Record<string, string>;
    
    // Устройство пользователя
    userAgent?: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
  };
  
  // AI и аналитика
  analytics: OrderAnalytics;
  
  // Коммуникации
  communication: OrderCommunication;
  
  // История изменений
  auditLog: Array<{
    timestamp: Date;
    userId?: string;
    action: string;
    changes: Record<string, { from: any; to: any }>;
    reason?: string;
    automated: boolean; // Было ли изменение автоматическим
  }>;
}

// 🎛️ Состояние системы заказов
interface OrderState {
  orders: Order[];
  currentCheckoutOrder?: Partial<Order>;
  
  // UI состояние
  ui: {
    checkoutStep: 'projects' | 'delivery' | 'payment' | 'confirmation' | 'processing';
    isProcessingPayment: boolean;
    isCalculatingDelivery: boolean;
    
    // Пользовательские предпочтения
    savedDeliveryAddresses: DeliveryDetails[];
    savedPaymentMethods: Partial<PaymentDetails>[];
    preferredNotifications: OrderCommunication['notifications'];
  };
  
  // Кеш и производительность
  cache: {
    deliveryRates: Record<string, { rate: number; cachedAt: Date }>;
    paymentFees: Record<PaymentMethod, number>;
    lastUpdated: Date;
  };
  
  // Настройки
  settings: {
    autoNotifications: boolean;
    qualityPhotos: boolean;     // Отправлять фото качества
    deliveryUpdates: boolean;   // Обновления доставки
    productionUpdates: boolean; // Обновления производства
  };
}

// ⚡ Actions
type OrderAction =
  // Создание и управление заказами
  | { type: 'CREATE_ORDER'; payload: { projects: CartProject[] } }
  | { type: 'UPDATE_ORDER'; payload: { orderId: string; updates: Partial<Order> } }
  | { type: 'CANCEL_ORDER'; payload: { orderId: string; reason: string } }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus; automated?: boolean } }
  
  // Checkout flow
  | { type: 'START_CHECKOUT'; payload: { projects: CartProject[] } }
  | { type: 'SET_CHECKOUT_STEP'; payload: { step: OrderState['ui']['checkoutStep'] } }
  | { type: 'SET_DELIVERY_DETAILS'; payload: { delivery: DeliveryDetails } }
  | { type: 'SET_PAYMENT_METHOD'; payload: { paymentMethod: PaymentMethod } }
  | { type: 'PROCESS_PAYMENT'; payload: { paymentDetails: PaymentDetails } }
  | { type: 'COMPLETE_ORDER'; payload: { order: Order } }
  
  // UI и UX
  | { type: 'SET_PROCESSING_STATE'; payload: { isProcessing: boolean; type: 'payment' | 'delivery' } }
  | { type: 'SAVE_DELIVERY_ADDRESS'; payload: { address: DeliveryDetails } }
  | { type: 'SAVE_PAYMENT_METHOD'; payload: { method: Partial<PaymentDetails> } }
  
  // Cache и производительность  
  | { type: 'UPDATE_DELIVERY_CACHE'; payload: { key: string; rate: number } }
  | { type: 'UPDATE_PAYMENT_FEES'; payload: { fees: Record<PaymentMethod, number> } }
  
  // Загрузка данных
  | { type: 'LOAD_ORDERS'; payload: { orders: Order[] } }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<OrderState> };

// 🏗️ Начальное состояние
const initialState: OrderState = {
  orders: [],
  ui: {
    checkoutStep: 'projects',
    isProcessingPayment: false,
    isCalculatingDelivery: false,
    savedDeliveryAddresses: [],
    savedPaymentMethods: [],
    preferredNotifications: {
      sms: true,
      email: true,
      telegram: false,
      push: true,
    },
  },
  cache: {
    deliveryRates: {},
    paymentFees: {
      'liqpay-card': 2.75,
      'liqpay-privat24': 1.5,
      'mono-card': 2.5,
      'apple-pay': 2.75,
      'google-pay': 2.75,
      'cash-on-delivery': 0,
      'bank-transfer': 0,
    },
    lastUpdated: new Date(),
  },
  settings: {
    autoNotifications: true,
    qualityPhotos: true,
    deliveryUpdates: true,
    productionUpdates: true,
  },
};

// 🧮 Reducer
function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'CREATE_ORDER': {
      const newOrder: Order = createOrderFromProjects(action.payload.projects);
      return {
        ...state,
        orders: [newOrder, ...state.orders],
      };
    }

    case 'UPDATE_ORDER': {
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? {
                ...order,
                ...action.payload.updates,
                metadata: {
                  ...order.metadata,
                  updatedAt: new Date(),
                },
              }
            : order
        ),
      };
    }

    case 'START_CHECKOUT': {
      const checkoutOrder = createOrderFromProjects(action.payload.projects);
      return {
        ...state,
        currentCheckoutOrder: checkoutOrder,
        ui: {
          ...state.ui,
          checkoutStep: 'delivery',
        },
      };
    }

    case 'SET_CHECKOUT_STEP': {
      return {
        ...state,
        ui: {
          ...state.ui,
          checkoutStep: action.payload.step,
        },
      };
    }

    case 'SET_DELIVERY_DETAILS': {
      return {
        ...state,
        currentCheckoutOrder: state.currentCheckoutOrder ? {
          ...state.currentCheckoutOrder,
          delivery: action.payload.delivery,
        } : state.currentCheckoutOrder,
      };
    }

    case 'SET_PROCESSING_STATE': {
      return {
        ...state,
        ui: {
          ...state.ui,
          isProcessingPayment: action.payload.type === 'payment' ? action.payload.isProcessing : state.ui.isProcessingPayment,
          isCalculatingDelivery: action.payload.type === 'delivery' ? action.payload.isProcessing : state.ui.isCalculatingDelivery,
        },
      };
    }

    case 'SAVE_DELIVERY_ADDRESS': {
      const existingAddresses = state.ui.savedDeliveryAddresses;
      const isDuplicate = existingAddresses.some(addr => 
        addr.city === action.payload.address.city && 
        addr.warehouse === action.payload.address.warehouse
      );
      
      if (isDuplicate) return state;
      
      return {
        ...state,
        ui: {
          ...state.ui,
          savedDeliveryAddresses: [action.payload.address, ...existingAddresses.slice(0, 4)], // Последние 5
        },
      };
    }

    case 'LOAD_FROM_STORAGE': {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
}

// 🎯 Создание заказа из проектов
function createOrderFromProjects(projects: CartProject[]): Order {
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  
  const subtotal = projects.reduce((sum, project) => sum + project.pricing.currentPrice, 0);
  
  return {
    id: orderId,
    number: orderNumber,
    status: 'draft',
    projects: projects.map(project => ({
      projectId: project.id,
      project,
      quantity: project.configuration.quantity,
    })),
    pricing: {
      subtotal,
      productionFee: subtotal * 0.1, // 10% производство
      deliveryFee: 0, // Будет рассчитано позже
      packagingFee: 25,
      insuranceFee: 0,
      urgencyFee: 0,
      paymentFee: 0,
      discount: 0,
      total: subtotal + subtotal * 0.1 + 25,
      currency: 'UAH',
      vatIncluded: true,
      invoiceRequired: false,
    },
    payment: {
      method: 'liqpay-card',
      status: 'pending',
      initiatedAt: new Date(),
      refundable: true,
    },
    delivery: {} as DeliveryDetails, // Будет заполнено в checkout
    production: {
      estimatedStartDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Завтра
      estimatedCompletionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 дня
      stages: [
        { name: 'Подготовка файлов', status: 'pending' },
        { name: 'Печать', status: 'pending' },
        { name: 'Контроль качества', status: 'pending' },
        { name: 'Упаковка', status: 'pending' },
      ],
      productionFiles: [],
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      channel: 'web',
    },
    analytics: {
      expectedProductionTime: 72, // 72 часа
      bottlenecks: [],
      deliveryConfidence: 0.95,
      qualityRisk: 'low',
      optimizationSuggestions: [],
    },
    communication: {
      notifications: {
        sms: true,
        email: true,
        telegram: false,
        push: true,
      },
      sentNotifications: [],
      customerFeedback: [],
      customerQueries: [],
    },
    auditLog: [{
      timestamp: new Date(),
      action: 'ORDER_CREATED',
      changes: {},
      automated: false,
    }],
  } as Order;
}

// 🎯 Context
interface OrderContextValue {
  state: OrderState;
  
  // Основные действия
  createOrder: (projects: CartProject[]) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  
  // Checkout flow
  startCheckout: (projects: CartProject[]) => void;
  setCheckoutStep: (step: OrderState['ui']['checkoutStep']) => void;
  setDeliveryDetails: (delivery: DeliveryDetails) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  
  // Утилиты
  getOrderById: (orderId: string) => Order | undefined;
  getTotalOrdersValue: () => number;
  getActiveOrders: () => Order[];
  
  // Калькуляторы
  calculateDeliveryFee: (method: DeliveryMethod, destination: string) => Promise<number>;
  calculatePaymentFee: (method: PaymentMethod, amount: number) => number;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

// 🎪 Provider
export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // 💾 Persistence
  useEffect(() => {
    const savedState = localStorage.getItem('orderManager');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
      } catch (error) {
        console.error('Error loading order state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orderManager', JSON.stringify(state));
  }, [state]);

  // 🎯 Actions
  const createOrder = useCallback((projects: CartProject[]) => {
    dispatch({ type: 'CREATE_ORDER', payload: { projects } });
  }, []);

  const updateOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    dispatch({ type: 'UPDATE_ORDER', payload: { orderId, updates } });
  }, []);

  const cancelOrder = useCallback((orderId: string, reason: string) => {
    dispatch({ type: 'CANCEL_ORDER', payload: { orderId, reason } });
  }, []);

  const startCheckout = useCallback((projects: CartProject[]) => {
    dispatch({ type: 'START_CHECKOUT', payload: { projects } });
  }, []);

  const setCheckoutStep = useCallback((step: OrderState['ui']['checkoutStep']) => {
    dispatch({ type: 'SET_CHECKOUT_STEP', payload: { step } });
  }, []);

  const setDeliveryDetails = useCallback((delivery: DeliveryDetails) => {
    dispatch({ type: 'SET_DELIVERY_DETAILS', payload: { delivery } });
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: { paymentMethod: method } });
  }, []);

  // 🧮 Утилиты
  const getOrderById = useCallback((orderId: string) => {
    return state.orders.find(order => order.id === orderId);
  }, [state.orders]);

  const getTotalOrdersValue = useCallback(() => {
    return state.orders.reduce((total, order) => total + order.pricing.total, 0);
  }, [state.orders]);

  const getActiveOrders = useCallback(() => {
    return state.orders.filter(order => 
      !['completed', 'cancelled', 'refunded'].includes(order.status)
    );
  }, [state.orders]);

  // 💰 Калькуляторы
  const calculateDeliveryFee = useCallback(async (method: DeliveryMethod, destination: string): Promise<number> => {
    // Имитация API вызова к Новой Поште
    const cacheKey = `${method}-${destination}`;
    const cached = state.cache.deliveryRates[cacheKey];
    
    if (cached && Date.now() - cached.cachedAt.getTime() < 30 * 60 * 1000) { // 30 минут кеш
      return cached.rate;
    }
    
    // Базовые тарифы (в реальности - API вызов)
    const baseFees: Record<DeliveryMethod, number> = {
      'nova-poshta-warehouse': 45,
      'nova-poshta-courier': 65,
      'ukrposhta': 35,
      'justin': 50,
      'pickup': 0,
      'international': 250,
    };
    
    const fee = baseFees[method] || 50;
    
    // Обновляем кеш
    dispatch({ 
      type: 'UPDATE_DELIVERY_CACHE', 
      payload: { key: cacheKey, rate: fee } 
    });
    
    return fee;
  }, [state.cache.deliveryRates]);

  const calculatePaymentFee = useCallback((method: PaymentMethod, amount: number): number => {
    const feePercentage = state.cache.paymentFees[method] || 0;
    return (amount * feePercentage) / 100;
  }, [state.cache.paymentFees]);

  const contextValue: OrderContextValue = {
    state,
    createOrder,
    updateOrder,
    cancelOrder,
    startCheckout,
    setCheckoutStep,
    setDeliveryDetails,
    setPaymentMethod,
    getOrderById,
    getTotalOrdersValue,
    getActiveOrders,
    calculateDeliveryFee,
    calculatePaymentFee,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
}

// 🪝 Hook
export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

// 🎯 Специализированные хуки
export function useCheckout() {
  const { state, startCheckout, setCheckoutStep, setDeliveryDetails, setPaymentMethod } = useOrders();
  
  return {
    currentOrder: state.currentCheckoutOrder,
    checkoutStep: state.ui.checkoutStep,
    isProcessingPayment: state.ui.isProcessingPayment,
    isCalculatingDelivery: state.ui.isCalculatingDelivery,
    startCheckout,
    setCheckoutStep,
    setDeliveryDetails,
    setPaymentMethod,
  };
}

export function useOrderTracking(orderId: string) {
  const { getOrderById, updateOrder } = useOrders();
  
  const order = getOrderById(orderId);
  
  return {
    order,
    updateStatus: (status: OrderStatus) => updateOrder(orderId, { status }),
    addNote: (note: string) => {
      if (order) {
        const updatedLog = [...order.auditLog, {
          timestamp: new Date(),
          action: 'NOTE_ADDED',
          changes: { note: { from: '', to: note } },
          automated: false,
        }];
        updateOrder(orderId, { auditLog: updatedLog });
      }
    },
  };
}