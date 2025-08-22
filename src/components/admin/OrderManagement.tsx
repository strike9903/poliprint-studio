"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  Truck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  products: string[];
  total: number;
  status: 'new' | 'processing' | 'quality_check' | 'completed' | 'shipped' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  dueDate: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

interface OrderManagementProps {
  initialOrders?: Order[];
  onOrderAction?: (orderId: string, action: string, newStatus?: string) => void;
  onBulkAction?: (action: string, selectedOrders?: string[]) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onNewOrder?: () => void;
}

// Mock data - в реальном приложении будет из API
const mockOrders: Order[] = [
  {
    id: 'ORD-2024-1247',
    customer: 'Олена Петренко',
    email: 'olena@example.com',
    phone: '+380671234567',
    products: ['Холст 60×90', 'Візитки х100'],
    total: 1250,
    status: 'new',
    priority: 'normal',
    createdAt: '2024-12-20 14:30',
    dueDate: '2024-12-23',
    paymentStatus: 'pending'
  },
  {
    id: 'ORD-2024-1246',
    customer: 'Дмитро Коваленко',
    email: 'dmitro@example.com',
    phone: '+380501234567',
    products: ['Акрил 40×40', 'Листівки х500'],
    total: 850,
    status: 'processing',
    priority: 'high',
    createdAt: '2024-12-20 12:15',
    dueDate: '2024-12-22',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-2024-1245',
    customer: 'Марія Іваненко',
    email: 'maria@example.com', 
    phone: '+380931234567',
    products: ['Постер А1', 'Наклейки х50'],
    total: 420,
    status: 'completed',
    priority: 'normal',
    createdAt: '2024-12-19 16:45',
    dueDate: '2024-12-21',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-2024-1244',
    customer: 'Сергій Мороз',
    email: 'sergiy@example.com',
    phone: '+380661234567',
    products: ['Метал принт 30×40'],
    total: 680,
    status: 'cancelled',
    priority: 'low',
    createdAt: '2024-12-19 10:20',
    dueDate: '2024-12-22',
    paymentStatus: 'refunded'
  }
];

