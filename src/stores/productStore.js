import { create } from "zustand";

const useProductStore = create((set, get) => ({
  products: [],
  filteredProducts: [],
  isLoading: false,
  error: null,

  // Filters
  selectedBrands: [],
  selectedCategories: [],
  priceRange: [0, 2000],
  genderFilter: "all",
  sortOption: "featured",
  searchQuery: "",

  // Fetch products using fetch()
  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("http://localhost:8000/products"); // Update API endpoint as needed
      if (!response.ok) {
        throw new Error("Failed to load products");
      }
      const data = await response.json();
      set({ products: data, filteredProducts: data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Toggle brand filter
  toggleBrand: (brand) => {
    const { selectedBrands } = get();
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    set({ selectedBrands: updatedBrands });
    get().applyFilters();
  },

  // Toggle category filter
  toggleCategory: (category) => {
    const { selectedCategories } = get();
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    set({ selectedCategories: updatedCategories });
    get().applyFilters();
  },

  // Set price range
  setPriceRange: (range) => {
    set({ priceRange: range });
    get().applyFilters();
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters(); // Reapply filters when search query changes
  },

  // Set gender filter
  setGenderFilter: (gender) => {
    set({ genderFilter: gender });
    get().applyFilters();
  },

  // Set sorting option
  setSortOption: (option) => {
    set({ sortOption: option });
    get().applyFilters();
  },

  // Clear all filters
  clearFilters: () => {
    set({
      selectedBrands: [],
      selectedCategories: [],
      priceRange: [0, 2000],
      genderFilter: "all",
      sortOption: "featured",
      searchQuery:""
    });
    get().applyFilters();
  },

  // Apply filters to products
  applyFilters: () => {
    const {
      products,
      selectedBrands,
      selectedCategories,
      priceRange,
      genderFilter,
      sortOption,
      searchQuery,
    } = get();

    let filtered = products;

    // Filter by brand
    if (selectedBrands.length) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategories.length) {
      filtered = filtered.filter((product) =>
        product.categories.some((category) =>
          selectedCategories.includes(category)
        )
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by gender
    if (genderFilter !== "all") {
      filtered = filtered.filter((product) => product.gender === genderFilter);
    }

    // Sorting
    if (sortOption === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (sortOption === "bestselling") {
      filtered.sort((a, b) => b.sales - a.sales);
    }

    set({ filteredProducts: filtered });
  },
}));

export default useProductStore;
