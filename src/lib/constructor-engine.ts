// Универсальная система конструкторов продуктов

export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'background' | 'logo';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  layer: number;
  locked: boolean;
  visible: boolean;
  data: Record<string, any>; // Специфичные данные для каждого типа
}

export interface TextElement extends DesignElement {
  type: 'text';
  data: {
    text: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    color: string;
    backgroundColor?: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    lineHeight: number;
    letterSpacing: number;
    textDecoration: string;
    textShadow?: string;
  };
}

export interface ImageElement extends DesignElement {
  type: 'image';
  data: {
    src: string;
    alt: string;
    filter?: string;
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    cropX: number;
    cropY: number;
    cropWidth: number;
    cropHeight: number;
    maskShape?: 'circle' | 'rounded' | 'polygon';
  };
}

export interface ShapeElement extends DesignElement {
  type: 'shape';
  data: {
    shape: 'rectangle' | 'circle' | 'triangle' | 'polygon' | 'line' | 'arrow';
    fill: string;
    stroke: string;
    strokeWidth: number;
    strokeDashArray?: number[];
    borderRadius?: number;
    points?: Array<{x: number, y: number}>; // Для полигонов
  };
}

// Базовый интерфейс продукта
export interface ProductConfig {
  id: string;
  name: string;
  category: 'business-cards' | 'flyers' | 'canvas' | 'acrylic' | 'stickers' | 'packaging';
  dimensions: {
    width: number;
    height: number;
    unit: 'mm' | 'cm' | 'in' | 'px';
    dpi: number;
  };
  printArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  bleedArea?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  materials: string[];
  finishes: string[];
  orientation: 'portrait' | 'landscape' | 'square';
  sides: 1 | 2; // Односторонний или двусторонний
  minQuantity: number;
  maxQuantity: number;
  basePrice: number;
  pricePerUnit: number;
  constraints: {
    minFontSize: number;
    maxColors: number;
    allowedFileTypes: string[];
    maxFileSize: number;
    requiredDPI: number;
  };
}

// Шаблон дизайна
export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  productType: string;
  thumbnail: string;
  isPremium: boolean;
  tags: string[];
  elements: DesignElement[];
  metadata: {
    author: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    usageCount: number;
    rating: number;
  };
}

// Состояние проекта
export interface ProjectState {
  id: string;
  name: string;
  productConfig: ProductConfig;
  currentSide: number; // Для двусторонних продуктов
  sides: {
    front: DesignElement[];
    back?: DesignElement[];
  };
  history: {
    states: string[]; // Сериализованные состояния для undo/redo
    currentIndex: number;
    maxStates: number;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    autoSaveAt?: string;
    version: string;
  };
  settings: {
    snapToGrid: boolean;
    gridSize: number;
    showGuides: boolean;
    showRulers: boolean;
    showBleed: boolean;
    showSafeArea: boolean;
    zoom: number;
  };
}

// Базовый класс конструктора
export abstract class BaseConstructor {
  protected project: ProjectState;
  protected canvas: any; // Fabric.js canvas
  protected listeners: Map<string, Function[]> = new Map();

  constructor(productConfig: ProductConfig, templateId?: string) {
    this.project = this.initializeProject(productConfig, templateId);
  }

  // Инициализация проекта
  private initializeProject(productConfig: ProductConfig, templateId?: string): ProjectState {
    return {
      id: this.generateId(),
      name: `${productConfig.name} - ${new Date().toLocaleDateString()}`,
      productConfig,
      currentSide: 0,
      sides: {
        front: [],
        back: productConfig.sides === 2 ? [] : undefined
      },
      history: {
        states: [],
        currentIndex: -1,
        maxStates: 50
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0'
      },
      settings: {
        snapToGrid: true,
        gridSize: 10,
        showGuides: true,
        showRulers: true,
        showBleed: true,
        showSafeArea: true,
        zoom: 1
      }
    };
  }

