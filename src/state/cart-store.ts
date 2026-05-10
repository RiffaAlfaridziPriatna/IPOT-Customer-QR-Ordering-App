import { create } from 'zustand';
import {
  CartItem,
  MenuItem,
  createCartItem,
  calculateCartItemPrice,
  generateCartItemKey,
} from '@domain/entities';
import { CustomizationSelection } from '@domain/value-objects';
import { Money } from '@domain/value-objects/Money';

interface CartState {
  items: Map<string, CartItem>;
  tableId: string | null;
  
  setTableId: (tableId: string) => void;
  
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    customizations: CustomizationSelection[]
  ) => void;
  
  removeItem: (
    menuItemId: number,
    customizations: CustomizationSelection[]
  ) => void;
  
  updateQuantity: (
    menuItemId: number,
    customizations: CustomizationSelection[],
    quantity: number
  ) => void;
  
  updateCustomizations: (
    menuItemId: number,
    oldCustomizations: CustomizationSelection[],
    newCustomizations: CustomizationSelection[]
  ) => void;
  
  clearCart: () => void;
  
  getItemCount: () => number;
  
  getSubtotal: () => Money;
  
  getCartItems: () => CartItem[];
}

export const useCartStore = create<CartState>((set, get) => ({
  items: new Map(),
  tableId: null,

  setTableId: (tableId: string) => {
    set({ tableId });
  },

  addItem: (
    menuItem: MenuItem,
    quantity: number,
    customizations: CustomizationSelection[]
  ) => {
    const key = generateCartItemKey(menuItem.id, customizations);
    const items = new Map(get().items);
    
    const existingItem = items.get(key);
    if (existingItem) {
      items.set(key, {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
      });
    } else {
      items.set(key, createCartItem(menuItem, quantity, customizations));
    }
    
    set({ items });
  },

  removeItem: (
    menuItemId: number,
    customizations: CustomizationSelection[]
  ) => {
    const key = generateCartItemKey(menuItemId, customizations);
    const items = new Map(get().items);
    items.delete(key);
    set({ items });
  },

  updateQuantity: (
    menuItemId: number,
    customizations: CustomizationSelection[],
    quantity: number
  ) => {
    const key = generateCartItemKey(menuItemId, customizations);
    const items = new Map(get().items);
    const item = items.get(key);
    
    if (item) {
      if (quantity <= 0) {
        items.delete(key);
      } else {
        items.set(key, { ...item, quantity });
      }
      set({ items });
    }
  },

  updateCustomizations: (
    menuItemId: number,
    oldCustomizations: CustomizationSelection[],
    newCustomizations: CustomizationSelection[]
  ) => {
    const oldKey = generateCartItemKey(menuItemId, oldCustomizations);
    const newKey = generateCartItemKey(menuItemId, newCustomizations);
    const items = new Map(get().items);
    const item = items.get(oldKey);
    
    if (item) {
      items.delete(oldKey);
      items.set(newKey, {
        ...item,
        customizations: newCustomizations,
      });
      set({ items });
    }
  },

  clearCart: () => {
    set({ items: new Map(), tableId: null });
  },

  getItemCount: () => {
    const items = get().items;
    return Array.from(items.values()).reduce(
      (total, item) => total + item.quantity,
      0
    );
  },

  getSubtotal: () => {
    const items = get().items;
    const cartItems = Array.from(items.values());
    
    if (cartItems.length === 0) {
      return new Money(0);
    }
    
    return cartItems.reduce((total, item) => {
      return total.add(calculateCartItemPrice(item));
    }, new Money(0));
  },

  getCartItems: () => {
    return Array.from(get().items.values());
  },
}));
