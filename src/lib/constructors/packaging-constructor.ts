import { BaseConstructor, DesignElement, ProductConfig, DesignTemplate } from '../constructor-engine';
import * as THREE from 'three';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface PackagingConfig extends Omit<ProductConfig, 'materials'> {
  packageType: 'box' | 'tube' | 'envelope' | 'bag' | 'tray' | 'wrapper' | 'label';
  structure: {
    type: '3d' | 'flat' | 'popup';
    foldingPattern: 'standard' | 'custom' | 'die_cut';
    unfoldTemplate: string;
    assemblyInstructions: string[];
  };
  dimensions3D: {
    length: number;
    width: number;
    height: number;
    unit: 'mm' | 'cm' | 'inch';
    volume: number;
  };
  materials: {
    paperType: 'cardboard' | 'corrugated' | 'kraft' | 'glossy' | 'matte' | 'recycled';
    thickness: number;
    weight: number;
    coating: 'none' | 'lamination' | 'varnish' | 'spot_uv' | 'foil';
    sustainability: {
      recyclable: boolean;
      biodegradable: boolean;
      fscCertified: boolean;
      carbonNeutral: boolean;
    };
  };
  structural: {
    glueType: 'hot_melt' | 'cold_glue' | 'double_sided_tape' | 'none';
    reinforcement: boolean;
    windowCutouts: {
      enabled: boolean;
      shape: 'rectangle' | 'circle' | 'custom';
      position: { x: number; y: number; z: number };
      size: { width: number; height: number };
    }[];
    perforations: {
      enabled: boolean;
      type: 'tear_strip' | 'easy_open' | 'vent_holes';
      pattern: 'straight' | 'curved' | 'custom';
    };
  };
  printing: {
    sides: ('front' | 'back' | 'left' | 'right' | 'top' | 'bottom')[];
    colorMode: 'cmyk' | 'pantone' | 'digital_rgb';
    specialFinishes: {
      embossing: boolean;
      debossing: boolean;
      foilStamping: { enabled: boolean; color: string; areas: string[] };
      spotVarnish: boolean;
      texturalEffects: string[];
    };
  };
  assembly: {
    difficulty: 'easy' | 'medium' | 'complex';
    estimatedTime: number; // minutes
    toolsRequired: string[];
    qualityChecks: string[];
  };
  branding: {
    logoPlacement: { face: string; position: { x: number; y: number }; size: number }[];
    brandColors: string[];
    typography: {
      primary: string;
      secondary: string;
      hierarchy: 'title' | 'subtitle' | 'body' | 'caption';
    };
    consistency: {
      brandGuidelines: boolean;
      colorAccuracy: number;
      logoIntegrity: boolean;
    };
  };
  visualization: {
    render3D: boolean;
    unfoldView: boolean;
    assemblyAnimation: boolean;
    materialPreview: boolean;
    lightingSetup: 'studio' | 'natural' | 'dramatic' | 'custom';
    viewingAngles: string[];
  };
}

export interface PackagingTemplate extends DesignTemplate {
  packageType: PackagingConfig['packageType'];
  structure: PackagingConfig['structure'];
  difficulty: PackagingConfig['assembly']['difficulty'];
  industryFocus: 'food' | 'cosmetics' | 'electronics' | 'fashion' | 'pharmaceutical' | 'gift' | 'shipping';
  dieline: string; // SVG or vector file path
  preview3D: string;
  unfoldPattern: string;
  assemblySteps: string[];
  marketingFeatures: {
    shelfAppeal: number;
    functionalBenefits: string[];
    targetAudience: string[];
    usageScenarios: string[];
  };
}

export class PackagingConstructor extends BaseConstructor {
  private threejsScene: THREE.Scene | null = null;
  private threejsRenderer: THREE.WebGLRenderer | null = null;
  private packageMesh: THREE.Group | null = null;
  private unfoldPattern: string = '';
  private assemblySteps: string[] = [];

  constructor(config: ProductConfig) {
    super(config);
    this.initializePackagingSpecifics();
  }

  private initializePackagingSpecifics() {
    // Initialize 3D scene for packaging visualization
    if (typeof window !== 'undefined') {
      this.threejsScene = new THREE.Scene();
      this.threejsRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.setupDefaultLighting();
      this.setupCamera();
    }
  }

