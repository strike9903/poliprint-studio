"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, Download, RotateCcw, RotateCw, ZoomIn, ZoomOut, 
  Layers, Eye, EyeOff, Move, Type, Image, Square, Circle,
  Palette, Sparkles, Zap, Gem, Star, Sun, Moon, Droplet
} from 'lucide-react';

const acrylicThicknesses = {
  '3mm': { name: '3mm Standard', price: 1.0, description: 'Базовая толщина для интерьера' },
  '5mm': { name: '5mm Premium', price: 1.5, description: 'Увеличенная прочность' },
  '8mm': { name: '8mm Luxury', price: 2.2, description: 'Премиум качество' },
  '10mm': { name: '10mm Professional', price: 2.8, description: 'Максимальная толщина' }
};

const acrylicFinishes = {
  glossy: { name: 'Глянцевый', price: 1.0, description: 'Зеркальный блеск' },
  matte: { name: 'Матовый', price: 1.1, description: 'Без отражений' },
  frosted: { name: 'Матированный', price: 1.3, description: 'Полупрозрачный эффект' },
  textured: { name: 'Текстурированный', price: 1.5, description: 'Рельефная поверхность' },
  metallic: { name: 'Металлик', price: 2.0, description: 'Металлический блеск' },
  holographic: { name: 'Голографический', price: 2.5, description: 'Радужные переливы' }
};

const modernEffects = {
  none: { name: 'Без эффекта', description: 'Стандартная печать' },
  neon: { name: 'Неоновое свечение', description: 'Эффект подсветки' },
  gradient: { name: 'Градиентные переходы', description: 'Плавные цветовые переходы' },
  geometric: { name: 'Геометрические формы', description: 'Современная геометрия' },
  minimalist: { name: 'Минимализм', description: 'Лаконичный дизайн' },
  abstract: { name: 'Абстракция', description: 'Художественная абстракция' },
  tech: { name: 'Хай-тек', description: 'Технологичный стиль' },
  organic: { name: 'Органические формы', description: 'Природные линии' }
};

const backgroundPatterns = {
  none: 'Без фона',
  dots: 'Точки',
  lines: 'Линии',
  grid: 'Сетка',
  waves: 'Волны',
  polygons: 'Полигоны',
  circuits: 'Схемы',
  organic: 'Органика'
};

const colorModes = {
  rgb: 'RGB (Стандарт)',
  cmyk: 'CMYK (Печать)', 
  spot: 'Spot Colors',
  pantone: 'Pantone',
  metallic: 'Металлические',
  fluorescent: 'Флуоресцентные'
};

const lightingEffects = {
  ambient: 'Окружающее освещение',
  directional: 'Направленный свет',
  spotlight: 'Прожектор',
  neon: 'Неоновая подсветка',
  led: 'LED подсветка',
  uv: 'УФ эффекты'
};

interface ModernPrintConfig {
  thickness: string;
  finish: string;
  effect: string;
  backgroundPattern: string;
  colorMode: string;
  lighting: string;
  transparency: number;
  reflectivity: number;
  contrast: number;
  saturation: number;
  brightness: number;
  warmth: number;
  edgePolish: boolean;
  uvPrint: boolean;
  backLight: boolean;
  doubleLayer: boolean;
  textureIntensity: number;
  modernFilters: {
    cyberpunk: boolean;
    vaporwave: boolean;
    synthwave: boolean;
    brutalist: boolean;
    bauhaus: boolean;
  };
}

interface AcrylicConfiguratorProps {
  width: number;
  height: number;
  onConfigChange?: (config: ModernPrintConfig) => void;
  onPriceChange?: (price: number) => void;
}

