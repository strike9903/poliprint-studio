"use client";

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Lock, Eye, EyeOff, Phone, UserPlus, LogIn, Zap, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function AuthDrawer({ isOpen, onClose, children }: AuthDrawerProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, isLoading, error, clearError } = useAuthStore();
  
  // Form state with validation
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = "Email обов'язковий";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Некоректний формат email";
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = "Пароль обов'язковий";
    } else if (formData.password.length < 6) {
      errors.password = "Пароль має бути не менше 6 символів";
    }
    
    // Registration-specific validation
    if (activeTab === 'register') {
      if (!formData.firstName) {
        errors.firstName = "Ім'я обов'язкове";
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Паролі не співпадають";
      }
      
      if (formData.phone && !/^\+380\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = "Некоректний формат телефону";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;

    try {
      if (activeTab === 'login') {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        });
      }
      
      toast({
        title: activeTab === 'register' ? "Реєстрація успішна! 🎉" : "Вхід успішний! 🎉",
        description: `Ласкаво просимо${activeTab === 'register' && formData.firstName ? `, ${formData.firstName}` : ''}!`,
      });
      
      // Clear form and close
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        confirmPassword: ''
      });
      setFormErrors({});
      onClose();
      
    } catch (error) {
      // Error is already handled by the store
      console.error('Auth error:', error);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    toast({
      title: `Вхід через ${provider === 'google' ? 'Google' : 'Facebook'}`,
      description: "Ця функція буде доступна незабаром",
    });
  };

  return (
    <>
      {children}
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-[400px] sm:w-[450px]">
          <SheetHeader>
            <SheetTitle className="text-xl font-heading flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              Швидкий вхід
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2 h-9">
                <TabsTrigger value="login" className="flex items-center gap-1.5 text-sm">
                  <LogIn className="w-3.5 h-3.5" />
                  Вхід
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-1.5 text-sm">
                  <UserPlus className="w-3.5 h-3.5" />
                  Реєстрація
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="login-email" className="text-xs">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-9 h-9 text-sm ${formErrors.email ? 'border-destructive' : ''}`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-xs text-destructive">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="login-password" className="text-xs">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-9 pr-9 h-9 text-sm ${formErrors.password ? 'border-destructive' : ''}`}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    {formErrors.password && (
                      <p className="text-xs text-destructive">{formErrors.password}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full h-10" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-foreground" />
                        <span className="text-sm">Вхід...</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium">Увійти</span>
                    )}
                  </Button>
                </form>

                {/* Social Login */}
                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-background px-2 text-xs text-muted-foreground">або</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleSocialLogin('google')} className="h-9">
                    <span className="text-sm">Google</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSocialLogin('facebook')} className="h-9">
                    <span className="text-sm">Facebook</span>
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="register-firstName" className="text-xs">Ім'я</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          id="register-firstName"
                          placeholder="Іван"
                          className={`pl-9 h-9 text-sm ${formErrors.firstName ? 'border-destructive' : ''}`}
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      {formErrors.firstName && (
                        <p className="text-xs text-destructive">{formErrors.firstName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="register-lastName" className="text-xs">Прізвище</Label>
                      <Input
                        id="register-lastName"
                        placeholder="Петренко"
                        className="h-9 text-sm"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="register-email" className="text-xs">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-9 h-9 text-sm ${formErrors.email ? 'border-destructive' : ''}`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-xs text-destructive">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="register-phone" className="text-xs">Телефон (необов'язково)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+380 XX XXX XX XX"
                        className={`pl-9 h-9 text-sm ${formErrors.phone ? 'border-destructive' : ''}`}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-destructive">{formErrors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="register-password" className="text-xs">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-9 pr-9 h-9 text-sm ${formErrors.password ? 'border-destructive' : ''}`}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    {formErrors.password && (
                      <p className="text-xs text-destructive">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="confirm-password" className="text-xs">Підтвердіть пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-9 h-9 text-sm ${formErrors.confirmPassword ? 'border-destructive' : ''}`}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-xs text-destructive">{formErrors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full h-10" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-foreground" />
                        <span className="text-sm">Реєстрація...</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium">Створити акаунт</span>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Compact Benefits */}
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-primary mb-2">
                <Zap className="w-3 h-3" />
                <span className="font-medium">Переваги акаунту</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <span>📁 Проекти</span>
                <span>💰 Знижки</span>
                <span>📋 Історія</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}