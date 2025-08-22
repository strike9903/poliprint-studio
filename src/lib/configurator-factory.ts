// Фабрика для динамического получения конфигураторов продуктов
import { ComponentType } from 'react';
import {
  DynamicCanvasConfigurator,
  DynamicAcrylicConfigurator,
  DynamicStickerConfigurator,
  DynamicPackagingConfigurator,
  preloadCanvasConfigurator,
  preloadAcrylicConfigurator,
  preloadStickerConfigurator,
  preloadPackagingConfigurator
} from '@/lib/dynamic-imports';

export type ProductType = 'business-cards' | 'flyers' | 'canvas' | 'acrylic' | 'stickers' | 'packaging';

export interface ConfiguratorProps {
  width: number;
  height: number;
  onConfigChange?: (config: any) => void;
  onPriceChange?: (price: number) => void;
}

export interface ProductConfiguratorInfo {
  name: string;
  description: string;
  component: ComponentType<ConfiguratorProps>;
  preloadFunction?: () => void;
  features: string[];
  category: 'print' | 'material' | '3d';
}

// Карта конфигураторов для каждого типа продукта
const configuratorMap: Record<ProductType, ProductConfiguratorInfo> = {
  'business-cards': {
    name: 'Конфигуратор визиток',
    description: 'Создание визиток с фирменным стилем',
    component: DynamicCanvasConfigurator as any, // Можно использовать базовый конфигуратор
    features: ['Шаблоны', 'QR коды', 'Корпоративные цвета', 'Различные форматы'],
    category: 'print'
  },
  'flyers': {
    name: 'Конфигуратор листовок',
    description: 'Создание рекламных листовок',
    component: DynamicCanvasConfigurator as any, // Можно использовать базовый конфигуратор
    features: ['Промо-материалы', 'A4/A5 форматы', 'Двусторонняя печать', 'Массовая печать'],
    category: 'print'
  },
  'canvas': {
    name: 'Конфигуратор холста',
    description: 'Создание художественных принтов на холсте',
    component: DynamicCanvasConfigurator as any,
    preloadFunction: preloadCanvasConfigurator,
    features: ['Художественные эффекты', 'Обработка изображений', 'Системы рам', 'Визуализация комнаты'],
    category: 'material'
  },
  'acrylic': {
    name: 'Конфигуратор акрила',
    description: 'Современные акриловые принты',
    component: DynamicAcrylicConfigurator as any,
    preloadFunction: preloadAcrylicConfigurator,
    features: ['Современные эффекты', 'Металлик', 'LED подсветка', 'Различная толщина'],
    category: 'material'
  },
  'stickers': {
    name: 'Конфигуратор наклеек',
    description: 'Наклейки с контурной вырубкой',
    component: DynamicStickerConfigurator as any,
    preloadFunction: preloadStickerConfigurator,
    features: ['Контурная вырубка', 'Различные материалы', 'Погодостойкость', 'Нумерация'],
    category: 'print'
  },
  'packaging': {
    name: 'Конфигуратор упаковки',
    description: 'Дизайн упаковки с 3D предпросмотром',
    component: DynamicPackagingConfigurator as any,
    preloadFunction: preloadPackagingConfigurator,
    features: ['3D визуализация', 'Развертки', 'Структурные элементы', 'Материалы упаковки'],
    category: '3d'
  }
};

/**
 * Получить информацию о конфигураторе для конкретного типа продукта
 */
export function getConfiguratorInfo(productType: ProductType): ProductConfiguratorInfo {
  const info = configuratorMap[productType];
  if (!info) {
    throw new Error(`Unknown product type: ${productType}`);
  }
  return info;
}

/**
 * Получить компонент конфигуратора для конкретного типа продукта
 */
export function getConfigurator(productType: ProductType): ComponentType<ConfiguratorProps> {
  return getConfiguratorInfo(productType).component;
}

/**
 * Предзагрузить конфигуратор для конкретного типа продукта
 */
export function preloadConfigurator(productType: ProductType): void {
  const info = getConfiguratorInfo(productType);
  if (info.preloadFunction) {
    info.preloadFunction();
  }
}

/**
 * Получить все доступные типы продуктов
 */
export function getAvailableProductTypes(): ProductType[] {
  return Object.keys(configuratorMap) as ProductType[];
}

/**
 * Получить конфигураторы по категории
 */
export function getConfiguratorsByCategory(category: 'print' | 'material' | '3d'): Array<{ 
  type: ProductType; 
  info: ProductConfiguratorInfo 
}> {
  return Object.entries(configuratorMap)
    .filter(([_, info]) => info.category === category)
    .map(([type, info]) => ({ type: type as ProductType, info }));
}

/**
 * Проверить, поддерживает ли продукт 3D визуализацию
 */
export function supports3D(productType: ProductType): boolean {
  return getConfiguratorInfo(productType).category === '3d';
}

/**
 * Проверить, поддерживает ли продукт материальные эффекты
 */
export function supportsMaterialEffects(productType: ProductType): boolean {
  return getConfiguratorInfo(productType).category === 'material';
}

/**
 * Хук для использования конфигуратора в React компонентах
 */
export function useProductConfigurator(productType: ProductType) {
  const info = getConfiguratorInfo(productType);
  
  // Предзагружаем компонент при инициализации
  if (info.preloadFunction) {
    info.preloadFunction();
  }
  
  return {
    ConfiguratorComponent: info.component,
    name: info.name,
    description: info.description,
    features: info.features,
    category: info.category,
    supports3D: supports3D(productType),
    supportsMaterialEffects: supportsMaterialEffects(productType)
  };
}