const statusConfig = {
  new: { label: 'Новий', variant: 'secondary' as const, icon: Clock, className: '' },
  processing: { label: 'В роботі', variant: 'default' as const, icon: Package, className: '' },
  quality_check: { label: 'Перевірка', variant: 'outline' as const, icon: Eye, className: '' },
  completed: { label: 'Готовий', variant: 'default' as const, icon: CheckCircle, className: 'bg-green-100 text-green-800 border-green-200' },
  shipped: { label: 'Відправлено', variant: 'default' as const, icon: Truck, className: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Скасовано', variant: 'destructive' as const, icon: XCircle, className: '' }
};

const priorityConfig = {
  low: { label: 'Низький', color: 'text-gray-500' },
  normal: { label: 'Звичайний', color: 'text-blue-500' },
  high: { label: 'Високий', color: 'text-orange-500' },
  urgent: { label: 'Терміновий', color: 'text-red-500' }
};

const paymentStatusConfig = {
  pending: { label: 'Очікується', variant: 'outline' as const, className: '' },
  paid: { label: 'Оплачено', variant: 'default' as const, className: 'bg-green-100 text-green-800 border-green-200' },
  refunded: { label: 'Повернуто', variant: 'destructive' as const, className: '' }
};

export function OrderManagement({
  initialOrders = mockOrders,
  onOrderAction,
  onBulkAction,
  onRefresh,
  onExport,
  onNewOrder
}: OrderManagementProps) {
  const [orders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const { toast } = useToast();

  // Фильтрация заказов
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  // Статистика по вкладкам
  const tabCounts = {
    all: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (onOrderAction) {
      onOrderAction(orderId, 'status_change', newStatus);
    } else {
      toast({
        title: "Статус оновлено",
        description: `Замовлення ${orderId} змінено на "${statusConfig[newStatus as keyof typeof statusConfig]?.label}"`,
      });
    }
  };

  const handleOrderAction = (orderId: string, action: string) => {
    if (onOrderAction) {
      onOrderAction(orderId, action);
    } else {
      toast({
        title: "Дія виконана",
        description: `${action} для замовлення ${orderId}`,
      });
    }
  };

  const handleBulkAction = (action: string) => {
    if (onBulkAction) {
      onBulkAction(action, selectedOrders);
    } else {
      toast({
        title: "Масова дія",
        description: `Виконано дію: ${action}`,
      });
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      toast({
        title: "Оновлено",
        description: "Список замовлень оновлено",
      });
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      toast({
        title: "Експорт",
        description: "Розпочато експорт списку замовлень",
      });
    }
  };

  const handleNewOrder = () => {
    if (onNewOrder) {
      onNewOrder();
    } else {
      toast({
        title: "Нове замовлення",
        description: "Відкриття форми створення замовлення",
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Замовлення</h1>
          <p className="text-muted-foreground">
            Управління всіма замовленнями клієнтів
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Експорт
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Оновити
          </Button>
          <Button onClick={handleNewOrder}>
            <Package className="h-4 w-4 mr-2" />
            Нове замовлення
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всього замовлень</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              +8% від минулого тижня
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нові замовлення</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts.new}</div>
            <p className="text-xs text-muted-foreground">
              Потребують обробки
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В роботі</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts.processing}</div>
            <p className="text-xs text-muted-foreground">
              Активні проекти
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Готові</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts.completed}</div>
            <p className="text-xs text-muted-foreground">
              До видачі
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Пошук за номером, клієнтом або email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі статуси</SelectItem>
                  <SelectItem value="new">Нові</SelectItem>
                  <SelectItem value="processing">В роботі</SelectItem>
                  <SelectItem value="completed">Готові</SelectItem>
                  <SelectItem value="cancelled">Скасовані</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Пріоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі пріоритети</SelectItem>
                  <SelectItem value="low">Низький</SelectItem>
                  <SelectItem value="normal">Звичайний</SelectItem>
                  <SelectItem value="high">Високий</SelectItem>
                  <SelectItem value="urgent">Терміновий</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Більше фільтрів
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="all" className="relative">
            Всі
            <Badge className="ml-2 text-xs">{tabCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="new" className="relative">
            Нові
            {tabCounts.new > 0 && (
              <Badge className="ml-2 text-xs bg-blue-500">{tabCounts.new}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processing" className="relative">
            В роботі
            {tabCounts.processing > 0 && (
              <Badge className="ml-2 text-xs bg-orange-500">{tabCounts.processing}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            Готові
            {tabCounts.completed > 0 && (
              <Badge className="ml-2 text-xs bg-green-500">{tabCounts.completed}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="relative">
            Скасовані
            {tabCounts.cancelled > 0 && (
              <Badge className="ml-2 text-xs bg-red-500">{tabCounts.cancelled}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Замовлення</TableHead>
                  <TableHead>Клієнт</TableHead>
                  <TableHead>Продукти</TableHead>
                  <TableHead>Сума</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Пріоритет</TableHead>
                  <TableHead>Оплата</TableHead>
                  <TableHead>Термін</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon;
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.createdAt}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.email}</p>
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.products.map((product, index) => (
                            <p key={index} className="text-sm">
                              {product}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">₴{order.total}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusConfig[order.status as keyof typeof statusConfig]?.variant}
                          className={statusConfig[order.status as keyof typeof statusConfig]?.className}
                        >
                          {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                          {statusConfig[order.status as keyof typeof statusConfig]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${priorityConfig[order.priority as keyof typeof priorityConfig]?.color}`}>
                          {priorityConfig[order.priority as keyof typeof priorityConfig]?.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig]?.variant}
                          className={paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig]?.className}
                        >
                          {paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.dueDate}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Дії</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'Переглянути')}>
                              <Eye className="mr-2 h-4 w-4" />
                              Переглянути
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'Редагувати')}>
                              <Edit className="mr-2 h-4 w-4" />
                              Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'Друк')}>
                              <Printer className="mr-2 h-4 w-4" />
                              Друк
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(order.id, 'processing')}
                            >
                              <Package className="mr-2 h-4 w-4" />
                              В роботу
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(order.id, 'completed')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Готовий
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Замовлень не знайдено</h3>
                <p className="text-muted-foreground">
                  Спробуйте змінити фільтри або критерії пошуку
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bulk Actions */}
      {filteredOrders.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Знайдено {filteredOrders.length} замовлень
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
                  Експорт вибраних
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('print')}>
                  <Printer className="h-4 w-4 mr-2" />
                  Друк
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('status')}>
                  Змінити статус
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default OrderManagement;