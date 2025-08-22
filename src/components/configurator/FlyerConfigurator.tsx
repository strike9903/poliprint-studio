"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { FlyerConstructor, FlyerConfig, FlyerTemplate } from '@/lib/constructors/flyer-constructor';
import { ProductConfig, DesignTemplate } from '@/lib/constructor-engine';
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
import { 
  FileText,
  Palette,
  Settings,
  QrCode,
  Download,
  Eye,
  Sparkles,
  Undo,
  Redo,
  Save,
  Target,
  Megaphone,
  Calendar,
  ShoppingCart,
  Building,
  Percent,
  Scissors,
  Printer
} from 'lucide-react';

interface FlyerConfiguratorProps {
  initialConfig?: Partial<FlyerConfig>;
  onSave?: (config: FlyerConfig) => void;
  onExport?: (format: 'pdf' | 'png' | 'jpg' | 'svg') => void;
}

const flyerTypeIcons = {
  'promotional': Megaphone,
  'event': Calendar,
  'product-catalog': ShoppingCart,
  'service-menu': Building,
  'announcement': FileText,
  'real-estate': Building
};

export function FlyerConfigurator({ 
  initialConfig,
  onSave,
  onExport 
}: FlyerConfiguratorProps) {
  const [constructor, setConstructor] = useState<FlyerConstructor | null>(null);
  const [templates, setTemplates] = useState<FlyerTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [contentSections, setContentSections] = useState({
    headline: '',
    subheadline: '',
    bodyText: '',
    callToAction: '',
    contactInfo: '',
    disclaimer: ''
  });
  const [brandingElements, setBrandingElements] = useState({
    companyName: '',
    brandColors: ['#3b82f6', '#ffffff'],
    fonts: ['Inter', 'Roboto']
  });
  const [marketingFeatures, setMarketingFeatures] = useState({
    discountOffer: { enabled: false, percentage: 0, code: '', validUntil: '' },
    qrCode: { enabled: false, data: '', size: 20, position: { x: 170, y: 250 } },
    socialMedia: []
  });
  const [printFeatures, setPrintFeatures] = useState({
    perforation: false,
    scoring: false,
    dieCutting: false,
    spotColors: [] as string[]
  });
  const [flyerType, setFlyerType] = useState<FlyerConfig['flyerType']>('promotional');
  const [size, setSize] = useState<FlyerConfig['size']>('A4');
  const [foldType, setFoldType] = useState<FlyerConfig['foldType']>('single');
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [quantity, setQuantity] = useState(500);

  useEffect(() => {
    const initConstructor = async () => {
      try {
        setIsLoading(true);
        
        const defaultConfig: ProductConfig = {
          id: 'fl_' + Date.now(),
          name: 'Листівка',
          category: 'flyers',
          dimensions: {
            width: 210,
            height: 297,
            unit: 'mm',
            dpi: 300
          },
          printArea: {
            x: 5,
            y: 5,
            width: 200,
            height: 287
          },
          bleedArea: {
            top: 3,
            right: 3,
            bottom: 3,
            left: 3
          },
          materials: ['standard_paper'],
          finishes: ['none'],
          orientation: 'portrait',
          sides: 2,
          minQuantity: 100,
          maxQuantity: 50000,
          basePrice: 80,
          pricePerUnit: 0.3,
          constraints: {
            minFontSize: 8,
            maxColors: 6,
            allowedFileTypes: ['pdf', 'ai', 'eps', 'png', 'jpg'],
            maxFileSize: 20971520, // 20MB
            requiredDPI: 300
          },
          ...initialConfig
        };

        const constructorInstance = new FlyerConstructor(defaultConfig);
        const availableTemplates = await constructorInstance.getAvailableTemplates() as FlyerTemplate[];
        
        setConstructor(constructorInstance);
        setTemplates(availableTemplates);
        
        if (availableTemplates.length > 0) {
          await constructorInstance.loadTemplate(availableTemplates[0].id);
          setSelectedTemplate(availableTemplates[0].id);
        }

        const config = constructorInstance.getProject().productConfig as FlyerConfig;
        if (config.contentSections) {
          setContentSections({
            headline: config.contentSections.headline || '',
            subheadline: config.contentSections.subheadline || '',
            bodyText: config.contentSections.bodyText || '',
            callToAction: config.contentSections.callToAction || '',
            contactInfo: config.contentSections.contactInfo || '',
            disclaimer: config.contentSections.disclaimer || ''
          });
        }
        if (config.brandingElements) {
          setBrandingElements({
            companyName: config.brandingElements.companyName || '',
            brandColors: config.brandingElements.brandColors || ['#3b82f6', '#ffffff'],
            fonts: config.brandingElements.fonts || ['Inter', 'Roboto']
          });
        }
        if (config.marketingFeatures) {
          setMarketingFeatures(config.marketingFeatures as any);
        }
        if (config.printFeatures) {
          setPrintFeatures({
            perforation: config.printFeatures.perforation || false,
            scoring: config.printFeatures.scoring || false,
            dieCutting: config.printFeatures.dieCutting || false,
            spotColors: config.printFeatures.spotColors || []
          });
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
    }
  }, [constructor, contentSections, marketingFeatures, quantity, foldType]);

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
    } catch (error) {
      console.error('Failed to validate design:', error);
    }
  }, [constructor]);

  const handleTemplateSelect = async (templateId: string) => {
    if (!constructor) return;
    
    try {
      await constructor.loadTemplate(templateId);
      setSelectedTemplate(templateId);
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };

  const handleContentSectionChange = (section: keyof typeof contentSections, value: string) => {
    const newSections = { ...contentSections, [section]: value };
    setContentSections(newSections);
    
    if (constructor) {
      constructor.updateContentSection(section, value);
    }
  };

  const handleBrandingChange = (element: keyof typeof brandingElements, value: any) => {
    const newBranding = { ...brandingElements, [element]: value };
    setBrandingElements(newBranding);
    
    if (constructor) {
      constructor.updateBrandingElement(element, value);
    }
  };

  const handleDiscountToggle = (enabled: boolean) => {
    const newDiscount = { ...marketingFeatures.discountOffer, enabled };
    setMarketingFeatures(prev => ({ ...prev, discountOffer: newDiscount }));
    
    if (constructor) {
      if (enabled && newDiscount.percentage) {
        constructor.addDiscountOffer(newDiscount.percentage, newDiscount.code, newDiscount.validUntil);
      } else {
        constructor.removeDiscountOffer();
      }
    }
  };

  const handleQRCodeToggle = (enabled: boolean) => {
    const newQR = { ...marketingFeatures.qrCode, enabled };
    setMarketingFeatures(prev => ({ ...prev, qrCode: newQR }));
    
    if (constructor) {
      if (enabled && newQR.data) {
        constructor.addQRCode(newQR.data, newQR.size, newQR.position);
      } else {
        constructor.removeQRCode();
      }
    }
  };

  const handleFoldTypeChange = (newFoldType: FlyerConfig['foldType']) => {
    setFoldType(newFoldType);
    if (constructor) {
      constructor.changeFoldType(newFoldType);
    }
  };

  const handleFlyerTypeChange = (newType: FlyerConfig['flyerType']) => {
    setFlyerType(newType);
    if (constructor) {
      constructor.applyFlyerType(newType);
      // Обновляем contentSections после применения типа
      const updatedSections = constructor.getContentSections();
      setContentSections({
        headline: updatedSections.headline || '',
        subheadline: updatedSections.subheadline || '',
        bodyText: updatedSections.bodyText || '',
        callToAction: updatedSections.callToAction || '',
        contactInfo: updatedSections.contactInfo || '',
        disclaimer: updatedSections.disclaimer || ''
      });
    }
  };

  const handleExport = async (format: 'pdf' | 'png' | 'jpg' | 'svg') => {
    if (!constructor) return;
    
    try {
      const blob = await constructor.exportDesign(format);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flyer-${Date.now()}.${format}`;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Ініціалізація конструктора листівок...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Боковая панель с настройками */}
      <div className="col-span-4 space-y-6">
        {/* Выбор типа листовки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Тип листівки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(flyerTypeIcons).map(([type, Icon]) => (
                <Button
                  key={type}
                  variant={flyerType === type ? 'default' : 'outline'}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => handleFlyerTypeChange(type as FlyerConfig['flyerType'])}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{getFlyerTypeLabel(type)}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Выбор шаблона */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Шаблони
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {templates.filter(t => t.flyerType === flyerType).map((template) => (
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
                          {template.size}
                        </Badge>
                        <Badge 
                          variant={template.complexity === 'simple' ? 'default' : 'outline'} 
                          className="text-xs"
                        >
                          {template.complexity}
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

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="design">Дизайн</TabsTrigger>
            <TabsTrigger value="marketing">Маркетинг</TabsTrigger>
            <TabsTrigger value="print">Друк</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Основний контент
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="headline">Основний заголовок *</Label>
                  <Input
                    id="headline"
                    value={contentSections.headline}
                    onChange={(e) => handleContentSectionChange('headline', e.target.value)}
                    placeholder="Привертайте увагу!"
                  />
                </div>
                <div>
                  <Label htmlFor="subheadline">Підзаголовок</Label>
                  <Input
                    id="subheadline"
                    value={contentSections.subheadline}
                    onChange={(e) => handleContentSectionChange('subheadline', e.target.value)}
                    placeholder="Додаткова інформація"
                  />
                </div>
                <div>
                  <Label htmlFor="bodyText">Основний текст</Label>
                  <Textarea
                    id="bodyText"
                    value={contentSections.bodyText}
                    onChange={(e) => handleContentSectionChange('bodyText', e.target.value)}
                    placeholder="Детальний опис вашої пропозиції..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="callToAction">Заклик до дії *</Label>
                  <Input
                    id="callToAction"
                    value={contentSections.callToAction}
                    onChange={(e) => handleContentSectionChange('callToAction', e.target.value)}
                    placeholder="Дзвоніть зараз!"
                  />
                </div>
                <div>
                  <Label htmlFor="contactInfo">Контактна інформація *</Label>
                  <Textarea
                    id="contactInfo"
                    value={contentSections.contactInfo}
                    onChange={(e) => handleContentSectionChange('contactInfo', e.target.value)}
                    placeholder="Телефон, адреса, сайт..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Параметри дизайну</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="size">Розмір</Label>
                  <Select value={size} onValueChange={(value) => setSize(value as FlyerConfig['size'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4 (210×297мм)</SelectItem>
                      <SelectItem value="A5">A5 (148×210мм)</SelectItem>
                      <SelectItem value="A6">A6 (105×148мм)</SelectItem>
                      <SelectItem value="DL">DL (99×210мм)</SelectItem>
                      <SelectItem value="custom">Індивідуальний</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="foldType">Тип складання</Label>
                  <Select value={foldType || 'single'} onValueChange={(value) => handleFoldTypeChange(value as FlyerConfig['foldType'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Без складання</SelectItem>
                      <SelectItem value="bifold">Навпіл</SelectItem>
                      <SelectItem value="trifold">На три частини</SelectItem>
                      <SelectItem value="z-fold">Z-складання</SelectItem>
                      <SelectItem value="gate-fold">Ворота</SelectItem>
                      <SelectItem value="accordion">Гармошка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="companyName">Назва компанії</Label>
                  <Input
                    id="companyName"
                    value={brandingElements.companyName}
                    onChange={(e) => handleBrandingChange('companyName', e.target.value)}
                    placeholder="Ваша компанія"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Знижкова пропозиція
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="discount-enabled"
                    checked={marketingFeatures.discountOffer.enabled}
                    onCheckedChange={handleDiscountToggle}
                  />
                  <Label htmlFor="discount-enabled">Додати знижку</Label>
                </div>
                {marketingFeatures.discountOffer.enabled && (
                  <>
                    <div>
                      <Label htmlFor="discount-percentage">Відсоток знижки</Label>
                      <Input
                        id="discount-percentage"
                        type="number"
                        min="1"
                        max="99"
                        value={marketingFeatures.discountOffer.percentage}
                        onChange={(e) => {
                          const newDiscount = { 
                            ...marketingFeatures.discountOffer, 
                            percentage: parseInt(e.target.value) || 0 
                          };
                          setMarketingFeatures(prev => ({ ...prev, discountOffer: newDiscount }));
                        }}
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount-code">Промокод</Label>
                      <Input
                        id="discount-code"
                        value={marketingFeatures.discountOffer.code}
                        onChange={(e) => {
                          const newDiscount = { 
                            ...marketingFeatures.discountOffer, 
                            code: e.target.value 
                          };
                          setMarketingFeatures(prev => ({ ...prev, discountOffer: newDiscount }));
                        }}
                        placeholder="SAVE20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="valid-until">Діє до</Label>
                      <Input
                        id="valid-until"
                        type="date"
                        value={marketingFeatures.discountOffer.validUntil}
                        onChange={(e) => {
                          const newDiscount = { 
                            ...marketingFeatures.discountOffer, 
                            validUntil: e.target.value 
                          };
                          setMarketingFeatures(prev => ({ ...prev, discountOffer: newDiscount }));
                        }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR код
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="qr-enabled"
                    checked={marketingFeatures.qrCode.enabled}
                    onCheckedChange={handleQRCodeToggle}
                  />
                  <Label htmlFor="qr-enabled">Додати QR код</Label>
                </div>
                {marketingFeatures.qrCode.enabled && (
                  <div>
                    <Label htmlFor="qr-data">Дані для QR коду</Label>
                    <Input
                      id="qr-data"
                      value={marketingFeatures.qrCode.data}
                      onChange={(e) => {
                        const newQR = { 
                          ...marketingFeatures.qrCode, 
                          data: e.target.value 
                        };
                        setMarketingFeatures(prev => ({ ...prev, qrCode: newQR }));
                      }}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="print" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Особливості друку
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(printFeatures).filter(([key]) => key !== 'spotColors').map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <Label htmlFor={feature} className="text-sm">
                      {getPrintFeatureLabel(feature)}
                    </Label>
                    <Switch
                      id={feature}
                      checked={enabled as boolean}
                      onCheckedChange={(checked) => {
                        const newFeatures = { ...printFeatures, [feature]: checked };
                        setPrintFeatures(newFeatures);
                        if (constructor) {
                          constructor.updatePrintFeature(feature as any, checked);
                        }
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

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
                      {pricing.breakdown.details.size} • {pricing.breakdown.details.sides === 2 ? 'Двостороння' : 'Односторонній'} • {pricing.breakdown.details.foldType}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Экспорт */}
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
                className="flex items-center gap-2"
              >
                PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('png')}
                className="flex items-center gap-2"
              >
                PNG
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('jpg')}
                className="flex items-center gap-2"
              >
                JPG
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('svg')}
                className="flex items-center gap-2"
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

        {/* Ошибки валидации */}
        {validationErrors.length > 0 && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Помилки валідації</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-destructive">
                    • {error}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Основная область предпросмотра */}
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
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <div 
                className="bg-white shadow-lg rounded-lg border relative"
                style={{
                  width: size === 'A4' ? '420px' : size === 'A5' ? '296px' : '420px',
                  height: size === 'A4' ? '594px' : size === 'A5' ? '420px' : '594px',
                  aspectRatio: size === 'A4' ? '210/297' : size === 'A5' ? '148/210' : '210/297'
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Попередній перегляд листівки</p>
                    <p className="text-sm">
                      {size} • {foldType === 'single' ? 'Без складання' : `Складання: ${foldType}`}
                    </p>
                  </div>
                </div>
                
                {foldType && foldType !== 'single' && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Показываем линии сгиба */}
                    {foldType === 'bifold' && (
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 opacity-50" style={{ transform: 'translateX(-0.5px)' }} />
                    )}
                    {foldType === 'trifold' && (
                      <>
                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gray-300 opacity-50" style={{ transform: 'translateX(-0.5px)' }} />
                        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray-300 opacity-50" style={{ transform: 'translateX(-0.5px)' }} />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Вспомогательные функции
function getFlyerTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'promotional': 'Реклама',
    'event': 'Івент',
    'product-catalog': 'Каталог',
    'service-menu': 'Послуги',
    'announcement': 'Оголошення',
    'real-estate': 'Нерухомість'
  };
  
  return labels[type] || type;
}

function getPrintFeatureLabel(feature: string): string {
  const labels: Record<string, string> = {
    perforation: 'Перфорація',
    scoring: 'Біговка',
    dieCutting: 'Висічка'
  };
  
  return labels[feature] || feature;
}