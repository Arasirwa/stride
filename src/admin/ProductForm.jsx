import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash } from 'lucide-react';
import useProductManagementStore from '../stores/ProductManagementStore';

const ProductForm = ({ productId = null, onSave, onCancel }) => {
  const { createProduct, updateProduct, currentProduct } = useProductManagementStore();
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    brand: '',
    price: '',
    discountPrice: '',
    categories: [],
    gender: 'unisex',
    isBestselling: false,
    stockCount: 0,
    sizes: [],
    images: ['']
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (currentProduct && productId) {
      setFormData({
        name: currentProduct.name || '',
        sku: currentProduct.sku || '',
        description: currentProduct.description || '',
        brand: currentProduct.brand || '',
        price: currentProduct.price || '',
        discountPrice: currentProduct.discountPrice || '',
        categories: currentProduct.categories || [],
        gender: currentProduct.gender || 'unisex',
        isBestselling: currentProduct.isBestselling || false,
        stockCount: currentProduct.stockCount || 0,
        sizes: currentProduct.sizes || [],
        images: currentProduct.images || ['']
      });
    }
  }, [currentProduct, productId]);
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';
    if (formData.discountPrice && isNaN(formData.discountPrice)) newErrors.discountPrice = 'Discount price must be a number';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      let result;
      if (productId) {
        result = await updateProduct(productId, formData);
      } else {
        result = await createProduct(formData);
      }
      
      if (result) {
        onSave(result);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ submit: 'Failed to save product. Please try again.' });
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSizeChange = (size, available) => {
    const existingIndex = formData.sizes.findIndex(s => s.size === size);
    
    if (existingIndex >= 0) {
      const updatedSizes = [...formData.sizes];
      updatedSizes[existingIndex] = { size, available };
      setFormData({ ...formData, sizes: updatedSizes });
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, { size, available }] });
    }
  };
  
  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };
  
  const updateImage = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };
  
  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">
        {productId ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      {errors.submit && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {errors.submit}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name*
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU*
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
        </div>
      </div>
      
      {/* Additional form fields for brand, price, etc. */}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Images*
        </label>
        <div className="space-y-3">
          {formData.images.map((image, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="Image URL"
                className="flex-1 p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-2 text-red-500 hover:text-red-700"
                disabled={formData.images.length <= 1}
              >
                <Trash size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} className="mr-1" /> Add Image
          </button>
        </div>
        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <X size={16} className="inline mr-2" /> Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save size={16} className="inline mr-2" /> Save Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;