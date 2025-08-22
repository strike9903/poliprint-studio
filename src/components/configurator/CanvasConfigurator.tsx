"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CanvasConstructor, CanvasConfig, CanvasTemplate } from '@/lib/constructors/canvas-constructor';
import { ProductConfig } from '@/lib/constructor-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Palette,
  Image,
  Settings,
  Download,
  Eye,
  Sparkles,
  Undo,
  Redo,
  Save,
  Crop,
  Filter,
  Sun,
  Contrast,
  Droplets,
  Maximize,
  Layers,
  Frame,
  Brush,
  Home,
  CheckCircle,
  AlertTriangle,
  Upload,
  Sliders
} from 'lucide-react';

interface CanvasConfiguratorProps {
  initialConfig?: Partial<CanvasConfig>;
  onSave?: (config: CanvasConfig) => void;
  onExport?: (format: 'pdf' | 'png' | 'jpg' | 'svg') => void;
}

type CanvasSize = 'small' | 'medium' | 'large' | 'xl' | 'custom';

const canvasSizeIcons: Record<CanvasSize, { width: number; height: number }> = {
  'small': { width: 20, height: 25 },
  'medium': { width: 30, height: 40 },
  'large': { width: 40, height: 50 },
  'xl': { width: 60, height: 80 },
  'custom': { width: 50, height: 50 }
};

