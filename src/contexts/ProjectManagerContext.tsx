"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { configuratorBrain, type SmartSuggestion } from '@/components/configurator/ConfiguratorBrain';
import { type PrintConfiguration, type PriceBreakdown } from '@/components/configurator/RealTimePriceCalculator';
import { type FileValidationResult } from '@/components/configurator/AdvancedFileUploader';

// 🎨 Расширенная структура проекта печати
export interface ProjectFile {
  id: string;
  originalFile: File;
  url: string; // Object URL или base64
  validation: FileValidationResult;
  optimizations: ProjectFileOptimization[];
  metadata: {
    originalName: string;
    size: number;
    lastModified: Date;
  };
}

export interface ProjectFileOptimization {
  type: 'resize' | 'compress' | 'color-adjust' | 'dpi-enhance';
  description: string;
  appliedAt?: Date;
  originalValue: string;
  optimizedValue: string;
}

export interface ProjectPreview {
  thumbnailUrl: string;
  preview3DState?: {
    cameraPosition: [number, number, number];
    environment: string;
    lighting: number;
  };
  mockupUrls: string[]; // Разные ракурсы
}

export interface PriceSnapshot {
  timestamp: Date;
  totalPrice: number;
  breakdown: PriceBreakdown;
  configuration: PrintConfiguration;
  reason: 'created' | 'quantity-changed' | 'material-changed' | 'size-changed' | 'optimization-applied';
}

export interface ProjectCollaboration {
  shareUrl?: string;
  isShared: boolean;
  sharedAt?: Date;
  accessLevel: 'view' | 'comment' | 'edit';
}

// 🚀 Основная структура проекта
export interface CartProject {
  // Основная информация
  id: string;
  name: string; // Пользовательское имя или AI-предложение
  description?: string;
  
  // Конфигурация печати
  configuration: PrintConfiguration;
  
  // Файлы и активы
  files: ProjectFile[];
  preview: ProjectPreview;
  
  // AI и аналитика
  aiInsights: {
    originalSuggestion: SmartSuggestion;
    confidence: number;
    alternativeOptions: SmartSuggestion[];
    optimizationSuggestions: ProjectOptimization[];
  };
  
  // Ценообразование
  pricing: {
    currentPrice: number;
    originalPrice: number;
    breakdown: PriceBreakdown;
    history: PriceSnapshot[];
    savings: number;
  };
  
  // Статус и управление
  status: 'draft' | 'ready' | 'needs-attention' | 'processing' | 'completed';
  stage: 'uploaded' | 'configured' | 'previewed' | 'finalized';
  
  // Метаданные
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastViewedAt: Date;
    viewCount: number;
    version: number;
  };
  
  // Коллаборация
  collaboration: ProjectCollaboration;
  
  // Настройки пользователя
  userPreferences: {
    isFavorite: boolean;
    reminderDate?: Date;
    notes: string[];
    tags: string[];
  };
}

export interface ProjectOptimization {
  id: string;
  type: 'cost' | 'quality' | 'speed' | 'environmental';
  title: string;
  description: string;
  impact: {
    priceChange: number;
    qualityChange: 'improved' | 'maintained' | 'reduced';
    timeChange: number; // в днях
  };
  action: () => void;
  isApplied: boolean;
}

// 📊 Статистика и аналитика
export interface ProjectManagerStats {
  totalProjects: number;
  totalValue: number;
  averageProjectValue: number;
  statusDistribution: Record<CartProject['status'], number>;
  categoryDistribution: Record<string, number>;
  monthlySavings: number;
  favoriteProducts: string[];
}

// 🎛️ Настройки Project Manager
export interface ProjectManagerSettings {
  autoSave: boolean;
  autoOptimize: boolean;
  notifications: {
    priceDrops: boolean;
    newOptimizations: boolean;
    reminders: boolean;
  };
  defaults: {
    urgency: PrintConfiguration['urgency'];
    material: string;
    environment: string;
  };
  privacy: {
    allowAnalytics: boolean;
    shareInsights: boolean;
  };
}

