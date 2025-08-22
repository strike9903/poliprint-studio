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
  Scissors, Edit3, Star, Zap, Droplet, Shield, Sun, Hash
} from 'lucide-react';

const stickerMaterials = {
  vinyl: { name: 'Виниловые', price: 1.0, description: 'Прочные и долговечные', durability: 5 },
  paper: { name: 'Бумажные', price: 0.6, description: 'Бюджетный вариант', durability: 2 },
  transparent: { name: 'Прозрачные', price: 1.4, description: 'Невидимый фон', durability: 4 },
  holographic: { name: 'Голографические', price: 2.2, description: 'Радужные переливы', durability: 4 },
  foil: { name: 'Фольгированные', price: 1.8, description: 'Металлический блеск', durability: 4 },
  fabric: { name: 'Тканевые', price: 2.0, description: 'Текстильная основа', durability: 3 },
  reflective: { name: 'Светоотражающие', price: 2.5, description: 'Видимость в темноте', durability: 5 }
};

const adhesiveTypes = {
  permanent: { name: 'Постоянный', price: 1.0, description: 'Сильное сцепление' },
  removable: { name: 'Съемный', price: 1.2, description: 'Легко удаляется' },
  repositionable: { name: 'Перемещаемый', price: 1.3, description: 'Можно переклеивать' },
  low_tack: { name: 'Слабый клей', price: 1.1, description: 'Для деликатных поверхностей' },
  high_tack: { name: 'Усиленный', price: 1.4, description: 'Экстра-сильный' }
};

const cuttingTypes = {
  die_cut: { name: 'Высечка (Die Cut)', price: 1.0, description: 'Точная форма изображения' },
  kiss_cut: { name: 'Поцелуйная резка', price: 0.8, description: 'Только верхний слой' },
  crack_back: { name: 'Crack & Peel', price: 1.2, description: 'Легкое удаление подложки' },
  perforation: { name: 'Перфорация', price: 1.1, description: 'Легкий отрыв' },
  score: { name: 'Биговка', price: 0.9, description: 'Линии сгиба' }
};

const contourShapes = {
  auto: { name: 'Автоматический', description: 'Определение контура по изображению' },
  rectangle: { name: 'Прямоугольник', description: 'Простая форма' },
  rounded: { name: 'Скругленный', description: 'Закругленные углы' },
  circle: { name: 'Круг', description: 'Круглая форма' },
  oval: { name: 'Овал', description: 'Эллиптическая форма' },
  star: { name: 'Звезда', description: 'Звездообразная' },
  heart: { name: 'Сердце', description: 'Форма сердца' },
  hexagon: { name: 'Шестиугольник', description: 'Геометрическая форма' },
  custom: { name: 'Произвольная', description: 'Пользовательская форма' }
};

const finishTypes = {
  glossy: { name: 'Глянцевый', price: 1.0, description: 'Блестящая поверхность' },
  matte: { name: 'Матовый', price: 1.1, description: 'Без блеска' },
  satin: { name: 'Сатиновый', price: 1.2, description: 'Полуглянцевый' },
  textured: { name: 'Текстурированный', price: 1.3, description: 'Рельефная поверхность' },
  soft_touch: { name: 'Soft Touch', price: 1.5, description: 'Бархатистый на ощупь' }
};

const specialEffects = {
  none: 'Без эффектов',
  glitter: 'Блестки',
  metallic: 'Металлик',
  glow: 'Свечение в темноте',
  scratch_off: 'Стираемый слой',
  temperature: 'Термохромный',
  uv_reactive: 'УФ-реактивный',
  embossed: 'Тиснение'
};

const weatherResistance = {
  indoor: { name: 'Внутреннее использование', price: 1.0, years: 1 },
  outdoor_1: { name: 'На улице (1 год)', price: 1.2, years: 1 },
  outdoor_3: { name: 'На улице (3 года)', price: 1.5, years: 3 },
  outdoor_5: { name: 'На улице (5 лет)', price: 2.0, years: 5 },
  outdoor_7: { name: 'На улице (7 лет)', price: 2.5, years: 7 },
  marine: { name: 'Морской класс', price: 3.0, years: 10 }
};