export function CanvasConfigurator({ 
  initialConfig,
  onSave,
  onExport 
}: CanvasConfiguratorProps) {
  const [constructor, setConstructor] = useState<CanvasConstructor | null>(null);
  const [templates, setTemplates] = useState<CanvasTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [imageProcessing, setImageProcessing] = useState({
    colorCorrection: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
      gamma: 1.0
    },
    artisticFilters: {
      enabled: false,
      filterType: 'none' as 'none' | 'oil_painting' | 'watercolor' | 'sketch' | 'vintage' | 'black_white' | 'sepia',
      intensity: 50
    },
    enhancement: {
      sharpening: 0,
      noiseReduction: false,
      upscaling: false
    }
  });
  const [framing, setFraming] = useState({
    enabled: false,
    style: 'classic' as const,
    material: 'wood' as const,
    color: '#8B4513',
    thickness: 25
  });
  const [mounting, setMounting] = useState({
    system: 'stretcher' as const,
    backingBoard: 'cardboard' as const,
    hanging: 'wire' as const
  });
  const [roomVisualization, setRoomVisualization] = useState({
    enabled: false,
    roomType: 'living_room' as const,
    wallColor: '#FFFFFF',
    lighting: 'natural' as const
  });
  const [size, setSize] = useState<CanvasSize>('medium');
  const [customSize, setCustomSize] = useState({ width: 30, height: 40 });
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'canvas' | 'room' | 'technical'>('canvas');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initConstructor = async () => {
      try {
        setIsLoading(true);
        
        const defaultConfig: ProductConfig = {
          id: 'cv_' + Date.now(),
          name: 'Холст',
          category: 'canvas',
          dimensions: {
            width: 300,
            height: 400,
            unit: 'mm',
            dpi: 300
          },
          printArea: {
            x: 0,
            y: 0,
            width: 300,
            height: 400
          },
          bleedArea: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
          materials: ['canvas'],
          finishes: ['none'],
          orientation: 'portrait',
          sides: 1,
          minQuantity: 1,
          maxQuantity: 100,
          basePrice: 300,
          pricePerUnit: 50.0,
          constraints: {
            minFontSize: 12,
            maxColors: 16777216, // Full color
            allowedFileTypes: ['jpg', 'png', 'tiff', 'pdf'],
            maxFileSize: 104857600, // 100MB
            requiredDPI: 300
          },
          ...initialConfig
        };

        const constructorInstance = new CanvasConstructor(defaultConfig);
        const availableTemplates = await constructorInstance.getAvailableTemplates() as CanvasTemplate[];
        
        setConstructor(constructorInstance);
        setTemplates(availableTemplates);
        
        if (availableTemplates.length > 0) {
          await constructorInstance.loadTemplate(availableTemplates[0].id);
          setSelectedTemplate(availableTemplates[0].id);
        }

        // Set up canvas rendering
        if (canvasRef.current) {
          setupCanvasRendering(constructorInstance);
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
      updateCanvasPreview();
    }
  }, [constructor, imageProcessing, framing, mounting, size, customSize, quantity]);

  const setupCanvasRendering = (constructorInstance: CanvasConstructor) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderCanvasPreview(ctx);
    }
  };

  const renderCanvasPreview = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get current dimensions
    const dimensions = size === 'custom' ? customSize : canvasSizeIcons[size];
    const scale = 8; // Scale for preview
    
    const canvasWidth = dimensions.width * scale;
    const canvasHeight = dimensions.height * scale;
    
    // Center the canvas in the preview area
    const offsetX = (canvas.width - canvasWidth) / 2;
    const offsetY = (canvas.height - canvasHeight) / 2;
    
    // Draw canvas background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(offsetX, offsetY, canvasWidth, canvasHeight);
    
    // Draw image placeholder or selected image
    if (selectedImage) {
      drawImageWithFilters(ctx, offsetX, offsetY, canvasWidth, canvasHeight);
    } else {
      drawImagePlaceholder(ctx, offsetX, offsetY, canvasWidth, canvasHeight);
    }
    
    // Draw frame if enabled
    if (framing.enabled) {
      drawFrame(ctx, offsetX, offsetY, canvasWidth, canvasHeight);
    }
    
    // Draw canvas border
    ctx.strokeStyle = '#DDD';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, canvasWidth, canvasHeight);
  };

  const drawImagePlaceholder = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(x + 10, y + 10, w - 20, h - 20);
    
    ctx.strokeStyle = '#DDD';
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);
    ctx.setLineDash([]);
    
    // Draw image icon
    ctx.fillStyle = '#888';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Додайте зображення', x + w/2, y + h/2);
  };

  const drawImageWithFilters = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    // Simulate image with color adjustments
    const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.5, '#4ECDC4');
    gradient.addColorStop(1, '#45B7D1');
    
    // Apply brightness/contrast simulation
    const brightness = imageProcessing.colorCorrection.brightness;
    const alpha = 0.8 + (brightness / 200); // Simulate brightness
    
    ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 10, y + 10, w - 20, h - 20);
    
    // Apply artistic filter overlay
    if (imageProcessing.artisticFilters.enabled) {
      ctx.globalAlpha = imageProcessing.artisticFilters.intensity / 100;
      applyArtisticFilter(ctx, x + 10, y + 10, w - 20, h - 20);
    }
    
    ctx.globalAlpha = 1;
  };

  const applyArtisticFilter = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const { filterType } = imageProcessing.artisticFilters;
    
    switch (filterType) {
      case 'oil_painting':
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.arc(
            x + Math.random() * w,
            y + Math.random() * h,
            Math.random() * 5 + 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;
      case 'watercolor':
        const watercolor = ctx.createRadialGradient(x + w/2, y + h/2, 0, x + w/2, y + h/2, Math.max(w, h)/2);
        watercolor.addColorStop(0, 'rgba(100, 150, 255, 0.3)');
        watercolor.addColorStop(1, 'rgba(100, 150, 255, 0.1)');
        ctx.fillStyle = watercolor;
        ctx.fillRect(x, y, w, h);
        break;
      case 'vintage':
        ctx.fillStyle = 'rgba(139, 69, 19, 0.2)';
        ctx.fillRect(x, y, w, h);
        break;
    }
  };

  const drawFrame = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const frameThickness = framing.thickness / 2; // Scale down for preview
    
    // Draw frame
    ctx.fillStyle = framing.color;
    ctx.fillRect(x - frameThickness, y - frameThickness, w + frameThickness * 2, frameThickness); // Top
    ctx.fillRect(x - frameThickness, y + h, w + frameThickness * 2, frameThickness); // Bottom  
    ctx.fillRect(x - frameThickness, y, frameThickness, h); // Left
    ctx.fillRect(x + w, y, frameThickness, h); // Right
    
    // Add frame texture based on material
    if (framing.material === 'wood') {
      ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x - frameThickness, y + i * (h / 5));
        ctx.lineTo(x + w + frameThickness, y + i * (h / 5));
        ctx.stroke();
      }
    }
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
      setValidationWarnings((validation as any).warnings || []);
    } catch (error) {
      console.error('Failed to validate design:', error);
    }
  }, [constructor]);

  const updateCanvasPreview = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        renderCanvasPreview(ctx);
      }
    }
  }, [selectedImage, imageProcessing, framing, size, customSize]);

  const handleTemplateSelect = async (templateId: string) => {
    if (!constructor) return;
    
    try {
      await constructor.loadTemplate(templateId);
      setSelectedTemplate(templateId);
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        if (constructor) {
          // TODO: Implement image source update method in CanvasConstructor
          // constructor.updateImageSource(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorCorrectionChange = (type: keyof typeof imageProcessing.colorCorrection, value: number) => {
    const newCorrection = { ...imageProcessing.colorCorrection, [type]: value };
    setImageProcessing(prev => ({ ...prev, colorCorrection: newCorrection }));
    
    if (constructor) {
      // TODO: Implement public color correction method in CanvasConstructor
      // constructor.applyColorCorrection(newCorrection);
    }
  };

  const handleArtisticFilterChange = (filterType: string, intensity: number) => {
    const newFilters = {
      enabled: filterType !== 'none',
      filterType: filterType as any,
      intensity
    };
    setImageProcessing(prev => ({ ...prev, artisticFilters: newFilters }));
    
    if (constructor) {
      // TODO: Implement artistic filter method in CanvasConstructor
      // constructor.applyArtisticFilter(filterType, intensity);
    }
  };

  const handleFramingChange = (field: keyof typeof framing, value: any) => {
    const newFraming = { ...framing, [field]: value };
    setFraming(newFraming);
    
    if (constructor) {
      // TODO: Implement framing update method in CanvasConstructor
      // constructor.updateFraming(newFraming);
    }
  };

  const handleSizeChange = (newSize: CanvasSize) => {
    setSize(newSize);
    if (constructor) {
      const dimensions = newSize === 'custom' ? customSize : canvasSizeIcons[newSize];
      // TODO: Implement canvas size update method in CanvasConstructor
      // constructor.updateCanvasSize(newSize, dimensions);
    }
  };

  const handleExport = async (format: 'pdf' | 'png' | 'jpg' | 'svg') => {
    if (!constructor) return;
    
    try {
      const blob = await constructor.exportDesign(format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canvas-${Date.now()}.${format}`;
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

  const getSizeLabel = (sizeKey: string): string => {
    const labels = {
      'small': 'Малий (20×25см)',
      'medium': 'Середній (30×40см)', 
      'large': 'Великий (40×50см)',
      'xl': 'Гігант (60×80см)',
      'custom': 'Індивідуальний'
    };
    return labels[sizeKey as keyof typeof labels] || sizeKey;
  };

  const getMaterialLabel = (material: string): string => {
    const labels = {
      'wood': 'Дерево',
      'metal': 'Метал',
      'plastic': 'Пластик'
    };
    return labels[material as keyof typeof labels] || material;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Ініціалізація конструктора холста...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Sidebar with settings */}
      <div className="col-span-4 space-y-6">
        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Зображення
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full h-32 border-dashed"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">Завантажити зображення</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, TIFF до 100МБ</p>
              </div>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Художні шаблони
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {templates.slice(0, 3).map((template) => (
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
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden">
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
                          {template.artworkStyle}
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

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid grid-cols-4 w-full text-xs">
            <TabsTrigger value="image">Зображення</TabsTrigger>
            <TabsTrigger value="frame">Рамка</TabsTrigger>
            <TabsTrigger value="size">Розмір</TabsTrigger>
            <TabsTrigger value="price">Ціна</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  Корекція кольорів
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Яскравість ({imageProcessing.colorCorrection.brightness})</Label>
                  <Slider
                    value={[imageProcessing.colorCorrection.brightness]}
                    onValueChange={(value) => handleColorCorrectionChange('brightness', value[0])}
                    min={-100}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Контраст ({imageProcessing.colorCorrection.contrast})</Label>
                  <Slider
                    value={[imageProcessing.colorCorrection.contrast]}
                    onValueChange={(value) => handleColorCorrectionChange('contrast', value[0])}
                    min={-100}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Насиченість ({imageProcessing.colorCorrection.saturation})</Label>
                  <Slider
                    value={[imageProcessing.colorCorrection.saturation]}
                    onValueChange={(value) => handleColorCorrectionChange('saturation', value[0])}
                    min={-100}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brush className="h-4 w-4" />
                  Художні ефекти
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Тип ефекту</Label>
                  <Select 
                    value={imageProcessing.artisticFilters.filterType} 
                    onValueChange={(value) => handleArtisticFilterChange(value, imageProcessing.artisticFilters.intensity)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без ефекту</SelectItem>
                      <SelectItem value="oil_painting">Олійний живопис</SelectItem>
                      <SelectItem value="watercolor">Акварель</SelectItem>
                      <SelectItem value="vintage">Вінтаж</SelectItem>
                      <SelectItem value="black_white">Чорно-білий</SelectItem>
                      <SelectItem value="sepia">Сепія</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {imageProcessing.artisticFilters.enabled && (
                  <div>
                    <Label>Інтенсивність ({imageProcessing.artisticFilters.intensity}%)</Label>
                    <Slider
                      value={[imageProcessing.artisticFilters.intensity]}
                      onValueChange={(value) => handleArtisticFilterChange(imageProcessing.artisticFilters.filterType, value[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frame" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Frame className="h-4 w-4" />
                  Рамка і монтаж
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="frame-enabled">Додати рамку</Label>
                  <Switch
                    id="frame-enabled"
                    checked={framing.enabled}
                    onCheckedChange={(checked) => handleFramingChange('enabled', checked)}
                  />
                </div>
                
                {framing.enabled && (
                  <>
                    <div>
                      <Label>Стиль рамки</Label>
                      <Select value={framing.style} onValueChange={(value) => handleFramingChange('style', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classic">Класична</SelectItem>
                          <SelectItem value="modern">Сучасна</SelectItem>
                          <SelectItem value="ornate">Багато декору</SelectItem>
                          <SelectItem value="minimal">Мінімалістична</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Матеріал</Label>
                      <Select value={framing.material} onValueChange={(value) => handleFramingChange('material', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wood">Дерево</SelectItem>
                          <SelectItem value="metal">Метал</SelectItem>
                          <SelectItem value="plastic">Пластик</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Товщина рамки ({framing.thickness}мм)</Label>
                      <Slider
                        value={[framing.thickness]}
                        onValueChange={(value) => handleFramingChange('thickness', value[0])}
                        min={10}
                        max={50}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Колір рамки</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="color"
                          value={framing.color}
                          onChange={(e) => handleFramingChange('color', e.target.value)}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          value={framing.color}
                          onChange={(e) => handleFramingChange('color', e.target.value)}
                          placeholder="#8B4513"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="size" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Maximize className="h-4 w-4" />
                  Розмір холста
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Розмір</Label>
                  <Select value={size} onValueChange={(value) => handleSizeChange(value as CanvasSize)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(canvasSizeIcons).map(sizeKey => (
                        <SelectItem key={sizeKey} value={sizeKey}>
                          {getSizeLabel(sizeKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {size === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="custom-width">Ширина (см)</Label>
                      <Input
                        id="custom-width"
                        type="number"
                        value={customSize.width}
                        onChange={(e) => setCustomSize(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                        min="10"
                        max="200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-height">Висота (см)</Label>
                      <Input
                        id="custom-height"
                        type="number"
                        value={customSize.height}
                        onChange={(e) => setCustomSize(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                        min="10"
                        max="200"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="price" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Розрахунок вартості</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Кількість</Label>
                  <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 шт</SelectItem>
                      <SelectItem value="2">2 шт</SelectItem>
                      <SelectItem value="3">3 шт</SelectItem>
                      <SelectItem value="5">5 шт</SelectItem>
                      <SelectItem value="10">10 шт</SelectItem>
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
                    {pricing.breakdown.featuresPrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Додаткові послуги:</span>
                        <span>+{pricing.breakdown.featuresPrice.toFixed(2)} грн</span>
                      </div>
                    )}
                    {pricing.breakdown.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Знижка за кількість:</span>
                        <span>-{pricing.breakdown.discountAmount.toFixed(2)} грн</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Загальна вартість:</span>
                      <span>{pricing.total.toFixed(2)} грн</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pricing.breakdown.details.size} • {pricing.breakdown.details.material}
                      {framing.enabled && ` • Рамка ${getMaterialLabel(framing.material)}`}
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
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport('pdf')}
                className="text-xs"
              >
                PDF
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
                  <CheckCircle className="h-4 w-4" />
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

      {/* Main preview area */}
      <div className="col-span-8">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Попередній перегляд
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={activeView === 'canvas' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('canvas')}
                >
                  <Palette className="h-4 w-4" />
                  Холст
                </Button>
                <Button
                  variant={activeView === 'room' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('room')}
                >
                  <Home className="h-4 w-4" />
                  В інтер'єрі
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
            {activeView === 'canvas' && (
              <div className="flex items-center justify-center h-full">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="border rounded-lg shadow-lg bg-white"
                />
              </div>
            )}
            
            {activeView === 'room' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Візуалізація в інтер'єрі</p>
                  <p className="text-sm text-muted-foreground">
                    Перегляньте як холст виглядатиме в вашому приміщенні
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}