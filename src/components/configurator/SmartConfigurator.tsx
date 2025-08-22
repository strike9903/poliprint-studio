"use client";

import { useState, useCallback, useRef } from 'react';
import { Upload, Sparkles, Zap, ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { configuratorBrain, type SmartSuggestion, type UserIntent, type FileAnalysis } from './ConfiguratorBrain';
import { enhancedConfiguratorBrain, type EnhancedSmartSuggestion } from './EnhancedConfiguratorBrain';
import { type DeepImageAnalysis } from './AIImageAnalyzer';
import { RealTimePriceCalculator, type PrintConfiguration } from './RealTimePriceCalculator';
import { Canvas3DPreview } from './Canvas3DPreview';
import { AdvancedFileUploader, type FileValidationResult } from './AdvancedFileUploader';
import { useProjectManager, type CartProject } from '@/contexts/ProjectManagerContext';

interface SmartConfiguratorProps {
  productId?: string;
  locale: string;
}

type ConfiguratorStep = 'upload' | 'analysis' | 'suggestions' | 'configure' | 'preview';

export function SmartConfigurator({ productId, locale }: SmartConfiguratorProps) {
  const [step, setStep] = useState<ConfiguratorStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [suggestions, setSuggestions] = useState<EnhancedSmartSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<EnhancedSmartSuggestion | null>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<DeepImageAnalysis | null>(null);
  const [userIntent, setUserIntent] = useState<UserIntent | null>(null);
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysis | null>(null);
  const [fileValidation, setFileValidation] = useState<FileValidationResult | null>(null);
  const [priceConfiguration, setPriceConfiguration] = useState<PrintConfiguration | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Project Manager integration
  const { addProject, updateProject, openDrawer } = useProjectManager();

  // Обработка загрузки файла
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      return; // Показать ошибку
    }

    setFile(selectedFile);
    setStep('analysis');
    setIsAnalyzing(true);
    
    // Имитация прогресса анализа
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Анализ намерений пользователя
      const intent = configuratorBrain.analyzeUserIntent(selectedFile, description);
      setUserIntent(intent);

      console.log('🧠 Starting Enhanced AI Analysis...');
      
      // НОВЫЙ: Enhanced AI анализ с глубоким learning
      const enhancedResult = await enhancedConfiguratorBrain.generateEnhancedRecommendations(
        selectedFile,
        intent,
        undefined // пока без ценового диапазона
      );

      // Сохраняем результаты enhanced анализа
      setDeepAnalysis(enhancedResult.analysis);
      setSuggestions(enhancedResult.suggestions);
      
      // Для совместимости, конвертируем deep analysis в старый формат
      const legacyAnalysis: FileAnalysis = {
        type: enhancedResult.analysis.content.style === 'photo' ? 'photo' : 'graphic',
        orientation: enhancedResult.analysis.technical.dimensions.width > enhancedResult.analysis.technical.dimensions.height ? 'landscape' : 'portrait',
        quality: enhancedResult.analysis.technical.dpi > 300 ? 'excellent' : 'high',
        dpi: enhancedResult.analysis.technical.dpi,
        dimensions: enhancedResult.analysis.technical.dimensions,
        colorProfile: enhancedResult.analysis.technical.colorProfile,
        dominantColors: enhancedResult.analysis.color.palette.map(p => p.color),
        hasText: enhancedResult.analysis.content.text.detected,
        hasFaces: enhancedResult.analysis.content.faces.count > 0,
        complexity: enhancedResult.analysis.content.complexity === 'minimal' ? 'simple' : 
                    enhancedResult.analysis.content.complexity === 'very-complex' ? 'complex' :
                    enhancedResult.analysis.content.complexity as 'simple' | 'complex' | 'medium',
        suggestedProducts: enhancedResult.analysis.printability.bestProducts.map(p => p.type)
      };
      setFileAnalysis(legacyAnalysis);

      console.log(`✨ Enhanced analysis completed: ${enhancedResult.suggestions.length} suggestions with ${enhancedResult.processingInsights.recommendationConfidence.toFixed(0)}% confidence`);

      // Завершение анализа
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep('suggestions');
      }, 800);
      
    } catch (error) {
      console.error('Enhanced Analysis error:', error);
      
      // Fallback к старому анализу в случае ошибки
      console.log('📦 Falling back to legacy analysis...');
      try {
        const analysis = await configuratorBrain.analyzeFile(selectedFile);
        setFileAnalysis(analysis);
        const legacySuggestions = configuratorBrain.generateSmartSuggestions(userIntent!, analysis);
        // Конвертируем legacy suggestions в enhanced format
        const enhancedLegacy: EnhancedSmartSuggestion[] = legacySuggestions.map(s => ({
          ...s,
          aiScore: s.confidence,
          technicalFit: 75,
          visualImpact: 70,
          marketPosition: 'standard' as const,
          enhancedBenefits: s.benefits.map(b => ({
            category: 'visual' as const,
            title: b,
            description: b,
            impact: 'medium' as const
          })),
          aiInsights: {
            whyRecommended: s.reasoning,
            expectedOutcome: 'Хороший результат',
            riskFactors: [],
            alternativeOptions: []
          },
          personalization: {
            targetAudience: 'Загальна аудиторія',
            emotionalAppeal: 'Універсальний',
            lifestyle: 'Стандартний',
            priceJustification: `${s.price}₴ - справедлива ціна`
          },
          interactive: {
            has3DPreview: s.productType === 'canvas',
            hasAugmentedReality: false,
            hasColorVariants: false,
            hasComparison: true
          }
        }));
        setSuggestions(enhancedLegacy);
        
        setTimeout(() => {
          setIsAnalyzing(false);
          setStep('suggestions');
        }, 800);
      } catch (fallbackError) {
        console.error('Fallback analysis failed:', fallbackError);
        setIsAnalyzing(false);
      }
    }
  }, [description]);

  // Drag & Drop обработка
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Обработка валидации файла
  const handleFileValidated = useCallback((file: File, validation: FileValidationResult) => {
    setFileValidation(validation);
  }, []);

  // Создание проекта в Project Manager
  const createProject = useCallback((suggestion: SmartSuggestion, config: PrintConfiguration) => {
    if (!file || !fileValidation || !fileAnalysis) return null;

    const projectName = suggestion.productType === 'canvas' 
      ? `Холст ${config.dimensions.width}×${config.dimensions.height}`
      : suggestion.productType === 'acrylic'
      ? `Акрил ${config.dimensions.width}×${config.dimensions.height}`
      : `${suggestion.productType} ${config.dimensions.width}×${config.dimensions.height}`;

    const project: Omit<CartProject, 'id' | 'metadata' | 'pricing'> = {
      name: projectName,
      description: description || undefined,
      configuration: config,
      files: [{
        id: `file_${Date.now()}`,
        originalFile: file,
        url: URL.createObjectURL(file),
        validation: fileValidation,
        optimizations: [],
        metadata: {
          originalName: file.name,
          size: file.size,
          lastModified: new Date(file.lastModified),
        }
      }],
      preview: {
        thumbnailUrl: URL.createObjectURL(file),
        mockupUrls: [],
      },
      aiInsights: {
        originalSuggestion: suggestion,
        confidence: suggestion.confidence,
        alternativeOptions: suggestions.filter(s => s !== suggestion),
        optimizationSuggestions: [],
      },
      status: fileValidation.isValid ? 'ready' : 'needs-attention',
      stage: 'configured',
      collaboration: {
        isShared: false,
        accessLevel: 'edit',
      },
      userPreferences: {
        isFavorite: false,
        notes: [],
        tags: [suggestion.productType],
      },
    };

    addProject(project);
    return project;
  }, [file, fileValidation, fileAnalysis, description, suggestions, addProject]);

  // Выбор рекомендации  
  const handleSuggestionSelect = (suggestion: EnhancedSmartSuggestion) => {
    setSelectedSuggestion(suggestion);
    
    // Создание конфигурации для калькулятора цен
    if (fileAnalysis && fileValidation) {
      const config: PrintConfiguration = {
        product: {
          type: suggestion.productType as any,
          material: suggestion.productType === 'canvas' ? 'premium-canvas' : 'acrylic-3mm',
          finishing: 'standard'
        },
        dimensions: {
          width: parseInt(suggestion.size.split('×')[0]),
          height: parseInt(suggestion.size.split('×')[1]),
          depth: suggestion.productType === 'canvas' ? 20 : 3
        },
        quantity: 1,
        urgency: 'standard',
        fileQuality: {
          dpi: fileValidation.fileInfo.dpi,
          colorProfile: fileValidation.fileInfo.colorProfile,
          hasIssues: !fileValidation.isValid
        }
      };
      setPriceConfiguration(config);

      // Создать проект в Project Manager
      const createdProject = createProject(suggestion, config);
      if (createdProject) {
        // Store project ID for updates
        setCurrentProjectId((createdProject as any).id || '');
      }
    }
    
    setStep('configure');
  };

  // Обновление цены
  const handlePriceUpdate = useCallback((price: number) => {
    setCurrentPrice(price);
    
    // Обновить цену в проекте если он существует
    if (currentProjectId) {
      updateProject(currentProjectId, {
        pricing: {
          currentPrice: price,
          originalPrice: price,
          breakdown: {} as any, // This would be filled by the calculator
          history: [],
          savings: 0,
        }
      });
    }
  }, [currentProjectId, updateProject]);

  // Добавление в корзину (добавляем проект и открываем Project Manager)
  const handleAddToCart = useCallback(() => {
    if (currentProjectId) {
      // Обновляем статус проекта на ready
      updateProject(currentProjectId, {
        status: 'ready',
        stage: 'finalized'
      });
      
      // Открываем Project Manager
      openDrawer();
    }
  }, [currentProjectId, updateProject, openDrawer]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">AI Print Assistant</span>
          </div>
          <Badge variant="outline">Крок {step === 'upload' ? '1' : step === 'analysis' ? '2' : step === 'suggestions' ? '3' : '4'} з 4</Badge>
        </div>
        
        <div className="flex gap-1">
          {['upload', 'analysis', 'suggestions', 'configure'].map((s, index) => (
            <div 
              key={s}
              className={`flex-1 h-2 rounded-full ${
                index < ['upload', 'analysis', 'suggestions', 'configure'].indexOf(step) ? 'bg-primary' :
                index === ['upload', 'analysis', 'suggestions', 'configure'].indexOf(step) ? 'bg-primary/50' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: File Upload */}
      {step === 'upload' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-heading">
                🤖 Завантажте ваше зображення
              </CardTitle>
              <p className="text-muted-foreground">
                Наш ШІ-асистент проаналізує файл та запропонує найкращі варіанти друку
              </p>
            </CardHeader>
            <CardContent>
              <AdvancedFileUploader 
                onFileValidated={handleFileValidated}
                acceptedTypes={['image/*']}
                maxFileSize={50}
                productType="canvas"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Розкажіть більше про ваш проект (необов'язково)</label>
                <Textarea
                  placeholder="Наприклад: 'Хочу картину для гостиної' або 'Візитки для IT-стартапу' або 'Подарунок батькам на ювілей'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  💡 Ця інформація допоможе нашому ШІ підібрати найкращий варіант
                </p>
              </div>

              {fileValidation && fileValidation.isValid && (
                <div className="mt-6">
                  <Button 
                    size="lg" 
                    className="w-full btn-hero"
                    onClick={() => handleFileSelect(file!)}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Розпочати ШІ-аналіз
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Enhanced AI Analysis */}
      {step === 'analysis' && isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center animate-spin">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              🧠 Deep AI аналізує ваше зображення
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Використовуємо computer vision та machine learning для глибокого розуміння вашого контенту
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Прогрес аналізу</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${analysisProgress > 15 ? 'bg-success animate-pulse' : 'bg-border'}`} />
                <span>Технічний аналіз</span>
                {analysisProgress > 15 && <Check className="w-4 h-4 text-success ml-auto" />}
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${analysisProgress > 35 ? 'bg-success animate-pulse' : 'bg-border'}`} />
                <span>Детекція об'єктів</span>
                {analysisProgress > 35 && <Check className="w-4 h-4 text-success ml-auto" />}
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${analysisProgress > 60 ? 'bg-success animate-pulse' : 'bg-border'}`} />
                <span>Колірний аналіз</span>
                {analysisProgress > 60 && <Check className="w-4 h-4 text-success ml-auto" />}
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${analysisProgress > 85 ? 'bg-success animate-pulse' : 'bg-border'}`} />
                <span>AI рекомендації</span>
                {analysisProgress > 85 && <Check className="w-4 h-4 text-success ml-auto" />}
              </div>
            </div>

            {/* Analysis steps visualization */}
            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-medium text-blue-900">🔍 Computer Vision</div>
                  <div className="text-blue-700">Розпізнавання об'єктів та композиції</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-purple-900">🎨 Color Intelligence</div>
                  <div className="text-purple-700">Аналіз палітри та настрою</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-green-900">🧠 Machine Learning</div>
                  <div className="text-green-700">Персоналізовані рекомендації</div>
                </div>
              </div>
            </div>

            {file && (
              <div className="bg-surface rounded-lg p-4">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Uploaded preview"
                  className="max-h-40 mx-auto rounded-lg"
                />
                <div className="text-center mt-2 text-xs text-muted-foreground">
                  Завантажений файл: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </div>
              </div>
            )}

            {/* Real-time AI insights (mock) */}
            {analysisProgress > 30 && (
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                <div className="text-xs text-accent-foreground font-medium">
                  ⚡ AI виявляє цікаві деталі...
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {analysisProgress > 40 && "• Визначено тип контенту "}
                  {analysisProgress > 60 && "• Проаналізовано кольорову гаму "}
                  {analysisProgress > 80 && "• Розраховано оптимальні розміри "}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Smart Suggestions */}
      {step === 'suggestions' && suggestions.length > 0 && (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-heading font-bold">
              🎯 AI підібрав для вас {suggestions.length} ідеальних варіанта
            </h2>
            <p className="text-muted-foreground">
              На основі глибокого аналізу вашого зображення, computer vision та machine learning
            </p>
            
            {/* Deep Analysis Summary */}
            {deepAnalysis && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-200/30 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900">Deep AI Analysis Results</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-900">
                        {Math.round(deepAnalysis.printability.overallScore)}%
                      </div>
                      <div className="text-blue-700">Якість для друку</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-900">
                        {deepAnalysis.content.faces.count || 0}
                      </div>
                      <div className="text-purple-700">Обличь виявлено</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-900">
                        {deepAnalysis.technical.dpi}
                      </div>
                      <div className="text-green-700">DPI роздільність</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-900 capitalize">
                        {deepAnalysis.color.mood}
                      </div>
                      <div className="text-orange-700">Настрій кольорів</div>
                    </div>
                  </div>
                  
                  {/* AI Confidence */}
                  <div className="mt-3 text-center">
                    <div className="text-xs text-muted-foreground">
                      🤖 AI впевненість: {Math.round(deepAnalysis.aiInsights.confidence)}% 
                      • Обробка: {deepAnalysis.aiInsights.processingTime.toFixed(0)}мс
                      • Тип контенту: <span className="capitalize">{deepAnalysis.content.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            {suggestions.map((suggestion, index) => {
              const pricing = configuratorBrain.generatePricingPsychology(suggestion.price, suggestion.productType);
              
              return (
                <Card 
                  key={index}
                  className={`relative hover:shadow-glow transition-all cursor-pointer ${
                    index === 0 ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  {index === 0 && (
                    <div className="absolute -top-3 left-6">
                      <Badge className="bg-primary text-primary-foreground">
                        ⭐ AI Топ рекомендація
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Enhanced Preview with AI Score */}
                      <div className="space-y-3">
                        <div className="aspect-square bg-gradient-primary rounded-lg flex items-center justify-center relative overflow-hidden">
                          <span className="text-6xl">
                            {suggestion.productType === 'canvas' ? '🖼️' : 
                             suggestion.productType === 'acrylic' ? '💎' : 
                             suggestion.productType === 'metal' ? '🔩' :
                             suggestion.productType === 'fabric' ? '🧶' : '💼'}
                          </span>
                          
                          {/* AI Score Indicator */}
                          <div className="absolute top-2 right-2">
                            <Badge className={`text-xs ${suggestion.aiScore > 85 ? 'bg-success' : suggestion.aiScore > 70 ? 'bg-warning' : 'bg-secondary'}`}>
                              AI {Math.round(suggestion.aiScore)}%
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Enhanced confidence indicators */}
                        <div className="space-y-2">
                          <Badge variant="outline" className="w-full justify-center">
                            {suggestion.confidence}% впевненості
                          </Badge>
                          <div className="text-xs text-center space-y-1">
                            <div className="text-muted-foreground">Технічна відповідність: {Math.round(suggestion.technicalFit)}%</div>
                            <div className="text-muted-foreground">Візуальний ефект: {Math.round(suggestion.visualImpact)}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Info */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-heading font-semibold">
                                {suggestion.productType === 'canvas' ? 'Друк на холсті' :
                                 suggestion.productType === 'acrylic' ? 'Друк на акрилі' : 
                                 suggestion.productType === 'metal' ? 'Друк на металі' :
                                 suggestion.productType === 'fabric' ? 'Друк на тканині' : 'Візитні картки'} 
                                {' '}{suggestion.size}
                              </h3>
                              <Badge className={`text-xs mt-1 ${
                                suggestion.marketPosition === 'luxury' ? 'bg-purple-500/10 text-purple-600' :
                                suggestion.marketPosition === 'premium' ? 'bg-blue-500/10 text-blue-600' :
                                suggestion.marketPosition === 'standard' ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'
                              }`}>
                                {suggestion.marketPosition === 'luxury' ? 'Розкіш' :
                                 suggestion.marketPosition === 'premium' ? 'Преміум' :
                                 suggestion.marketPosition === 'standard' ? 'Стандарт' : 'Бюджет'}
                              </Badge>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {suggestion.price} ₴
                              </div>
                              {pricing.originalPrice && (
                                <div className="text-sm text-muted-foreground line-through">
                                  {pricing.originalPrice} ₴
                                </div>
                              )}
                            </div>
                          </div>

                          {/* AI Insights */}
                          <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-blue-900 font-medium">
                              🤖 AI Інсайт: {suggestion.aiInsights.whyRecommended}
                            </p>
                          </div>

                          <p className="text-muted-foreground mb-3">
                            {suggestion.reasoning}
                          </p>

                          <div className="text-sm text-success font-medium mb-3">
                            {pricing.comparisonText}
                          </div>
                          
                          {/* Expected Outcome */}
                          <div className="text-sm text-accent font-medium mb-3">
                            ✨ Очікуваний результат: {suggestion.aiInsights.expectedOutcome}
                          </div>
                        </div>

                        {/* Enhanced Benefits */}
                        <div className="space-y-3">
                          <h4 className="font-medium">Переваги:</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {suggestion.enhancedBenefits.slice(0, 3).map((benefit, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  benefit.impact === 'critical' ? 'bg-red-500' :
                                  benefit.impact === 'high' ? 'bg-orange-500' :
                                  benefit.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`} />
                                <div>
                                  <div className="font-medium">{benefit.title}</div>
                                  <div className="text-muted-foreground">{benefit.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Best For with Personalization */}
                        <div className="space-y-2">
                          <h4 className="font-medium">Ідеально для:</h4>
                          <div className="flex flex-wrap gap-2">
                            {suggestion.bestFor.map((use, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {use}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Personalization info */}
                          <div className="text-xs text-muted-foreground mt-2">
                            👤 Цільова аудиторія: {suggestion.personalization.targetAudience}
                            <br />
                            💝 Емоційний впив: {suggestion.personalization.emotionalAppeal}
                          </div>
                        </div>

                        {/* Interactive Features */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {suggestion.interactive.has3DPreview && (
                            <Badge variant="outline" className="text-xs">🔮 3D Превью</Badge>
                          )}
                          {suggestion.interactive.hasAugmentedReality && (
                            <Badge variant="outline" className="text-xs">📱 AR</Badge>
                          )}
                          {suggestion.interactive.hasColorVariants && (
                            <Badge variant="outline" className="text-xs">🎨 Варіанти</Badge>
                          )}
                        </div>

                        <Button className="w-full btn-hero group" size="lg">
                          Обрати цей варіант
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Alternative Options */}
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Не підходить жоден варіант? 
              </p>
              <Button variant="outline">
                Налаштувати вручну
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Configure & Preview */}
      {step === 'configure' && selectedSuggestion && priceConfiguration && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-heading font-bold">
              Налаштування та превью
            </h2>
            <p className="text-muted-foreground">
              Перегляньте результат та оптимізуйте ціну
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: 3D Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🖼️</span>
                    3D Превью
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSuggestion.productType === 'canvas' && file && (
                    <Canvas3DPreview
                      imageUrl={URL.createObjectURL(file)}
                      canvasConfig={{
                        width: priceConfiguration.dimensions.width,
                        height: priceConfiguration.dimensions.height,
                        depth: priceConfiguration.dimensions.depth || 20,
                        edge: 'gallery',
                        frameColor: '#8B4513'
                      }}
                      environmentType="gallery"
                    />
                  )}
                  
                  {selectedSuggestion.productType !== 'canvas' && (
                    <div className="aspect-square bg-gradient-primary rounded-xl flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <span className="text-6xl">
                          {selectedSuggestion.productType === 'acrylic' ? '💎' : '💼'}
                        </span>
                        <p className="text-lg font-medium">
                          Превью для {selectedSuggestion.productType === 'acrylic' ? 'акрилу' : 'візиток'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          3D превью буде додано в наступному оновленні
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Product Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Обраний продукт</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {selectedSuggestion.productType === 'canvas' ? '🖼️' : 
                       selectedSuggestion.productType === 'acrylic' ? '💎' : '💼'}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedSuggestion.productType === 'canvas' ? 'Друк на холсті' :
                         selectedSuggestion.productType === 'acrylic' ? 'Друк на акрилі' : 'Візитні картки'}
                      </h3>
                      <p className="text-muted-foreground">{selectedSuggestion.size}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Матеріал</div>
                      <div className="font-medium">{priceConfiguration.product.material}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Обробка</div>
                      <div className="font-medium">{priceConfiguration.product.finishing}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Розмір</div>
                      <div className="font-medium">
                        {priceConfiguration.dimensions.width}×{priceConfiguration.dimensions.height} см
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Кількість</div>
                      <div className="font-medium">{priceConfiguration.quantity} шт</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Price Calculator */}
            <div className="space-y-6">
              <RealTimePriceCalculator
                configuration={priceConfiguration}
                onPriceUpdate={handlePriceUpdate}
                showComparison={true}
                showOptimizations={true}
              />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full btn-hero"
                  onClick={handleAddToCart}
                >
                  <span className="text-lg">Додати в кошик • {currentPrice.toFixed(0)} ₴</span>
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => setStep('suggestions')}>
                    ← Назад до варіантів
                  </Button>
                  <Button variant="outline">
                    Зберегти проект
                  </Button>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="bg-success/5 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-success">Гарантії якості:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span>100% гарантія якості</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span>Безкоштовний передрук при браку</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span>Доставка Новою Поштою</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFile(e.target.files?.[0] || null);
          }
        }}
      />
    </div>
  );
}