// 🔄 State structure
interface ProjectManagerState {
  projects: CartProject[];
  settings: ProjectManagerSettings;
  stats: ProjectManagerStats;
  isLoading: boolean;
  lastSyncAt?: Date;
  
  // UI состояние
  ui: {
    isDrawerOpen: boolean;
    selectedProjectId?: string;
    expandedProjectIds: string[];
    viewMode: 'grid' | 'list' | 'compact';
    sortBy: 'newest' | 'oldest' | 'price-high' | 'price-low' | 'name' | 'status';
    filterBy: {
      status?: CartProject['status'];
      priceRange?: [number, number];
      categories?: string[];
    };
  };
}

// ⚡ Actions
type ProjectManagerAction =
  | { type: 'ADD_PROJECT'; payload: Omit<CartProject, 'id' | 'metadata' | 'pricing'> }
  | { type: 'REMOVE_PROJECT'; payload: { projectId: string } }
  | { type: 'UPDATE_PROJECT'; payload: { projectId: string; updates: Partial<CartProject> } }
  | { type: 'DUPLICATE_PROJECT'; payload: { projectId: string; newName?: string } }
  | { type: 'REORDER_PROJECTS'; payload: { projectIds: string[] } }
  
  | { type: 'UPDATE_CONFIGURATION'; payload: { projectId: string; configuration: PrintConfiguration } }
  | { type: 'APPLY_OPTIMIZATION'; payload: { projectId: string; optimizationId: string } }
  | { type: 'UPDATE_FILES'; payload: { projectId: string; files: ProjectFile[] } }
  
  | { type: 'SET_PROJECT_STATUS'; payload: { projectId: string; status: CartProject['status'] } }
  | { type: 'SET_PROJECT_NAME'; payload: { projectId: string; name: string } }
  | { type: 'TOGGLE_FAVORITE'; payload: { projectId: string } }
  | { type: 'ADD_NOTE'; payload: { projectId: string; note: string } }
  
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'SELECT_PROJECT'; payload: { projectId: string } }
  | { type: 'TOGGLE_PROJECT_EXPANDED'; payload: { projectId: string } }
  | { type: 'SET_VIEW_MODE'; payload: { viewMode: ProjectManagerState['ui']['viewMode'] } }
  | { type: 'SET_SORT'; payload: { sortBy: ProjectManagerState['ui']['sortBy'] } }
  | { type: 'SET_FILTER'; payload: { filterBy: ProjectManagerState['ui']['filterBy'] } }
  
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ProjectManagerSettings> }
  | { type: 'BULK_ACTION'; payload: { projectIds: string[]; action: 'delete' | 'archive' | 'favorite' } }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<ProjectManagerState> }
  | { type: 'CLEAR_ALL_PROJECTS' };

// 🏗️ Default state
const defaultSettings: ProjectManagerSettings = {
  autoSave: true,
  autoOptimize: true,
  notifications: {
    priceDrops: true,
    newOptimizations: true,
    reminders: true,
  },
  defaults: {
    urgency: 'standard',
    material: 'premium-canvas',
    environment: 'gallery',
  },
  privacy: {
    allowAnalytics: true,
    shareInsights: false,
  },
};

const initialState: ProjectManagerState = {
  projects: [],
  settings: defaultSettings,
  stats: {
    totalProjects: 0,
    totalValue: 0,
    averageProjectValue: 0,
    statusDistribution: { draft: 0, ready: 0, 'needs-attention': 0, processing: 0, completed: 0 },
    categoryDistribution: {},
    monthlySavings: 0,
    favoriteProducts: [],
  },
  isLoading: false,
  ui: {
    isDrawerOpen: false,
    expandedProjectIds: [],
    viewMode: 'grid',
    sortBy: 'newest',
    filterBy: {},
  },
};

