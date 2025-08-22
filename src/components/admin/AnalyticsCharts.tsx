"use client";

import { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

// Типы данных для графиков
interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
  avgOrder: number;
}

interface ProductData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface TimeData {
  hour: string;
  orders: number;
  revenue: number;
}

interface RegionData {
  region: string;
  orders: number;
  revenue: number;
  growth: number;
}

// Mock данные для демонстрации
const revenueData: RevenueData[] = [
  { month: 'Січ', revenue: 45000, orders: 120, customers: 89, avgOrder: 375 },
  { month: 'Лют', revenue: 52000, orders: 145, customers: 112, avgOrder: 359 },
  { month: 'Бер', revenue: 48000, orders: 135, customers: 98, avgOrder: 356 },
  { month: 'Кві', revenue: 61000, orders: 167, customers: 134, avgOrder: 365 },
  { month: 'Тра', revenue: 55000, orders: 152, customers: 118, avgOrder: 362 },
  { month: 'Чер', revenue: 67000, orders: 189, customers: 156, avgOrder: 355 },
  { month: 'Лип', revenue: 72000, orders: 203, customers: 167, avgOrder: 355 },
  { month: 'Сер', revenue: 69000, orders: 195, customers: 159, avgOrder: 354 },
  { month: 'Вер', revenue: 78000, orders: 218, customers: 178, avgOrder: 358 },
  { month: 'Жов', revenue: 82000, orders: 235, customers: 189, avgOrder: 349 },
  { month: 'Лис', revenue: 89000, orders: 247, customers: 201, avgOrder: 360 },
  { month: 'Гру', revenue: 95000, orders: 267, customers: 218, avgOrder: 356 }
];

const productData: ProductData[] = [
  { name: 'Холст', value: 4500, percentage: 35.2, color: '#8884d8' },
  { name: 'Візитки', value: 3200, percentage: 25.1, color: '#82ca9d' },
  { name: 'Акрил', value: 2800, percentage: 21.9, color: '#ffc658' },
  { name: 'Листівки', value: 1500, percentage: 11.7, color: '#ff7c7c' },
  { name: 'Наклейки', value: 800, percentage: 6.1, color: '#8dd1e1' }
];

const hourlyData: TimeData[] = [
  { hour: '00', orders: 2, revenue: 800 },
  { hour: '01', orders: 1, revenue: 400 },
  { hour: '02', orders: 0, revenue: 0 },
  { hour: '03', orders: 1, revenue: 300 },
  { hour: '06', orders: 4, revenue: 1600 },
  { hour: '09', orders: 18, revenue: 7200 },
  { hour: '12', orders: 28, revenue: 11200 },
  { hour: '15', orders: 35, revenue: 14000 },
  { hour: '18', orders: 22, revenue: 8800 },
  { hour: '21', orders: 10, revenue: 4000 },
  { hour: '23', orders: 4, revenue: 1600 }
];

const regionData: RegionData[] = [
  { region: 'Київ', orders: 89, revenue: 32140, growth: 12.5 },
  { region: 'Харків', orders: 52, revenue: 18720, growth: 8.3 },
  { region: 'Одеса', orders: 34, revenue: 12580, growth: -2.1 },
  { region: 'Львів', orders: 28, revenue: 10980, growth: 15.7 },
  { region: 'Дніпро', orders: 23, revenue: 8450, growth: 5.4 }
];

interface AnalyticsChartsProps {
  period?: '7d' | '30d' | '90d' | '1y';
  onPeriodChange?: (period: string) => void;
}

export function AnalyticsCharts({ period = '30d', onPeriodChange }: AnalyticsChartsProps) {
  const [activeChart, setActiveChart] = useState<'revenue' | 'products' | 'time' | 'regions'>('revenue');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number) => `₴${value.toLocaleString()}`;
  const formatPercent = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

  const handleRefresh = async () => {
    setIsLoading(true);
    // Имитация загрузки данных
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Экспорт данных в CSV/Excel
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Останні 7 днів</SelectItem>
              <SelectItem value="30d">Останні 30 днів</SelectItem>
              <SelectItem value="90d">Останні 3 місяці</SelectItem>
              <SelectItem value="1y">Рік</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Оновити
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Фільтри
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Експорт
          </Button>
        </div>
      </div>

      {/* Chart Navigation */}
      <Tabs value={activeChart} onValueChange={(value) => setActiveChart(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue" className="flex items-center space-x-2">
            <LineChartIcon className="h-4 w-4" />
            <span>Дохід</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <PieChartIcon className="h-4 w-4" />
            <span>Продукти</span>
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Час</span>
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Регіони</span>
          </TabsTrigger>
        </TabsList>

        {/* Revenue Charts */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Динаміка доходу</span>
                </CardTitle>
                <CardDescription>
                  Помісячна статистика доходу та замовлень
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) : value,
                        name === 'revenue' ? 'Дохід' : 'Замовлення'
                      ]}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      fill="#8884d8" 
                      stroke="#8884d8"
                      fillOpacity={0.3}
                      name="Дохід"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Замовлення"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Customer Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Клієнтська аналітика</CardTitle>
                <CardDescription>
                  Кількість клієнтів та середній чек
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'avgOrder' ? formatCurrency(Number(value)) : value,
                        name === 'avgOrder' ? 'Середній чек' : 'Клієнти'
                      ]}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="customers" 
                      fill="#ffc658"
                      name="Клієнти"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="avgOrder" 
                      stroke="#ff7c7c" 
                      strokeWidth={2}
                      name="Середній чек"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Charts */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            
            {/* Product Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Розподіл продуктів</CardTitle>
                <CardDescription>
                  Частка кожного типу продукту в загальному доході
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Product Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Ефективність продуктів</CardTitle>
                <CardDescription>
                  Дохід по категоріям продуктів
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Product Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Детальна статистика по продуктах</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productData.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: product.color }}
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.percentage}% від загального доходу
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.value)}</p>
                      <Badge variant={index < 2 ? "default" : "secondary"}>
                        {index < 2 ? "Топ продукт" : "Стандарт"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Analytics */}
        <TabsContent value="time" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Активність за годинами</CardTitle>
              <CardDescription>
                Розподіл замовлень та доходу протягом дня
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Дохід' : 'Замовлення'
                    ]}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="orders" 
                    fill="#8884d8"
                    name="Замовлення"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Дохід"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Analytics */}
        <TabsContent value="regions" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            
            {/* Regional Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Дохід за регіонами</CardTitle>
                <CardDescription>
                  Географічний розподіл доходу
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Regional Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Зростання за регіонами</CardTitle>
                <CardDescription>
                  Динаміка росту продажів по регіонах
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {regionData.map((region) => (
                  <div key={region.region} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{region.region}</p>
                      <p className="text-sm text-muted-foreground">
                        {region.orders} замовлень
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(region.revenue)}</p>
                      <div className="flex items-center space-x-1">
                        {region.growth >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${
                          region.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercent(region.growth)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsCharts;