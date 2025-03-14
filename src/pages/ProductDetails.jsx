import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useProductStore from "../stores/productStore";
import useCartStore from "../stores/cartStore";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products, fetchProducts } = useProductStore();
  const {addToCart} = useCartStore()
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    
    loadProduct();
  }, [fetchProducts]);

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id || p.id === parseInt(id));
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [products, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-secondary-900">Product not found</h1>
        <p className="mt-4 text-secondary-500">The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = product.reviews && product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  // Calculate discount percentage
  const discountPercentage = product.discountPrice && product.price
    ? (((product.price - product.discountPrice) / product.price) * 100).toFixed(0)
    : 0;

  // Format date for reviews
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Stars rendering for ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? "text-accent-400" : "text-secondary-200"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 500);
  };

  // Handle add to wishlist
  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    console.log(
      `${isInWishlist ? "Removed from" : "Added to"} wishlist: ${product.name}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-secondary-50">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <a href="/" className="text-secondary-500 hover:text-primary-600 transition-colors">
          Home
        </a>
        <span className="mx-2 text-secondary-400"> {">"} </span>
        <a href="/shop" className="text-secondary-500 hover:text-primary-600 transition-colors">
          Shop
        </a>
        <span className="mx-2 text-secondary-400">{">"}</span>
        <span className="text-secondary-900 font-medium">{product.name}</span>
      </nav>

      {/* Success notification */}
      {showAddedToCart && (
        <div className="fixed top-4 right-4 z-50 bg-success-100 border border-success-200 text-success-700 px-4 py-3 rounded-xl flex items-center shadow-product">
          <svg
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Added to cart!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 bg-white rounded-2xl overflow-hidden shadow-product">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="grid grid-cols-5 gap-3">
            {product.images && product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${
                  selectedImage === index
                    ? "ring-2 ring-primary-500 ring-offset-2"
                    : "hover:shadow-product"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-center object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Brand and badges */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-primary-600 font-heading">
              {product.brand || "Brand"}
            </h2>
            <div className="flex space-x-2">
              {product.isBestselling && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
                  Bestseller
                </span>
              )}
            </div>
          </div>

          {/* Product name */}
          <h1 className="text-3xl font-bold text-secondary-900 font-heading">{product.name}</h1>

          {/* Rating summary */}
          <div className="flex items-center">
            {renderStars(averageRating)}
            <span className="ml-2 text-sm text-secondary-500">
              {product.reviews ? product.reviews.length : 0} reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center">
            {product.discountPrice && product.discountPrice < product.price ? (
              <>
                <p className="text-3xl font-bold text-secondary-900">
                  ksh {product.discountPrice.toFixed(2)}
                </p>
                <p className="ml-3 text-lg text-secondary-400 line-through">
                  ksh {product.price.toFixed(2)}
                </p>
                <span className="ml-3 px-3 py-1 text-sm font-semibold text-danger-600 bg-danger-100 rounded-full">
                  {discountPercentage}% OFF
                </span>
              </>
            ) : (
              <p className="text-3xl font-bold text-secondary-900">
                ${product.price ? product.price.toFixed(2) : "0.00"}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-base text-secondary-600">{product.description}</p>

          {/* Divider */}
          <div className="border-t border-secondary-200 my-6"></div>

          {/* Size selector */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 mb-2">Size</h3>
            <div className="grid grid-cols-4 gap-3 mt-2">
              {product.sizes && product.sizes.map((sizeOption) => (
                <button
                  key={sizeOption.size}
                  onClick={() => setSelectedSize(sizeOption.size)}
                  disabled={!sizeOption.available}
                  className={`
                    border rounded-xl py-3 text-sm font-medium uppercase transition-all duration-200
                    ${
                      selectedSize === sizeOption.size
                        ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                        : "border-secondary-200"
                    }
                    ${
                      !sizeOption.available
                        ? "cursor-not-allowed text-secondary-400 bg-secondary-100"
                        : "hover:border-primary-400 hover:shadow-sm"
                    }
                  `}
                >
                  {sizeOption.size}
                  {!sizeOption.available && <span> - Out of stock</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div>
            <h3 className="text-sm font-medium text-secondary-900 mb-2">Quantity</h3>
            <div className="flex border border-secondary-200 rounded-xl w-32 mt-2 overflow-hidden shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stockCount || 10}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(
                      product.stockCount || 10,
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  )
                }
                className="w-16 text-center border-0 focus:ring-0 text-secondary-900"
              />
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stockCount || 10, quantity + 1))
                }
                className="px-3 py-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock info */}
          <p className={`text-sm ${product.stockCount > 10 ? 'text-success-600' : product.stockCount > 0 ? 'text-accent-600' : 'text-danger-600'}`}>
            {product.stockCount > 10
              ? "In stock and ready to ship"
              : product.stockCount > 0
              ? `Only ${product.stockCount} left in stock!`
              : "Out of stock"}
          </p>

          {/* Add to cart and wishlist buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              type="button"
              disabled={!selectedSize}
              onClick={handleAddToCart}
              className={`
                flex-1 py-4 px-6 text-white font-medium rounded-xl flex items-center justify-center transition-all duration-200
                ${
                  selectedSize
                    ? "bg-primary-600 hover:bg-primary-700 shadow-product hover:shadow-hover"
                    : "bg-secondary-300 cursor-not-allowed"
                }
              `}
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {selectedSize ? "Add to Cart" : "Select a Size"}
            </button>

            <button
              type="button"
              onClick={toggleWishlist}
              className={`
                p-4 rounded-xl border border-secondary-200 flex items-center justify-center transition-all duration-200
                ${
                  isInWishlist
                    ? "bg-danger-50 border-danger-200 shadow-sm"
                    : "bg-white hover:bg-secondary-50 hover:shadow-sm"
                }
              `}
            >
              {isInWishlist ? (
                <svg
                  className="h-6 w-6 text-danger-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-secondary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Additional info */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center bg-white p-3 rounded-xl shadow-sm">
              <svg
                className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">Free shipping on orders over ksh: 2500</span>
            </div>
            <div className="flex items-center bg-white p-3 rounded-xl shadow-sm">
              <svg
                className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-sm">30-day return policy</span>
            </div>
            <div className="flex items-center bg-white p-3 rounded-xl shadow-sm">
              <svg
                className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-sm">Secure payment</span>
            </div>
            <div className="flex items-center bg-white p-3 rounded-xl shadow-sm">
              <svg
                className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
              <span className="text-sm">24/7 Customer support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product details tabs */}
      <div className="mt-16 bg-white rounded-2xl shadow-product p-6">
        <div className="border-b border-secondary-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-4 text-sm font-medium transition-colors border-b-2 px-1 ${
                activeTab === "details" 
                  ? "border-primary-600 text-primary-600" 
                  : "border-transparent text-secondary-500 hover:text-secondary-700"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-4 text-sm font-medium transition-colors border-b-2 px-1 ${
                activeTab === "specs" 
                  ? "border-primary-600 text-primary-600" 
                  : "border-transparent text-secondary-500 hover:text-secondary-700"
              }`}
            >
              Specifications
            </button>
            {product.reviews && product.reviews.length > 0 && (
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 text-sm font-medium transition-colors border-b-2 px-1 ${
                  activeTab === "reviews" 
                    ? "border-primary-600 text-primary-600" 
                    : "border-transparent text-secondary-500 hover:text-secondary-700"
                }`}
              >
                Reviews ({product.reviews.length})
              </button>
            )}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === "details" && (
            <div className="prose prose-sm text-secondary-600 max-w-none">
              <h3 className="text-xl font-bold text-secondary-900 font-heading mb-4">
                Product Information
              </h3>
              <p>
                {product.description || "No detailed description available."}
              </p>
              {product.details && (
                <p className="mt-4">{product.details}</p>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div>
              <h3 className="text-xl font-bold text-secondary-900 font-heading mb-6">
                Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.material && (
                  <div className="bg-secondary-50 p-4 rounded-xl">
                    <h4 className="text-sm font-medium text-secondary-900">
                      Material
                    </h4>
                    <p className="text-sm text-secondary-600 mt-1">{product.material}</p>
                  </div>
                )}
                {product.specifications && product.specifications.map((spec, index) => (
                  <div key={index} className="bg-secondary-50 p-4 rounded-xl">
                    <h4 className="text-sm font-medium text-secondary-900">
                      {spec.name}
                    </h4>
                    <p className="text-sm text-secondary-600 mt-1">{spec.value}</p>
                  </div>
                ))}
                {product.sku && (
                  <div className="bg-secondary-50 p-4 rounded-xl">
                    <h4 className="text-sm font-medium text-secondary-900">SKU</h4>
                    <p className="text-sm text-secondary-600 mt-1">{product.sku}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "reviews" && product.reviews && product.reviews.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-secondary-900 font-heading">
                  Customer Reviews
                </h3>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
                  Write a Review
                </button>
              </div>

              {/* Review summary */}
              <div className="bg-secondary-50 p-6 rounded-xl mb-8">
                <div className="flex items-center">
                  <div className="bg-white p-4 rounded-full w-20 h-20 flex items-center justify-center shadow-sm">
                    <span className="text-3xl font-bold text-secondary-900">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <div className="ml-6">
                    {renderStars(averageRating)}
                    <p className="text-sm text-secondary-600 mt-2">
                      Based on {product.reviews.length} reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div
                    key={review.userId || index}
                    className="bg-secondary-50 p-6 rounded-xl transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                          {(review.username || "Anonymous").charAt(0)}
                        </div>
                        <h3 className="text-lg font-medium text-secondary-900 ml-3">
                          {review.username || "Anonymous"}
                        </h3>
                      </div>
                      <span className="text-sm text-secondary-500">
                        {review.date ? formatDate(review.date) : ""}
                      </span>
                    </div>
                    {renderStars(review.rating)}
                    <p className="mt-3 text-secondary-700">{review.comment}</p>
                    <div className="flex items-center mt-4 text-sm">
                      <button className="flex items-center text-secondary-500 hover:text-primary-600 transition-colors">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        <span>Helpful ({review.helpfulVotes || 0})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-secondary-900 font-heading mb-8">
          You might also like
        </h2>
        
        {/* This would be populated with actual related products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-product group-hover:shadow-hover transition-all duration-200">
                <div className="aspect-w-1 aspect-h-1 bg-secondary-100">
                  {/* Placeholder for product image */}
                  <div className="w-full h-full flex items-center justify-center text-secondary-400">
                    Product Image
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">Similar Product {item}</h3>
                  <p className="text-sm text-secondary-500 mt-1">Category</p>
                  <p className="font-bold mt-2 text-secondary-900">$99.00</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;