  // Абстрактные методы для каждого типа продукта
  abstract getAvailableTemplates(): Promise<DesignTemplate[]>;
  abstract validateDesign(): Promise<{valid: boolean, errors: string[]}>;
  abstract calculatePrice(quantity: number): Promise<{total: number, breakdown: any}>;
  abstract exportDesign(format: 'pdf' | 'png' | 'jpg' | 'svg'): Promise<Blob>;

  // Общие методы управления элементами
  addElement(element: DesignElement, side: number = this.project.currentSide): void {
    const currentSide = side === 0 ? this.project.sides.front : this.project.sides.back;
    if (!currentSide) return;

    // Присваиваем уникальный ID если его нет
    if (!element.id) {
      element.id = this.generateId();
    }

    currentSide.push(element);
    this.saveState();
    this.emit('elementAdded', element);
  }

  removeElement(elementId: string, side: number = this.project.currentSide): boolean {
    const currentSide = side === 0 ? this.project.sides.front : this.project.sides.back;
    if (!currentSide) return false;

    const index = currentSide.findIndex(el => el.id === elementId);
    if (index === -1) return false;

    const removed = currentSide.splice(index, 1)[0];
    this.saveState();
    this.emit('elementRemoved', removed);
    return true;
  }

  updateElement(elementId: string, updates: Partial<DesignElement>, side: number = this.project.currentSide): boolean {
    const currentSide = side === 0 ? this.project.sides.front : this.project.sides.back;
    if (!currentSide) return false;

    const element = currentSide.find(el => el.id === elementId);
    if (!element) return false;

    Object.assign(element, updates);
    this.saveState();
    this.emit('elementUpdated', element);
    return true;
  }

  getElement(elementId: string, side: number = this.project.currentSide): DesignElement | null {
    const currentSide = side === 0 ? this.project.sides.front : this.project.sides.back;
    if (!currentSide) return null;

    return currentSide.find(el => el.id === elementId) || null;
  }

  getAllElements(side: number = this.project.currentSide): DesignElement[] {
    const currentSide = side === 0 ? this.project.sides.front : this.project.sides.back;
    return currentSide ? [...currentSide] : [];
  }

  // Управление слоями
  moveToLayer(elementId: string, newLayer: number): boolean {
    return this.updateElement(elementId, { layer: newLayer });
  }

  moveUp(elementId: string): boolean {
    const element = this.getElement(elementId);
    if (!element) return false;
    return this.moveToLayer(elementId, element.layer + 1);
  }

  moveDown(elementId: string): boolean {
    const element = this.getElement(elementId);
    if (!element || element.layer <= 0) return false;
    return this.moveToLayer(elementId, element.layer - 1);
  }

  moveToTop(elementId: string): boolean {
    const allElements = this.getAllElements();
    const maxLayer = Math.max(...allElements.map(el => el.layer), 0);
    return this.moveToLayer(elementId, maxLayer + 1);
  }

  moveToBottom(elementId: string): boolean {
    return this.moveToLayer(elementId, 0);
  }

  // История изменений (Undo/Redo)
  private saveState(): void {
    const currentState = JSON.stringify({
      sides: this.project.sides,
      metadata: { ...this.project.metadata, updatedAt: new Date().toISOString() }
    });

    const history = this.project.history;
    
    // Удаляем все состояния после текущего (если мы делали undo)
    history.states = history.states.slice(0, history.currentIndex + 1);
    
    // Добавляем новое состояние
    history.states.push(currentState);
    history.currentIndex++;
    
    // Ограничиваем количество состояний
    if (history.states.length > history.maxStates) {
      history.states.shift();
      history.currentIndex--;
    }
    
    this.emit('stateChanged', this.project);
  }

  undo(): boolean {
    const history = this.project.history;
    if (history.currentIndex <= 0) return false;

    history.currentIndex--;
    const previousState = JSON.parse(history.states[history.currentIndex]);
    
    this.project.sides = previousState.sides;
    this.project.metadata = previousState.metadata;
    
    this.emit('undoPerformed', this.project);
    return true;
  }

