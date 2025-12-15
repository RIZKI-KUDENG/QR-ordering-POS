import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  uniqueId: string; 
  productId: number;
  name: string;
  price: number;
  quantity: number;
  selectedOptions: { id: number; name: string; extraPrice: number }[];
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'uniqueId'>) => void;
  removeItem: (uniqueId: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        const optionIds = newItem.selectedOptions.map(o => o.id).sort().join('-');
        const uniqueId = `${newItem.productId}-${optionIds}`;

        set((state) => {
          const existing = state.items.find((i) => i.uniqueId === uniqueId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.uniqueId === uniqueId ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...newItem, uniqueId, quantity: 1 }] };
        });
      },

      removeItem: (uniqueId) =>
        set((state) => ({ items: state.items.filter((i) => i.uniqueId !== uniqueId) })),

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        return get().items.reduce((total, item) => {
           const itemTotal = item.price + item.selectedOptions.reduce((sum, opt) => sum + opt.extraPrice, 0);
           return total + (itemTotal * item.quantity);
        }, 0);
      }
    }),
    { name: 'cart-storage' } 
  )
);