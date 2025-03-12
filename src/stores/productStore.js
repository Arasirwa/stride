import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProductStore = create(
  persist(
    (set, get) => ({
      // Products state
      products: [],
      filteredProducts: [],
      isLoading: false,
      error: null,

      // Filter state
      selectedBrands: [],
      selectedCategories: [],
      priceRange: [0, 2000],
      genderFilter: "all",
      sortOption: "featured",
      searchQuery: "",

      // Cart & Orders
      cart: [],
      orders: [],
      currentOrder: null, // Store the latest order being processed
      notifications: [],

      // Fetch products from API
      fetchProducts: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch("https://my-server-kvf0.onrender.com");

          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }

          const data = await response.json();

          set({
            products: data,
            isLoading: false,
            filteredProducts: applyFilters({
              products: data,
              selectedBrands: get().selectedBrands,
              selectedCategories: get().selectedCategories,
              priceRange: get().priceRange,
              genderFilter: get().genderFilter,
              sortOption: get().sortOption,
              searchQuery: get().searchQuery,
            }),
          });
        } catch (error) {
          set({
            error: error.message || "An error occurred while fetching products",
            isLoading: false,
          });
        }
      },

      // Search functionality
      setSearchQuery: (query) => {
        set((state) => ({
          searchQuery: query,
          filteredProducts: applyFilters({
            products: state.products,
            selectedBrands: state.selectedBrands,
            selectedCategories: state.selectedCategories,
            priceRange: state.priceRange,
            genderFilter: state.genderFilter,
            sortOption: state.sortOption,
            searchQuery: query,
          }),
        }));
      },

      // Filter actions
      toggleBrand: (brand) => {
        set((state) => {
          const newSelectedBrands = state.selectedBrands.includes(brand)
            ? state.selectedBrands.filter((b) => b !== brand)
            : [...state.selectedBrands, brand];

          return {
            selectedBrands: newSelectedBrands,
            filteredProducts: applyFilters({
              products: state.products,
              selectedBrands: newSelectedBrands,
              selectedCategories: state.selectedCategories,
              priceRange: state.priceRange,
              genderFilter: state.genderFilter,
              sortOption: state.sortOption,
              searchQuery: state.searchQuery,
            }),
          };
        });
      },

      toggleCategory: (category) => {
        set((state) => {
          const newSelectedCategories = state.selectedCategories.includes(
            category
          )
            ? state.selectedCategories.filter((c) => c !== category)
            : [...state.selectedCategories, category];

          return {
            selectedCategories: newSelectedCategories,
            filteredProducts: applyFilters({
              products: state.products,
              selectedBrands: state.selectedBrands,
              selectedCategories: newSelectedCategories,
              priceRange: state.priceRange,
              genderFilter: state.genderFilter,
              sortOption: state.sortOption,
              searchQuery: state.searchQuery,
            }),
          };
        });
      },

      setPriceRange: (range) => {
        set((state) => ({
          priceRange: range,
          filteredProducts: applyFilters({
            products: state.products,
            selectedBrands: state.selectedBrands,
            selectedCategories: state.selectedCategories,
            priceRange: range,
            genderFilter: state.genderFilter,
            sortOption: state.sortOption,
            searchQuery: state.searchQuery,
          }),
        }));
      },

      setGenderFilter: (gender) => {
        set((state) => ({
          genderFilter: gender,
          filteredProducts: applyFilters({
            products: state.products,
            selectedBrands: state.selectedBrands,
            selectedCategories: state.selectedCategories,
            priceRange: state.priceRange,
            genderFilter: gender,
            sortOption: state.sortOption,
            searchQuery: state.searchQuery,
          }),
        }));
      },

      setSortOption: (option) => {
        set((state) => ({
          sortOption: option,
          filteredProducts: applyFilters({
            products: state.products,
            selectedBrands: state.selectedBrands,
            selectedCategories: state.selectedCategories,
            priceRange: state.priceRange,
            genderFilter: state.genderFilter,
            sortOption: option,
            searchQuery: state.searchQuery,
          }),
        }));
      },

      clearFilters: () => {
        set((state) => ({
          selectedBrands: [],
          selectedCategories: [],
          priceRange: [0, 2000],
          genderFilter: "all",
          sortOption: "featured",
          searchQuery: "",
          filteredProducts: applyFilters({
            products: state.products,
            selectedBrands: [],
            selectedCategories: [],
            priceRange: [0, 2000],
            genderFilter: "all",
            sortOption: "featured",
            searchQuery: "",
          }),
        }));
      },

      // Cart management
      addToCart: (product, size, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item) => item.product.id === product.id && item.size === size
          );

          let newCart;

          if (existingItemIndex >= 0) {
            newCart = [...state.cart];
            newCart[existingItemIndex] = {
              ...newCart[existingItemIndex],
              quantity: newCart[existingItemIndex].quantity + quantity,
            };
          } else {
            newCart = [
              ...state.cart,
              {
                id: `${product.id}-${size}-${Date.now()}`,
                product,
                size,
                quantity,
              },
            ];
          }

          return { cart: newCart };
        });
      },

      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId),
        }));
      },

      updateCartItemQuantity: (cartItemId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      // Order Management
      placeOrder: () => {
        set((state) => {
          const newOrder = {
            id: Date.now(),
            items: state.cart,
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

      updateOrderStatus: (orderId, status) => {
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
        });
      },

      markOrderAsPaid: (orderId) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "Payment Confirmed",
                  statusHistory: [
                    ...order.statusHistory,
                    { status: "Payment Confirmed", timestamp: new Date() },
                  ],
                }
              : order
          );

          return {
            orders: updatedOrders,
            currentOrder: updatedOrders.find((order) => order.id === orderId),
            notifications: [
              ...state.notifications,
              {
                orderId,
                message: "Your payment has been confirmed!",
                timestamp: new Date(),
              },
            ],
          };
        });
        get().clearCart();
      },

      // Fetch User Orders
      getCurrentOrders: () => {
        return get().orders.filter((order) => order.status !== "Delivered");
      },

      getPreviousOrders: () => {
        return get().orders.filter((order) => order.status === "Delivered");
      },

      getAllOrders: () => {
        return get().orders;
      },

      // Manage Notifications
      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "product-store", // Persisting cart & orders
      partialize: (state) => ({
        cart: state.cart,
        orders: state.orders,
        notifications: state.notifications,
      }),
    }
  )
);

// Helper function to apply all filters and sorting
const applyFilters = ({
  products,
  selectedBrands,
  selectedCategories,
  priceRange,
  genderFilter,
  sortOption,
  searchQuery,
}) => {
  let filtered = products;

  if (searchQuery) {
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedBrands.length) {
    filtered = filtered.filter((product) =>
      selectedBrands.includes(product.brand)
    );
  }

  if (selectedCategories.length) {
    filtered = filtered.filter((product) =>
      product.categories.some((category) =>
        selectedCategories.includes(category)
      )
    );
  }

  filtered = filtered.filter(
    (product) =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  if (genderFilter !== "all") {
    filtered = filtered.filter(
      (product) =>
        product.gender === genderFilter || product.gender === "unisex"
    );
  }

  return filtered;
};

export default useProductStore;
