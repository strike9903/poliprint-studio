"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Mail,
  Phone,
  UserCheck,
  UserX,
  Download,
  RefreshCw,
  Users,
  Crown,
  Calendar,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  status: 'active' | 'inactive' | 'blocked';
  role: string;
  tier: 'regular' | 'vip' | 'premium';
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  registeredAt: string;
  location: string;
  preferredProducts: string[];
}

interface UserManagementProps {
  initialUsers?: User[];
  onUserAction?: (userId: string, action: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onAddUser?: () => void;
}

// Mock data - в реальном приложении будет из API
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Олена Петренко',
    email: 'olena@example.com',
    phone: '+380671234567',
    avatar: null,
    status: 'active',
    role: 'customer',
    tier: 'vip',
    totalOrders: 24,
    totalSpent: 15680,
    lastOrder: '2024-12-20',
    registeredAt: '2024-01-15',
    location: 'Київ',
    preferredProducts: ['Холст', 'Акрил']
  },
  {
    id: '2', 
    name: 'Дмитро Коваленко',
    email: 'dmitro@example.com',
    phone: '+380501234567',
    avatar: null,
    status: 'active',
    role: 'customer',
    tier: 'regular',
    totalOrders: 8,
    totalSpent: 4320,
    lastOrder: '2024-12-18',
    registeredAt: '2024-06-10',
    location: 'Харків',
    preferredProducts: ['Візитки', 'Листівки']
  },
  {
    id: '3',
    name: 'Марія Іваненко', 
    email: 'maria@example.com',
    phone: '+380931234567',
    avatar: null,
    status: 'inactive',
    role: 'customer',
    tier: 'regular',
    totalOrders: 3,
    totalSpent: 890,
    lastOrder: '2024-11-05',
    registeredAt: '2024-08-22',
    location: 'Львів',
    preferredProducts: ['Постери']
  },
  {
    id: '4',
    name: 'Сергій Мороз',
    email: 'sergiy@example.com', 
    phone: '+380661234567',
    avatar: null,
    status: 'blocked',
    role: 'customer',
    tier: 'regular',
    totalOrders: 1,
    totalSpent: 250,
    lastOrder: '2024-09-15',
    registeredAt: '2024-09-10',
    location: 'Одеса',
    preferredProducts: ['Метал принт']
  },
  {
    id: '5',
    name: 'Анна Сидоренко',
    email: 'anna@example.com',
    phone: '+380981234567', 
    avatar: null,
    status: 'active',
    role: 'customer',
    tier: 'vip',
    totalOrders: 42,
    totalSpent: 28450,
    lastOrder: '2024-12-19',
    registeredAt: '2023-11-08',
    location: 'Дніпро',
    preferredProducts: ['Холст', 'Метал принт', 'Акрил']
  }
];

const statusConfig = {
  active: { label: 'Активний', variant: 'default' as const, color: 'text-green-600', className: 'bg-green-100 text-green-800 border-green-200' },
  inactive: { label: 'Неактивний', variant: 'secondary' as const, color: 'text-gray-500', className: '' },
  blocked: { label: 'Заблокований', variant: 'destructive' as const, color: 'text-red-600', className: '' }
};

const tierConfig = {
  regular: { label: 'Звичайний', variant: 'outline' as const, color: 'text-blue-600', icon: null },
  vip: { label: 'VIP', variant: 'default' as const, color: 'text-purple-600', icon: Crown },
  premium: { label: 'Преміум', variant: 'secondary' as const, color: 'text-orange-600', icon: null }
};