// 🧮 Reducer
function projectManagerReducer(state: ProjectManagerState, action: ProjectManagerAction): ProjectManagerState {
  switch (action.type) {
    case 'ADD_PROJECT': {
      const newProject: CartProject = {
        ...action.payload,
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          lastViewedAt: new Date(),
          viewCount: 1,
          version: 1,
        },
        pricing: {
          currentPrice: 0,
          originalPrice: 0,
          breakdown: {} as PriceBreakdown,
          history: [],
          savings: 0,
        },
      };

      return {
        ...state,
        projects: [newProject, ...state.projects],
        stats: {
          ...state.stats,
          totalProjects: state.stats.totalProjects + 1,
        },
      };
    }

    case 'REMOVE_PROJECT': {
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload.projectId),
        ui: {
          ...state.ui,
          selectedProjectId: state.ui.selectedProjectId === action.payload.projectId 
            ? undefined 
            : state.ui.selectedProjectId,
          expandedProjectIds: state.ui.expandedProjectIds.filter(id => id !== action.payload.projectId),
        },
      };
    }

    case 'UPDATE_PROJECT': {
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? {
                ...project,
                ...action.payload.updates,
                metadata: {
                  ...project.metadata,
                  updatedAt: new Date(),
                  version: project.metadata.version + 1,
                },
              }
            : project
        ),
      };
    }

    case 'DUPLICATE_PROJECT': {
      const originalProject = state.projects.find(p => p.id === action.payload.projectId);
      if (!originalProject) return state;

      const duplicatedProject: CartProject = {
        ...originalProject,
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: action.payload.newName || `${originalProject.name} (копія)`,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          lastViewedAt: new Date(),
          viewCount: 1,
          version: 1,
        },
      };

      return {
        ...state,
        projects: [duplicatedProject, ...state.projects],
      };
    }

    case 'OPEN_DRAWER':
      return { ...state, ui: { ...state.ui, isDrawerOpen: true } };

    case 'CLOSE_DRAWER':
      return { ...state, ui: { ...state.ui, isDrawerOpen: false } };

    case 'SELECT_PROJECT':
      return { ...state, ui: { ...state.ui, selectedProjectId: action.payload.projectId } };

    case 'TOGGLE_PROJECT_EXPANDED': {
      const { projectId } = action.payload;
      const isExpanded = state.ui.expandedProjectIds.includes(projectId);
      
      return {
        ...state,
        ui: {
          ...state.ui,
          expandedProjectIds: isExpanded
            ? state.ui.expandedProjectIds.filter(id => id !== projectId)
            : [...state.ui.expandedProjectIds, projectId],
        },
      };
    }

    case 'SET_VIEW_MODE':
      return { ...state, ui: { ...state.ui, viewMode: action.payload.viewMode } };

    case 'SET_SORT':
      return { ...state, ui: { ...state.ui, sortBy: action.payload.sortBy } };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };

    case 'CLEAR_ALL_PROJECTS':
      return { ...state, projects: [], ui: { ...state.ui, selectedProjectId: undefined, expandedProjectIds: [] } };

    default:
      return state;
  }
}

// 🎯 Context
interface ProjectManagerContextValue {
  state: ProjectManagerState;
  
  // Основные действия с проектами
  addProject: (project: Omit<CartProject, 'id' | 'metadata' | 'pricing'>) => void;
  removeProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<CartProject>) => void;
  duplicateProject: (projectId: string, newName?: string) => void;
  
  // Работа с конфигурацией
  updateConfiguration: (projectId: string, configuration: PrintConfiguration) => void;
  applyOptimization: (projectId: string, optimizationId: string) => void;
  
  // UI действия
  openDrawer: () => void;
  closeDrawer: () => void;
  selectProject: (projectId: string) => void;
  toggleProjectExpanded: (projectId: string) => void;
  setViewMode: (viewMode: ProjectManagerState['ui']['viewMode']) => void;
  setSortBy: (sortBy: ProjectManagerState['ui']['sortBy']) => void;
  
  // Утилиты
  getTotalPrice: () => number;
  getProjectById: (projectId: string) => CartProject | undefined;
  getFilteredProjects: () => CartProject[];
  clearAllProjects: () => void;
}

const ProjectManagerContext = createContext<ProjectManagerContextValue | undefined>(undefined);

