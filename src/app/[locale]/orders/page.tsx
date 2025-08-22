"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();

  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 850,
      items: [
        { name: 'Холст 60×90 см', quantity: 1, price: 750 },
        { name: 'Доставка', quantity: 1, price: 100 }
      ]
    },
    {
      id: 'ORD-002', 
      date: '2024-01-20',
      status: 'processing',
      total: 450,
      items: [
        { name: 'Візитки преміум (500 шт)', quantity: 1, price: 350 },
        { name: 'Доставка', quantity: 1, price: 100 }
      ]
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'processing':
        return { label: 'Обробляється', icon: Clock, color: 'bg-yellow-100 text-yellow-800' };
      case 'printing':
        return { label: 'Друкується', icon: Package, color: 'bg-blue-100 text-blue-800' };
      case 'shipping':
        return { label: 'Доставляється', icon: Truck, color: 'bg-orange-100 text-orange-800' };
      case 'delivered':
        return { label: 'Доставлено', icon: CheckCircle, color: 'bg-green-100 text-green-800' };
      default:
        return { label: 'Невідомо', icon: Clock, color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Необхідна авторизація</h1>
          <p className="text-muted-foreground mb-6">Увійдіть в акаунт для перегляду замовлень</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Мої замовлення</h1>
            <p className="text-muted-foreground">
              Відстежуйте статус ваших замовлень та історію покупок
            </p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Поки що немає замовлень</h3>
                <p className="text-muted-foreground mb-6">
                  Коли ви зробите замовлення, воно з'явиться тут
                </p>
                <Button asChild>
                  <a href="/catalog">Перейти до каталогу</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <span>Замовлення #{order.id}</span>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString('uk-UA')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <div className="text-right">
                            <div className="font-semibold">{order.total} ₴</div>
                            <div className="text-sm text-muted-foreground">
                              {order.items.length} товар{order.items.length > 1 ? 'и' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                              <div className="font-semibold">{item.price} ₴</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/track?order=${order.id}`}>
                            Відстежити замовлення
                          </a>
                        </Button>
                        <Button variant="outline" size="sm">
                          Повторити замовлення
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
