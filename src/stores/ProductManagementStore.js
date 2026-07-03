import { create } from 'zustand';
import * as productsService from '../services/productsService';

const useProductManagementStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await productsService.listProducts();
      set({ products, isLoading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },

  // Get a single product by ID
  getProduct: (id) => {
    return get().products.find(product => product.id === id);
  },

  // Add a new product
  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await productsService.createProduct(product);
      set(state => ({
        products: [...state.products, newProduct],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error adding product:', error);
      set({ error: 'Failed to add product', isLoading: false });
    }
  },

  // Update an existing product
  updateProduct: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = await productsService.updateProduct(id, updatedData);
      set(state => ({
        products: state.products.map(product =>
          product.id === id ? updatedProduct : product
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error updating product:', error);
      set({ error: 'Failed to update product', isLoading: false });
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productsService.deleteProduct(id);
      set(state => ({
        products: state.products.filter(product => product.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      set({ error: 'Failed to delete product', isLoading: false });
    }
  },
  
  // Filter products by criteria
  filterProducts: (criteria = {}) => {
    const { products } = get();
    let filtered = [...products];
    
    if (criteria.search) {
      const searchTerm = criteria.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.brand.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm)
      );
    }
    
    if (criteria.brand) {
      filtered = filtered.filter(product => product.brand === criteria.brand);
    }
    
    if (criteria.category) {
      filtered = filtered.filter(product => 
        product.categories.includes(criteria.category)
      );
    }
    
    if (criteria.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= criteria.priceRange[0] && 
        product.price <= criteria.priceRange[1]
      );
    }
    
    return filtered;
  },
  
  // Get available categories
  getCategories: () => {
    const { products } = get();
    const categoriesSet = new Set();
    
    products.forEach(product => {
      product.categories.forEach(category => categoriesSet.add(category));
    });
    
    return Array.from(categoriesSet);
  },
  
  // Get available brands
  getBrands: () => {
    const { products } = get();
    const brandsSet = new Set();
    
    products.forEach(product => {
      brandsSet.add(product.brand);
    });
    
    return Array.from(brandsSet);
  }
}));

export default useProductManagementStore;