  private setupDefaultLighting() {
    if (!this.threejsScene) return;

    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.threejsScene.add(ambientLight);

    // Directional light for shadows and highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    this.threejsScene.add(directionalLight);

    // Point lights for studio-like setup
    const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight1.position.set(-10, 10, 10);
    this.threejsScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 100);
    pointLight2.position.set(10, -10, 10);
    this.threejsScene.add(pointLight2);
  }

  private setupCamera() {
    if (!this.threejsScene) return;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
  }

  async getAvailableTemplates(): Promise<PackagingTemplate[]> {
    // Simulate API call for packaging templates
    return [
      {
        id: 'pkg_classic_box',
        name: 'Класична коробка',
        category: 'packaging',
        tags: ['classic', 'box', 'cardboard'],
        thumbnail: '/templates/packaging/classic-box.jpg',
        preview3D: '/templates/packaging/classic-box-3d.glb',
        unfoldPattern: '/templates/packaging/classic-box-unfold.svg',
        dieline: '/templates/packaging/classic-box-dieline.svg',
        isPremium: false,
        packageType: 'box',
        structure: {
          type: '3d',
          foldingPattern: 'standard',
          unfoldTemplate: 'box_standard',
          assemblyInstructions: [
            'Вирізати по контуру',
            'Згорнути по лініях згину',
            'Склеїти клапани',
            'Перевірити міцність з\'єднань'
          ]
        },
        difficulty: 'easy',
        industryFocus: 'gift',
        assemblySteps: [
          'Підготувати інструменти',
          'Вирізати заготовку',
          'Створити згини',
          'Склеїти елементи',
          'Провести контроль якості'
        ],
        marketingFeatures: {
          shelfAppeal: 8,
          functionalBenefits: ['Легка збірка', 'Міцна конструкція', 'Універсальне використання'],
          targetAudience: ['Підприємці', 'Інтернет-магазини', 'Подарункові сервіси'],
          usageScenarios: ['Подарункова упаковка', 'Доставка товарів', 'Зберігання']
        },
        productType: 'packaging',
        elements: [],
        metadata: {
          author: 'Poliprint Design Team',
          description: 'Стандартна картонна коробка для загального використання',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 124,
          rating: 4.6
        }
      },
      {
        id: 'pkg_pillow_box',
        name: 'Подушка-бокс',
        category: 'packaging',
        tags: ['pillow', 'premium', 'curved'],
        thumbnail: '/templates/packaging/pillow-box.jpg',
        preview3D: '/templates/packaging/pillow-box-3d.glb',
        unfoldPattern: '/templates/packaging/pillow-box-unfold.svg',
        dieline: '/templates/packaging/pillow-box-dieline.svg',
        isPremium: true,
        packageType: 'box',
        structure: {
          type: '3d',
          foldingPattern: 'custom',
          unfoldTemplate: 'pillow_curved',
          assemblyInstructions: [
            'Вирізати по криволінійному контуру',
            'Створити округлі згини',
            'Сформувати подушкоподібну форму',
            'Зафіксувати торці'
          ]
        },
        difficulty: 'medium',
        industryFocus: 'cosmetics',
        assemblySteps: [
          'Підготувати спеціальні інструменти для кривих',
          'Точно вирізати заготовку',
          'Створити плавні згини',
          'Формувати об\'ємну форму',
          'Фіксувати без деформації'
        ],
        marketingFeatures: {
          shelfAppeal: 9,
          functionalBenefits: ['Преміум вигляд', 'Захист товару', 'Легке відкриття'],
          targetAudience: ['Косметичні бренди', 'Ювелірні магазини', 'Luxury бренди'],
          usageScenarios: ['Преміум товари', 'Подарунки', 'Брендована упаковка']
        },
        productType: 'packaging',
        elements: [],
        metadata: {
          author: 'Poliprint Design Team',
          description: 'Елегантна упаковка у формі подушки для преміум товарів',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 89,
          rating: 4.9
        }
      },
      {
        id: 'pkg_display_box',
        name: 'Витринна коробка',
        category: 'packaging',
        tags: ['display', 'window', 'retail'],
        thumbnail: '/templates/packaging/display-box.jpg',
        preview3D: '/templates/packaging/display-box-3d.glb',
        unfoldPattern: '/templates/packaging/display-box-unfold.svg',
        dieline: '/templates/packaging/display-box-dieline.svg',
        isPremium: false,
        packageType: 'box',
        structure: {
          type: '3d',
          foldingPattern: 'die_cut',
          unfoldTemplate: 'display_window',
          assemblyInstructions: [
            'Вирізати основну форму',
            'Вирізати віконце',
            'Вклеїти прозору плівку',
            'Зібрати коробку'
          ]
        },
        difficulty: 'medium',
        industryFocus: 'food',
        assemblySteps: [
          'Підготувати матеріали та інструменти',
          'Вирізати основну заготовку',
          'Створити віконний отвір',
          'Встановити прозоре покриття',
          'Зібрати в готову форму'
        ],
        marketingFeatures: {
          shelfAppeal: 9,
          functionalBenefits: ['Демонстрація товару', 'Захист від пошкоджень', 'Привабливість на полиці'],
          targetAudience: ['Продуктові бренди', 'Іграшкові магазини', 'Роздрібна торгівля'],
          usageScenarios: ['Супермаркети', 'Фірмові магазини', 'Виставки']
        },
        productType: 'packaging',
        elements: [],
        metadata: {
          author: 'Poliprint Design Team',
          description: 'Упаковка з віконцем для демонстрації товару',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 67,
          rating: 4.4
        }
      }
    ];
  }

  async loadTemplate(templateId: string): Promise<boolean> {
    const templates = await this.getAvailableTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Load template configuration
    const config = this.project.productConfig as unknown as PackagingConfig;
    config.packageType = template.packageType;
    config.structure = template.structure;
    config.assembly = {
      ...config.assembly,
      difficulty: template.difficulty
    };

    this.unfoldPattern = template.unfoldPattern;
    this.assemblySteps = template.assemblySteps;

    // Load 3D model if available
    if (template.preview3D && this.threejsScene) {
      await this.load3DModel(template.preview3D);
    }

    this.emit('templateLoaded', { templateId, template });
    return true;
  }

  private async load3DModel(modelPath: string): Promise<void> {
    // This would integrate with Three.js loaders in a real implementation
    // For now, we'll create a placeholder 3D representation
    if (!this.threejsScene) return;

    // Clear existing package mesh
    if (this.packageMesh) {
      this.threejsScene.remove(this.packageMesh);
    }

    // Create a new package mesh group
    this.packageMesh = new THREE.Group();

    const config = this.project.productConfig as unknown as PackagingConfig;
    const geometry = new THREE.BoxGeometry(
      config.dimensions3D?.length || 100,
      config.dimensions3D?.height || 50,
      config.dimensions3D?.width || 80
    );

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.packageMesh.add(mesh);

    // Add edges for better visualization
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    this.packageMesh.add(wireframe);

    this.threejsScene.add(this.packageMesh);
  }

  updatePackageType(type: PackagingConfig['packageType']): void {
    const config = this.project.productConfig as unknown as PackagingConfig;
    config.packageType = type;
    
    // Update 3D visualization based on package type
    this.updateVisualization();
    this.emit('packageTypeChanged', { type });
  }

  updateDimensions3D(dimensions: PackagingConfig['dimensions3D']): void {
    const config = this.project.productConfig as unknown as PackagingConfig;
    config.dimensions3D = dimensions;
    
    // Recalculate volume
    config.dimensions3D.volume = dimensions.length * dimensions.width * dimensions.height;
    
    // Update 3D model
    this.update3DModel();
    this.emit('dimensionsChanged', { dimensions });
  }

  private update3DModel(): void {
    if (!this.packageMesh || !this.threejsScene) return;

    const config = this.project.productConfig as unknown as PackagingConfig;
    
    // Remove old mesh
    this.threejsScene.remove(this.packageMesh);
    
    // Create new mesh with updated dimensions
    this.packageMesh = new THREE.Group();
    
    const geometry = new THREE.BoxGeometry(
      config.dimensions3D.length,
      config.dimensions3D.height,
      config.dimensions3D.width
    );

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.packageMesh.add(mesh);

    this.threejsScene.add(this.packageMesh);
  }

  updateMaterial(material: Partial<PackagingConfig['materials']>): void {
    const config = this.project.productConfig as unknown as PackagingConfig;
    config.materials = { ...config.materials, ...material };
    
    // Update visual representation
    this.updateMaterialVisualization(config.materials);
    this.emit('materialChanged', { material: config.materials });
  }

  private updateMaterialVisualization(materials: PackagingConfig['materials']): void {
    if (!this.packageMesh) return;

    // Update material properties based on paper type
    const mesh = this.packageMesh.children[0] as THREE.Mesh;
    if (mesh && mesh.material) {
      const material = mesh.material as THREE.MeshPhongMaterial;
      
      // Set color based on paper type
      switch (materials.paperType) {
        case 'kraft':
          material.color.setHex(0xd2b48c);
          break;
        case 'corrugated':
          material.color.setHex(0xf4e4bc);
          break;
        case 'glossy':
          material.color.setHex(0xffffff);
          material.shininess = 100;
          break;
        case 'matte':
          material.color.setHex(0xf5f5f5);
          material.shininess = 10;
          break;
        default:
          material.color.setHex(0xffffff);
      }
    }
  }

  addWindowCutout(cutout: PackagingConfig['structural']['windowCutouts'][0]): void {
    const config = this.project.productConfig as unknown as PackagingConfig;
    config.structural.windowCutouts.push(cutout);
    
    // Update 3D visualization
    this.updateStructuralFeatures();
    this.emit('windowCutoutAdded', { cutout });
  }

  private updateStructuralFeatures(): void {
    // Update 3D model to show structural features like windows, perforations, etc.
    if (!this.packageMesh || !this.threejsScene) return;

    const config = this.project.productConfig as unknown as PackagingConfig;
    
    // Add window cutouts as transparent materials
    config.structural.windowCutouts.forEach((window, index) => {
      if (window.enabled) {
        const windowGeometry = new THREE.PlaneGeometry(window.size.width, window.size.height);
        const windowMaterial = new THREE.MeshBasicMaterial({
          color: 0x87ceeb,
          transparent: true,
          opacity: 0.3
        });
        
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(window.position.x, window.position.y, window.position.z + 1);
        if (this.packageMesh) {
          this.packageMesh.add(windowMesh);
        }
      }
    });
  }

  generateUnfoldPattern(): string {
    const config = this.project.productConfig as unknown as PackagingConfig;
    
    // Generate SVG unfold pattern based on package dimensions and type
    const { length, width, height } = config.dimensions3D;
    
    let svgContent = `<svg width="${length * 3}" height="${height * 2 + width * 2}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add main faces
    svgContent += `
      <!-- Bottom -->
      <rect x="${length}" y="${height}" width="${width}" height="${length}" fill="none" stroke="black" stroke-width="1"/>
      <!-- Top -->
      <rect x="${length}" y="0" width="${width}" height="${length}" fill="none" stroke="black" stroke-width="1"/>
      <!-- Front -->
      <rect x="${length}" y="${height + length}" width="${width}" height="${height}" fill="none" stroke="black" stroke-width="1"/>
      <!-- Back -->
      <rect x="${length}" y="${height + length + height}" width="${width}" height="${height}" fill="none" stroke="black" stroke-width="1"/>
      <!-- Left -->
      <rect x="0" y="${height + length}" width="${length}" height="${height}" fill="none" stroke="black" stroke-width="1"/>
      <!-- Right -->
      <rect x="${length + width}" y="${height + length}" width="${length}" height="${height}" fill="none" stroke="black" stroke-width="1"/>
    `;
    
    // Add fold lines
    svgContent += `
      <!-- Fold lines -->
      <line x1="${length}" y1="0" x2="${length}" y2="${height * 2 + length * 2}" stroke="red" stroke-width="0.5" stroke-dasharray="5,5"/>
      <line x1="${length + width}" y1="0" x2="${length + width}" y2="${height * 2 + length * 2}" stroke="red" stroke-width="0.5" stroke-dasharray="5,5"/>
      <line x1="0" y1="${height + length}" x2="${length * 3}" y2="${height + length}" stroke="red" stroke-width="0.5" stroke-dasharray="5,5"/>
      <line x1="0" y1="${height + length + height}" x2="${length * 3}" y2="${height + length + height}" stroke="red" stroke-width="0.5" stroke-dasharray="5,5"/>
    `;
    
    svgContent += '</svg>';
    
    this.unfoldPattern = svgContent;
    return svgContent;
  }

  generateAssemblyInstructions(): string[] {
    const config = this.project.productConfig as unknown as PackagingConfig;
    
    const instructions = [
      `1. Підготуйте матеріали: ${config.materials.paperType} товщиною ${config.materials.thickness}мм`,
      '2. Роздрукуйте розгортку на принтері з роздільною здатністю 300 DPI',
      '3. Вирізайте по суцільних лініях за допомогою канцелярського ножа',
      '4. Створіть згини по пунктирних лініях за допомогою лінійки',
      '5. Нанесіть клей на відповідні клапани'
    ];

    // Add specific instructions based on package type
    switch (config.packageType) {
      case 'box':
        instructions.push(
          '6. Зберіть основну коробку, починаючи з днища',
          '7. Закріпіть бокові стінки',
          '8. Встановіть верхню частину'
        );
        break;
      case 'tube':
        instructions.push(
          '6. Сформуйте циліндричну форму',
          '7. Склейте продольний шов',
          '8. Закріпіть торцеві кришки'
        );
        break;
      case 'envelope':
        instructions.push(
          '6. Складіть конверт почергово',
          '7. Закріпіть клапани',
          '8. Перевірте герметичність'
        );
        break;
    }

    // Add quality control steps
    instructions.push(
      '9. Перевірте міцність всіх з\'єднань',
      '10. Переконайтеся в правильності розмірів',
      '11. Проведіть тест на навантаження'
    );

    this.assemblySteps = instructions;
    return instructions;
  }

  updateVisualization(): void {
    const config = this.project.productConfig as unknown as PackagingConfig;
    
    if (config.visualization.render3D) {
      this.update3DModel();
      this.updateStructuralFeatures();
      this.updateMaterialVisualization(config.materials);
    }
    
    if (config.visualization.unfoldView) {
      this.generateUnfoldPattern();
    }
    
    this.emit('visualizationUpdated', { config: config.visualization });
  }

  async calculatePrice(quantity: number): Promise<any> {
    const config = this.project.productConfig as unknown as PackagingConfig;
    
    // Base pricing calculation
    let basePrice = config.basePrice || 100;
    let unitPrice = config.pricePerUnit || 2.5;
    
    // Material multipliers
    const materialMultipliers = {
      'cardboard': 1.0,
      'corrugated': 1.3,
      'kraft': 0.9,
      'glossy': 1.4,
      'matte': 1.2,
      'recycled': 1.1
    };
    
    // Complexity multipliers
    const complexityMultipliers = {
      'easy': 1.0,
      'medium': 1.3,
      'complex': 1.8
    };
    
    // Package type multipliers
    const typeMultipliers = {
      'box': 1.0,
      'tube': 1.2,
      'envelope': 0.8,
      'bag': 0.7,
      'tray': 1.1,
      'wrapper': 0.6,
      'label': 0.5
    };
    
    // Calculate volume-based pricing
    const volume = config.dimensions3D.volume / 1000000; // Convert to liters
    const volumeMultiplier = Math.max(0.5, Math.min(2.0, 1 + (volume - 1) * 0.1));
    
    // Apply multipliers
    const materialMultiplier = materialMultipliers[config.materials.paperType] || 1.0;
    const complexityMultiplier = complexityMultipliers[config.assembly.difficulty] || 1.0;
    const typeMultiplier = typeMultipliers[config.packageType] || 1.0;
    
    let subtotal = (basePrice + (unitPrice * quantity)) * materialMultiplier * complexityMultiplier * typeMultiplier * volumeMultiplier;
    
    // Additional features pricing
    let featuresPrice = 0;
    
    if (config.structural.windowCutouts.some(w => w.enabled)) {
      featuresPrice += 15 * quantity;
    }
    
    if (config.structural.perforations.enabled) {
      featuresPrice += 8 * quantity;
    }
    
    if (config.printing.specialFinishes.embossing) {
      featuresPrice += 25 * quantity;
    }
    
    if (config.printing.specialFinishes.foilStamping.enabled) {
      featuresPrice += 30 * quantity;
    }
    
    if (config.materials.coating !== 'none') {
      featuresPrice += 12 * quantity;
    }
    
    // Quantity discounts
    let discountAmount = 0;
    if (quantity >= 5000) discountAmount = subtotal * 0.15;
    else if (quantity >= 2000) discountAmount = subtotal * 0.12;
    else if (quantity >= 1000) discountAmount = subtotal * 0.08;
    else if (quantity >= 500) discountAmount = subtotal * 0.05;
    
    const total = subtotal + featuresPrice - discountAmount;
    
    return {
      total: Math.round(total * 100) / 100,
      breakdown: {
        subtotal: Math.round(subtotal * 100) / 100,
        featuresPrice: Math.round(featuresPrice * 100) / 100,
        discountAmount: Math.round(discountAmount * 100) / 100,
        details: {
          packageType: config.packageType,
          material: config.materials.paperType,
          complexity: config.assembly.difficulty,
          volume: `${config.dimensions3D.volume.toFixed(2)} см³`,
          coating: config.materials.coating,
          specialFeatures: this.getActiveFeatures(config)
        }
      }
    };
  }

  private getActiveFeatures(config: PackagingConfig): string[] {
    const features = [];
    
    if (config.structural.windowCutouts.some(w => w.enabled)) {
      features.push('Віконні вирізи');
    }
    
    if (config.structural.perforations.enabled) {
      features.push('Перфорація');
    }
    
    if (config.printing.specialFinishes.embossing) {
      features.push('Тиснення');
    }
    
    if (config.printing.specialFinishes.foilStamping.enabled) {
      features.push('Фольгування');
    }
    
    if (config.materials.coating !== 'none') {
      features.push('Покриття');
    }
    
    if (config.materials.sustainability.fscCertified) {
      features.push('FSC сертифікат');
    }
    
    return features;
  }

  async validateDesign(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const config = this.project.productConfig as unknown as PackagingConfig;
    
    // Validate dimensions
    if (!config.dimensions3D || config.dimensions3D.length <= 0 || config.dimensions3D.width <= 0 || config.dimensions3D.height <= 0) {
      errors.push('Всі розміри упаковки повинні бути більше нуля');
    }
    
    // Check minimum/maximum dimensions based on material
    const maxDimension = Math.max(config.dimensions3D.length, config.dimensions3D.width, config.dimensions3D.height);
    if (config.materials.paperType === 'cardboard' && maxDimension > 600) {
      warnings.push('Великі розміри можуть потребувати додаткового зміцнення для картону');
    }
    
    // Validate volume constraints
    const volume = config.dimensions3D.volume;
    if (volume > 1000000) { // 1 cubic meter
      warnings.push('Великий об\'єм може ускладнити виробництво');
    }
    
    // Check material thickness vs dimensions
    if (config.materials.thickness < 2 && maxDimension > 300) {
      warnings.push('Тонкий матеріал може бути недостатньо міцним для великих розмірів');
    }
    
    // Validate assembly complexity
    if (config.assembly.difficulty === 'complex' && !config.assembly.toolsRequired?.length) {
      errors.push('Складна збірка повинна містити перелік необхідних інструментів');
    }
    
    // Check printing constraints
    if (config.printing.sides.length === 0) {
      errors.push('Повинна бути вибрана принаймні одна сторона для друку');
    }
    
    // Validate window cutouts
    config.structural.windowCutouts.forEach((window, index) => {
      if (window.enabled) {
        if (window.size.width >= config.dimensions3D.width * 0.8 || window.size.height >= config.dimensions3D.height * 0.8) {
          warnings.push(`Віконний виріз ${index + 1} занадто великий і може ослабити конструкцію`);
        }
      }
    });
    
    // Check sustainability features
    if (config.materials.sustainability.recyclable && config.materials.coating === 'lamination') {
      warnings.push('Ламінування може ускладнити переробку матеріалу');
    }
    
    // Validate brand consistency
    if (config.branding.logoPlacement.length === 0) {
      warnings.push('Рекомендується додати логотип для кращого впізнання бренду');
    }
    
    // Check special finishes compatibility
    if (config.printing.specialFinishes.embossing && config.materials.thickness < 1.5) {
      errors.push('Тиснення потребує матеріал товщиною принаймні 1.5мм');
    }
    
    // Performance validation
    if (config.assembly.estimatedTime > 30 && config.assembly.difficulty === 'easy') {
      warnings.push('Час збірки не відповідає заявленій простоті');
    }
    
    const isValid = errors.length === 0;
    
    return {
      valid: isValid,
      errors,
      warnings,
      suggestions: this.generateSuggestions(config, warnings)
    };
  }

  private generateSuggestions(config: PackagingConfig, warnings: string[]): string[] {
    const suggestions = [];
    
    if (warnings.some(w => w.includes('зміцнення'))) {
      suggestions.push('Розгляньте використання гофрокартону для кращої міцності');
    }
    
    if (config.materials.sustainability.recyclable) {
      suggestions.push('Додайте екологічні маркування для підвищення привабливості');
    }
    
    if (config.packageType === 'box' && !config.structural.reinforcement) {
      suggestions.push('Додайте зміцнення кутів для підвищення довговічності');
    }
    
    if (config.assembly.difficulty === 'complex') {
      suggestions.push('Розгляньте створення відео-інструкції для складної збірки');
    }
    
    if (config.branding.logoPlacement.length === 0) {
      suggestions.push('Розмістіть логотип на найбільш видимій стороні упаковки');
    }
    
    return suggestions;
  }

  exportConfig(): PackagingConfig {
    return this.project.productConfig as unknown as PackagingConfig;
  }

  get3DScene(): THREE.Scene | null {
    return this.threejsScene;
  }

  getUnfoldPattern(): string {
    return this.unfoldPattern || this.generateUnfoldPattern();
  }

  getAssemblySteps(): string[] {
    return this.assemblySteps.length > 0 ? this.assemblySteps : this.generateAssemblyInstructions();
  }

  async exportDesign(format: 'pdf' | 'png' | 'jpg' | 'svg' | '3d' | 'unfold'): Promise<Blob> {
    const config = this.project.productConfig as unknown as PackagingConfig;
    
    switch (format) {
      case '3d':
        return this.export3DModel();
      case 'unfold':
        return this.exportUnfoldPattern();
      case 'svg':
        return this.exportAsSVG();
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private async export3DModel(): Promise<Blob> {
    // Export 3D model in GLB or OBJ format
    const modelData = JSON.stringify({
      type: '3D Model Export',
      packageType: (this.project.productConfig as unknown as PackagingConfig).packageType,
      dimensions: (this.project.productConfig as unknown as PackagingConfig).dimensions3D,
      timestamp: new Date().toISOString()
    });
    
    return new Blob([modelData], { type: 'application/json' });
  }

  private async exportUnfoldPattern(): Promise<Blob> {
    const pattern = this.getUnfoldPattern();
    return new Blob([pattern], { type: 'image/svg+xml' });
  }

  private async exportAsSVG(): Promise<Blob> {
    // Generate comprehensive SVG with both 3D view and unfold pattern
    let svgContent = `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add 3D isometric view
    svgContent += this.generate3DIsometricView();
    
    // Add unfold pattern
    svgContent += `<g transform="translate(600, 0)">`;
    svgContent += this.generateUnfoldPattern().replace(/<svg[^>]*>|<\/svg>/g, '');
    svgContent += '</g>';
    
    svgContent += '</svg>';
    
    return new Blob([svgContent], { type: 'image/svg+xml' });
  }

  private generate3DIsometricView(): string {
    const config = this.project.productConfig as unknown as PackagingConfig;
    const { length, width, height } = config.dimensions3D;
    
    // Simple isometric projection
    const scale = 2;
    const offsetX = 100;
    const offsetY = 100;
    
    // Convert 3D coordinates to isometric 2D
    const iso = (x: number, y: number, z: number) => ({
      x: offsetX + (x - z) * Math.cos(Math.PI / 6) * scale,
      y: offsetY + (x + z) * Math.sin(Math.PI / 6) * scale + y * scale
    });
    
    const corners = [
      iso(0, 0, 0),
      iso(length, 0, 0),
      iso(length, height, 0),
      iso(0, height, 0),
      iso(0, 0, width),
      iso(length, 0, width),
      iso(length, height, width),
      iso(0, height, width)
    ];
    
    let isometricView = `
      <!-- 3D Isometric View -->
      <g id="isometric-view">
        <!-- Front face -->
        <polygon points="${corners[0].x},${corners[0].y} ${corners[1].x},${corners[1].y} ${corners[2].x},${corners[2].y} ${corners[3].x},${corners[3].y}" 
                 fill="white" stroke="black" stroke-width="1"/>
        <!-- Right face -->
        <polygon points="${corners[1].x},${corners[1].y} ${corners[5].x},${corners[5].y} ${corners[6].x},${corners[6].y} ${corners[2].x},${corners[2].y}" 
                 fill="#f0f0f0" stroke="black" stroke-width="1"/>
        <!-- Top face -->
        <polygon points="${corners[3].x},${corners[3].y} ${corners[2].x},${corners[2].y} ${corners[6].x},${corners[6].y} ${corners[7].x},${corners[7].y}" 
                 fill="#e0e0e0" stroke="black" stroke-width="1"/>
      </g>
    `;
    
    return isometricView;
  }
}