interface ContourPoint {
  x: number;
  y: number;
  type: 'line' | 'curve';
  controlPoint1?: { x: number; y: number };
  controlPoint2?: { x: number; y: number };
}

interface StickerConfig {
  material: string;
  adhesive: string;
  cutting: string;
  contourShape: string;
  finish: string;
  effect: string;
  weatherResistance: string;
  thickness: number;
  quantity: number;
  autoContour: boolean;
  contourTolerance: number;
  bleedArea: number;
  cornerRadius: number;
  customContour: ContourPoint[];
  multilayer: boolean;
  numbering: {
    enabled: boolean;
    start: number;
    format: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  };
  variableData: {
    enabled: boolean;
    fields: string[];
  };
  qualityOptions: {
    highResolution: boolean;
    colorCorrection: boolean;
    proofRequired: boolean;
    rushOrder: boolean;
  };
}

interface StickerConfiguratorProps {
  width: number;
  height: number;
  onConfigChange?: (config: StickerConfig) => void;
  onPriceChange?: (price: number) => void;
}

export function StickerConfigurator({ 
  width = 100, 
  height = 100, 
  onConfigChange, 
  onPriceChange 
}: StickerConfiguratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<StickerConfig>({
    material: 'vinyl',
    adhesive: 'permanent',
    cutting: 'die_cut',
    contourShape: 'auto',
    finish: 'glossy',
    effect: 'none',
    weatherResistance: 'indoor',
    thickness: 100,
    quantity: 100,
    autoContour: true,
    contourTolerance: 15,
    bleedArea: 2,
    cornerRadius: 5,
    customContour: [],
    multilayer: false,
    numbering: {
      enabled: false,
      start: 1,
      format: '###',
      position: 'bottom-right'
    },
    variableData: {
      enabled: false,
      fields: []
    },
    qualityOptions: {
      highResolution: false,
      colorCorrection: false,
      proofRequired: false,
      rushOrder: false
    }
  });

  const [zoom, setZoom] = useState(100);
  const [selectedTool, setSelectedTool] = useState('move');
  const [contourEditMode, setContourEditMode] = useState(false);

  useEffect(() => {
    renderStickerPreview();
    const price = calculatePrice();
    onPriceChange?.(price);
    onConfigChange?.(config);
  }, [config, zoom]);

  const renderStickerPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = zoom / 100;
    const scaledWidth = width * scale * 2; // Увеличиваем для лучшей видимости
    const scaledHeight = height * scale * 2;

    // Центрируем стикер
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    // Рисуем базовую форму стикера
    drawStickerBase(ctx, x, y, scaledWidth, scaledHeight);
    
    // Применяем материал и эффекты
    applyStickerMaterial(ctx, x, y, scaledWidth, scaledHeight);
    
    // Рисуем контур обрезки
    drawCuttingContour(ctx, x, y, scaledWidth, scaledHeight);
    
    // Добавляем специальные эффекты
    applySpecialEffects(ctx, x, y, scaledWidth, scaledHeight);
    
    // Показываем нумерацию если включена
    if (config.numbering.enabled) {
      drawNumbering(ctx, x, y, scaledWidth, scaledHeight);
    }

    // Информация о стикере
    ctx.fillStyle = '#666';
    ctx.font = '12px monospace';
    ctx.fillText(`${width}×${height}mm`, 10, canvas.height - 10);
    const materialInfo = stickerMaterials[config.material as keyof typeof stickerMaterials];
    const cuttingInfo = cuttingTypes[config.cutting as keyof typeof cuttingTypes];
    ctx.fillText(`${materialInfo?.name || 'Unknown'}`, 10, canvas.height - 25);
    ctx.fillText(`${cuttingInfo?.name || 'Unknown'}`, 10, canvas.height - 40);
  };

  const drawStickerBase = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.save();
    
    // Подложка (если Kiss Cut)
    if (config.cutting === 'kiss_cut') {
      ctx.fillStyle = 'rgba(240, 240, 240, 0.8)';
      ctx.fillRect(x - 10, y - 10, w + 20, h + 20);
    }

    // Основная форма стикера
    ctx.beginPath();
    
    if (config.contourShape === 'rectangle') {
      if (config.cornerRadius > 0) {
        drawRoundedRect(ctx, x, y, w, h, config.cornerRadius);
      } else {
        ctx.rect(x, y, w, h);
      }
    } else if (config.contourShape === 'circle') {
      const radius = Math.min(w, h) / 2;
      ctx.arc(x + w/2, y + h/2, radius, 0, Math.PI * 2);
    } else if (config.contourShape === 'oval') {
      ctx.ellipse(x + w/2, y + h/2, w/2, h/2, 0, 0, Math.PI * 2);
    } else if (config.contourShape === 'star') {
      drawStar(ctx, x + w/2, y + h/2, Math.min(w, h) / 3, Math.min(w, h) / 6, 5);
    } else if (config.contourShape === 'heart') {
      drawHeart(ctx, x + w/2, y + h/2, Math.min(w, h) / 3);
    } else if (config.contourShape === 'hexagon') {
      drawHexagon(ctx, x + w/2, y + h/2, Math.min(w, h) / 3);
    } else {
      // Прямоугольник по умолчанию
      ctx.rect(x, y, w, h);
    }

    ctx.closePath();
    ctx.clip();
    ctx.restore();
  };

  const applyStickerMaterial = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const material = stickerMaterials[config.material as keyof typeof stickerMaterials];
    
    ctx.save();
    recreatePath(ctx, x, y, w, h);

    if (config.material === 'transparent') {
      // Прозрачный материал - показываем только границы
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (config.material === 'holographic') {
      // Голографический эффект
      const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
      gradient.addColorStop(0, 'rgba(255, 0, 255, 0.4)');
      gradient.addColorStop(0.2, 'rgba(0, 255, 255, 0.4)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 0, 0.4)');
      gradient.addColorStop(0.6, 'rgba(255, 0, 0, 0.4)');
      gradient.addColorStop(0.8, 'rgba(0, 255, 0, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 255, 0.4)');
      ctx.fillStyle = gradient;
      ctx.fill();
    } else if (config.material === 'foil') {
      // Фольгированный материал
      const gradient = ctx.createLinearGradient(x, y, x, y + h);
      gradient.addColorStop(0, 'rgba(220, 220, 220, 0.9)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(1, 'rgba(200, 200, 200, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fill();
    } else if (config.material === 'reflective') {
      // Светоотражающий материал
      ctx.fillStyle = 'rgba(240, 240, 240, 0.9)';
      ctx.fill();
      // Добавляем точки для имитации отражающих элементов
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let px = x + 5; px < x + w; px += 8) {
        for (let py = y + 5; py < y + h; py += 8) {
          ctx.fillRect(px, py, 2, 2);
        }
      }
    } else {
      // Обычные материалы
      let baseColor = 'rgba(255, 255, 255, 0.9)';
      if (config.material === 'paper') baseColor = 'rgba(250, 248, 240, 0.9)';
      if (config.material === 'fabric') baseColor = 'rgba(240, 235, 230, 0.9)';
      
      ctx.fillStyle = baseColor;
      ctx.fill();
    }

    // Применяем финиш
    applyFinish(ctx, x, y, w, h);
    
    ctx.restore();
  };

  const applyFinish = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    if (config.finish === 'glossy') {
      // Глянцевый блик
      const gradient = ctx.createLinearGradient(x, y, x, y + h/3);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      recreatePath(ctx, x, y, w, h);
      ctx.fill();
    } else if (config.finish === 'textured') {
      // Текстурированная поверхность
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#000';
      for (let i = 0; i < 100; i++) {
        const px = x + Math.random() * w;
        const py = y + Math.random() * h;
        ctx.fillRect(px, py, 1, 1);
      }
      ctx.globalAlpha = 1;
    } else if (config.finish === 'soft_touch') {
      // Soft touch эффект
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      recreatePath(ctx, x, y, w, h);
      ctx.fill();
    }
  };

  const drawCuttingContour = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.save();
    
    if (config.cutting === 'die_cut') {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
    } else if (config.cutting === 'kiss_cut') {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 1;
      ctx.setLineDash([1, 1]);
    } else if (config.cutting === 'perforation') {
      ctx.strokeStyle = '#0000ff';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 2]);
    } else {
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);
    }

    recreatePath(ctx, x, y, w, h);
    ctx.stroke();
    
    ctx.restore();
  };

  const applySpecialEffects = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    if (config.effect === 'glitter') {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
      for (let i = 0; i < 20; i++) {
        const px = x + Math.random() * w;
        const py = y + Math.random() * h;
        const size = Math.random() * 3 + 1;
        ctx.fillRect(px, py, size, size);
      }
    } else if (config.effect === 'metallic') {
      const gradient = ctx.createLinearGradient(x, y, x + w, y);
      gradient.addColorStop(0, 'rgba(192, 192, 192, 0.3)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(128, 128, 128, 0.3)');
      ctx.fillStyle = gradient;
      recreatePath(ctx, x, y, w, h);
      ctx.fill();
    } else if (config.effect === 'glow') {
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 10;
      ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
      recreatePath(ctx, x, y, w, h);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (config.effect === 'embossed') {
      // Эффект тиснения
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      recreatePath(ctx, x, y, w, h);
      ctx.stroke();
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
    }
  };

  const drawNumbering = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    
    let textX = x;
    let textY = y;
    
    switch (config.numbering.position) {
      case 'top-left':
        textX = x + 5;
        textY = y + 15;
        break;
      case 'top-right':
        textX = x + w - 25;
        textY = y + 15;
        break;
      case 'bottom-left':
        textX = x + 5;
        textY = y + h - 5;
        break;
      case 'bottom-right':
        textX = x + w - 25;
        textY = y + h - 5;
        break;
      case 'center':
        textX = x + w/2 - 10;
        textY = y + h/2;
        break;
    }

    const number = config.numbering.format.replace(/#+/g, config.numbering.start.toString());
    ctx.fillText(number, textX, textY);
  };

  const recreatePath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.beginPath();
    
    if (config.contourShape === 'rectangle') {
      if (config.cornerRadius > 0) {
        drawRoundedRect(ctx, x, y, w, h, config.cornerRadius);
      } else {
        ctx.rect(x, y, w, h);
      }
    } else if (config.contourShape === 'circle') {
      const radius = Math.min(w, h) / 2;
      ctx.arc(x + w/2, y + h/2, radius, 0, Math.PI * 2);
    } else if (config.contourShape === 'oval') {
      ctx.ellipse(x + w/2, y + h/2, w/2, h/2, 0, 0, Math.PI * 2);
    } else if (config.contourShape === 'star') {
      drawStar(ctx, x + w/2, y + h/2, Math.min(w, h) / 3, Math.min(w, h) / 6, 5);
    } else if (config.contourShape === 'heart') {
      drawHeart(ctx, x + w/2, y + h/2, Math.min(w, h) / 3);
    } else if (config.contourShape === 'hexagon') {
      drawHexagon(ctx, x + w/2, y + h/2, Math.min(w, h) / 3);
    } else {
      ctx.rect(x, y, w, h);
    }
  };

  // Вспомогательные функции для рисования форм
  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) => {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, outerRadius: number, innerRadius: number, points: number) => {
    const step = Math.PI / points;
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i <= 2 * points; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * step - Math.PI / 2;
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    ctx.moveTo(cx, cy + size * 0.3);
    ctx.bezierCurveTo(cx - size * 0.5, cy - size * 0.3, cx - size, cy + size * 0.1, cx, cy + size);
    ctx.bezierCurveTo(cx + size, cy + size * 0.1, cx + size * 0.5, cy - size * 0.3, cx, cy + size * 0.3);
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  };

  const calculatePrice = (): number => {
    const basePrice = (width * height * 0.001) * config.quantity; // Base per sq.cm
    const materialMultiplier = stickerMaterials[config.material as keyof typeof stickerMaterials]?.price || 1;
    const adhesiveMultiplier = adhesiveTypes[config.adhesive as keyof typeof adhesiveTypes]?.price || 1;
    const cuttingMultiplier = cuttingTypes[config.cutting as keyof typeof cuttingTypes]?.price || 1;
    const finishMultiplier = finishTypes[config.finish as keyof typeof finishTypes]?.price || 1;
    const weatherMultiplier = weatherResistance[config.weatherResistance as keyof typeof weatherResistance]?.price || 1;
    
    let effectsMultiplier = 1.0;
    if (config.effect !== 'none') effectsMultiplier += 0.3;
    if (config.multilayer) effectsMultiplier += 0.5;
    if (config.numbering.enabled) effectsMultiplier += 0.2;
    if (config.variableData.enabled) effectsMultiplier += 0.4;
    
    // Качественные опции
    if (config.qualityOptions.highResolution) effectsMultiplier += 0.1;
    if (config.qualityOptions.colorCorrection) effectsMultiplier += 0.15;
    if (config.qualityOptions.proofRequired) effectsMultiplier += 0.2;
    if (config.qualityOptions.rushOrder) effectsMultiplier += 0.5;

    // Скидки за количество
    let quantityDiscount = 1.0;
    if (config.quantity >= 1000) quantityDiscount = 0.8;
    else if (config.quantity >= 500) quantityDiscount = 0.85;
    else if (config.quantity >= 250) quantityDiscount = 0.9;
    else if (config.quantity >= 100) quantityDiscount = 0.95;

    return basePrice * materialMultiplier * adhesiveMultiplier * cuttingMultiplier * 
           finishMultiplier * weatherMultiplier * effectsMultiplier * quantityDiscount;
  };

  const updateConfig = (updates: Partial<StickerConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig({
      material: 'vinyl',
      adhesive: 'permanent',
      cutting: 'die_cut',
      contourShape: 'auto',
      finish: 'glossy',
      effect: 'none',
      weatherResistance: 'indoor',
      thickness: 100,
      quantity: 100,
      autoContour: true,
      contourTolerance: 15,
      bleedArea: 2,
      cornerRadius: 5,
      customContour: [],
      multilayer: false,
      numbering: {
        enabled: false,
        start: 1,
        format: '###',
        position: 'bottom-right'
      },
      variableData: {
        enabled: false,
        fields: []
      },
      qualityOptions: {
        highResolution: false,
        colorCorrection: false,
        proofRequired: false,
        rushOrder: false
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
    a.download = `sticker-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Конфігуратор наклейок з контурною вирубкою</h2>
          <p className="text-muted-foreground">Створіть професійні наклейки з точною формою вирубки</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {width}×{height}mm
          </Badge>
          <Badge variant="secondary">
            {config.quantity} шт
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
                <Scissors className="w-5 h-5" />
                Preview с контуром вирубки
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
                <Button 
                  variant={contourEditMode ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setContourEditMode(!contourEditMode)}
                >
                  <Edit3 className="w-4 h-4" />
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
                  className="w-full h-full cursor-crosshair"
                  style={{ imageRendering: 'pixelated' }}
                />
                {contourEditMode && (
                  <div className="absolute top-2 left-2 bg-white/90 rounded p-2 text-xs">
                    Режим редагування контуру активний
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                <span>Червона лінія: высечка • Зеленая лінія: kiss cut • Синя лінія: перфорація</span>
                <span>{width}×{height}mm</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Panel */}
        <div>
          <Tabs defaultValue="material" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="material">Материал</TabsTrigger>
              <TabsTrigger value="cutting">Вирубка</TabsTrigger>
              <TabsTrigger value="effects">Ефекти</TabsTrigger>
              <TabsTrigger value="advanced">Опції</TabsTrigger>
            </TabsList>

            <TabsContent value="material" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Основні параметри
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Материал наклейки</Label>
                    <Select value={config.material} onValueChange={(value) => updateConfig({ material: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(stickerMaterials).map(([key, material]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <div className="font-medium">{material.name}</div>
                                <div className="text-xs text-muted-foreground">{material.description}</div>
                              </div>
                              <Badge variant="outline">×{material.price}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Тип клея</Label>
                    <Select value={config.adhesive} onValueChange={(value) => updateConfig({ adhesive: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(adhesiveTypes).map(([key, adhesive]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <div className="font-medium">{adhesive.name}</div>
                              <div className="text-xs text-muted-foreground">{adhesive.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Финиш поверхности</Label>
                    <Select value={config.finish} onValueChange={(value) => updateConfig({ finish: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(finishTypes).map(([key, finish]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center justify-between w-full">
                              <span>{finish.name}</span>
                              <Badge variant="outline">×{finish.price}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Стойкость к погоде</Label>
                    <Select value={config.weatherResistance} onValueChange={(value) => updateConfig({ weatherResistance: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(weatherResistance).map(([key, weather]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <div className="font-medium">{weather.name}</div>
                                <div className="text-xs text-muted-foreground">{weather.years} лет</div>
                              </div>
                              <Badge variant="outline">×{weather.price}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Количество (шт)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10000}
                      value={config.quantity}
                      onChange={(e) => updateConfig({ quantity: parseInt(e.target.value) || 100 })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Скидки: 100+ (5%), 250+ (10%), 500+ (15%), 1000+ (20%)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cutting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scissors className="w-5 h-5" />
                    Контурна вирубка
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Тип різання</Label>
                    <Select value={config.cutting} onValueChange={(value) => updateConfig({ cutting: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(cuttingTypes).map(([key, cutting]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <div className="font-medium">{cutting.name}</div>
                              <div className="text-xs text-muted-foreground">{cutting.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Форма контура</Label>
                    <Select value={config.contourShape} onValueChange={(value) => updateConfig({ contourShape: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(contourShapes).map(([key, shape]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <div className="font-medium">{shape.name}</div>
                              <div className="text-xs text-muted-foreground">{shape.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {config.contourShape === 'rounded' && (
                    <div>
                      <Label>Радіус заокруглення (мм)</Label>
                      <Slider
                        value={[config.cornerRadius]}
                        onValueChange={([value]) => updateConfig({ cornerRadius: value })}
                        max={20}
                        step={1}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">{config.cornerRadius}mm радіус</p>
                    </div>
                  )}

                  <div>
                    <Label>Область выпуска під обрез (мм)</Label>
                    <Slider
                      value={[config.bleedArea]}
                      onValueChange={([value]) => updateConfig({ bleedArea: value })}
                      max={5}
                      step={0.5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{config.bleedArea}mm виплив</p>
                  </div>

                  {config.contourShape === 'auto' && (
                    <div>
                      <Label>Точність контуру (%)</Label>
                      <Slider
                        value={[config.contourTolerance]}
                        onValueChange={([value]) => updateConfig({ contourTolerance: value })}
                        min={5}
                        max={50}
                        step={5}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {config.contourTolerance}% допуск ({config.contourTolerance < 15 ? 'Висока точність' : config.contourTolerance < 30 ? 'Середня точність' : 'Швидке виявлення'})
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Спеціальні ефекти
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Спеціальний ефект</Label>
                    <Select value={config.effect} onValueChange={(value) => updateConfig({ effect: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(specialEffects).map(([key, name]) => (
                          <SelectItem key={key} value={key}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Багатошарова наклейка</Label>
                        <p className="text-xs text-muted-foreground">Декілька рівнів для об'ємного ефекту</p>
                      </div>
                      <Switch
                        checked={config.multilayer}
                        onCheckedChange={(checked) => updateConfig({ multilayer: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Нумерація
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Включити нумерацію</Label>
                    <Switch
                      checked={config.numbering.enabled}
                      onCheckedChange={(checked) => 
                        updateConfig({ numbering: { ...config.numbering, enabled: checked }})
                      }
                    />
                  </div>

                  {config.numbering.enabled && (
                    <>
                      <div>
                        <Label>Початковий номер</Label>
                        <Input
                          type="number"
                          min={1}
                          value={config.numbering.start}
                          onChange={(e) => 
                            updateConfig({ 
                              numbering: { 
                                ...config.numbering, 
                                start: parseInt(e.target.value) || 1 
                              }
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Формат нумерації</Label>
                        <Input
                          value={config.numbering.format}
                          onChange={(e) => 
                            updateConfig({ 
                              numbering: { 
                                ...config.numbering, 
                                format: e.target.value 
                              }
                            })
                          }
                          placeholder="### или ABC-###"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          # = цифра, A = буква
                        </p>
                      </div>

                      <div>
                        <Label>Положення номера</Label>
                        <Select 
                          value={config.numbering.position} 
                          onValueChange={(value) => 
                            updateConfig({ 
                              numbering: { 
                                ...config.numbering, 
                                position: value as any 
                              }
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top-left">Верх слева</SelectItem>
                            <SelectItem value="top-right">Верх справа</SelectItem>
                            <SelectItem value="bottom-left">Низ слева</SelectItem>
                            <SelectItem value="bottom-right">Низ справа</SelectItem>
                            <SelectItem value="center">По центру</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Качество и опции
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Высокое разрешение</Label>
                        <p className="text-xs text-muted-foreground">600+ DPI печать</p>
                      </div>
                      <Switch
                        checked={config.qualityOptions.highResolution}
                        onCheckedChange={(checked) => 
                          updateConfig({ 
                            qualityOptions: { 
                              ...config.qualityOptions, 
                              highResolution: checked 
                            }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Цветокоррекция</Label>
                        <p className="text-xs text-muted-foreground">Профессиональная цветокоррекция</p>
                      </div>
                      <Switch
                        checked={config.qualityOptions.colorCorrection}
                        onCheckedChange={(checked) => 
                          updateConfig({ 
                            qualityOptions: { 
                              ...config.qualityOptions, 
                              colorCorrection: checked 
                            }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Обязательная цветопроба</Label>
                        <p className="text-xs text-muted-foreground">Утверждение перед печатью</p>
                      </div>
                      <Switch
                        checked={config.qualityOptions.proofRequired}
                        onCheckedChange={(checked) => 
                          updateConfig({ 
                            qualityOptions: { 
                              ...config.qualityOptions, 
                              proofRequired: checked 
                            }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Срочный заказ</Label>
                        <p className="text-xs text-muted-foreground">Приоритетное выполнение</p>
                      </div>
                      <Switch
                        checked={config.qualityOptions.rushOrder}
                        onCheckedChange={(checked) => 
                          updateConfig({ 
                            qualityOptions: { 
                              ...config.qualityOptions, 
                              rushOrder: checked 
                            }
                          })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Переменные данные</Label>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">Персонализация каждой наклейки</span>
                      <Switch
                        checked={config.variableData.enabled}
                        onCheckedChange={(checked) => 
                          updateConfig({ 
                            variableData: { 
                              ...config.variableData, 
                              enabled: checked 
                            }
                          })
                        }
                      />
                    </div>
                    {config.variableData.enabled && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Загрузите Excel файл с данными для персонализации
                      </p>
                    )}
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
            <Zap className="w-5 h-5" />
            Детальный расчет стоимости
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">₴{calculatePrice().toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">Общая стоимость</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{stickerMaterials[config.material as keyof typeof stickerMaterials]?.name || 'Unknown'}</div>
              <p className="text-sm text-muted-foreground">Материал</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{cuttingTypes[config.cutting as keyof typeof cuttingTypes]?.name || 'Unknown'}</div>
              <p className="text-sm text-muted-foreground">Вирубка</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{config.quantity} шт</div>
              <p className="text-sm text-muted-foreground">Количество</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{width}×{height}mm</div>
              <p className="text-sm text-muted-foreground">Размеры</p>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Цена указана за {config.quantity} шт с учетом всех опций • 
            {weatherResistance[config.weatherResistance as keyof typeof weatherResistance]?.name || 'Unknown'} • 
            {finishTypes[config.finish as keyof typeof finishTypes]?.name || 'Unknown'} финиш
          </div>
        </CardContent>
      </Card>
    </div>
  );
}