export function AcrylicConfigurator({ 
  width = 300, 
  height = 200, 
  onConfigChange, 
  onPriceChange 
}: AcrylicConfiguratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<ModernPrintConfig>({
    thickness: '5mm',
    finish: 'glossy',
    effect: 'none',
    backgroundPattern: 'none',
    colorMode: 'rgb',
    lighting: 'ambient',
    transparency: 0,
    reflectivity: 80,
    contrast: 100,
    saturation: 100,
    brightness: 100,
    warmth: 0,
    edgePolish: true,
    uvPrint: false,
    backLight: false,
    doubleLayer: false,
    textureIntensity: 50,
    modernFilters: {
      cyberpunk: false,
      vaporwave: false,
      synthwave: false,
      brutalist: false,
      bauhaus: false
    }
  });

  const [zoom, setZoom] = useState(100);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedTool, setSelectedTool] = useState('move');

  useEffect(() => {
    renderAcrylicPreview();
    const price = calculatePrice();
    onPriceChange?.(price);
    onConfigChange?.(config);
  }, [config, zoom]);

  const renderAcrylicPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = zoom / 100;
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    // Центрируем акриловую панель
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    // Основной фон акриловой панели
    ctx.save();
    
    // Применяем эффекты современной печати
    applyModernEffects(ctx, x, y, scaledWidth, scaledHeight);
    
    // Рисуем основную акриловую поверхность
    drawAcrylicSurface(ctx, x, y, scaledWidth, scaledHeight);
    
    // Добавляем фоновый паттерн
    drawBackgroundPattern(ctx, x, y, scaledWidth, scaledHeight);
    
    // Применяем современные фильтры
    applyModernFilters(ctx, x, y, scaledWidth, scaledHeight);
    
    // Эффекты освещения
    applyLightingEffects(ctx, x, y, scaledWidth, scaledHeight);
    
    // Эффекты краев и полировки
    drawEdgeEffects(ctx, x, y, scaledWidth, scaledHeight);
    
    ctx.restore();

    // Информация о размерах
    ctx.fillStyle = '#666';
    ctx.font = '12px monospace';
    ctx.fillText(`${width}×${height}mm`, 10, canvas.height - 10);
    const finishInfo = acrylicFinishes[config.finish as keyof typeof acrylicFinishes];
    ctx.fillText(`${config.thickness} ${finishInfo?.name || 'Unknown'}`, 10, canvas.height - 25);
  };

  const applyModernEffects = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const effect = config.effect;
    
    if (effect === 'neon') {
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else if (effect === 'gradient') {
      const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
      gradient.addColorStop(0, '#ff0080');
      gradient.addColorStop(0.5, '#7928ca');
      gradient.addColorStop(1, '#0070f3');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1;
    } else if (effect === 'geometric') {
      drawGeometricPatterns(ctx, x, y, w, h);
    }
  };

  const drawAcrylicSurface = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const finish = acrylicFinishes[config.finish as keyof typeof acrylicFinishes];
    
    // Базовый цвет акрила
    let baseColor = 'rgba(255, 255, 255, 0.9)';
    
    if (config.finish === 'frosted') {
      baseColor = 'rgba(255, 255, 255, 0.7)';
    } else if (config.finish === 'metallic') {
      baseColor = 'rgba(192, 192, 192, 0.9)';
    } else if (config.finish === 'holographic') {
      const gradient = ctx.createLinearGradient(x, y, x + w, y);
      gradient.addColorStop(0, 'rgba(255, 0, 128, 0.3)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 0, 0.3)');
      gradient.addColorStop(0.4, 'rgba(0, 255, 128, 0.3)');
      gradient.addColorStop(0.6, 'rgba(0, 128, 255, 0.3)');
      gradient.addColorStop(0.8, 'rgba(128, 0, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 0, 128, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, w, h);
    }

    ctx.fillStyle = baseColor;
    ctx.fillRect(x, y, w, h);

    // Эффект прозрачности
    if (config.transparency > 0) {
      ctx.globalAlpha = 1 - (config.transparency / 100);
    }

    // Эффект отражения
    if (config.reflectivity > 0) {
      const reflectionGradient = ctx.createLinearGradient(x, y, x, y + h / 3);
      reflectionGradient.addColorStop(0, `rgba(255, 255, 255, ${config.reflectivity / 200})`);
      reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = reflectionGradient;
      ctx.fillRect(x, y, w, h / 3);
    }
  };

  const drawBackgroundPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const pattern = config.backgroundPattern;
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    if (pattern === 'dots') {
      for (let px = x + 10; px < x + w; px += 15) {
        for (let py = y + 10; py < y + h; py += 15) {
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (pattern === 'lines') {
      for (let px = x; px < x + w; px += 10) {
        ctx.beginPath();
        ctx.moveTo(px, y);
        ctx.lineTo(px, y + h);
        ctx.stroke();
      }
    } else if (pattern === 'grid') {
      for (let px = x; px < x + w; px += 20) {
        ctx.beginPath();
        ctx.moveTo(px, y);
        ctx.lineTo(px, y + h);
        ctx.stroke();
      }
      for (let py = y; py < y + h; py += 20) {
        ctx.beginPath();
        ctx.moveTo(x, py);
        ctx.lineTo(x + w, py);
        ctx.stroke();
      }
    } else if (pattern === 'waves') {
      ctx.beginPath();
      for (let px = x; px <= x + w; px += 2) {
        const wave = Math.sin((px - x) * 0.02) * 10;
        if (px === x) {
          ctx.moveTo(px, y + h / 2 + wave);
        } else {
          ctx.lineTo(px, y + h / 2 + wave);
        }
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  };

  const drawGeometricPatterns = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#0070f3';
    
    // Треугольники
    for (let i = 0; i < 5; i++) {
      const px = x + Math.random() * w;
      const py = y + Math.random() * h;
      const size = 20 + Math.random() * 30;
      
      ctx.beginPath();
      ctx.moveTo(px, py - size);
      ctx.lineTo(px - size, py + size);
      ctx.lineTo(px + size, py + size);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  };

  const applyModernFilters = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const filters = config.modernFilters;
    
    if (filters.cyberpunk) {
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.fillRect(x, y, w, h);
      ctx.globalCompositeOperation = 'source-over';
    }
    
    if (filters.vaporwave) {
      const gradient = ctx.createLinearGradient(x, y, x, y + h);
      gradient.addColorStop(0, 'rgba(255, 0, 150, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0.1)');
      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillRect(x, y, w, h);
      ctx.globalCompositeOperation = 'source-over';
    }
    
    if (filters.synthwave) {
      ctx.strokeStyle = '#ff0080';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      for (let py = y + 20; py < y + h; py += 40) {
        ctx.beginPath();
        ctx.moveTo(x, py);
        ctx.lineTo(x + w, py);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  };

  const applyLightingEffects = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const lighting = config.lighting;
    
    if (lighting === 'spotlight') {
      const gradient = ctx.createRadialGradient(x + w/2, y + h/2, 0, x + w/2, y + h/2, w/2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, w, h);
    } else if (lighting === 'neon') {
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
    
    if (config.backLight) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(x - 5, y - 5, w + 10, h + 10);
      ctx.shadowBlur = 0;
    }
  };

  const drawEdgeEffects = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    if (config.edgePolish) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    }
    
    if (config.doubleLayer) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);
    }

    // Толщина акрила (3D эффект)
    const thickness = parseInt(config.thickness.replace('mm', ''));
    const depthOffset = thickness / 2;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w + depthOffset, y - depthOffset);
    ctx.lineTo(x + w + depthOffset, y + h - depthOffset);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + depthOffset, y + h - depthOffset);
    ctx.lineTo(x + w + depthOffset, y + h - depthOffset);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
  };

  const calculatePrice = (): number => {
    const basePrice = (width * height * 0.001); // Base per sq.cm
    const thicknessMultiplier = acrylicThicknesses[config.thickness as keyof typeof acrylicThicknesses]?.price || 1;
    const finishMultiplier = acrylicFinishes[config.finish as keyof typeof acrylicFinishes]?.price || 1;
    
    let effectsMultiplier = 1.0;
    if (config.effect !== 'none') effectsMultiplier += 0.3;
    if (config.uvPrint) effectsMultiplier += 0.4;
    if (config.backLight) effectsMultiplier += 0.6;
    if (config.doubleLayer) effectsMultiplier += 0.8;
    if (config.backgroundPattern !== 'none') effectsMultiplier += 0.2;
    
    const filtersCount = Object.values(config.modernFilters).filter(Boolean).length;
    effectsMultiplier += filtersCount * 0.15;

    return basePrice * thicknessMultiplier * finishMultiplier * effectsMultiplier;
  };

  const updateConfig = (updates: Partial<ModernPrintConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig({
      thickness: '5mm',
      finish: 'glossy',
      effect: 'none',
      backgroundPattern: 'none',
      colorMode: 'rgb',
      lighting: 'ambient',
      transparency: 0,
      reflectivity: 80,
      contrast: 100,
      saturation: 100,
      brightness: 100,
      warmth: 0,
      edgePolish: true,
      uvPrint: false,
      backLight: false,
      doubleLayer: false,
      textureIntensity: 50,
      modernFilters: {
        cyberpunk: false,
        vaporwave: false,
        synthwave: false,
        brutalist: false,
        bauhaus: false
      }
    });
  };

  const exportConfig = () => {
    const configData = {
      config,
      dimensions: { width, height },
      price: calculatePrice(),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acrylic-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Конфігуратор акрилових принтів</h2>
          <p className="text-muted-foreground">Створіть сучасний акриловий принт з передовими ефектами</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {width}×{height}mm
          </Badge>
          <Badge variant="outline">
            ₴{calculatePrice().toFixed(2)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                3D Preview
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-mono w-12 text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={resetConfig}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden" style={{ minHeight: '500px' }}>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-full"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Panel */}
        <div>
          <Tabs defaultValue="material" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="material">Материал</TabsTrigger>
              <TabsTrigger value="effects">Эффекты</TabsTrigger>
              <TabsTrigger value="colors">Цвета</TabsTrigger>
              <TabsTrigger value="advanced">Опции</TabsTrigger>
            </TabsList>

            <TabsContent value="material" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Основные параметры
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Толщина акрила</Label>
                    <Select value={config.thickness} onValueChange={(value) => updateConfig({ thickness: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(acrylicThicknesses).map(([key, thickness]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center justify-between w-full">
                              <span>{thickness.name}</span>
                              <Badge variant="outline">×{thickness.price}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {acrylicThicknesses[config.thickness as keyof typeof acrylicThicknesses]?.description || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <Label>Финиш поверхности</Label>
                    <Select value={config.finish} onValueChange={(value) => updateConfig({ finish: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(acrylicFinishes).map(([key, finish]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center justify-between w-full">
                              <span>{finish.name}</span>
                              <Badge variant="outline">×{finish.price}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {acrylicFinishes[config.finish as keyof typeof acrylicFinishes]?.description || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <Label>Прозрачность (%)</Label>
                    <Slider
                      value={[config.transparency]}
                      onValueChange={([value]) => updateConfig({ transparency: value })}
                      max={80}
                      step={5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{config.transparency}% прозрачности</p>
                  </div>

                  <div>
                    <Label>Отражающая способность (%)</Label>
                    <Slider
                      value={[config.reflectivity]}
                      onValueChange={([value]) => updateConfig({ reflectivity: value })}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{config.reflectivity}% отражения</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Современные эффекты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Основной эффект</Label>
                    <Select value={config.effect} onValueChange={(value) => updateConfig({ effect: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(modernEffects).map(([key, effect]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <div className="font-medium">{effect.name}</div>
                              <div className="text-xs text-muted-foreground">{effect.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Фоновый паттерн</Label>
                    <Select value={config.backgroundPattern} onValueChange={(value) => updateConfig({ backgroundPattern: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(backgroundPatterns).map(([key, name]) => (
                          <SelectItem key={key} value={key}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Освещение</Label>
                    <Select value={config.lighting} onValueChange={(value) => updateConfig({ lighting: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(lightingEffects).map(([key, name]) => (
                          <SelectItem key={key} value={key}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Стилевые фильтры</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {Object.entries(config.modernFilters).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <label className="text-sm capitalize">{key}</label>
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => 
                              updateConfig({ 
                                modernFilters: { ...config.modernFilters, [key]: checked }
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Цветовые настройки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Цветовая модель</Label>
                    <Select value={config.colorMode} onValueChange={(value) => updateConfig({ colorMode: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(colorModes).map(([key, name]) => (
                          <SelectItem key={key} value={key}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Контрастность (%)</Label>
                    <Slider
                      value={[config.contrast]}
                      onValueChange={([value]) => updateConfig({ contrast: value })}
                      min={50}
                      max={150}
                      step={5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{config.contrast}% контраста</p>
                  </div>

                  <div>
                    <Label>Насыщенность (%)</Label>
                    <Slider
                      value={[config.saturation]}
                      onValueChange={([value]) => updateConfig({ saturation: value })}
                      min={50}
                      max={150}
                      step={5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{config.saturation}% насыщенности</p>
                  </div>

                  <div>
                    <Label>Яркость (%)</Label>
                    <Slider
                      value={[config.brightness]}
                      onValueChange={([value]) => updateConfig({ brightness: value })}
                      min={50}
                      max={150}
                      step={5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{config.brightness}% яркости</p>
                  </div>

                  <div>
                    <Label>Температура цвета</Label>
                    <Slider
                      value={[config.warmth]}
                      onValueChange={([value]) => updateConfig({ warmth: value })}
                      min={-50}
                      max={50}
                      step={5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {config.warmth > 0 ? 'Теплее' : config.warmth < 0 ? 'Холоднее' : 'Нейтральный'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Продвинутые опции
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Полировка краев</Label>
                        <p className="text-xs text-muted-foreground">Глянцевая обработка</p>
                      </div>
                      <Switch
                        checked={config.edgePolish}
                        onCheckedChange={(checked) => updateConfig({ edgePolish: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>UV печать</Label>
                        <p className="text-xs text-muted-foreground">Повышенная стойкость</p>
                      </div>
                      <Switch
                        checked={config.uvPrint}
                        onCheckedChange={(checked) => updateConfig({ uvPrint: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>LED подсветка</Label>
                        <p className="text-xs text-muted-foreground">Внутренняя подсветка</p>
                      </div>
                      <Switch
                        checked={config.backLight}
                        onCheckedChange={(checked) => updateConfig({ backLight: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Двойной слой</Label>
                        <p className="text-xs text-muted-foreground">3D эффект глубины</p>
                      </div>
                      <Switch
                        checked={config.doubleLayer}
                        onCheckedChange={(checked) => updateConfig({ doubleLayer: checked })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Интенсивность текстуры (%)</Label>
                    <Slider
                      value={[config.textureIntensity]}
                      onValueChange={([value]) => updateConfig({ textureIntensity: value })}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{config.textureIntensity}% интенсивности</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Экспорт и сохранение</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button onClick={exportConfig} className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Экспорт конфигурации
                    </Button>
                    <Button onClick={resetConfig} variant="outline" className="w-full">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Сбросить настройки
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Price Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Расчет стоимости
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">₴{calculatePrice().toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">Общая стоимость</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{acrylicThicknesses[config.thickness as keyof typeof acrylicThicknesses]?.name || 'Unknown'}</div>
              <p className="text-sm text-muted-foreground">Толщина</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{acrylicFinishes[config.finish as keyof typeof acrylicFinishes]?.name || 'Unknown'}</div>
              <p className="text-sm text-muted-foreground">Финиш</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{width}×{height}mm</div>
              <p className="text-sm text-muted-foreground">Размеры</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}