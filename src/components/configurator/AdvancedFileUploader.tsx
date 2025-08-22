"use client";

import { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap, 
  Eye,
  RotateCcw,
  Crop,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

export interface FileValidationResult {
  isValid: boolean;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    code: string;
    message: string;
    fix?: string;
    autoFixable?: boolean;
  }>;
  fileInfo: {
    size: number;
    dimensions: { width: number; height: number };
    dpi: number;
    colorProfile: string;
    format: string;
  };
  optimizationSuggestions: Array<{
    action: string;
    description: string;
    improvement: string;
  }>;
}

interface AdvancedFileUploaderProps {
  onFileValidated: (file: File, validation: FileValidationResult) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  productType?: 'canvas' | 'acrylic' | 'business-cards' | 'poster';
}

export function AdvancedFileUploader({ 
  onFileValidated, 
  acceptedTypes = ['image/*'],
  maxFileSize = 50,
  productType = 'canvas'
}: AdvancedFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [validation, setValidation] = useState<FileValidationResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Валидация файла
  const validateFile = useCallback(async (file: File): Promise<FileValidationResult> => {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Анализ файла
        const issues = [];
        const optimizationSuggestions = [];
        
        // Проверка размера файла
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxFileSize) {
          issues.push({
            type: 'error' as const,
            code: 'FILE_TOO_LARGE',
            message: `Файл занадто великий (${fileSizeMB.toFixed(1)}MB). Максимальний розмір: ${maxFileSize}MB`,
            fix: 'Стисніть зображення або зменшіть роздільну здатність',
            autoFixable: true
          });
        }

        // Проверка разрешения
        const totalPixels = img.width * img.height;
        const estimatedDPI = Math.sqrt(totalPixels / 100); // Приблизительный расчет
        
        if (estimatedDPI < 150) {
          issues.push({
            type: 'warning' as const,
            code: 'LOW_DPI',
            message: `Низька роздільна здатність (~${Math.round(estimatedDPI)} DPI). Рекомендується 300+ DPI`,
            fix: 'Використайте зображення вищої роздільної здатності для кращої якості друку'
          });
        } else if (estimatedDPI >= 300) {
          issues.push({
            type: 'info' as const,
            code: 'EXCELLENT_DPI',
            message: `Відмінна роздільна здатність (~${Math.round(estimatedDPI)} DPI) ✨`,
            fix: 'Ідеально для високоякісного друку!'
          });
        }

        // Проверка пропорций для продукта
        const ratio = img.width / img.height;
        if (productType === 'canvas') {
          if (ratio < 0.5 || ratio > 2.5) {
            issues.push({
              type: 'warning' as const,
              code: 'UNUSUAL_RATIO',
              message: 'Незвичайні пропорції для холста',
              fix: 'Розгляньте обрізання зображення або вибір іншого розміру'
            });
          }
        }

        // Анализ цветов
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const colorAnalysis = analyzeColors(imageData);
        
        if (colorAnalysis.hasVibrantColors && productType === 'canvas') {
          optimizationSuggestions.push({
            action: 'COLOR_BOOST',
            description: 'Підсилити яскравість кольорів',
            improvement: 'Покращить контрастність на холсті'
          });
        }

        // Проверка четкости
        const sharpness = analyzeSharpness(imageData);
        if (sharpness < 0.3) {
          issues.push({
            type: 'warning' as const,
            code: 'LOW_SHARPNESS',
            message: 'Зображення може бути розмитим',
            fix: 'Спробуйте застосувати фільтр підвищення різкості',
            autoFixable: true
          });
        }

        resolve({
          isValid: !issues.some(issue => issue.type === 'error'),
          issues,
          fileInfo: {
            size: file.size,
            dimensions: { width: img.width, height: img.height },
            dpi: Math.round(estimatedDPI),
            colorProfile: 'RGB', // Упрощенно
            format: file.type
          },
          optimizationSuggestions
        });
      };

      img.onerror = () => {
        resolve({
          isValid: false,
          issues: [{
            type: 'error',
            code: 'INVALID_IMAGE',
            message: 'Не вдалося завантажити зображення',
            fix: 'Перевірте формат файлу'
          }],
          fileInfo: {
            size: file.size,
            dimensions: { width: 0, height: 0 },
            dpi: 0,
            colorProfile: 'Unknown',
            format: file.type
          },
          optimizationSuggestions: []
        });
      };

      img.src = URL.createObjectURL(file);
    });
  }, [maxFileSize, productType]);

  // Обработка выбора файла
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!acceptedTypes.some(type => selectedFile.type.match(type.replace('*', '.*')))) {
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setIsValidating(true);
    setValidationProgress(0);

    // Имитация прогресса валидации
    const progressInterval = setInterval(() => {
      setValidationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 150);

    try {
      const validationResult = await validateFile(selectedFile);
      
      clearInterval(progressInterval);
      setValidationProgress(100);
      
      setTimeout(() => {
        setValidation(validationResult);
        setIsValidating(false);
        onFileValidated(selectedFile, validationResult);
      }, 500);
      
    } catch (error) {
      console.error('Validation error:', error);
      setIsValidating(false);
    }
  }, [acceptedTypes, validateFile, onFileValidated]);

  // Drag & Drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Автоисправления
  const handleAutoFix = useCallback(async (issueCode: string) => {
    if (!file || !previewUrl) return;
    
    setIsProcessing(true);
    
    // Имитация обработки
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Здесь был бы реальный код обработки изображения
    console.log('Auto-fixing:', issueCode);
    
    setIsProcessing(false);
  }, [file, previewUrl]);

  // Сброс
  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setValidation(null);
    setIsValidating(false);
    setValidationProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!file && (
        <Card 
          className={`border-2 border-dashed transition-all cursor-pointer ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-12 text-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-colors ${
              isDragging ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
            }`}>
              <Upload className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragging ? 'Відпустіть файл тут' : 'Завантажте зображення'}
              </h3>
              <p className="text-muted-foreground">
                Підтримуються: JPG, PNG, PDF • До {maxFileSize}MB
              </p>
            </div>

            <Button variant="outline" size="lg">
              Вибрати файл
            </Button>
          </CardContent>
        </Card>
      )}

      {/* File Processing */}
      {file && isValidating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center animate-spin">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              Аналіз файлу
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Перевірка якості та оптимізація</span>
                <span>{Math.round(validationProgress)}%</span>
              </div>
              <Progress value={validationProgress} className="h-2" />
            </div>
            
            {previewUrl && (
              <div className="flex justify-center">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-32 rounded-lg border"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validation && !isValidating && (
        <div className="space-y-6">
          {/* File Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Інформація про файл</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleReset}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Розмір</div>
                  <div className="font-medium">
                    {validation.fileInfo.dimensions.width} × {validation.fileInfo.dimensions.height}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">DPI</div>
                  <div className="font-medium">{validation.fileInfo.dpi}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Розмір файлу</div>
                  <div className="font-medium">
                    {(validation.fileInfo.size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Формат</div>
                  <div className="font-medium">{validation.fileInfo.format.split('/')[1].toUpperCase()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues and Fixes */}
          {validation.issues.length > 0 && (
            <div className="space-y-3">
              {validation.issues.map((issue, index) => (
                <Alert 
                  key={index} 
                  variant={issue.type === 'error' ? 'destructive' : 'default'}
                  className={
                    issue.type === 'warning' ? 'border-warning bg-warning/5' :
                    issue.type === 'info' ? 'border-success bg-success/5' : ''
                  }
                >
                  {issue.type === 'error' && <AlertTriangle className="h-4 w-4" />}
                  {issue.type === 'warning' && <Info className="h-4 w-4 text-warning" />}
                  {issue.type === 'info' && <CheckCircle className="h-4 w-4 text-success" />}
                  
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{issue.message}</div>
                      {issue.fix && (
                        <div className="text-sm text-muted-foreground mt-1">
                          💡 {issue.fix}
                        </div>
                      )}
                    </div>
                    
                    {issue.autoFixable && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAutoFix(issue.code)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Обробка...' : 'Виправити'}
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Preview with editing tools */}
          {previewUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Превью та інструменти</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Crop className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Palette className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <img 
                    src={previewUrl} 
                    alt="File preview" 
                    className="max-h-64 rounded-lg border"
                  />
                </div>
                
                {validation.optimizationSuggestions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Рекомендації з оптимізації:</h4>
                    {validation.optimizationSuggestions.map((suggestion, index) => (
                      <div key={index} className="bg-accent/10 rounded-lg p-3 text-sm">
                        <div className="font-medium">{suggestion.action}</div>
                        <div className="text-muted-foreground">{suggestion.description}</div>
                        <div className="text-success text-xs mt-1">✨ {suggestion.improvement}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
    </div>
  );
}

// Утилиты для анализа изображения
function analyzeColors(imageData: ImageData): { hasVibrantColors: boolean } {
  // Упрощенный анализ цветов
  const data = imageData.data;
  let vibrantCount = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Простая проверка на яркие цвета
    if (Math.max(r, g, b) > 200 && Math.min(r, g, b) < 100) {
      vibrantCount++;
    }
  }
  
  return {
    hasVibrantColors: vibrantCount / (data.length / 4) > 0.1
  };
}

function analyzeSharpness(imageData: ImageData): number {
  // Упрощенный анализ резкости с помощью градиента
  const data = imageData.data;
  const width = imageData.width;
  let sharpness = 0;
  
  for (let i = 0; i < data.length - width * 4; i += 4) {
    const current = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const below = (data[i + width * 4] + data[i + width * 4 + 1] + data[i + width * 4 + 2]) / 3;
    
    sharpness += Math.abs(current - below);
  }
  
  return sharpness / (data.length / 4) / 255; // Нормализация
}