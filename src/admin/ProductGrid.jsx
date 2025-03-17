import { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { ShoppingBag } from 'lucide-react';

const ProductGrid = ({ products, onDelete }) => {
  const [productToEdit, setProductToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setProductToEdit(null);
  };
  
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={40} className="mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or add some products.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            onEdit={handleEditProduct}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      {showModal && (
        <ProductModal 
          product={productToEdit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductGrid;