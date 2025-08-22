// Core types for Poliprint Studio

export interface Product {
  id: string;
  slug: string;
  title: Record<string, string>; // i18n titles
  description: Record<string, string>; // i18n descriptions
  category: ProductCategory;
  basePrice: number;
  currency: 'UAH';
  images: ProductImage[];
  configSchema: ProductConfigSchema;
  techSpecs: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: Record<string, string>;
  type: 'gallery' | 'mockup' | '3d' | 'tech';
  order: number;
}

export type ProductCategory = 
  | 'canvas' 
  | 'acrylic' 
  | 'posters' 
  | 'business-cards' 
  | 'flyers' 
  | 'brochures' 
  | 'stickers' 
  | 'calendars' 
  | 'packaging' 
  | 'rigid' 
  | 'rollups' 
  | 'tshirts';

export interface ProductConfigSchema {
  type: ProductCategory;
  fields: ConfigField[];
  dependencies?: ConfigDependency[];
  validations?: ConfigValidation[];
}

export interface ConfigField {
  id: string;
  type: 'select' | 'radio' | 'checkbox' | 'number' | 'text' | 'dimension' | 'file' | 'color';
  label: Record<string, string>;
  required: boolean;
  options?: ConfigOption[];
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  accepts?: string[]; // file types
}

export interface ConfigOption {
  value: string;
  label: Record<string, string>;
  priceModifier?: number;
  priceType?: 'fixed' | 'percentage' | 'multiplier';
  disabled?: boolean;
}

export interface ConfigDependency {
  field: string;
  depends: string;
  values: string[];
  action: 'show' | 'hide' | 'enable' | 'disable';
}

export interface ConfigValidation {
  field: string;
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: Record<string, string>;
}

// Dimension types
export interface Dimension {
  unit: 'mm' | 'cm' | 'in';
  width: number;
  height: number;
}

// Specific product configs
export interface CanvasConfig {
  dimensionPreset?: '30x40' | '40x60' | '60x90' | 'custom';
  customSize?: Dimension;
  edge: 'gallery' | 'mirror' | 'solid';
  edgeColor?: string;
  stretcherDepth: '18mm' | '30mm';
  texture: 'classic' | 'linen' | 'premium';
  hanging?: boolean;
  fileId?: string;
}

export interface AcrylicConfig {
  size: Dimension;
  thickness: '3mm' | '5mm' | '8mm' | '10mm';
  substrate?: 'white' | 'black' | 'none';
  mounting: 'direct' | 'standoff' | 'facemount';
  fileId?: string;
}

export interface BusinessCardConfig {
  format: '90x50' | '85x55' | 'custom';
  customSize?: Dimension;
  corners: 'sharp' | 'rounded';
  paper: string;
  lamination?: string;
  sides: '1' | '2';
  quantity: number;
  turnaround: string;
  fileId?: string;
  approvedForPrint?: boolean;
}

export interface BrochureConfig {
  format: string;
  pages: number;
  binding: 'staple' | 'glue' | 'wire';
  cover?: string;
  lamination?: string;
  quantity: number;
  fileId?: string;
}

export interface StickerConfig {
  carrier: 'sheet' | 'roll';
  shape: 'circle' | 'square' | 'rectangle' | 'custom';
  cutContour: boolean;
  quantity: number;
  gap?: number;
  fileId?: string;
}

export interface TShirtConfig {
  model: string;
  color: string;
  sizes: Record<string, number>; // XS: 2, S: 5, etc.
  placements: TShirtPlacement[];
}

export interface TShirtPlacement {
  zone: 'front' | 'back' | 'left-sleeve' | 'right-sleeve';
  fileId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dpi: number;
}

// Cart and order types
export interface CartItem {
  id: string;
  productId: string;
  config: Record<string, any>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  fileUploads?: FileUpload[];
  preview?: string;
}

export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  preflightStatus?: PreflightStatus;
  uploadedAt: string;
}

export interface PreflightStatus {
  status: 'pending' | 'ok' | 'warning' | 'error';
  dpi?: number;
  dimensions?: Dimension;
  colorProfile?: string;
  bleed?: boolean;
  issues?: PreflightIssue[];
}

export interface PreflightIssue {
  code: string;
  level: 'info' | 'warning' | 'error';
  message: Record<string, string>;
  fix?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: 'UAH';
  customer: Customer;
  shippingInfo: ShippingInfo;
  payment: PaymentInfo;
  timeline: OrderTimeline[];
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'draft' 
  | 'pending' 
  | 'paid' 
  | 'preflight' 
  | 'production' 
  | 'quality-check' 
  | 'packaging' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  config: Record<string, any>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  files: FileUpload[];
  preview?: string;
  notes?: string;
}

export interface Customer {
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  isGuest?: boolean;
}

export interface ShippingInfo {
  method: 'novaposhta-branch' | 'novaposhta-courier';
  address: NovaPoshtaAddress;
  cost: number;
  estimatedDays: number;
}

export interface NovaPoshtaAddress {
  city: string;
  cityRef?: string;
  area: string;
  areaRef?: string;
  warehouse?: string;
  warehouseRef?: string;
  street?: string;
  building?: string;
  apartment?: string;
}

export interface PaymentInfo {
  method: 'liqpay' | 'mono' | 'wayforpay';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: Record<string, string>;
  actor?: string;
}

// User and auth types
export interface User {
  id: string;
  email: string;
  name: string; // Display name
  phone?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  role: 'user' | 'admin';
  addresses?: SavedAddress[];
  preferences?: UserPreferences;
  emailVerified?: boolean;
  createdAt?: string;
  stats?: UserStats;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  memberSince: string;
}

// Auth-specific types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string | null;
  role: 'user' | 'admin';
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

export interface AuthResponse {
  success: boolean;
  user: AuthUser;
  token: string;
  message?: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  novaPoshtaAddress: NovaPoshtaAddress;
  isDefault: boolean;
}

export interface UserPreferences {
  language: 'ua' | 'ru';
  currency: 'UAH';
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
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
  label: Record<string, string>;
  amount: number;
  type: 'base' | 'option' | 'discount' | 'shipping';
}

// Templates
export interface Template {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  category: ProductCategory;
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
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  coverImage: string;
  author: string;
  tags: string[];
  publishedAt: string;
  isPublished: boolean;
}

// Nova Poshta API types
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

export interface NovaPoshtaDeliveryPrice {
  cost: number;
  estimatedDeliveryDate: string;
}