import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import cartAPI from '../services/cartAPI';
import { toast } from 'react-toastify';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSync: false,

      // Add item to cart
      addToCart: async (listing, quantity = 1) => {
        set({ isLoading: true });
        
        try {
          const { items } = get();
          const existingItem = items.find(item => item.listingId === listing._id);
          
          let newItems;
          if (existingItem) {
            newItems = items.map(item =>
              item.listingId === listing._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const cartItem = {
              listingId: listing._id,
              title: listing.title,
              pricePerUnit: listing.pricePerUnit,
              unitType: listing.unitType,
              quantity,
              farmerId: listing.farmerId,
              farmerName: listing.farmer?.name || 'Unknown Farmer',
              maxQuantity: listing.quantityAvailable,
              photos: listing.photos || [],
            };
            newItems = [...items, cartItem];
          }
          
          set({ items: newItems, isLoading: false });
          
          // Sync with server if authenticated
          try {
            await cartAPI.syncCart(newItems);
            set({ isSync: true });
          } catch (error) {
            console.error('Cart sync failed:', error);
            set({ isSync: false });
          }
          
          toast.success('Item added to cart');
        } catch (error) {
          set({ isLoading: false });
          toast.error('Failed to add item to cart');
          throw error;
        }
      },

      // Update item quantity
      updateQuantity: async (listingId, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          return get().removeFromCart(listingId);
        }
        
        const newItems = items.map(item =>
          item.listingId === listingId
            ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
            : item
        );
        
        set({ items: newItems });
        
        // Sync with server
        try {
          await cartAPI.syncCart(newItems);
          set({ isSync: true });
        } catch (error) {
          console.error('Cart sync failed:', error);
          set({ isSync: false });
        }
      },

      // Remove item from cart
      removeFromCart: async (listingId) => {
        const { items } = get();
        const newItems = items.filter(item => item.listingId !== listingId);
        
        set({ items: newItems });
        
        // Sync with server
        try {
          await cartAPI.syncCart(newItems);
          set({ isSync: true });
        } catch (error) {
          console.error('Cart sync failed:', error);
          set({ isSync: false });
        }
        
        toast.success('Item removed from cart');
      },

      // Clear entire cart
      clearCart: async () => {
        set({ items: [] });
        
        try {
          await cartAPI.clearCart();
          set({ isSync: true });
        } catch (error) {
          console.error('Cart clear failed:', error);
          set({ isSync: false });
        }
      },

      // Load cart from server
      loadCart: async () => {
        set({ isLoading: true });
        
        try {
          const cartData = await cartAPI.getCart();
          set({ 
            items: cartData.items || [], 
            isLoading: false,
            isSync: true 
          });
        } catch (error) {
          console.error('Failed to load cart:', error);
          set({ 
            isLoading: false,
            isSync: false 
          });
        }
      },

      // Get cart totals
      getTotals: () => {
        const { items } = get();
        
        const subtotal = items.reduce(
          (total, item) => total + (item.pricePerUnit * item.quantity),
          0
        );
        
        const totalItems = items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        
        return {
          subtotal: Math.round(subtotal * 100) / 100,
          totalItems,
          itemCount: items.length,
        };
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export { useCartStore };