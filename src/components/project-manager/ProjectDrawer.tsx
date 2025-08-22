"use client";

import { useState, useMemo } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

import { 
  FolderOpen,
  Search, 
  Filter,
  MoreVertical,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Copy,
  Trash2,
  Settings,
  Download,
  Share2,
  Eye,
  Grid3X3,
  List,
  SortAsc,
  Star,
  Zap,
  BarChart3,
  Target
} from 'lucide-react';

import { useProjectManager, type CartProject } from '@/contexts/ProjectManagerContext';
import { ProjectCard } from './ProjectCard';

interface ProjectDrawerProps {
  children: React.ReactNode;
}

export function ProjectDrawer({ children }: ProjectDrawerProps) {
  const { 
    state, 
    openDrawer, 
    closeDrawer, 
    setViewMode, 
    setSortBy,
    clearAllProjects,
    getTotalPrice 
  } = useProjectManager();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  // 📊 Computed statistics
  const stats = useMemo(() => {
    const projects = state.projects;
    const totalValue = getTotalPrice();
    const readyProjects = projects.filter(p => p.status === 'ready').length;
    const draftProjects = projects.filter(p => p.status === 'draft').length;
    const needsAttentionProjects = projects.filter(p => p.status === 'needs-attention').length;
    
    return {
      totalProjects: projects.length,
      totalValue,
      readyProjects,
      draftProjects,
      needsAttentionProjects,
      averageProjectValue: projects.length > 0 ? totalValue / projects.length : 0,
    };
  }, [state.projects, getTotalPrice]);

  // 🔍 Filtered projects based on search
  const filteredProjects = useMemo(() => {
    let projects = state.projects;
    
    if (searchQuery) {
      projects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.configuration.product.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return projects;
  }, [state.projects, searchQuery]);

  // 🎯 Status-based project groups
  const projectGroups = useMemo(() => {
    return {
      ready: filteredProjects.filter(p => p.status === 'ready'),
      draft: filteredProjects.filter(p => p.status === 'draft'),
      'needs-attention': filteredProjects.filter(p => p.status === 'needs-attention'),
      processing: filteredProjects.filter(p => p.status === 'processing'),
    };
  }, [filteredProjects]);

  // 📈 Progress calculation
  const completionProgress = useMemo(() => {
    if (stats.totalProjects === 0) return 0;
    return (stats.readyProjects / stats.totalProjects) * 100;
  }, [stats.totalProjects, stats.readyProjects]);

  // 🎨 Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <FolderOpen className="w-12 h-12 text-primary" />
      </div>
      
      <h3 className="text-xl font-heading font-semibold mb-2">
        Ваші проекти з'являться тут
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-sm">
        Створіть свій перший проект за допомогою AI-конфігуратора або оберіть товар з каталогу
      </p>
      
      <div className="space-y-3 w-full max-w-xs">
        <Button className="w-full btn-hero" onClick={closeDrawer}>
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Конфігуратор
        </Button>
        
        <Button variant="outline" className="w-full" onClick={closeDrawer}>
          Переглянути каталог
        </Button>
      </div>
    </div>
  );

  return (
    <Sheet open={state.ui.isDrawerOpen} onOpenChange={(open) => open ? openDrawer() : closeDrawer()}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-[600px] p-0 flex flex-col">
        {/* 📊 Header with stats */}
        <SheetHeader className="p-6 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-2xl font-heading flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                Мої проекти
              </SheetTitle>
              
              <SheetDescription className="mt-1">
                {stats.totalProjects > 0 
                  ? `${stats.totalProjects} проектів • ${stats.totalValue.toFixed(0)} ₴`
                  : 'Керуйте своїми проектами друку'
                }
              </SheetDescription>
            </div>

            {stats.totalProjects > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Дії</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Експорт PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Поділитися списком
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Очистити все
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* 📈 Quick stats */}
          {stats.totalProjects > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-success/5 rounded-lg border border-success/20">
                <div className="text-lg font-bold text-success">{stats.readyProjects}</div>
                <div className="text-xs text-muted-foreground">Готові</div>
              </div>
              
              <div className="text-center p-3 bg-warning/5 rounded-lg border border-warning/20">
                <div className="text-lg font-bold text-warning">{stats.draftProjects}</div>
                <div className="text-xs text-muted-foreground">Чернетки</div>
              </div>
              
              <div className="text-center p-3 bg-accent/5 rounded-lg border border-accent/20">
                <div className="text-lg font-bold text-accent">{stats.needsAttentionProjects}</div>
                <div className="text-xs text-muted-foreground">Потребують уваги</div>
              </div>
            </div>
          )}

          {/* 🎯 Progress bar */}
          {stats.totalProjects > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Прогрес готовності</span>
                <span className="font-medium">{Math.round(completionProgress)}%</span>
              </div>
              <Progress value={completionProgress} className="h-2" />
            </div>
          )}
        </SheetHeader>

        {stats.totalProjects === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* 🔍 Search and filters */}
            <div className="px-6 pb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Пошук проектів..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* View mode toggle */}
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={state.ui.viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={state.ui.viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Sort dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SortAsc className="w-4 h-4 mr-2" />
                      Сортування
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('newest')}>
                      <Clock className="w-4 h-4 mr-2" />
                      Нові спочатку
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                      <Clock className="w-4 h-4 mr-2" />
                      Старі спочатку
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('price-high')}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Дорогі спочатку
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('price-low')}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Дешеві спочатку
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('name')}>
                      <Target className="w-4 h-4 mr-2" />
                      За назвою
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* 📋 Project list */}
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="all" className="h-full flex flex-col">
                <div className="px-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" className="text-xs">
                      Всі ({stats.totalProjects})
                    </TabsTrigger>
                    <TabsTrigger value="ready" className="text-xs">
                      Готові ({stats.readyProjects})
                    </TabsTrigger>
                    <TabsTrigger value="draft" className="text-xs">
                      Чернетки ({stats.draftProjects})
                    </TabsTrigger>
                    <TabsTrigger value="attention" className="text-xs">
                      Увага ({stats.needsAttentionProjects})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="flex-1 px-6">
                  <TabsContent value="all" className="mt-4 space-y-4">
                    {filteredProjects.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          {searchQuery ? 'Проекти не знайдені' : 'Немає проектів'}
                        </p>
                      </div>
                    ) : (
                      <div className={
                        state.ui.viewMode === 'grid' 
                          ? 'grid grid-cols-1 gap-4' 
                          : 'space-y-2'
                      }>
                        {filteredProjects.map((project) => (
                          <ProjectCard 
                            key={project.id} 
                            project={project}
                            viewMode={state.ui.viewMode}
                            isSelected={selectedProjects.includes(project.id)}
                            onSelect={(selected) => {
                              if (selected) {
                                setSelectedProjects(prev => [...prev, project.id]);
                              } else {
                                setSelectedProjects(prev => prev.filter(id => id !== project.id));
                              }
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="ready" className="mt-4 space-y-4">
                    <div className={
                      state.ui.viewMode === 'grid' 
                        ? 'grid grid-cols-1 gap-4' 
                        : 'space-y-2'
                    }>
                      {projectGroups.ready.map((project) => (
                        <ProjectCard 
                          key={project.id} 
                          project={project}
                          viewMode={state.ui.viewMode}
                          isSelected={selectedProjects.includes(project.id)}
                          onSelect={(selected) => {
                            if (selected) {
                              setSelectedProjects(prev => [...prev, project.id]);
                            } else {
                              setSelectedProjects(prev => prev.filter(id => id !== project.id));
                            }
                          }}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="draft" className="mt-4 space-y-4">
                    <div className={
                      state.ui.viewMode === 'grid' 
                        ? 'grid grid-cols-1 gap-4' 
                        : 'space-y-2'
                    }>
                      {projectGroups.draft.map((project) => (
                        <ProjectCard 
                          key={project.id} 
                          project={project}
                          viewMode={state.ui.viewMode}
                          isSelected={selectedProjects.includes(project.id)}
                          onSelect={(selected) => {
                            if (selected) {
                              setSelectedProjects(prev => [...prev, project.id]);
                            } else {
                              setSelectedProjects(prev => prev.filter(id => id !== project.id));
                            }
                          }}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="attention" className="mt-4 space-y-4">
                    {projectGroups['needs-attention'].length === 0 ? (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Чудово! Всі проекти в порядку.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className={
                        state.ui.viewMode === 'grid' 
                          ? 'grid grid-cols-1 gap-4' 
                          : 'space-y-2'
                      }>
                        {projectGroups['needs-attention'].map((project) => (
                          <ProjectCard 
                            key={project.id} 
                            project={project}
                            viewMode={state.ui.viewMode}
                            isSelected={selectedProjects.includes(project.id)}
                            onSelect={(selected) => {
                              if (selected) {
                                setSelectedProjects(prev => [...prev, project.id]);
                              } else {
                                setSelectedProjects(prev => prev.filter(id => id !== project.id));
                              }
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>

            {/* 💰 Footer with total and actions */}
            <div className="border-t p-6 space-y-4">
              {/* Total summary */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Загальна вартість</div>
                  <div className="text-2xl font-bold text-primary">
                    {stats.totalValue.toFixed(0)} ₴
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Середня ціна</div>
                  <div className="text-lg font-semibold">
                    {stats.averageProjectValue.toFixed(0)} ₴
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  size="lg" 
                  className="btn-hero"
                  disabled={stats.readyProjects === 0}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Оформити ({stats.readyProjects})
                </Button>
                
                <Button variant="outline" size="lg" onClick={closeDrawer}>
                  <Plus className="w-4 h-4 mr-2" />
                  Новий проект
                </Button>
              </div>

              {/* Quick actions for selected */}
              {selectedProjects.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <span className="text-sm font-medium">
                    {selectedProjects.length} обрано
                  </span>
                  <div className="flex gap-2 ml-auto">
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}