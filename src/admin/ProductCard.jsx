import { Edit, Trash2, Tag, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Product Image */}
      <div className="h-48 bg-gray-200 relative">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
        )}
        
        {product.discountPrice < product.price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            SALE
          </div>
        )}
        
        {product.isBestselling && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            BESTSELLER
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
          <span className={`text-sm font-medium ${product.stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stockCount > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        
        <div className="flex flex-wrap gap-1 mb-2">
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
        
        <div className="flex justify-between items-center mt-3">
          <div>
            {product.discountPrice < product.price ? (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">KSH {product.discountPrice.toFixed(2)}</span>
                <span className="ml-2 text-xs text-gray-500 line-through">KSH {product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-900">KSH {product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(product)}
              className="text-indigo-600 hover:text-indigo-900 p-1"
              title="Edit Product"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="text-red-600 hover:text-red-900 p-1"
              title="Delete Product"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;