  redo(): boolean {
    const history = this.project.history;
    if (history.currentIndex >= history.states.length - 1) return false;

    history.currentIndex++;
    const nextState = JSON.parse(history.states[history.currentIndex]);
    
    this.project.sides = nextState.sides;
    this.project.metadata = nextState.metadata;
    
    this.emit('redoPerformed', this.project);
    return true;
  }

  canUndo(): boolean {
    return this.project.history.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.project.history.currentIndex < this.project.history.states.length - 1;
  }

  // Работа с шаблонами
  async loadTemplate(templateId: string): Promise<boolean> {
    try {
      const templates = await this.getAvailableTemplates();
      const template = templates.find(t => t.id === templateId);
      
      if (!template) return false;

      // Очищаем текущий дизайн
      this.project.sides.front = [];
      if (this.project.sides.back) {
        this.project.sides.back = [];
      }

      // Загружаем элементы шаблона
      template.elements.forEach(element => {
        this.addElement({ ...element, id: this.generateId() });
      });

      this.emit('templateLoaded', template);
      return true;
    } catch (error) {
      console.error('Failed to load template:', error);
      return false;
    }
  }

  // Настройки проекта
  updateSettings(settings: Partial<ProjectState['settings']>): void {
    Object.assign(this.project.settings, settings);
    this.emit('settingsUpdated', this.project.settings);
  }

  getSettings(): ProjectState['settings'] {
    return { ...this.project.settings };
  }

  // Автосохранение
  async autoSave(): Promise<boolean> {
    try {
      const projectData = this.serializeProject();
      localStorage.setItem(`project_${this.project.id}`, projectData);
      
      this.project.metadata.autoSaveAt = new Date().toISOString();
      this.emit('autoSaved', this.project);
      return true;
    } catch (error) {
      console.error('Auto-save failed:', error);
      return false;
    }
  }

  // Сериализация проекта
  serializeProject(): string {
    return JSON.stringify(this.project);
  }

  // Загрузка проекта
  static loadProject(projectData: string): ProjectState {
    return JSON.parse(projectData);
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  protected emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Утилиты
  private generateId(): string {
    return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Публичные геттеры
  getProject(): ProjectState {
    return { ...this.project };
  }

  getProductConfig(): ProductConfig {
    return { ...this.project.productConfig };
  }

  getCurrentSide(): number {
    return this.project.currentSide;
  }

  switchSide(side: number): boolean {
    if (side < 0 || side >= this.project.productConfig.sides) return false;
    
    this.project.currentSide = side;
    this.emit('sideChanged', side);
    return true;
  }
}

// Фабрика конструкторов
export class ConstructorFactory {
  static async create(productType: string, productConfig: ProductConfig, templateId?: string): Promise<BaseConstructor> {
    switch (productType) {
      case 'business-cards':
        const { BusinessCardConstructor } = await import('./constructors/business-card-constructor');
        return new BusinessCardConstructor(productConfig, templateId);
      
      case 'flyers':
        const { FlyerConstructor } = await import('./constructors/flyer-constructor');
        return new FlyerConstructor(productConfig, templateId);
      
      case 'canvas':
        const { CanvasConstructor } = await import('./constructors/canvas-constructor');
        return new CanvasConstructor(productConfig, templateId);
      
      case 'acrylic':
        const { AcrylicConstructor } = await import('./constructors/acrylic-constructor');
        return new AcrylicConstructor(productConfig, templateId);
      
      case 'stickers':
        const { StickerConstructor } = await import('./constructors/sticker-constructor');
        return new StickerConstructor(productConfig, templateId);
      
      case 'packaging':
        const { PackagingConstructor } = await import('./constructors/packaging-constructor');
        const packagingConstructor = new PackagingConstructor(productConfig);
        if (templateId) {
          await packagingConstructor.loadTemplate(templateId);
        }
        return packagingConstructor;
      
      default:
        throw new Error(`Unknown product type: ${productType}`);
    }
  }

  static getAvailableProductTypes(): string[] {
    return ['business-cards', 'flyers', 'canvas', 'acrylic', 'stickers', 'packaging'];
  }
}