import { create } from "zustand";
import { persist } from "zustand/middleware";
import useCartStore from "./cartStore";

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      notifications: [],
      
      // Place a new order - now with payment details included and initial status
      placeOrder: ({ items, totalPrice, shipping, tax, paymentMethod, paymentId, initialStatus = "Pending Payment" }) => {
        if (!items || items.length === 0) return;

        const orderDate = new Date();
        const newOrder = {
          id: Date.now(),
          items,
          totalPrice, 
          shipping,
          tax,
          status: initialStatus,
          customerInfo: {
            name: "John Doe", // In a real app, this would come from user profile
            email: "john.doe@example.com",
            phone: "+254 700 123 456",
            address: "123 Main St, Nairobi, Kenya"
          },
          statusHistory: [
            { 
              status: initialStatus, 
              timestamp: orderDate,
              notes: initialStatus === "Payment Confirmed" 
                ? `Order placed with confirmed payment via ${paymentMethod}. Transaction ID: ${paymentId}`
                : "Order placed, awaiting payment" 
            }
          ],
          paymentMethod, // Will be null if order is placed without payment
          paymentId,     // Will be null if order is placed without payment
          notes: []
        };

        set((state) => ({
          orders: [...state.orders, newOrder],
          currentOrder: newOrder,
          notifications: [
            ...state.notifications,
            {
              orderId: newOrder.id,
              message: initialStatus === "Payment Confirmed"
                ? `New order #${newOrder.id} has been placed and paid.`
                : `New order #${newOrder.id} has been placed.`,
              timestamp: orderDate,
              isRead: false,
              type: initialStatus === "Payment Confirmed" ? "payment" : "order"
            }
          ]
        }));
        
        // Clear cart after order is placed with payment
        if (initialStatus === "Payment Confirmed") {
          useCartStore.getState().clearCart();
        }
      },

      // Update order status with optional note
      updateOrderStatus: (orderId, status, note = "") => {
        const timestamp = new Date();
        
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  statusHistory: [
                    ...order.statusHistory,
                    { 
                      status, 
                      timestamp,
                      notes: note || `Status updated to ${status}` 
                    }
                  ]
                }
              : order
          );

          let notificationType = "order";
          if (status === "Shipped") notificationType = "shipping";
          if (status === "Delivered") notificationType = "delivery";
          if (status === "Cancelled") notificationType = "cancellation";

          return {
            orders: updatedOrders,
            notifications: [
              ...state.notifications,
              {
                orderId,
                message: `Order #${orderId} is now ${status}.${note ? ` Note: ${note}` : ''}`,
                timestamp,
                isRead: false,
                type: notificationType
              }
            ]
          };
        });
      },

      // Add a note to an order
      addOrderNote: (orderId, text, isCustomerVisible = false) => {
        const timestamp = new Date();
        
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  notes: [
                    ...order.notes,
                    { text, timestamp, isCustomerVisible, author: "Admin" }
                  ]
                }
              : order
          );

          return {
            orders: updatedOrders
          };
        });
      },

      // Mark notification as read
      markNotificationAsRead: (index) => {
        set((state) => {
          const updatedNotifications = [...state.notifications];
          if (updatedNotifications[index]) {
            updatedNotifications[index] = {
              ...updatedNotifications[index],
              isRead: true
            };
          }
          return { notifications: updatedNotifications };
        });
      },

      // Mark all notifications as read
      markAllNotificationsAsRead: () => {
        set((state) => {
          const updatedNotifications = state.notifications.map(notification => ({
            ...notification,
            isRead: true
          }));
          return { notifications: updatedNotifications };
        });
      },
      
      // Remove notification
      removeNotification: (index) => {
        set((state) => {
          const updatedNotifications = [...state.notifications];
          updatedNotifications.splice(index, 1);
          return { notifications: updatedNotifications };
        });
      },

      // Clear all notifications
      clearNotifications: () => set({ notifications: [] }),

      // Get orders with different status filters
      getCurrentOrders: () => get().orders.filter(order => order.status !== "Delivered" && order.status !== "Cancelled"),
      getPendingPaymentOrders: () => get().orders.filter(order => order.status === "Pending Payment"),
      getProcessingOrders: () => get().orders.filter(order => ["Payment Confirmed", "Processing"].includes(order.status)),
      getShippedOrders: () => get().orders.filter(order => ["Shipped", "Out for Delivery"].includes(order.status)),
      getDeliveredOrders: () => get().orders.filter(order => order.status === "Delivered"),
      getCancelledOrders: () => get().orders.filter(order => order.status === "Cancelled"),
      getAllOrders: () => get().orders,
      
      // Get notifications with filters
      getUnreadNotifications: () => get().notifications.filter(notification => !notification.isRead),
      getPaymentNotifications: () => get().notifications.filter(notification => notification.type === "payment"),
      getShippingNotifications: () => get().notifications.filter(notification => notification.type === "shipping"),
      getOrderNotifications: () => get().notifications.filter(notification => notification.type === "order")
    }),
    { name: "order-store" }
  )
);

export default useOrderStore;