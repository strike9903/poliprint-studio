"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { BusinessCardConstructor, BusinessCardConfig, BusinessCardTemplate } from '@/lib/constructors/business-card-constructor';
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
  Palette,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  QrCode,
  Download,
  Eye,
  Sparkles,
  Undo,
  Redo,
  Save,
  Upload
} from 'lucide-react';

interface BusinessCardConfiguratorProps {
  initialConfig?: Partial<BusinessCardConfig>;
  onSave?: (config: BusinessCardConfig) => void;
  onExport?: (format: 'pdf' | 'png' | 'jpg' | 'svg') => void;
}

export function BusinessCardConfigurator({ 
  initialConfig,
  onSave,
  onExport 
}: BusinessCardConfiguratorProps) {
  const [constructor, setConstructor] = useState<BusinessCardConstructor | null>(null);
  const [templates, setTemplates] = useState<BusinessCardTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [corporateFields, setCorporateFields] = useState({
    companyName: '',
    personName: '',
    position: '',
    phone: '',
    email: '',
    website: '',
    address: ''
  });
  const [specialFeatures, setSpecialFeatures] = useState({
    roundedCorners: false,
    embossing: false,
    foiling: false,
    spot_uv: false,
    laminationGlossy: false,
    laminationMatte: true
  });
  const [qrCodeEnabled, setQrCodeEnabled] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [quantity, setQuantity] = useState(100);

  // Инициализация конструктора
  useEffect(() => {
    const initConstructor = async () => {
      try {
        setIsLoading(true);
        
        const defaultConfig: ProductConfig = {
          id: 'bc_' + Date.now(),
          name: 'Бізнес-картка',
          category: 'business-cards',
          dimensions: {
            width: 85,
            height: 55,
            unit: 'mm',
            dpi: 300
          },
          printArea: {
            x: 2,
            y: 2,
            width: 81,
            height: 51
          },
          bleedArea: {
            top: 2,
            right: 2,
            bottom: 2,
            left: 2
          },
          materials: ['standard_cardstock'],
          finishes: ['matte_lamination'],
          orientation: 'landscape',
          sides: 1,
          minQuantity: 50,
          maxQuantity: 5000,
          basePrice: 150,
          pricePerUnit: 0.8,
          constraints: {
            minFontSize: 8,
            maxColors: 4,
            allowedFileTypes: ['pdf', 'ai', 'eps', 'png', 'jpg'],
            maxFileSize: 10485760, // 10MB
            requiredDPI: 300
          },
          ...initialConfig
        };

        const constructorInstance = new BusinessCardConstructor(defaultConfig);
        const availableTemplates = await constructorInstance.getAvailableTemplates() as BusinessCardTemplate[];
        
        setConstructor(constructorInstance);
        setTemplates(availableTemplates);
        
        // Загружаем первый шаблон по умолчанию
        if (availableTemplates.length > 0) {
          await constructorInstance.loadTemplate(availableTemplates[0].id);
          setSelectedTemplate(availableTemplates[0].id);
        }

        // Инициализируем поля из конфигурации
        const config = constructorInstance.getProject().productConfig as BusinessCardConfig;
        if (config.corporateFields) {
          setCorporateFields({
            companyName: config.corporateFields.companyName,
            personName: config.corporateFields.personName,
            position: config.corporateFields.position,
            phone: config.corporateFields.phone,
            email: config.corporateFields.email,
            website: config.corporateFields.website || '',
            address: config.corporateFields.address || ''
          });
        }
        if (config.specialFeatures) {
          setSpecialFeatures(config.specialFeatures);
        }
        if (config.qrCode?.enabled) {
          setQrCodeEnabled(true);
          setQrCodeData(config.qrCode.data);
        }

      } catch (error) {
        console.error('Failed to initialize constructor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initConstructor();
  }, [initialConfig]);

  // Обновление полей и валидация
  useEffect(() => {
    if (constructor) {
      updatePricing();
      validateDesign();
    }
  }, [constructor, corporateFields, specialFeatures, quantity]);

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

  const handleCorporateFieldChange = (field: keyof typeof corporateFields, value: string) => {
    const newFields = { ...corporateFields, [field]: value };
    setCorporateFields(newFields);
    
    if (constructor) {
      constructor.updateCorporateField(field, value);
    }
  };

  const handleSpecialFeatureChange = (feature: keyof typeof specialFeatures, enabled: boolean) => {
    const newFeatures = { ...specialFeatures, [feature]: enabled };
    setSpecialFeatures(newFeatures);
    
    if (constructor) {
      constructor.updateSpecialFeature(feature, enabled);
    }
  };

  const handleQRCodeToggle = (enabled: boolean) => {
    setQrCodeEnabled(enabled);
    
    if (constructor) {
      if (enabled && qrCodeData) {
        constructor.addQRCode(qrCodeData);
      } else {
        constructor.removeQRCode();
      }
    }
  };

  const handleQRCodeDataChange = (data: string) => {
    setQrCodeData(data);
    
    if (constructor && qrCodeEnabled && data) {
      constructor.addQRCode(data);
    }
  };

  const handleExport = async (format: 'pdf' | 'png' | 'jpg' | 'svg') => {
    if (!constructor) return;
    
    try {
      const blob = await constructor.exportDesign(format);
      
      // Скачиваем файл
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `business-card-${Date.now()}.${format}`;
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
          <p className="text-muted-foreground">Ініціалізація конструктора...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Боковая панель с настройками */}
      <div className="col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Шаблони
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`relative border rounded-lg p-2 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="aspect-[85/55] bg-muted rounded mb-2 overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium truncate">{template.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant={template.style === 'corporate' ? 'default' : 'secondary'} className="text-xs">
                      {template.style}
                    </Badge>
                    {template.isPremium && (
                      <Sparkles className="h-3 w-3 text-amber-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="features">Ефекти</TabsTrigger>
            <TabsTrigger value="export">Експорт</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Інформація про компанію
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Назва компанії *</Label>
                  <Input
                    id="companyName"
                    value={corporateFields.companyName}
                    onChange={(e) => handleCorporateFieldChange('companyName', e.target.value)}
                    placeholder="ТОВ 'Поліпринт'"
                  />
                </div>
                <div>
                  <Label htmlFor="personName">Ім'я співробітника *</Label>
                  <Input
                    id="personName"
                    value={corporateFields.personName}
                    onChange={(e) => handleCorporateFieldChange('personName', e.target.value)}
                    placeholder="Іван Петренко"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Посада</Label>
                  <Input
                    id="position"
                    value={corporateFields.position}
                    onChange={(e) => handleCorporateFieldChange('position', e.target.value)}
                    placeholder="Менеджер з продажу"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    value={corporateFields.phone}
                    onChange={(e) => handleCorporateFieldChange('phone', e.target.value)}
                    placeholder="+38 (067) 123-45-67"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={corporateFields.email}
                    onChange={(e) => handleCorporateFieldChange('email', e.target.value)}
                    placeholder="ivan@poliprint.ua"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Веб-сайт</Label>
                  <Input
                    id="website"
                    value={corporateFields.website}
                    onChange={(e) => handleCorporateFieldChange('website', e.target.value)}
                    placeholder="www.poliprint.ua"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Адреса</Label>
                  <Textarea
                    id="address"
                    value={corporateFields.address}
                    onChange={(e) => handleCorporateFieldChange('address', e.target.value)}
                    placeholder="вул. Хрещатик, 1, Київ, 01001"
                    rows={2}
                  />
                </div>
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
                    checked={qrCodeEnabled}
                    onCheckedChange={handleQRCodeToggle}
                  />
                  <Label htmlFor="qr-enabled">Додати QR код</Label>
                </div>
                {qrCodeEnabled && (
                  <div>
                    <Label htmlFor="qr-data">Дані для QR коду</Label>
                    <Input
                      id="qr-data"
                      value={qrCodeData}
                      onChange={(e) => handleQRCodeDataChange(e.target.value)}
                      placeholder="https://poliprint.ua"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Може бути URL, телефон, email або текст
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Спеціальні ефекти</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(specialFeatures).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <Label htmlFor={feature} className="text-sm">
                      {getFeatureLabel(feature)}
                    </Label>
                    <Switch
                      id={feature}
                      checked={enabled}
                      onCheckedChange={(checked) => 
                        handleSpecialFeatureChange(feature as keyof typeof specialFeatures, checked)
                      }
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
                  <Label htmlFor="quantity">Кількість</Label>
                  <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50 шт</SelectItem>
                      <SelectItem value="100">100 шт</SelectItem>
                      <SelectItem value="250">250 шт</SelectItem>
                      <SelectItem value="500">500 шт</SelectItem>
                      <SelectItem value="1000">1000 шт</SelectItem>
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
                        <span>Знижка за кількість:</span>
                        <span>-{pricing.breakdown.discountAmount.toFixed(2)} грн</span>
                      </div>
                    )}
                    {pricing.breakdown.effectsPrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Спеціальні ефекти:</span>
                        <span>+{pricing.breakdown.effectsPrice.toFixed(2)} грн</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Загальна вартість:</span>
                      <span>{pricing.total.toFixed(2)} грн</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Експорт дизайну
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
                
                <Separator />
                
                <Button onClick={handleSave} className="w-full flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Зберегти проект
                </Button>
              </CardContent>
            </Card>

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
          </TabsContent>
        </Tabs>
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
                className="bg-white shadow-lg rounded-lg border"
                style={{
                  width: '340px', // 85mm * 4 для масштабирования
                  height: '220px', // 55mm * 4
                  aspectRatio: '85/55'
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Попередній перегляд візитки</p>
                    <p className="text-xs">85 × 55 мм</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Вспомогательная функция для получения подписей функций
function getFeatureLabel(feature: string): string {
  const labels: Record<string, string> = {
    roundedCorners: 'Закруглені кути',
    embossing: 'Тиснення',
    foiling: 'Фольгування',
    spot_uv: 'Спот-лак',
    laminationGlossy: 'Глянцева ламінація',
    laminationMatte: 'Матова ламінація'
  };
  
  return labels[feature] || feature;
}