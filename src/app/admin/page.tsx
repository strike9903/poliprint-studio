"use client";

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

// Mock data - в реальном приложении будет получаться через API
const statsData = {
  todayOrders: {
    value: 47,
    change: +12.5,
    trend: 'up' as const,
  },
  revenue: {
    value: 89430,
    change: +8.2,
    trend: 'up' as const,
  },
  activeUsers: {
    value: 1247,
    change: -2.1,
    trend: 'down' as const,
  },
  conversionRate: {
    value: 3.8,
    change: +0.7,
    trend: 'up' as const,
  }
};

const systemHealth = {
  status: 'healthy' as const,
  uptime: 99.9,
  responseTime: 245,
  services: [
    { name: 'API Server', status: 'healthy', responseTime: 120 },
    { name: 'Database', status: 'healthy', responseTime: 45 },
    { name: 'File Storage', status: 'warning', responseTime: 890 },
    { name: 'Payment Gateway', status: 'healthy', responseTime: 156 },
  ]
};

const recentActivity = [
  {
    id: '1',
    type: 'order',
    message: 'Нове замовлення #ORD-2024-1247',
    timestamp: '2 хвилини тому',
    status: 'new'
  },
  {
    id: '2', 
    type: 'payment',
    message: 'Оплата отримана ₴850',
    timestamp: '5 хвилин тому',
    status: 'success'
  },
  {
    id: '3',
    type: 'user',
    message: 'Новий клієнт зареєстрований',
    timestamp: '12 хвилин тому', 
    status: 'info'
  },
  {
    id: '4',
    type: 'system',
    message: 'Резервне копіювання завершено',
    timestamp: '1 година тому',
    status: 'success'
  }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Огляд діяльності Poliprint Studio
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            <Activity className="h-3 w-3 mr-1" />
            Система працює
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Today Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Замовлення сьогодні
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.todayOrders.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {statsData.todayOrders.trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={statsData.todayOrders.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {statsData.todayOrders.change > 0 ? '+' : ''}{statsData.todayOrders.change}%
              </span>
              <span className="ml-1">від вчора</span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Дохід сьогодні
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₴{statsData.revenue.value.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">
                +{statsData.revenue.change}%
              </span>
              <span className="ml-1">від минулого місяця</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активні клієнти
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.activeUsers.value.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-600">
                {statsData.activeUsers.change}%
              </span>
              <span className="ml-1">цього місяця</span>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Конверсія
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.conversionRate.value}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">
                +{statsData.conversionRate.change}%
              </span>
              <span className="ml-1">від минулого тижня</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Останні події</CardTitle>
              <CardDescription>
                Нові замовлення, платежі та системні події
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`
                    mt-1 h-2 w-2 rounded-full flex-shrink-0
                    ${activity.status === 'new' ? 'bg-blue-500' : 
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }
                  `} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Статус системи</span>
              </CardTitle>
              <CardDescription>
                Працездатність сервісів
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Час роботи</span>
                  <span className="font-medium">{systemHealth.uptime}%</span>
                </div>
                <Progress value={systemHealth.uptime} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Час відгуку</span>
                  <span className="font-medium">{systemHealth.responseTime}ms</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-medium">Сервіси</p>
                {systemHealth.services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`
                        h-2 w-2 rounded-full
                        ${service.status === 'healthy' ? 'bg-green-500' :
                          service.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }
                      `} />
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {service.responseTime}ms
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Швидкі дії</CardTitle>
          <CardDescription>
            Найчастіші операції для швидкого доступу
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span className="text-sm">Додати продукт</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Експорт клієнтів</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Звіт продажів</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">Перевірка системи</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}