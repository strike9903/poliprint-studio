"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, MapPin, Clock, Phone, Calculator, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface City {
  ref: string;
  name: string;
  nameRu: string;
  area: string;
  areaDescription: string;
}

interface Warehouse {
  ref: string;
  siteKey: string;
  number: string;
  description: string;
  shortAddress: string;
  phone: string;
  typeOfWarehouse: string;
  schedule: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
}

interface DeliveryCalculation {
  assessedCost: number;
  deliveryCost: number;
  redeliveryCost: number;
  packagingCost: number;
  zone: string;
  totalCost: number;
}

interface NovaPoshtaSelectorProps {
  onDeliverySelect: (delivery: {
    city: City;
    warehouse: Warehouse;
    calculation?: DeliveryCalculation;
  }) => void;
  orderAmount?: number;
  orderWeight?: number;
  className?: string;
}

export function NovaPoshtaSelector({ 
  onDeliverySelect, 
  orderAmount = 1000, 
  orderWeight = 0.5,
  className 
}: NovaPoshtaSelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [calculation, setCalculation] = useState<DeliveryCalculation | null>(null);
  
  const [citySearch, setCitySearch] = useState('');
  const [cityOpen, setCityOpen] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Загрузка городов при поиске
  useEffect(() => {
    if (citySearch.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchCities(citySearch);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [citySearch]);

  // Загрузка складов при выборе города
  useEffect(() => {
    if (selectedCity) {
      loadWarehouses(selectedCity.ref);
    }
  }, [selectedCity]);

  // Расчет доставки при выборе склада
  useEffect(() => {
    if (selectedCity && selectedWarehouse) {
      calculateDelivery();
    }
  }, [selectedCity, selectedWarehouse]);

  const searchCities = async (query: string) => {
    setIsLoadingCities(true);
    try {
      const response = await fetch(`/api/np/cities?q=${encodeURIComponent(query)}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setCities(data.cities);
      } else {
        toast({
          title: "Помилка пошуку міст",
          description: data.message || "Не вдалося знайти міста",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Cities search error:', error);
      toast({
        title: "Помилка мережі",
        description: "Не вдалося підключитися до сервісу",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCities(false);
    }
  };

  const loadWarehouses = async (cityRef: string) => {
    setIsLoadingWarehouses(true);
    setWarehouses([]);
    setSelectedWarehouse(null);
    
    try {
      const response = await fetch(`/api/np/warehouses?cityRef=${cityRef}`);
      const data = await response.json();
      
      if (data.success) {
        setWarehouses(data.warehouses);
      } else {
        toast({
          title: "Помилка завантаження відділень",
          description: data.message || "Не вдалося завантажити відділення",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Warehouses load error:', error);
      toast({
        title: "Помилка мережі",
        description: "Не вдалося завантажити відділення",
        variant: "destructive",
      });
    } finally {
      setIsLoadingWarehouses(false);
    }
  };

  const calculateDelivery = async () => {
    if (!selectedCity || !selectedWarehouse) return;
    
    setIsCalculating(true);
    try {
      const response = await fetch('/api/np/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citySender: 'kyiv-ref', // Отправляем из Киева (склад Poliprint)
          cityRecipient: selectedCity.ref,
          weight: orderWeight,
          serviceType: 'WarehouseWarehouse',
          cost: orderAmount,
          seatsAmount: 1
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setCalculation(data.calculation);
        
        // Передаем выбранную доставку родительскому компоненту
        onDeliverySelect({
          city: selectedCity,
          warehouse: selectedWarehouse,
          calculation: data.calculation
        });
      } else {
        toast({
          title: "Помилка розрахунку доставки",
          description: data.message || "Не вдалося розрахувати вартість",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delivery calculation error:', error);
      toast({
        title: "Помилка розрахунку",
        description: "Не вдалося розрахувати доставку",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Доставка Новою Поштою</span>
        </CardTitle>
        <CardDescription>
          Оберіть місто та відділення для отримання замовлення
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        
        {/* Выбор города */}
        <div className="space-y-2">
          <Label>Місто отримання</Label>
          <Popover open={cityOpen} onOpenChange={setCityOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={cityOpen}
                className="w-full justify-between"
                disabled={isLoadingCities}
              >
                {selectedCity ? selectedCity.name : "Оберіть місто..."}
                {isLoadingCities ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput 
                  placeholder="Введіть назву міста..." 
                  value={citySearch}
                  onValueChange={setCitySearch}
                />
                <CommandEmpty>
                  {isLoadingCities ? "Шукаємо..." : "Міст не знайдено"}
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {cities.map((city) => (
                    <CommandItem
                      key={city.ref}
                      value={city.name}
                      onSelect={() => {
                        setSelectedCity(city);
                        setCityOpen(false);
                        setCitySearch('');
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCity?.ref === city.ref ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div>
                        <div className="font-medium">{city.name}</div>
                        <div className="text-xs text-muted-foreground">{city.areaDescription}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Выбор отделения */}
        {selectedCity && (
          <div className="space-y-2">
            <Label>Відділення</Label>
            {isLoadingWarehouses ? (
              <div className="flex items-center justify-center p-4 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Завантажуємо відділення...</span>
              </div>
            ) : (
              <Select 
                value={selectedWarehouse?.ref || ''} 
                onValueChange={(value) => {
                  const warehouse = warehouses.find(w => w.ref === value);
                  setSelectedWarehouse(warehouse || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть відділення..." />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.ref} value={warehouse.ref}>
                      <div className="flex flex-col">
                        <span className="font-medium">№{warehouse.number}</span>
                        <span className="text-sm text-muted-foreground">
                          {warehouse.shortAddress}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Информация о выбранном отделении */}
        {selectedWarehouse && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="font-medium">{selectedWarehouse.description}</div>
                
                {selectedWarehouse.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-3 w-3 mr-1" />
                    {selectedWarehouse.phone}
                  </div>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Пн-Пт: {selectedWarehouse.schedule.Monday || '08:00-21:00'}
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {selectedWarehouse.typeOfWarehouse === 'Office' ? 'Відділення' : 'Поштомат'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Расчет стоимости доставки */}
        {selectedCity && selectedWarehouse && (
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Вартість доставки</span>
            </Label>
            
            {isCalculating ? (
              <div className="flex items-center justify-center p-4 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Розраховуємо...</span>
              </div>
            ) : calculation ? (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Доставка:</span>
                      <span>₴{calculation.deliveryCost}</span>
                    </div>
                    {calculation.packagingCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Упаковка:</span>
                        <span>₴{calculation.packagingCost}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Всього за доставку:</span>
                        <span className="text-primary">₴{calculation.totalCost}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}