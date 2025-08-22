"use client";

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  Package,
  MapPin,
  Calendar,
  Download,
  BarChart3,
  Target,
  Clock
} from 'lucide-react';

// Mock data - в реальном приложении будет из аналитических API
const analyticsData = {
  revenue: {
    current: 89430,
    previous: 78210,
    change: 14.3,
    trend: 'up' as const
  },
  orders: {
    current: 247,
    previous: 203,
    change: 21.7,
    trend: 'up' as const
  },
  customers: {
    current: 156,
    previous: 142,
    change: 9.9,
    trend: 'up' as const
  },
  conversion: {
    current: 3.8,
    previous: 3.2,
    change: 18.8,
    trend: 'up' as const
  },
  avgOrderValue: {
    current: 362,
    previous: 385,
    change: -6.0,
    trend: 'down' as const
  }
};

const topProducts = [
  { name: 'Холст 60×90', orders: 45, revenue: 22500, percentage: 25.2 },
  { name: 'Візитки (100 шт)', orders: 38, revenue: 8360, percentage: 9.4 },
  { name: 'Акрил 40×40', orders: 24, revenue: 16320, percentage: 18.3 },
  { name: 'Постер А1', orders: 31, revenue: 9300, percentage: 10.4 },
  { name: 'Метал принт 30×40', orders: 18, revenue: 12240, percentage: 13.7 }
];

const salesByRegion = [
  { city: 'Київ', orders: 89, revenue: 32140, percentage: 36.0 },
  { city: 'Харків', orders: 52, revenue: 18720, percentage: 20.9 },
  { city: 'Одеса', orders: 34, revenue: 12580, percentage: 14.1 },
  { city: 'Львів', orders: 28, revenue: 10980, percentage: 12.3 },
  { city: 'Дніпро', orders: 23, revenue: 8450, percentage: 9.4 },
  { city: 'Інші', orders: 21, revenue: 6560, percentage: 7.3 }
];

const hourlyData = [
  { hour: '00:00', orders: 2 },
  { hour: '01:00', orders: 1 },
  { hour: '02:00', orders: 0 },
  { hour: '03:00', orders: 1 },
  { hour: '04:00', orders: 0 },
  { hour: '05:00', orders: 2 },
  { hour: '06:00', orders: 4 },
  { hour: '07:00', orders: 8 },
  { hour: '08:00', orders: 12 },
  { hour: '09:00', orders: 18 },
  { hour: '10:00', orders: 25 },
  { hour: '11:00', orders: 32 },
  { hour: '12:00', orders: 28 },
  { hour: '13:00', orders: 24 },
  { hour: '14:00', orders: 30 },
  { hour: '15:00', orders: 35 },
  { hour: '16:00', orders: 32 },
  { hour: '17:00', orders: 28 },
  { hour: '18:00', orders: 22 },
  { hour: '19:00', orders: 18 },
  { hour: '20:00', orders: 14 },
  { hour: '21:00', orders: 10 },
  { hour: '22:00', orders: 6 },
  { hour: '23:00', orders: 4 }
];

const peakHour = hourlyData.reduce((max, current) => 
  current.orders > max.orders ? current : max
);

