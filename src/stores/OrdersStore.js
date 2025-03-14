import { create } from "zustand";
import { persist } from "zustand/middleware";
import useCartStore from "./cartStore";

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      notifications: [],

      placeOrder: () => {
        set((state) => {
          const newOrder = {
            id: Date.now(),
            items: useCartStore.getState().cart,
            status: "Pending Payment",
            statusHistory: [
              { status: "Pending Payment", timestamp: new Date() },
            ],
          };

          return {
            orders: [...state.orders, newOrder],
            currentOrder: newOrder,
          };
        });
      },

      updateOrderStatus: (orderId, status) =>
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  statusHistory: [
                    ...order.statusHistory,
                    { status, timestamp: new Date() },
                  ],
                }
              : order
          );

          return {
            orders: updatedOrders,
            notifications: [
              ...state.notifications,
              {
                orderId,
                message: `Your order is now ${status}.`,
                timestamp: new Date(),
              },
            ],
          };
        }),

      markOrderAsPaid: (orderId) => {
        get().updateOrderStatus(orderId, "Payment Confirmed");
        useCartStore.getState().clearCart();
      },

      clearNotifications: () => set({ notifications: [] }),

      getCurrentOrders: () =>
        get().orders.filter((order) => order.status !== "Delivered"),
      getPreviousOrders: () =>
        get().orders.filter((order) => order.status === "Delivered"),
      getAllOrders: () => get().orders,
    }),
    { name: "order-store" }
  )
);

export default useOrderStore;
