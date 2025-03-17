import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Plus, 
  Edit, 
  Trash2,
  ArrowDown, 
  ArrowUp,
  Tag,
  ShoppingBag
} from 'lucide-react';
import useProductManagementStore from '../stores/ProductManagementStore';
import ProductModal from './ProductModal';

const ProductList = () => {
  const { 
    products, 
    fetchProducts, 
    deleteProduct, 
    getCategories, 
    getBrands 
  } = useProductManagementStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [productToEdit, setProductToEdit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const productsPerPage = 10;
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
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === 'price') {
      return sortDirection === 'asc' 
        ? a.price - b.price 
        : b.price - a.price;
    } else if (sortField === 'stock') {
      return sortDirection === 'asc' 
        ? a.stockCount - b.stockCount 
        : b.stockCount - a.stockCount;
    }
    return 0;
  });
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, brandFilter, categoryFilter]);
  
  // Handle edit product
  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowAddModal(true);
  };
  
  // Handle delete product confirmation
  const handleDeleteConfirm = (productId) => {
    setConfirmDelete(productId);
  };
  
  // Handle actual delete
  const handleDeleteProduct = () => {
    if (confirmDelete) {
      deleteProduct(confirmDelete);
      setConfirmDelete(null);
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products Management</h2>
        
        <div className="flex gap-2">
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
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {currentProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Product
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortField === 'price' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center">
                      Stock
                      {sortField === 'stock' && (
                        sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-md bg-gray-200 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ShoppingBag size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">KSH {product.price?.toFixed(2)}</div>
                      {product.discountPrice < product.price && (
                        <div className="text-xs text-green-600">
                          Sale: KSH {product.discountPrice?.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.stockCount > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stockCount > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {product.stockCount} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {product.categories.map(category => (
                          <span 
                            key={category} 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <Tag size={10} className="mr-1" />
                            {category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <ShoppingBag size={40} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-500">
              {searchTerm || brandFilter || categoryFilter 
                ? 'Try adjusting your filters to find what you\'re looking for.' 
                : 'You haven\'t added any products yet.'}
            </p>
            {(searchTerm || brandFilter || categoryFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setBrandFilter('');
                  setCategoryFilter('');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{Math.min(indexOfFirstProduct + 1, sortedProducts.length)}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastProduct, sortedProducts.length)}</span> of{' '}
                  <span className="font-medium">{sortedProducts.length}</span> products
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                        ${currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
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

export default ProductList;