export default function AdminAnalyticsPage() {
  const formatCurrency = (amount: number) => `₴${amount.toLocaleString()}`;
  const formatPercent = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

  const renderTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Аналітика</h1>
          <p className="text-muted-foreground">
            Детальна статистика продажів і показників ефективності
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Останні 7 днів</SelectItem>
              <SelectItem value="30d">Останні 30 днів</SelectItem>
              <SelectItem value="90d">Останні 3 місяці</SelectItem>
              <SelectItem value="1y">Рік</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Експорт
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        
        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Дохід</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.revenue.current)}</div>
            <div className="flex items-center text-xs">
              {renderTrendIcon(analyticsData.revenue.trend)}
              <span className={`ml-1 ${getTrendColor(analyticsData.revenue.trend)}`}>
                {formatPercent(analyticsData.revenue.change)}
              </span>
              <span className="ml-1 text-muted-foreground">від минулого періоду</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Замовлення</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.orders.current}</div>
            <div className="flex items-center text-xs">
              {renderTrendIcon(analyticsData.orders.trend)}
              <span className={`ml-1 ${getTrendColor(analyticsData.orders.trend)}`}>
                {formatPercent(analyticsData.orders.change)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Клієнти</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.customers.current}</div>
            <div className="flex items-center text-xs">
              {renderTrendIcon(analyticsData.customers.trend)}
              <span className={`ml-1 ${getTrendColor(analyticsData.customers.trend)}`}>
                {formatPercent(analyticsData.customers.change)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Конверсія</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversion.current}%</div>
            <div className="flex items-center text-xs">
              {renderTrendIcon(analyticsData.conversion.trend)}
              <span className={`ml-1 ${getTrendColor(analyticsData.conversion.trend)}`}>
                {formatPercent(analyticsData.conversion.change)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Середній чек</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.avgOrderValue.current)}</div>
            <div className="flex items-center text-xs">
              {renderTrendIcon(analyticsData.avgOrderValue.trend)}
              <span className={`ml-1 ${getTrendColor(analyticsData.avgOrderValue.trend)}`}>
                {formatPercent(analyticsData.avgOrderValue.change)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Top Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Топ продукти</span>
            </CardTitle>
            <CardDescription>
              Найбільш популярні продукти за дохідністю
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-6 text-center">
                  <Badge variant={index === 0 ? 'default' : 'outline'} className="w-6 h-6 p-0 text-xs">
                    {index + 1}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{product.name}</p>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.revenue)}</p>
                      <p className="text-sm text-muted-foreground">{product.orders} замовлень</p>
                    </div>
                  </div>
                  <Progress value={product.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.percentage.toFixed(1)}% від загального доходу
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sales by Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Продажі за регіонами</span>
            </CardTitle>
            <CardDescription>
              Географічний розподіл замовлень
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesByRegion.map((region) => (
              <div key={region.city} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`
                    w-3 h-3 rounded-full
                    ${region.city === 'Київ' ? 'bg-blue-500' :
                      region.city === 'Харків' ? 'bg-green-500' :
                      region.city === 'Одеса' ? 'bg-yellow-500' :
                      region.city === 'Львів' ? 'bg-purple-500' :
                      region.city === 'Дніпро' ? 'bg-red-500' :
                      'bg-gray-500'
                    }
                  `} />
                  <span className="font-medium">{region.city}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(region.revenue)}</p>
                  <p className="text-xs text-muted-foreground">
                    {region.orders} зам. ({region.percentage}%)
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Time Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Активність за годинами</span>
            </CardTitle>
            <CardDescription>
              Розподіл замовлень протягом дня
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div>
                  <p className="font-medium">Пікова година</p>
                  <p className="text-2xl font-bold">{peakHour.hour}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Замовлень</p>
                  <p className="text-2xl font-bold">{peakHour.orders}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Розподіл по годинах:</p>
                <div className="grid grid-cols-6 gap-1">
                  {hourlyData.map((data) => (
                    <div 
                      key={data.hour}
                      className="text-center p-1"
                    >
                      <div 
                        className={`
                          h-8 rounded mb-1 flex items-end justify-center text-xs text-white font-medium
                          ${data.orders === peakHour.orders ? 'bg-primary' : 'bg-muted'}
                        `}
                        style={{
                          height: `${Math.max(16, (data.orders / peakHour.orders) * 32)}px`
                        }}
                      >
                        {data.orders > 5 && data.orders}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {data.hour.split(':')[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Показники ефективності</CardTitle>
            <CardDescription>
              Ключові метрики за останні 30 днів
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Швидкість обробки замовлень</span>
                <span className="font-medium">2.1 години</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">Ціль: менше 3 годин</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Задоволеність клієнтів</span>
                <span className="font-medium">4.8/5.0</span>
              </div>
              <Progress value={96} className="h-2" />
              <p className="text-xs text-muted-foreground">96% позитивних відгуків</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Повернення замовлень</span>
                <span className="font-medium">1.2%</span>
              </div>
              <Progress value={12} className="h-2" />
              <p className="text-xs text-muted-foreground">Нижче галузевого стандарту</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Повторні замовлення</span>
                <span className="font-medium">34%</span>
              </div>
              <Progress value={34} className="h-2" />
              <p className="text-xs text-muted-foreground">Лояльність клієнтів зростає</p>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Рекомендації для зростання</CardTitle>
          <CardDescription>
            Ключові інсайти на основі аналізу даних
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <p className="font-medium">Збільшити асортимент</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Холсти показують найкращу рентабельність. 
                Розширте розміри та варіанти обрамлення.
              </p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <p className="font-medium">Регіональна експансія</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Одеса та Львів показують потенціал. 
                Розгляньте локальну рекламу в цих регіонах.
              </p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <p className="font-medium">Оптимізація піку</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Пік замовлень о 15:00. Підготуйте додатковий 
                персонал в цей час для швидшої обробки.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}