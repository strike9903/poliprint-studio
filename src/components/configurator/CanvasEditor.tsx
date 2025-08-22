"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Type,
  Square,
  Circle,
  Image as ImageIcon,
  Brush,
  Eraser,
  Undo,
  Redo,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Copy,
  Trash2,
  Download,
  Upload,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Palette,
  Settings
} from 'lucide-react';

interface CanvasEditorProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
  onExport?: (format: 'png' | 'jpg' | 'pdf') => void;
  className?: string;
}

interface CanvasObject {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  locked: boolean;
  layer: number;
  fabricObject: fabric.Object;
}

export function CanvasEditor({ 
  width = 800, 
  height = 600, 
  onSave, 
  onExport,
  className 
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeMode, setActiveMode] = useState<'select' | 'text' | 'draw' | 'shape'>('select');
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(5);
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isDrawing, setIsDrawing] = useState(false);

  // Инициализация Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff'
      });

      fabricCanvasRef.current = canvas;

      // События canvas
      canvas.on('selection:created', (e) => {
        setSelectedObject(e.selected?.[0] || null);
      });

      canvas.on('selection:updated', (e) => {
        setSelectedObject(e.selected?.[0] || null);
      });

      canvas.on('selection:cleared', () => {
        setSelectedObject(null);
      });

      canvas.on('object:added', () => {
        updateObjectsList();
        saveState();
      });

      canvas.on('object:removed', () => {
        updateObjectsList();
        saveState();
      });

      canvas.on('object:modified', () => {
        updateObjectsList();
        saveState();
      });

      // Настройка brush
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = brushColor;
        canvas.freeDrawingBrush.width = brushWidth;
      }

      return () => {
        canvas.dispose();
      };
    }
  }, [width, height]);

  // Обновление списка объектов
  const updateObjectsList = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const objects = fabricCanvasRef.current.getObjects().map((obj, index) => ({
      id: (obj as any).id || `object_${index}`,
      type: obj.type || 'unknown',
      name: (obj as any).name || `${obj.type} ${index + 1}`,
      visible: obj.visible !== false,
      locked: obj.lockMovementX || false,
      layer: index,
      fabricObject: obj
    }));

    setCanvasObjects(objects);
  }, []);

  // Сохранение состояния для истории
  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const currentState = JSON.stringify(fabricCanvasRef.current.toJSON());
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(currentState);
    
    // Ограничиваем историю 50 шагами
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryStep(historyStep + 1);
    }
    
    setHistory(newHistory);
  }, [history, historyStep]);

  // Инструменты управления
  const handleUndo = () => {
    if (historyStep > 0 && fabricCanvasRef.current) {
      const previousState = history[historyStep - 1];
      fabricCanvasRef.current.loadFromJSON(previousState, () => {
        fabricCanvasRef.current?.renderAll();
        setHistoryStep(historyStep - 1);
        updateObjectsList();
      });
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1 && fabricCanvasRef.current) {
      const nextState = history[historyStep + 1];
      fabricCanvasRef.current.loadFromJSON(nextState, () => {
        fabricCanvasRef.current?.renderAll();
        setHistoryStep(historyStep + 1);
        updateObjectsList();
      });
    }
  };

  const handleClear = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#ffffff';
      setCanvasObjects([]);
      saveState();
    }
  };

  // Режимы редактирования
  const setSelectMode = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = false;
      setActiveMode('select');
      setIsDrawing(false);
    }
  };

  const setDrawMode = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = true;
      if (fabricCanvasRef.current.freeDrawingBrush) {
        fabricCanvasRef.current.freeDrawingBrush.color = brushColor;
        fabricCanvasRef.current.freeDrawingBrush.width = brushWidth;
      }
      setActiveMode('draw');
      setIsDrawing(true);
    }
  };

  // Добавление текста
  const addText = () => {
    if (fabricCanvasRef.current) {
      const text = new fabric.IText('Введіть текст', {
        left: 100,
        top: 100,
        fontFamily: fontFamily,
        fontSize: fontSize,
        fill: textColor
      });
      
      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
    }
  };

  // Добавление фигур
  const addRectangle = () => {
    if (fabricCanvasRef.current) {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: 'transparent',
        stroke: brushColor,
        strokeWidth: 2
      });
      
      fabricCanvasRef.current.add(rect);
      fabricCanvasRef.current.setActiveObject(rect);
    }
  };

  const addCircle = () => {
    if (fabricCanvasRef.current) {
      const circle = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: 'transparent',
        stroke: brushColor,
        strokeWidth: 2
      });
      
      fabricCanvasRef.current.add(circle);
      fabricCanvasRef.current.setActiveObject(circle);
    }
  };

  // Загрузка изображения
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && fabricCanvasRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        fabric.Image.fromURL(dataUrl).then((img) => {
          img.scaleToWidth(200);
          fabricCanvasRef.current?.add(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Управление объектами
  const deleteSelected = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  const duplicateSelected = () => {
    if (fabricCanvasRef.current && selectedObject) {
      selectedObject.clone().then((cloned: fabric.Object) => {
        cloned.set({
          left: (selectedObject.left || 0) + 20,
          top: (selectedObject.top || 0) + 20
        });
        fabricCanvasRef.current?.add(cloned);
        fabricCanvasRef.current?.setActiveObject(cloned);
      });
    }
  };

  // Управление слоями
  const moveToFront = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.bringObjectToFront(selectedObject);
      updateObjectsList();
    }
  };

  const moveToBack = () => {
    if (fabricCanvasRef.current && selectedObject) {
      fabricCanvasRef.current.sendObjectToBack(selectedObject);
      updateObjectsList();
    }
  };

  // Управление zoom
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 3);
    setZoom(newZoom);
    fabricCanvasRef.current?.setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.1);
    setZoom(newZoom);
    fabricCanvasRef.current?.setZoom(newZoom);
  };

  const resetZoom = () => {
    setZoom(1);
    fabricCanvasRef.current?.setZoom(1);
  };

  // Экспорт
  const handleSave = () => {
    if (fabricCanvasRef.current && onSave) {
      const dataUrl = fabricCanvasRef.current.toDataURL({ format: 'png', multiplier: 1 });
      onSave(dataUrl);
    }
  };

  const handleExport = (format: 'png' | 'jpg' | 'pdf') => {
    if (fabricCanvasRef.current) {
      let dataUrl: string;
      
      if (format === 'pdf') {
        // Для PDF нужна дополнительная библиотека (jsPDF)
        dataUrl = fabricCanvasRef.current.toDataURL({ format: 'png', multiplier: 1 });
      } else {
        const fabricFormat = format === 'jpg' ? 'jpeg' : 'png';
        dataUrl = fabricCanvasRef.current.toDataURL({ format: fabricFormat, multiplier: 1 });
      }

      // Скачивание файла
      const link = document.createElement('a');
      link.download = `design.${format}`;
      link.href = dataUrl;
      link.click();

      if (onExport) {
        onExport(format);
      }
    }
  };

  return (
    <div className={`flex h-full ${className}`}>
      
      {/* Toolbar */}
      <Card className="w-64 mr-4">
        <CardHeader>
          <CardTitle className="text-lg">Інструменти</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Mode Selection */}
          <div className="space-y-2">
            <Label>Режим</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={activeMode === 'select' ? 'default' : 'outline'}
                size="sm"
                onClick={setSelectMode}
              >
                <Move className="h-4 w-4 mr-1" />
                Вибір
              </Button>
              <Button
                variant={activeMode === 'draw' ? 'default' : 'outline'}
                size="sm"
                onClick={setDrawMode}
              >
                <Brush className="h-4 w-4 mr-1" />
                Малювання
              </Button>
            </div>
          </div>

          <Separator />

          {/* Add Elements */}
          <div className="space-y-2">
            <Label>Додати елемент</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={addText}>
                <Type className="h-4 w-4 mr-1" />
                Текст
              </Button>
              <Button variant="outline" size="sm" onClick={addRectangle}>
                <Square className="h-4 w-4 mr-1" />
                Квадрат
              </Button>
              <Button variant="outline" size="sm" onClick={addCircle}>
                <Circle className="h-4 w-4 mr-1" />
                Коло
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4 mr-1" />
                Фото
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </div>

          <Separator />

          {/* Drawing Settings */}
          {isDrawing && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="brush-color">Колір пензля</Label>
                <Input
                  id="brush-color"
                  type="color"
                  value={brushColor}
                  onChange={(e) => {
                    setBrushColor(e.target.value);
                    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
                      fabricCanvasRef.current.freeDrawingBrush.color = e.target.value;
                    }
                  }}
                  className="w-full h-10"
                />
              </div>
              <div>
                <Label htmlFor="brush-width">Товщина: {brushWidth}px</Label>
                <Slider
                  id="brush-width"
                  min={1}
                  max={50}
                  step={1}
                  value={[brushWidth]}
                  onValueChange={(value) => {
                    setBrushWidth(value[0]);
                    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
                      fabricCanvasRef.current.freeDrawingBrush.width = value[0];
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Text Settings */}
          {selectedObject?.type === 'i-text' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="text-color">Колір тексту</Label>
                <Input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value);
                    if (selectedObject) {
                      selectedObject.set('fill', e.target.value);
                      fabricCanvasRef.current?.renderAll();
                    }
                  }}
                  className="w-full h-10"
                />
              </div>
              <div>
                <Label htmlFor="font-size">Розмір шрифту: {fontSize}px</Label>
                <Slider
                  id="font-size"
                  min={8}
                  max={72}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => {
                    setFontSize(value[0]);
                    if (selectedObject) {
                      selectedObject.set('fontSize', value[0]);
                      fabricCanvasRef.current?.renderAll();
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="font-family">Шрифт</Label>
                <Select
                  value={fontFamily}
                  onValueChange={(value) => {
                    setFontFamily(value);
                    if (selectedObject) {
                      selectedObject.set('fontFamily', value);
                      fabricCanvasRef.current?.renderAll();
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Label>Дії</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={historyStep <= 0}
              >
                <Undo className="h-4 w-4 mr-1" />
                Скасувати
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={historyStep >= history.length - 1}
              >
                <Redo className="h-4 w-4 mr-1" />
                Повернути
              </Button>
              {selectedObject && (
                <>
                  <Button variant="outline" size="sm" onClick={duplicateSelected}>
                    <Copy className="h-4 w-4 mr-1" />
                    Копіювати
                  </Button>
                  <Button variant="outline" size="sm" onClick={deleteSelected}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Видалити
                  </Button>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Zoom Controls */}
          <div className="space-y-2">
            <Label>Масштаб: {Math.round(zoom * 100)}%</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetZoom}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Export */}
          <div className="space-y-2">
            <Label>Експорт</Label>
            <div className="space-y-2">
              <Button variant="outline" size="sm" onClick={handleSave} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Зберегти
              </Button>
              <div className="grid grid-cols-3 gap-1">
                <Button variant="outline" size="sm" onClick={() => handleExport('png')}>
                  PNG
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('jpg')}>
                  JPG
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                  PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Clear Canvas */}
          <Button variant="destructive" size="sm" onClick={handleClear} className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Очистити все
          </Button>
        </CardContent>
      </Card>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Canvas Header */}
        <Card className="mb-4">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  {width} × {height} px
                </Badge>
                <Badge variant="outline">
                  Масштаб: {Math.round(zoom * 100)}%
                </Badge>
                {selectedObject && (
                  <Badge variant="default">
                    Обрано: {selectedObject.type}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedObject && (
                  <>
                    <Button variant="outline" size="sm" onClick={moveToFront}>
                      На передній план
                    </Button>
                    <Button variant="outline" size="sm" onClick={moveToBack}>
                      На задній план
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Canvas Container */}
        <Card className="flex-1 flex items-center justify-center p-4">
          <div className="border border-gray-300 bg-white shadow-lg">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
            />
          </div>
        </Card>
      </div>

      {/* Layers Panel */}
      <Card className="w-64 ml-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            Шари
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {canvasObjects.reverse().map((obj, index) => (
              <div
                key={obj.id}
                className={`flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                  selectedObject === obj.fabricObject ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => {
                  fabricCanvasRef.current?.setActiveObject(obj.fabricObject);
                  setSelectedObject(obj.fabricObject);
                }}
              >
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      obj.fabricObject.set('visible', !obj.visible);
                      fabricCanvasRef.current?.renderAll();
                      updateObjectsList();
                    }}
                  >
                    {obj.visible ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      obj.fabricObject.set('lockMovementX', !obj.locked);
                      obj.fabricObject.set('lockMovementY', !obj.locked);
                      updateObjectsList();
                    }}
                  >
                    {obj.locked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <span className="text-sm truncate">
                    {obj.name}
                  </span>
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {obj.type}
                </Badge>
              </div>
            ))}
            
            {canvasObjects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Немає об'єктів
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CanvasEditor;