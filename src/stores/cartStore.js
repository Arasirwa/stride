import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cart: [],

      addToCart: (product, size, quantity = 1) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item) => item.product.id === product.id && item.size === size
          );

          let newCart = [...state.cart];

          if (existingItemIndex >= 0) {
            newCart[existingItemIndex] = {
              ...newCart[existingItemIndex],
              quantity: newCart[existingItemIndex].quantity + quantity,
            };
          } else {
            newCart.push({ id: `${product.id}-${size}`, product, size, quantity });
          }

          return { cart: newCart };
        }),

      removeFromCart: (cartItemId) =>
        set((state) => ({ cart: state.cart.filter((item) => item.id !== cartItemId) })),

      updateCartItemQuantity: (cartItemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item)),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: "cart-store" }
  )
);

export default useCartStore;
