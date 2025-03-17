import { useState, useEffect } from 'react';
import { X, Plus, Minus, Image as ImageIcon } from 'lucide-react';
import useProductManagementStore from '../stores/ProductManagementStore';

const ProductModal = ({ product, onClose }) => {
  const { addProduct, updateProduct, getCategories } = useProductManagementStore();
  const existingCategories = getCategories();
  
  // Initial form state
  const initialFormState = {
    name: '',
    sku: '',
    description: '',
    brand: '',
    categories: [],
    price: 0,
    discountPrice: 0,
    isBestselling: false,
    gender: 'unisex',
    stockCount: 0,
    images: [''],
    sizes: [{ size: 38, available: true }]
  };
  
  const [formData, setFormData] = useState(product ? { ...product } : initialFormState);
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState({});
  
  // Set initial form data if editing
  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };
  
  // Handle image URL changes
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };
  
  // Add image field
  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };
  
  // Remove image field
  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages.length ? updatedImages : [''] });
  };
  
  // Handle category selection
  const handleCategoryChange = (category, isChecked) => {
    let updatedCategories = [...formData.categories];
    
    if (isChecked) {
      updatedCategories.push(category);
    } else {
      updatedCategories = updatedCategories.filter(cat => cat !== category);
    }
    
    setFormData({ ...formData, categories: updatedCategories });
  };
  
  // Add new category
  const handleAddCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCategory]
      });
      setNewCategory('');
    }
  };
  
  // Handle size field changes
  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index] = { 
      ...updatedSizes[index], 
      [field]: field === 'size' ? parseInt(value, 10) || 0 : value 
    };
    setFormData({ ...formData, sizes: updatedSizes });
  };
  
  // Add size field
  const addSizeField = () => {
    const lastSize = formData.sizes[formData.sizes.length - 1];
    const newSize = { size: lastSize.size + 1, available: true };
    setFormData({
      ...formData,
      sizes: [...formData.sizes, newSize]
    });
  };
  
  // Remove size field
  const removeSizeField = (index) => {
    if (formData.sizes.length > 1) {
      const updatedSizes = formData.sizes.filter((_, i) => i !== index);
      setFormData({ ...formData, sizes: updatedSizes });
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (formData.categories.length === 0) newErrors.categories = 'At least one category is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.discountPrice < 0) newErrors.discountPrice = 'Discount price cannot be negative';
    if (formData.stockCount < 0) newErrors.stockCount = 'Stock count cannot be negative';
    
    // Check if at least one image URL is provided
    if (formData.images.every(image => !image.trim())) {
      newErrors.images = 'At least one image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clean up the images array by removing empty values
      const cleanedData = {
        ...formData,
        images: formData.images.filter(url => url.trim() !== '')
      };
      
      if (product) {
        // Update existing product
        updateProduct(product.id, cleanedData);
      } else {
        // Add new product
        addProduct(cleanedData);
      }
      
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`border rounded-lg p-2 w-full ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input 
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className={`border rounded-lg p-2 w-full ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand *
                  </label>
                  <input 
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className={`border rounded-lg p-2 w-full ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Pricing & Inventory */}
            <div>
              <h3 className="text-lg font-medium mb-4">Pricing & Inventory</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (KSH) *
                    </label>
                    <input 
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleNumberChange}
                      className={`border rounded-lg p-2 w-full ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Price (KSH)
                    </label>
                    <input 
                      type="number"
                      name="discountPrice"
                      min="0"
                      step="0.01"
                      value={formData.discountPrice}
                      onChange={handleNumberChange}
                      className={`border rounded-lg p-2 w-full ${errors.discountPrice ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.discountPrice && <p className="text-red-500 text-xs mt-1">{errors.discountPrice}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Count *
                  </label>
                  <input 
                    type="number"
                    name="stockCount"
                    min="0"
                    value={formData.stockCount}
                    onChange={handleNumberChange}
                    className={`border rounded-lg p-2 w-full ${errors.stockCount ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.stockCount && <p className="text-red-500 text-xs mt-1">{errors.stockCount}</p>}
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input 
                      type="checkbox"
                      name="isBestselling"
                      checked={formData.isBestselling}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Bestselling Product</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Categories</h3>
            
            <div className={`border rounded-lg p-4 ${errors.categories ? 'border-red-500' : 'border-gray-300'}`}>
              <div className="flex flex-wrap gap-2 mb-4">
                {existingCategories.map(category => (
                  <label key={category} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={(e) => handleCategoryChange(category, e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add new category"
                  className="border border-gray-300 rounded-lg p-2 flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg disabled:bg-blue-300"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              {errors.categories && <p className="text-red-500 text-xs mt-1">{errors.categories}</p>}
            </div>
          </div>
          
          {/* Sizes */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Sizes</h3>
              <button
                type="button"
                onClick={addSizeField}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Size
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.sizes.map((sizeObj, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-1/4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <input
                      type="number"
                      value={sizeObj.size}
                      onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                  
                  <div className="flex-1 flex items-center mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sizeObj.available}
                        onChange={(e) => handleSizeChange(index, 'available', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Available</span>
                    </label>
                  </div>
                  
                  {formData.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeField(index)}
                      className="mt-6 text-red-600 hover:text-red-800"
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Images */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Images</h3>
              <button
                type="button"
                onClick={addImageField}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Image
              </button>
            </div>
            
            <div className={`space-y-3 ${errors.images ? 'border-red-500' : ''}`}>
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Image URL"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                  
                  {imageUrl && (
                    <div className="w-12 h-12 border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={`Preview ${index}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = '<div class="text-gray-400"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>';
                          }}
                        />
                      ) : (
                        <ImageIcon size={24} className="text-gray-400" />
                      )}
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="text-red-600 hover:text-red-800"
                    disabled={formData.images.length === 1 && !imageUrl}
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
              {errors.images && <p className="text-red-500 text-xs">{errors.images}</p>}
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;