"use client";

import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MoreVertical,
  Eye,
  Edit3,
  Copy,
  Heart,
  Trash2,
  Download,
  Share2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader,
  Star,
  Zap,
  FileText,
  Camera,
  Palette,
  Settings,
  Play,
  ArrowRight
} from 'lucide-react';

import { type CartProject, useProjectManager } from '@/contexts/ProjectManagerContext';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: CartProject;
  viewMode: 'grid' | 'list' | 'compact';
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
}

export function ProjectCard({ 
  project, 
  viewMode, 
  isSelected = false, 
  onSelect,
  onClick 
}: ProjectCardProps) {
  const { removeProject, updateProject, duplicateProject } = useProjectManager();
  const [isHovered, setIsHovered] = useState(false);

  // 🎨 Status configuration
  const statusConfig = {
    draft: {
      label: 'Чернетка',
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: FileText,
      description: 'Потребує завершення'
    },
    ready: {
      label: 'Готовий',
      color: 'bg-success/10 text-success border-success/20',
      icon: CheckCircle,
      description: 'Готовий до друку'
    },
    'needs-attention': {
      label: 'Потребує уваги',
      color: 'bg-warning/10 text-warning border-warning/20',
      icon: AlertTriangle,
      description: 'Виправте помилки'
    },
    processing: {
      label: 'Обробляється',
      color: 'bg-primary/10 text-primary border-primary/20',
      icon: Loader,
      description: 'В роботі'
    },
    completed: {
      label: 'Завершено',
      color: 'bg-success/10 text-success border-success/20',
      icon: CheckCircle,
      description: 'Проект завершено'
    }
  };

  const currentStatus = statusConfig[project.status];

  // 📊 Progress calculation
  const progress = (() => {
    const stages = ['uploaded', 'configured', 'previewed', 'finalized'];
    const currentStageIndex = stages.indexOf(project.stage);
    return ((currentStageIndex + 1) / stages.length) * 100;
  })();

  // 🎯 Product type emoji
  const productEmoji = {
    canvas: '🖼️',
    acrylic: '💎',
    'business-cards': '💼',
    poster: '🪧',
    banner: '🏷️'
  }[project.configuration.product.type] || '📦';

  // 🔄 Action handlers
  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    updateProject(project.id, {
      userPreferences: {
        ...project.userPreferences,
        isFavorite: !project.userPreferences.isFavorite
      }
    });
  }, [project.id, project.userPreferences, updateProject]);

  const handleDuplicate = useCallback(() => {
    duplicateProject(project.id);
  }, [project.id, duplicateProject]);

  const handleDelete = useCallback(() => {
    if (confirm('Ви впевнені, що хочете видалити цей проект?')) {
      removeProject(project.id);
    }
  }, [project.id, removeProject]);

  const handleEdit = useCallback(() => {
    // Navigate to configurator with this project
    onClick?.();
  }, [onClick]);

  // 🎨 Card content based on view mode
  if (viewMode === 'list') {
    return (
      <Card 
        className={cn(
          "group cursor-pointer transition-all hover:shadow-md border",
          isSelected && "ring-2 ring-primary ring-offset-2",
          project.userPreferences.isFavorite && "border-warning/40"
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Selection checkbox */}
            {onSelect && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Preview thumbnail */}
            <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              {project.preview.thumbnailUrl ? (
                <img 
                  src={project.preview.thumbnailUrl} 
                  alt={project.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-2xl">{productEmoji}</span>
              )}
            </div>

            {/* Project info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{project.name}</h3>
                    {project.userPreferences.isFavorite && (
                      <Star className="w-4 h-4 text-warning fill-warning" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{project.configuration.product.type}</span>
                    <span>•</span>
                    <span>{project.configuration.dimensions.width}×{project.configuration.dimensions.height} см</span>
                    <span>•</span>
                    <span>{format(new Date(project.metadata.updatedAt), 'dd MMM', { locale: uk })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={currentStatus.color} variant="outline">
                      <currentStatus.icon className="w-3 h-3 mr-1" />
                      {currentStatus.label}
                    </Badge>
                    
                    <div className="text-lg font-bold text-primary">
                      {project.pricing.currentPrice.toFixed(0)} ₴
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleFavorite}
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-opacity",
                      project.userPreferences.isFavorite && "opacity-100"
                    )}
                  >
                    <Heart className={cn(
                      "w-4 h-4",
                      project.userPreferences.isFavorite && "fill-warning text-warning"
                    )} />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Дії</DropdownMenuLabel>
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Редагувати
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDuplicate}>
                        <Copy className="w-4 h-4 mr-2" />
                        Дублювати
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Поділитися
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Видалити
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border",
        isSelected && "ring-2 ring-primary ring-offset-2",
        project.userPreferences.isFavorite && "border-warning/40"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {onSelect && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate flex items-center gap-2">
                {project.name}
                {project.userPreferences.isFavorite && (
                  <Star className="w-4 h-4 text-warning fill-warning" />
                )}
              </CardTitle>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "h-8 w-8 transition-opacity",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Дії з проектом</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit3 className="w-4 h-4 mr-2" />
                Редагувати
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Переглянути 3D
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Дублювати
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Завантажити превью
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Поділитися
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Видалити
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status and progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge className={currentStatus.color} variant="outline">
              <currentStatus.icon className="w-3 h-3 mr-1" />
              {currentStatus.label}
            </Badge>
            
            <span className="text-xs text-muted-foreground">
              {Math.round(progress)}% готовості
            </span>
          </div>
          
          <Progress value={progress} className="h-1.5" />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-4">
        {/* Preview */}
        <div className="aspect-square bg-gradient-primary rounded-lg flex items-center justify-center relative overflow-hidden group">
          {project.preview.thumbnailUrl ? (
            <>
              <img 
                src={project.preview.thumbnailUrl} 
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open 3D preview
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  3D Превью
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <span className="text-4xl mb-2 block">{productEmoji}</span>
              <p className="text-sm text-muted-foreground">Превью недоступне</p>
            </div>
          )}

          {/* Favorite button overlay */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={cn(
              "absolute top-2 right-2 h-8 w-8 transition-opacity",
              project.userPreferences.isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            <Heart className={cn(
              "w-4 h-4",
              project.userPreferences.isFavorite && "fill-warning text-warning"
            )} />
          </Button>
        </div>

        {/* Project details */}
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-1 mb-1">
              {productEmoji}
              <span>{project.configuration.product.type}</span>
              <span className="text-xs">•</span>
              <span>{project.configuration.dimensions.width}×{project.configuration.dimensions.height} см</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Оновлено {format(new Date(project.metadata.updatedAt), 'dd MMM', { locale: uk })}</span>
            </div>
          </div>

          {/* AI insights */}
          {project.aiInsights.confidence > 80 && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Zap className="w-3 h-3" />
              <span>AI впевнений на {project.aiInsights.confidence}%</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-primary">
                {project.pricing.currentPrice.toFixed(0)} ₴
              </div>
              {project.pricing.savings > 0 && (
                <div className="text-xs text-success">
                  Економія {project.pricing.savings.toFixed(0)} ₴
                </div>
              )}
            </div>

            {/* Quick action button */}
            <Button 
              size="sm" 
              className="btn-hero"
              onClick={(e) => {
                e.stopPropagation();
                if (project.status === 'ready') {
                  // Go to checkout
                } else {
                  // Continue editing
                  handleEdit();
                }
              }}
            >
              {project.status === 'ready' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  В кошик
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Продовжити
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="font-medium">{project.files.length}</div>
            <div className="text-muted-foreground">Файлів</div>
          </div>
          
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="font-medium">{project.metadata.viewCount}</div>
            <div className="text-muted-foreground">Переглядів</div>
          </div>
          
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="font-medium">v{project.metadata.version}</div>
            <div className="text-muted-foreground">Версія</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}