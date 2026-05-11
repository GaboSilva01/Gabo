import { create } from 'zustand';
import { Product } from '@/data/mockProducts';

export interface CartItem {
  product: Product;
  quantity: number;
  customOptions?: {
    wantsPersonalization: boolean;
    pantoneColor?: string;
    needsLid: boolean;
    lidType?: 'flex' | 'lisa';
    cuneteType?: 'alimenticio' | 'industrial';
    cajetinShape?: 'cuadrada' | 'rectangular' | 'hexagonal';
  };
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, customOptions?: CartItem['customOptions']) => void;
  removeItem: (productId: string, customOptions?: CartItem['customOptions']) => void;
  updateQuantity: (productId: string, quantity: number, customOptions?: CartItem['customOptions']) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  addItem: (product, quantity = 1, customOptions) =>
    set((state) => {
      // Si tiene personalización, lo tratamos como un item único por ahora o buscamos si existe uno exactamente igual
      if (customOptions) {
        // Podríamos buscar si existe otro igual con la misma personalización, pero para simplificar lo agregamos
        return { items: [...state.items, { product, quantity, customOptions }] };
      }
      
      const existingItem = state.items.find((item) => item.product.id === product.id && !item.customOptions);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id && !item.customOptions
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    }),
  removeItem: (productId, customOptions) =>
    set((state) => ({
      items: state.items.filter((item) => 
        !(item.product.id === productId && JSON.stringify(item.customOptions) === JSON.stringify(customOptions))
      ),
    })),
  updateQuantity: (productId, quantity, customOptions) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId && JSON.stringify(item.customOptions) === JSON.stringify(customOptions) 
          ? { ...item, quantity } 
          : item
      ),
    })),
  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
