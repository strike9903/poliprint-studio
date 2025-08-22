"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface FavoriteItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  href: string;
  image: string;
  addedAt: number;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const addToFavorites = (item: Omit<FavoriteItem, 'addedAt'>) => {
    const favoriteItem: FavoriteItem = {
      ...item,
      addedAt: Date.now()
    };

    setFavorites(prev => {
      // Check if already in favorites
      if (prev.some(fav => fav.id === item.id)) {
        return prev;
      }
      
      toast({
        title: "Додано в обране ❤️",
        description: `${item.title} додано до улюблених`,
      });
      
      return [favoriteItem, ...prev];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => {
      const item = prev.find(fav => fav.id === id);
      if (item) {
        toast({
          title: "Видалено з обраного",
          description: `${item.title} видалено з улюблених`,
        });
      }
      return prev.filter(fav => fav.id !== id);
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  const clearFavorites = () => {
    if (favorites.length > 0) {
      setFavorites([]);
      toast({
        title: "Обране очищено",
        description: "Всі улюблені товари видалені",
      });
    }
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    totalFavorites: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
