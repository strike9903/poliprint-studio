export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string;
  basePrice: number;
  priceFrom?: number;
  currency: string;
  category: string;
  images: string[];
  tags: string[];
  rating?: number;
  isPopular?: boolean;
  isNew?: boolean;
  inStock: boolean;
  deliveryDays: number;
  material?: string;
  size?: string;
  finish?: string;
  urgency?: string;
  printType?: string;
  configSchema: ProductConfigSchema;
  options: ProductOption[];
  metadata: Record<string, any>;
}

export interface ProductConfigSchema {
  type: 'canvas' | 'acrylic' | 'business-cards' | 'flyers' | 'brochures' | 'stickers' | 'posters' | 'packaging' | 'apparel';
  version: string;
  fields: ConfigField[];
}

export interface ConfigField {
  id: string;
  type: 'select' | 'number' | 'boolean' | 'color' | 'file' | 'text';
  label: string;
  required: boolean;
  options?: { value: string; label: string; price?: number }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ProductOption {
  id: string;
  name: string;
  values: OptionValue[];
  required: boolean;
  type: 'single' | 'multiple';
}

export interface OptionValue {
  id: string;
  value: string;
  label: string;
  priceModifier: number;
  description?: string;
}

export interface CartItem {
  id: string;
  productId: number;
  config: Record<string, any>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  fileUploads: FileUpload[];
}

export interface FileUpload {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  preflightResults?: PreflightResult;
}

export interface PreflightResult {
  dpi: number;
  bleedMm: number;
  issues: PreflightIssue[];
  score: 'good' | 'warning' | 'error';
}

export interface PreflightIssue {
  type: 'dpi' | 'bleed' | 'colorMode' | 'transparency' | 'fonts';
  severity: 'warning' | 'error';
  message: string;
  suggestion?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'uk' | 'ru';
  currency: 'UAH';
  notifications: boolean;
  newsletter: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  totalPrice: number;
  currency: string;
  paymentStatus: PaymentStatus;
  deliveryInfo: DeliveryInfo;
  createdAt: Date;
  updatedAt: Date;
  timeline: OrderTimelineItem[];
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed' 
  | 'in-production'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface DeliveryInfo {
  method: 'nova-poshta' | 'ukr-poshta' | 'pickup';
  address: {
    city: string;
    warehouse: string;
    recipientName: string;
    recipientPhone: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: Date;
  cost: number;
}

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: Date;
  message: string;
  details?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isPopular: boolean;
  productCount: number;
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    parentCategory?: string;
  };
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface CatalogFilters {
  categories?: string[];
  materials?: string[];
  formats?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  rating?: number;
  search?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string | null;
  role: 'customer' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Pricing types
export interface PricingRequest {
  items: Array<{
    productId: string;
    config: Record<string, any>;
    quantity?: number;
  }>;
  currency: 'UAH';
  promoCode?: string;
}

export interface PricingResponse {
  items: PricingItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: 'UAH';
  breakdown: PriceBreakdownItem[];
}

export interface PricingItem {
  productId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface PriceBreakdownItem {
  label: string;
  amount: number;
  type: 'base' | 'option' | 'discount' | 'shipping';
}

// Nova Poshta types
export interface NovaPoshtaCity {
  ref: string;
  description: string;
  area: string;
  areaDescription: string;
}

export interface NovaPoshtaWarehouse {
  ref: string;
  description: string;
  shortAddress: string;
  number: string;
  cityRef: string;
}

// Templates
export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  previewUrl: string;
  isPremium: boolean;
  downloads: number;
  rating: number;
  createdAt: string;
}

// Blog
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  publishedAt: string;
  isPublished: boolean;
}