export function UserManagement({
  initialUsers = mockUsers,
  onUserAction,
  onRefresh,
  onExport,
  onAddUser
}: UserManagementProps) {
  const [users] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  
  const { toast } = useToast();

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesTier = tierFilter === 'all' || user.tier === tierFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && user.status === 'active') ||
                      (activeTab === 'vip' && user.tier === 'vip') ||
                      (activeTab === 'inactive' && user.status === 'inactive');
    
    return matchesSearch && matchesStatus && matchesTier && matchesTab;
  });

  // Статистика по вкладкам
  const tabCounts = {
    all: users.length,
    active: users.filter(u => u.status === 'active').length,
    vip: users.filter(u => u.tier === 'vip').length,
    inactive: users.filter(u => u.status === 'inactive').length
  };

  // Общая статистика
  const totalSpent = users.reduce((sum, user) => sum + user.totalSpent, 0);
  const totalOrders = users.reduce((sum, user) => sum + user.totalOrders, 0);
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const handleUserAction = (userId: string, action: string) => {
    const user = users.find(u => u.id === userId);
    
    if (onUserAction) {
      onUserAction(userId, action);
    } else {
      toast({
        title: "Дія виконана",
        description: `${action} для користувача ${user?.name}`,
      });
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      toast({
        title: "Оновлено",
        description: "Список користувачів оновлено",
      });
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      toast({
        title: "Експорт",
        description: "Розпочато експорт списку користувачів",
      });
    }
  };

  const handleAddUser = () => {
    if (onAddUser) {
      onAddUser();
    } else {
      toast({
        title: "Додавання користувача",
        description: "Відкриття форми додавання нового користувача",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return `₴${amount.toLocaleString()}`;
  };

  const getActivityStatus = (lastOrder: string) => {
    const lastOrderDate = new Date(lastOrder);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return { label: 'Активний', color: 'text-green-600' };
    if (diffDays <= 30) return { label: 'Помірний', color: 'text-yellow-600' };
    return { label: 'Неактивний', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Клієнти</h1>
          <p className="text-muted-foreground">
            Управління базою клієнтів та їх активністю
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
          <Button onClick={handleAddUser}>
            <Users className="h-4 w-4 mr-2" />
            Додати клієнта
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всього клієнтів</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% від минулого місяця
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загальний дохід</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Від усіх клієнтів
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Середній чек</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Math.round(avgOrderValue))}</div>
            <p className="text-xs text-muted-foreground">
              За замовлення
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP клієнти</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts.vip}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((tabCounts.vip / users.length) * 100)}% від загальної кількості
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
                  placeholder="Пошук за ім'ям, email або телефоном..."
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
                  <SelectItem value="active">Активні</SelectItem>
                  <SelectItem value="inactive">Неактивні</SelectItem>
                  <SelectItem value="blocked">Заблоковані</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Рівень" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі рівні</SelectItem>
                  <SelectItem value="regular">Звичайні</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="premium">Преміум</SelectItem>
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

      {/* Users Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Всі
            <Badge className="ml-2 text-xs">{tabCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Активні
            <Badge className="ml-2 text-xs bg-green-500">{tabCounts.active}</Badge>
          </TabsTrigger>
          <TabsTrigger value="vip">
            VIP
            <Badge className="ml-2 text-xs bg-purple-500">{tabCounts.vip}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Неактивні
            <Badge className="ml-2 text-xs bg-gray-500">{tabCounts.inactive}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Клієнт</TableHead>
                  <TableHead>Контакти</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Рівень</TableHead>
                  <TableHead>Замовлення</TableHead>
                  <TableHead>Витрачено</TableHead>
                  <TableHead>Активність</TableHead>
                  <TableHead>Реєстрація</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const activityStatus = getActivityStatus(user.lastOrder);
                  const TierIcon = tierConfig[user.tier as keyof typeof tierConfig]?.icon;
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.location}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusConfig[user.status as keyof typeof statusConfig]?.variant}
                          className={statusConfig[user.status as keyof typeof statusConfig]?.className}
                        >
                          {statusConfig[user.status as keyof typeof statusConfig]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tierConfig[user.tier as keyof typeof tierConfig]?.variant}>
                          {TierIcon && <TierIcon className="h-3 w-3 mr-1" />}
                          {tierConfig[user.tier as keyof typeof tierConfig]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{user.totalOrders}</p>
                          <p className="text-sm text-muted-foreground">
                            Остання: {user.lastOrder}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(user.totalSpent)}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${activityStatus.color}`}>
                          {activityStatus.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                          {user.registeredAt}
                        </div>
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
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'Переглянути профіль')}>
                              <Eye className="mr-2 h-4 w-4" />
                              Переглянути
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'Редагувати профіль')}>
                              <Edit className="mr-2 h-4 w-4" />
                              Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'Надіслати email')}>
                              <Mail className="mr-2 h-4 w-4" />
                              Написати
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'blocked' ? (
                              <DropdownMenuItem 
                                onClick={() => handleUserAction(user.id, 'Розблокувати')}
                                className="text-green-600"
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Розблокувати
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => handleUserAction(user.id, 'Заблокувати')}
                                className="text-red-600"
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Заблокувати
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Клієнтів не знайдено</h3>
                <p className="text-muted-foreground">
                  Спробуйте змінити фільтри або критерії пошуку
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UserManagement;