import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, config: Record<string, any>, quantity?: number) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, config, quantity = 1) => {
        const existingItemIndex = get().items.findIndex(
          item => 
            item.productId === product.id && 
            JSON.stringify(item.config) === JSON.stringify(config)
        );

        set(state => {
          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            updatedItems[existingItemIndex].totalPrice = 
              updatedItems[existingItemIndex].unitPrice * updatedItems[existingItemIndex].quantity;
            return { items: updatedItems };
          } else {
            const newItem: CartItem = {
              id: Math.random().toString(36).substr(2, 9),
              productId: product.id,
              config,
              quantity,
              unitPrice: product.basePrice, // TODO: calculate with config
              totalPrice: product.basePrice * quantity,
              fileUploads: []
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      updateItem: (id, updates) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id 
              ? { 
                  ...item, 
                  ...updates,
                  totalPrice: (updates.unitPrice || item.unitPrice) * (updates.quantity || item.quantity)
                }
              : item
          )
        }));
      },

      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      }
    }),
    {
      name: 'poliprint-cart',
      partialize: (state) => ({ items: state.items })
    }
  )
);