// src/admin/ProductManager.jsx
import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Plus, 
  Grid, 
  List,
  ShoppingBag
} from 'lucide-react';
import useProductManagementStore from '../stores/ProductManagementStore';
import ProductList from './ProductList';
import ProductGrid from './ProductGrid';
import ProductModal from './ProductModal';

const ProductsManager = () => {
  const { 
    products, 
    fetchProducts, 
    deleteProduct,
    getCategories,
    getBrands
  } = useProductManagementStore();
  
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  
  const categories = getCategories();
  const brands = getBrands();
  
  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesBrand = brandFilter === '' || product.brand === brandFilter;
    const matchesCategory = categoryFilter === '' || 
      product.categories.includes(categoryFilter);
    
    return matchesSearch && matchesBrand && matchesCategory;
  });
  
  // Delete confirmation handler
  const handleDeleteConfirm = (productId) => {
    setConfirmDelete(productId);
  };
  
  // Actual delete handler
  const handleDeleteProduct = () => {
    if (confirmDelete) {
      deleteProduct(confirmDelete);
      setConfirmDelete(null);
    }
  };
  
  // Edit product handler
  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowAddModal(true);
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-2xl font-bold">Products Management</h2>
        
        <div className="flex gap-2">
          <div className="flex border rounded-lg overflow-hidden bg-gray-100">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
          >
            <Filter size={16} className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
          
          <button
            onClick={() => {
              setProductToEdit(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className={`bg-white rounded-lg shadow p-4 mb-6 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, SKU, or brand..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Brand</label>
            <select 
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="border rounded-lg py-2 px-3 w-full"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-lg py-2 px-3 w-full"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setSearchTerm('');
              setBrandFilter('');
              setCategoryFilter('');
            }}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
          >
            Clear All Filters
          </button>
        </div>
      </div>
      
      {/* Products Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
      
      {/* Products View */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Get started by adding your first product to your store.
            </p>
            <button
              onClick={() => {
                setProductToEdit(null);
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Your First Product
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching products</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setBrandFilter('');
                setCategoryFilter('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <ProductList 
            products={products}
            filteredProducts={filteredProducts}
            onDelete={handleDeleteConfirm}
            onEdit={handleEditProduct}
          />
        ) : (
          <ProductGrid 
            products={filteredProducts}
            onDelete={handleDeleteConfirm}
            onEdit={handleEditProduct}
          />
        )}
      </div>
      
      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <ProductModal 
          product={productToEdit}
          onClose={() => {
            setShowAddModal(false);
            setProductToEdit(null);
          }}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;