// 🎪 Provider component
export function ProjectManagerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectManagerReducer, initialState);

  // 💾 Persistence with localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('projectManager');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
      } catch (error) {
        console.error('Error loading project manager state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projectManager', JSON.stringify(state));
  }, [state]);

  // 🎯 Action creators
  const addProject = useCallback((project: Omit<CartProject, 'id' | 'metadata' | 'pricing'>) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  }, []);

  const removeProject = useCallback((projectId: string) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: { projectId } });
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<CartProject>) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { projectId, updates } });
  }, []);

  const duplicateProject = useCallback((projectId: string, newName?: string) => {
    dispatch({ type: 'DUPLICATE_PROJECT', payload: { projectId, newName } });
  }, []);

  const updateConfiguration = useCallback((projectId: string, configuration: PrintConfiguration) => {
    dispatch({ type: 'UPDATE_CONFIGURATION', payload: { projectId, configuration } });
  }, []);

  const applyOptimization = useCallback((projectId: string, optimizationId: string) => {
    dispatch({ type: 'APPLY_OPTIMIZATION', payload: { projectId, optimizationId } });
  }, []);

  const openDrawer = useCallback(() => dispatch({ type: 'OPEN_DRAWER' }), []);
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), []);
  const selectProject = useCallback((projectId: string) => {
    dispatch({ type: 'SELECT_PROJECT', payload: { projectId } });
  }, []);

  const toggleProjectExpanded = useCallback((projectId: string) => {
    dispatch({ type: 'TOGGLE_PROJECT_EXPANDED', payload: { projectId } });
  }, []);

  const setViewMode = useCallback((viewMode: ProjectManagerState['ui']['viewMode']) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: { viewMode } });
  }, []);

  const setSortBy = useCallback((sortBy: ProjectManagerState['ui']['sortBy']) => {
    dispatch({ type: 'SET_SORT', payload: { sortBy } });
  }, []);

  // 🧮 Computed values
  const getTotalPrice = useCallback(() => {
    return state.projects.reduce((total, project) => total + project.pricing.currentPrice, 0);
  }, [state.projects]);

  const getProjectById = useCallback((projectId: string) => {
    return state.projects.find(p => p.id === projectId);
  }, [state.projects]);

  const getFilteredProjects = useCallback(() => {
    let filtered = [...state.projects];

    // Apply filters
    if (state.ui.filterBy.status) {
      filtered = filtered.filter(p => p.status === state.ui.filterBy.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.ui.sortBy) {
        case 'newest':
          return new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime();
        case 'oldest':
          return new Date(a.metadata.createdAt).getTime() - new Date(b.metadata.createdAt).getTime();
        case 'price-high':
          return b.pricing.currentPrice - a.pricing.currentPrice;
        case 'price-low':
          return a.pricing.currentPrice - b.pricing.currentPrice;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.projects, state.ui.filterBy, state.ui.sortBy]);

  const clearAllProjects = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_PROJECTS' });
  }, []);

  const contextValue: ProjectManagerContextValue = {
    state,
    addProject,
    removeProject,
    updateProject,
    duplicateProject,
    updateConfiguration,
    applyOptimization,
    openDrawer,
    closeDrawer,
    selectProject,
    toggleProjectExpanded,
    setViewMode,
    setSortBy,
    getTotalPrice,
    getProjectById,
    getFilteredProjects,
    clearAllProjects,
  };

  return (
    <ProjectManagerContext.Provider value={contextValue}>
      {children}
    </ProjectManagerContext.Provider>
  );
}

// 🪝 Custom hook
export function useProjectManager() {
  const context = useContext(ProjectManagerContext);
  if (context === undefined) {
    throw new Error('useProjectManager must be used within a ProjectManagerProvider');
  }
  return context;
}

// 🎯 Специализированные хуки
export function useProject(projectId: string) {
  const { getProjectById, updateProject } = useProjectManager();
  
  return {
    project: getProjectById(projectId),
    updateProject: (updates: Partial<CartProject>) => updateProject(projectId, updates),
  };
}

export function useProjectStats() {
  const { state } = useProjectManager();
  
  return {
    stats: state.stats,
    totalPrice: state.projects.reduce((sum, p) => sum + p.pricing.currentPrice, 0),
    projectCount: state.projects.length,
    readyProjects: state.projects.filter(p => p.status === 'ready').length,
    draftProjects: state.projects.filter(p => p.status === 'draft').length,
  };
}