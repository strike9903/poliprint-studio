// Оптимизированные динамические импорты для code-splitting
import dynamic from 'next/dynamic';
import React, { ComponentType } from 'react';

// Loading компонент
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-3 text-muted-foreground">Загрузка...</span>
  </div>
);

// Error boundary для динамических компонентов
const LoadingError = () => (
  <div className="flex items-center justify-center p-8 text-red-500">
    <span>Ошибка загрузки компонента</span>
  </div>
);

// AI Configurator - тяжелый компонент с TensorFlow
export const DynamicSmartConfigurator = dynamic(
  () => import('@/components/configurator/SmartConfigurator').then(mod => ({
    default: mod.SmartConfigurator
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-pulse rounded-lg bg-muted h-64 w-full mb-4"></div>
          <p className="text-muted-foreground">Загрузка AI конфігуратора...</p>
        </div>
      </div>
    ),
    ssr: false // AI компоненты работают только на клиенте
  }
);

// Chart компоненты с библиотеками графиков
export const DynamicAnalyticsCharts = dynamic(
  () => import('@/components/admin/AnalyticsCharts').then(mod => ({
    default: mod.AnalyticsCharts
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-pulse rounded-lg bg-muted h-64 w-full mb-4"></div>
          <p className="text-muted-foreground">Загрузка аналитики...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

// Canvas/Fabric editor - полнофункциональный редактор
export const DynamicCanvasEditor = dynamic(
  () => import('@/components/configurator/CanvasEditor').then(mod => ({
    default: mod.CanvasEditor
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 bg-muted/20 rounded-lg">
        <div className="text-center">
          <div className="animate-pulse bg-muted rounded h-6 w-32 mb-2"></div>
          <p className="text-sm text-muted-foreground">Загрузка Fabric.js редактора...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

// Специализированные конфигураторы продуктов
export const DynamicCanvasConfigurator = dynamic(
  () => import('@/components/configurator/CanvasConfigurator').then(mod => ({
    default: mod.CanvasConfigurator
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 bg-muted/20 rounded-lg">
        <div className="text-center">
          <div className="animate-pulse bg-muted rounded h-6 w-32 mb-2"></div>
          <p className="text-sm text-muted-foreground">Загрузка конфигуратора холста...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

export const DynamicAcrylicConfigurator = dynamic(
  () => import('@/components/configurator/AcrylicConfigurator').then(mod => ({
    default: mod.AcrylicConfigurator
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 bg-muted/20 rounded-lg">
        <div className="text-center">
          <div className="animate-pulse bg-muted rounded h-6 w-32 mb-2"></div>
          <p className="text-sm text-muted-foreground">Загрузка конфигуратора акрила...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

export const DynamicStickerConfigurator = dynamic(
  () => import('@/components/configurator/StickerConfigurator').then(mod => ({
    default: mod.StickerConfigurator
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 bg-muted/20 rounded-lg">
        <div className="text-center">
          <div className="animate-pulse bg-muted rounded h-6 w-32 mb-2"></div>
          <p className="text-sm text-muted-foreground">Загрузка конфигуратора наклеек...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

export const DynamicPackagingConfigurator = dynamic(
  () => import('@/components/configurator/PackagingConfigurator').then(mod => ({
    default: mod.PackagingConfigurator
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 bg-muted/20 rounded-lg">
        <div className="text-center">
          <div className="animate-pulse bg-muted rounded h-6 w-32 mb-2"></div>
          <p className="text-sm text-muted-foreground">Загрузка конфигуратора упаковки...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

// 3D модели и визуализация
export const Dynamic3DPreview = dynamic(
  () => import('@/components/configurator/Canvas3DPreview').then(mod => ({
    default: mod.Canvas3DPreview
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-pulse bg-muted rounded-lg h-48 w-full mb-4"></div>
          <p className="text-muted-foreground">Загрузка 3D превью...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

// Checkout компоненты
export const DynamicModernCheckoutFlow = dynamic(
  () => import('@/components/checkout/ModernCheckoutFlow').then(mod => ({
    default: mod.ModernCheckoutFlow
  })),
  {
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-64 bg-muted rounded"></div>
        <div className="h-12 bg-muted rounded w-1/4"></div>
      </div>
    )
  }
);

// PaymentForm компонент с интеграциями
export const DynamicPaymentForm = dynamic(
  () => import('@/components/payments/PaymentForm').then(mod => ({
    default: mod.PaymentForm
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-pulse bg-muted rounded h-32 w-full mb-4"></div>
          <p className="text-muted-foreground">Загрузка форми оплати...</p>
        </div>
      </div>
    )
  }
);

// Мобильные компоненты
export const DynamicMobileImageGallery = dynamic(
  () => import('@/components/mobile/MobileImageGallery').then(mod => ({
    default: mod.MobileImageGallery
  })),
  {
    loading: LoadingSpinner,
    ssr: false // Мобильные жесты работают только на клиенте
  }
);

export const DynamicMobileSearch = dynamic(
  () => import('@/components/mobile/MobileSearch').then(mod => ({
    default: mod.MobileSearch
  })),
  {
    loading: LoadingSpinner
  }
);

// Web Vitals трекер
export const DynamicWebVitalsTracker = dynamic(
  () => import('@/components/analytics/WebVitalsTracker').then(mod => ({
    default: mod.WebVitalsTracker
  })),
  {
    loading: () => null, // Скрытая загрузка для аналитики
    ssr: false
  }
);

// Admin компоненты для управления системой
export const DynamicUserManagement = dynamic(
  () => import('@/components/admin/UserManagement').then(mod => ({
    default: mod.UserManagement
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-pulse bg-muted rounded h-40 w-full mb-4"></div>
          <p className="text-muted-foreground">Загрузка системы управления пользователями...</p>
        </div>
      </div>
    )
  }
);

export const DynamicOrderManagement = dynamic(
  () => import('@/components/admin/OrderManagement').then(mod => ({
    default: mod.OrderManagement
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-pulse bg-muted rounded h-40 w-full mb-4"></div>
          <p className="text-muted-foreground">Загрузка системы управления заказами...</p>
        </div>
      </div>
    )
  }
);

// Lazy loading хелперы
interface LazyComponentOptions {
  loading?: () => JSX.Element;
  error?: () => JSX.Element;
  delay?: number;
}

export function createLazyComponent<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: LazyComponentOptions = {}
) {
  const {
    loading = () => <LoadingSpinner />,
    error = () => <LoadingError />
  } = options;

  return dynamic(importFn, {
    loading,
    ssr: false
  });
}

// Preload функции для критических компонентов
export const preloadConfigurator = () => {
  import('@/components/configurator/SmartConfigurator');
};

export const preloadProductConfigurators = () => {
  import('@/components/configurator/CanvasConfigurator');
  import('@/components/configurator/AcrylicConfigurator');
  import('@/components/configurator/StickerConfigurator');
  import('@/components/configurator/PackagingConfigurator');
};

export const preloadCanvasConfigurator = () => {
  import('@/components/configurator/CanvasConfigurator');
};

export const preloadAcrylicConfigurator = () => {
  import('@/components/configurator/AcrylicConfigurator');
};

export const preloadStickerConfigurator = () => {
  import('@/components/configurator/StickerConfigurator');
};

export const preloadPackagingConfigurator = () => {
  import('@/components/configurator/PackagingConfigurator');
};

export const preloadCheckout = () => {
  import('@/components/checkout/ModernCheckoutFlow');
};

// Preload админских компонентов
export const preloadAdminCharts = () => {
  import('@/components/admin/AnalyticsCharts');
};

export const preloadAdminComponents = () => {
  import('@/components/admin/UserManagement');
  import('@/components/admin/OrderManagement');
};

export const preloadPaymentComponents = () => {
  import('@/components/payments/PaymentForm');
};

export const preloadCanvas = () => {
  import('@/components/configurator/CanvasEditor');
  import('@/components/configurator/Canvas3DPreview');
};

// Hook для предзагрузки компонентов при hover
export function usePreloadOnHover(preloadFn: () => void) {
  const handleMouseEnter = () => {
    preloadFn();
  };

  return { onMouseEnter: handleMouseEnter };
}

// Компонент для предзагрузки ресурсов
export const ResourcePreloader = () => {
  if (typeof window === 'undefined') return null;

  // Предзагрузка критических ресурсов в idle time
  requestIdleCallback(() => {
    // Предзагружаем только если пользователь не на мобильном и есть быстрое соединение
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === '4g' && !connection.saveData) {
        // Приоритетная предзагрузка
        preloadConfigurator();
        
        // Предзагрузка конфигураторов продуктов
        setTimeout(() => {
          preloadProductConfigurators();
        }, 1000);
        
        // Предзагрузка админских компонентов (если пользователь админ)
        if (window.location.pathname.includes('/admin')) {
          setTimeout(() => {
            preloadAdminComponents();
            preloadAdminCharts();
          }, 2000);
        }
        
        // Предзагрузка компонентов оплаты и checkout
        setTimeout(() => {
          preloadCheckout();
          preloadPaymentComponents();
        }, 3000);
      }
    }
  });

  return null;
};