"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PackagingConstructor, PackagingConfig, PackagingTemplate } from '@/lib/constructors/packaging-constructor';
import { ProductConfig } from '@/lib/constructor-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Package,
  Box,
  Layers,
  Ruler,
  Palette,
  Settings,
  Download,
  Eye,
  Sparkles,
  Undo,
  Redo,
  Save,
  Scissors,
  Printer,
  Leaf,
  Shield,
  Zap,
  Monitor,
  FileText,
  RotateCcw,
  Play,
  Volume,
  Maximize,
  Grid,
  Target,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface PackagingConfiguratorProps {
  initialConfig?: Partial<PackagingConfig>;
  onSave?: (config: PackagingConfig) => void;
  onExport?: (format: 'pdf' | 'png' | 'jpg' | 'svg' | '3d' | 'unfold') => void;
}

const packageTypeIcons = {
  'box': Box,
  'tube': Package,
  'envelope': FileText,
  'bag': Package,
  'tray': Layers,
  'wrapper': Package,
  'label': Target
};

const materialTypeIcons = {
  'cardboard': Box,
  'corrugated': Layers,
  'kraft': Leaf,
  'glossy': Sparkles,
  'matte': Shield,
  'recycled': Leaf
};

export function PackagingConfigurator({ 
  initialConfig,
  onSave,
  onExport 
}: PackagingConfiguratorProps) {
  const [constructor, setConstructor] = useState<PackagingConstructor | null>(null);
  const [templates, setTemplates] = useState<PackagingTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [packageType, setPackageType] = useState<PackagingConfig['packageType']>('box');
  const [dimensions, setDimensions] = useState({
    length: 100,
    width: 80,
    height: 50,
    unit: 'mm' as const
  });
  const [materials, setMaterials] = useState({
    paperType: 'cardboard' as 'cardboard' | 'corrugated' | 'kraft' | 'glossy' | 'matte' | 'recycled',
    thickness: 2,
    weight: 300,
    coating: 'none' as 'none' | 'lamination' | 'varnish' | 'spot_uv' | 'foil',
    sustainability: {
      recyclable: true,
      biodegradable: false,
      fscCertified: false,
      carbonNeutral: false
    }
  });
  const [structural, setStructural] = useState({
    glueType: 'hot_melt' as const,
    reinforcement: false,
    windowCutouts: [] as any[],
    perforations: {
      enabled: false,
      type: 'tear_strip' as const,
      pattern: 'straight' as const
    }
  });
  const [printing, setPrinting] = useState({
    sides: ['front'] as string[],
    colorMode: 'cmyk' as const,
    specialFinishes: {
      embossing: false,
      debossing: false,
      foilStamping: { enabled: false, color: '#FFD700', areas: [] },
      spotVarnish: false,
      texturalEffects: []
    }
  });
  const [assembly, setAssembly] = useState({
    difficulty: 'easy' as 'easy' | 'medium' | 'complex',
    estimatedTime: 5,
    toolsRequired: [] as string[],
    qualityChecks: [] as string[]
  });
  const [visualization, setVisualization] = useState({
    render3D: true,
    unfoldView: false,
    assemblyAnimation: false,
    materialPreview: true,
    lightingSetup: 'studio' as const,
    viewingAngles: ['front', 'side', 'top']
  });
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [quantity, setQuantity] = useState(1000);
  const [activeView, setActiveView] = useState<'3d' | 'unfold' | 'assembly'>('3d');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initConstructor = async () => {
      try {
        setIsLoading(true);
        
        const defaultConfig: ProductConfig = {
          id: 'pkg_' + Date.now(),
          name: 'Упаковка',
          category: 'packaging',
          dimensions: {
            width: dimensions.width,
            height: dimensions.height,
            unit: dimensions.unit,
            dpi: 300
          },
          printArea: {
            x: 5,
            y: 5,
            width: dimensions.width - 10,
            height: dimensions.height - 10
          },
          bleedArea: {
            top: 3,
            right: 3,
            bottom: 3,
            left: 3
          },
          materials: {
            paperType: 'cardboard',
            thickness: 2,
            weight: 250,
            coating: 'none',
            sustainability: {
              recyclable: true,
              biodegradable: true,
              fscCertified: false,
              carbonNeutral: false
            }
          } as any,
          finishes: ['none'],
          orientation: 'portrait',
          sides: 2 as any, // packaging has multiple sides
          minQuantity: 100,
          maxQuantity: 100000,
          basePrice: 120,
          pricePerUnit: 2.5,
          constraints: {
            minFontSize: 6,
            maxColors: 8,
            allowedFileTypes: ['pdf', 'ai', 'eps', 'png', 'jpg'],
            maxFileSize: 52428800, // 50MB
            requiredDPI: 300
          },
          ...initialConfig
        };

        const constructorInstance = new PackagingConstructor(defaultConfig);
        const availableTemplates = await constructorInstance.getAvailableTemplates() as PackagingTemplate[];
        
        setConstructor(constructorInstance);
        setTemplates(availableTemplates);
        
        if (availableTemplates.length > 0) {
          await constructorInstance.loadTemplate(availableTemplates[0].id);
          setSelectedTemplate(availableTemplates[0].id);
        }

        // Set up 3D visualization
        if (canvasRef.current && constructorInstance.get3DScene()) {
          setupVisualization(constructorInstance);
        }

      } catch (error) {
        console.error('Failed to initialize constructor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initConstructor();
  }, [initialConfig]);

  useEffect(() => {
    if (constructor) {
      updatePricing();
      validateDesign();
      updateVisualization();
    }
  }, [constructor, dimensions, materials, structural, printing, quantity]);

  const setupVisualization = (constructorInstance: PackagingConstructor) => {
    if (!canvasRef.current) return;

    const scene = constructorInstance.get3DScene();
    if (!scene) return;

    // This would integrate with Three.js renderer in a real implementation
    // For now, we'll simulate the 3D view
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderPackagePreview(ctx);
    }
  };

  const renderPackagePreview = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a simple 3D-like representation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 2;
    
    // Convert dimensions to canvas scale
    const length = dimensions.length * scale;
    const width = dimensions.width * scale;
    const height = dimensions.height * scale;
    
    // Draw isometric box
    ctx.fillStyle = getPackageColor();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Front face
    ctx.beginPath();
    ctx.rect(centerX - width/2, centerY - height/2, width, height);
    ctx.fill();
    ctx.stroke();
    
    // Right face (perspective)
    ctx.fillStyle = darkenColor(getPackageColor(), 0.8);
    ctx.beginPath();
    ctx.moveTo(centerX + width/2, centerY - height/2);
    ctx.lineTo(centerX + width/2 + length/3, centerY - height/2 - length/3);
    ctx.lineTo(centerX + width/2 + length/3, centerY + height/2 - length/3);
    ctx.lineTo(centerX + width/2, centerY + height/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Top face
    ctx.fillStyle = darkenColor(getPackageColor(), 0.9);
    ctx.beginPath();
    ctx.moveTo(centerX - width/2, centerY - height/2);
    ctx.lineTo(centerX - width/2 + length/3, centerY - height/2 - length/3);
    ctx.lineTo(centerX + width/2 + length/3, centerY - height/2 - length/3);
    ctx.lineTo(centerX + width/2, centerY - height/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Add material texture simulation
    if (materials.paperType === 'corrugated') {
      drawCorrugatedTexture(ctx, centerX - width/2, centerY - height/2, width, height);
    }
    
    // Add window cutouts if enabled
    structural.windowCutouts.forEach(window => {
      if (window.enabled) {
        drawWindow(ctx, centerX, centerY, window);
      }
    });
  };

  const getPackageColor = (): string => {
    switch (materials.paperType) {
      case 'kraft': return '#D2B48C';
      case 'corrugated': return '#F4E4BC';
      case 'glossy': return '#FFFFFF';
      case 'matte': return '#F5F5F5';
      case 'recycled': return '#E6D7C3';
      default: return '#FFFFFF';
    }
  };

  const darkenColor = (color: string, factor: number): string => {
    // Simple color darkening
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * factor * 100);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                  (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                  (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const drawCorrugatedTexture = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.strokeStyle = '#DDD';
    ctx.lineWidth = 1;
    for (let i = x; i < x + width; i += 5) {
      ctx.beginPath();
      ctx.moveTo(i, y);
      ctx.lineTo(i, y + height);
      ctx.stroke();
    }
  };

  const drawWindow = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, window: any) => {
    ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
    ctx.fillRect(
      centerX + window.position.x - window.size.width/2,
      centerY + window.position.y - window.size.height/2,
      window.size.width,
      window.size.height
    );
    ctx.strokeStyle = '#87CEEB';
    ctx.strokeRect(
      centerX + window.position.x - window.size.width/2,
      centerY + window.position.y - window.size.height/2,
      window.size.width,
      window.size.height
    );
  };

  const updatePricing = useCallback(async () => {
    if (!constructor) return;
    
    try {
      const result = await constructor.calculatePrice(quantity);
      setPricing(result);
    } catch (error) {
      console.error('Failed to calculate pricing:', error);
    }
  }, [constructor, quantity]);

  const validateDesign = useCallback(async () => {
    if (!constructor) return;
    
    try {
      const validation = await constructor.validateDesign();
      setValidationErrors(validation.errors);
      setValidationWarnings(validation.warnings);
    } catch (error) {
      console.error('Failed to validate design:', error);
    }
  }, [constructor]);

  const updateVisualization = useCallback(() => {
    if (constructor && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        renderPackagePreview(ctx);
      }
    }
  }, [constructor, dimensions, materials, structural]);

  const handleTemplateSelect = async (templateId: string) => {
    if (!constructor) return;
    
    try {
      await constructor.loadTemplate(templateId);
      setSelectedTemplate(templateId);
      
      // Update local state from template
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setPackageType(template.packageType);
        setAssembly(prev => ({ ...prev, difficulty: template.difficulty }));
      }
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };

  const handlePackageTypeChange = (newType: PackagingConfig['packageType']) => {
    setPackageType(newType);
    if (constructor) {
      constructor.updatePackageType(newType);
    }
  };

  const handleDimensionsChange = (field: keyof typeof dimensions, value: number) => {
    const newDimensions = { ...dimensions, [field]: value };
    setDimensions(newDimensions);
    
    if (constructor) {
      constructor.updateDimensions3D({
        ...newDimensions,
        volume: newDimensions.length * newDimensions.width * newDimensions.height
      });
    }
  };

  const handleMaterialChange = (field: keyof typeof materials, value: any) => {
    const newMaterials = { ...materials, [field]: value };
    setMaterials(newMaterials);
    
    if (constructor) {
      constructor.updateMaterial(newMaterials);
    }
  };

  const handleSustainabilityChange = (field: keyof typeof materials.sustainability, value: boolean) => {
    const newSustainability = { ...materials.sustainability, [field]: value };
    setMaterials(prev => ({ ...prev, sustainability: newSustainability }));
    
    if (constructor) {
      constructor.updateMaterial({ sustainability: newSustainability });
    }
  };

  const handleWindowCutoutAdd = () => {
    const newWindow = {
      enabled: true,
      shape: 'rectangle' as const,
      position: { x: 0, y: 0, z: 0 },
      size: { width: 30, height: 20 }
    };
    
    const newCutouts = [...structural.windowCutouts, newWindow];
    setStructural(prev => ({ ...prev, windowCutouts: newCutouts }));
    
    if (constructor) {
      constructor.addWindowCutout(newWindow);
    }
  };

  const handleSpecialFinishChange = (finish: keyof typeof printing.specialFinishes, value: boolean) => {
    const newFinishes = { ...printing.specialFinishes, [finish]: value };
    setPrinting(prev => ({ ...prev, specialFinishes: newFinishes }));
  };

  const handleExport = async (format: 'pdf' | 'png' | 'jpg' | 'svg' | '3d' | 'unfold') => {
    if (!constructor) return;
    
    try {
      const blob = await constructor.exportDesign(format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `packaging-${Date.now()}.${format === '3d' ? 'glb' : format === 'unfold' ? 'svg' : format}`;
      a.click();
      URL.revokeObjectURL(url);
      
      onExport?.(format);
    } catch (error) {
      console.error('Failed to export design:', error);
    }
  };

  const handleSave = () => {
    if (!constructor) return;
    
    const config = constructor.exportConfig();
    onSave?.(config);
  };

  const renderUnfoldPattern = () => {
    if (!constructor) return null;
    
    const pattern = constructor.getUnfoldPattern();
    return (
      <div className="flex items-center justify-center p-8">
        <div 
          className="border rounded-lg bg-white"
          dangerouslySetInnerHTML={{ __html: pattern }}
        />
      </div>
    );
  };

  const renderAssemblyInstructions = () => {
    if (!constructor) return null;
    
    const steps = constructor.getAssemblySteps();
    return (
      <div className="space-y-4 p-6">
        <h3 className="text-lg font-semibold">Інструкції зі збірки</h3>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm">{step}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Додаткова інформація</span>
          </div>
          <div className="text-sm space-y-1">
            <p>Складність: <Badge variant={assembly.difficulty === 'easy' ? 'default' : assembly.difficulty === 'medium' ? 'secondary' : 'destructive'}>{getDifficultyLabel(assembly.difficulty)}</Badge></p>
            <p>Час збірки: {assembly.estimatedTime} хвилин</p>
            <p>Об'єм: {(dimensions.length * dimensions.width * dimensions.height / 1000).toFixed(2)} л</p>
          </div>
        </div>
      </div>
    );
  };

  const getDifficultyLabel = (difficulty: string): string => {
    const labels = {
      'easy': 'Легко',
      'medium': 'Середньо',
      'complex': 'Складно'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  const getPackageTypeLabel = (type: string): string => {
    const labels = {
      'box': 'Коробка',
      'tube': 'Тубус',
      'envelope': 'Конверт',
      'bag': 'Пакет',
      'tray': 'Лоток',
      'wrapper': 'Обгортка',
      'label': 'Етикетка'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getMaterialTypeLabel = (type: string): string => {
    const labels = {
      'cardboard': 'Картон',
      'corrugated': 'Гофрокартон',
      'kraft': 'Крафт',
      'glossy': 'Глянцевий',
      'matte': 'Матовий',
      'recycled': 'Переробний'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Ініціалізація конструктора упаковки...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Sidebar with settings */}
      <div className="col-span-4 space-y-6">
        {/* Package Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Тип упаковки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(packageTypeIcons).map(([type, Icon]) => (
                <Button
                  key={type}
                  variant={packageType === type ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => handlePackageTypeChange(type as PackagingConfig['packageType'])}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{getPackageTypeLabel(type)}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Шаблони
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {templates.filter(t => t.packageType === packageType).map((template) => (
                <div
                  key={template.id}
                  className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-muted rounded overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{template.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {template.industryFocus}
                        </Badge>
                        <Badge 
                          variant={template.difficulty === 'easy' ? 'default' : 'outline'} 
                          className="text-xs"
                        >
                          {getDifficultyLabel(template.difficulty)}
                        </Badge>
                        {template.isPremium && (
                          <Sparkles className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="dimensions" className="w-full">
          <TabsList className="grid grid-cols-5 w-full text-xs">
            <TabsTrigger value="dimensions">Розміри</TabsTrigger>
            <TabsTrigger value="materials">Матеріал</TabsTrigger>
            <TabsTrigger value="structure">Структура</TabsTrigger>
            <TabsTrigger value="printing">Друк</TabsTrigger>
            <TabsTrigger value="pricing">Ціна</TabsTrigger>
          </TabsList>

          <TabsContent value="dimensions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Розміри 3D
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="length" className="text-xs">Довжина</Label>
                    <Input
                      id="length"
                      type="number"
                      value={dimensions.length}
                      onChange={(e) => handleDimensionsChange('length', parseInt(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width" className="text-xs">Ширина</Label>
                    <Input
                      id="width"
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => handleDimensionsChange('width', parseInt(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Висота</Label>
                    <Input
                      id="height"
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => handleDimensionsChange('height', parseInt(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Об'єм: {((dimensions.length * dimensions.width * dimensions.height) / 1000).toFixed(2)} см³
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Матеріали
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paperType">Тип паперу</Label>
                  <Select value={materials.paperType} onValueChange={(value) => handleMaterialChange('paperType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(materialTypeIcons).map(([type, Icon]) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {getMaterialTypeLabel(type)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="thickness">Товщина ({materials.thickness}мм)</Label>
                  <Slider
                    value={[materials.thickness]}
                    onValueChange={(value) => handleMaterialChange('thickness', value[0])}
                    max={5}
                    min={0.5}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="coating">Покриття</Label>
                  <Select value={materials.coating} onValueChange={(value) => handleMaterialChange('coating', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без покриття</SelectItem>
                      <SelectItem value="lamination">Ламінування</SelectItem>
                      <SelectItem value="varnish">Лак</SelectItem>
                      <SelectItem value="spot_uv">Вибірковий UV</SelectItem>
                      <SelectItem value="foil">Фольга</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Екологічність</Label>
                  {Object.entries(materials.sustainability).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="text-xs">
                        {getSustainabilityLabel(key)}
                      </Label>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => handleSustainabilityChange(key as any, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Структурні особливості
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reinforcement" className="text-sm">Зміцнення</Label>
                  <Switch
                    id="reinforcement"
                    checked={structural.reinforcement}
                    onCheckedChange={(checked) => setStructural(prev => ({ ...prev, reinforcement: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="perforations" className="text-sm">Перфорація</Label>
                  <Switch
                    id="perforations"
                    checked={structural.perforations.enabled}
                    onCheckedChange={(checked) => 
                      setStructural(prev => ({ 
                        ...prev, 
                        perforations: { ...prev.perforations, enabled: checked }
                      }))
                    }
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">Віконні вирізи</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleWindowCutoutAdd}
                    >
                      Додати
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Віконних вирізів: {structural.windowCutouts.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="printing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Особливості друку
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Спеціальні ефекти</Label>
                  <div className="space-y-2 mt-2">
                    {Object.entries(printing.specialFinishes).filter(([key]) => key !== 'foilStamping' && key !== 'texturalEffects').map(([finish, enabled]) => (
                      <div key={finish} className="flex items-center justify-between">
                        <Label htmlFor={finish} className="text-xs">
                          {getSpecialFinishLabel(finish)}
                        </Label>
                        <Switch
                          id={finish}
                          checked={enabled as boolean}
                          onCheckedChange={(checked) => handleSpecialFinishChange(finish as any, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="colorMode">Колірний режим</Label>
                  <Select value={printing.colorMode} onValueChange={(value) => setPrinting(prev => ({ ...prev, colorMode: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cmyk">CMYK</SelectItem>
                      <SelectItem value="pantone">Pantone</SelectItem>
                      <SelectItem value="digital_rgb">Digital RGB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Розрахунок вартості</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Тираж</Label>
                  <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 шт</SelectItem>
                      <SelectItem value="250">250 шт</SelectItem>
                      <SelectItem value="500">500 шт</SelectItem>
                      <SelectItem value="1000">1000 шт</SelectItem>
                      <SelectItem value="2500">2500 шт</SelectItem>
                      <SelectItem value="5000">5000 шт</SelectItem>
                      <SelectItem value="10000">10000 шт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {pricing && (
                  <div className="space-y-2">
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Базова вартість:</span>
                      <span>{pricing.breakdown.subtotal.toFixed(2)} грн</span>
                    </div>
                    {pricing.breakdown.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Знижка за тираж:</span>
                        <span>-{pricing.breakdown.discountAmount.toFixed(2)} грн</span>
                      </div>
                    )}
                    {pricing.breakdown.featuresPrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Додаткові послуги:</span>
                        <span>+{pricing.breakdown.featuresPrice.toFixed(2)} грн</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Загальна вартість:</span>
                      <span>{pricing.total.toFixed(2)} грн</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pricing.breakdown.details.packageType} • {pricing.breakdown.details.material} • {pricing.breakdown.details.volume}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Експорт
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport('pdf')}
                className="text-xs"
              >
                PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('3d')}
                className="text-xs"
              >
                3D
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('unfold')}
                className="text-xs"
              >
                Розгортка
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('png')}
                className="text-xs"
              >
                PNG
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('jpg')}
                className="text-xs"
              >
                JPG
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('svg')}
                className="text-xs"
              >
                SVG
              </Button>
            </div>
            
            <Button onClick={handleSave} className="w-full flex items-center gap-2">
              <Save className="h-4 w-4" />
              Зберегти проект
            </Button>
          </CardContent>
        </Card>

        {/* Validation Status */}
        {(validationErrors.length > 0 || validationWarnings.length > 0) && (
          <Card className={validationErrors.length > 0 ? "border-destructive" : "border-yellow-500"}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${validationErrors.length > 0 ? "text-destructive" : "text-yellow-600"}`}>
                {validationErrors.length > 0 ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
                {validationErrors.length > 0 ? "Помилки валідації" : "Попередження"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {validationErrors.length > 0 && (
                <ul className="space-y-1 mb-2">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-destructive">
                      • {error}
                    </li>
                  ))}
                </ul>
              )}
              {validationWarnings.length > 0 && (
                <ul className="space-y-1">
                  {validationWarnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-600">
                      • {warning}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main visualization area */}
      <div className="col-span-8">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                3D Візуалізація
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={activeView === '3d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('3d')}
                >
                  <Box className="h-4 w-4" />
                  3D
                </Button>
                <Button
                  variant={activeView === 'unfold' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('unfold')}
                >
                  <Grid className="h-4 w-4" />
                  Розгортка
                </Button>
                <Button
                  variant={activeView === 'assembly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('assembly')}
                >
                  <Settings className="h-4 w-4" />
                  Збірка
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => constructor?.undo()}
                  disabled={!constructor?.canUndo()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => constructor?.redo()}
                  disabled={!constructor?.canRedo()}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            {activeView === '3d' && (
              <div className="flex items-center justify-center h-full">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="border rounded-lg shadow-lg"
                />
              </div>
            )}
            
            {activeView === 'unfold' && (
              <div className="h-full overflow-auto">
                {renderUnfoldPattern()}
              </div>
            )}
            
            {activeView === 'assembly' && (
              <div className="h-full overflow-auto">
                {renderAssemblyInstructions()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper functions
function getSustainabilityLabel(key: string): string {
  const labels = {
    recyclable: 'Вторинна переробка',
    biodegradable: 'Біорозкладання',
    fscCertified: 'FSC сертифікат',
    carbonNeutral: 'Вуглецева нейтральність'
  };
  return labels[key as keyof typeof labels] || key;
}

function getSpecialFinishLabel(key: string): string {
  const labels = {
    embossing: 'Тиснення',
    debossing: 'Видавлювання',
    spotVarnish: 'Вибірковий лак'
  };
  return labels[key as keyof typeof labels] || key;
}