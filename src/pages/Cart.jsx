import React from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ChevronLeft,
  CreditCard,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useOrderStore from "../stores/OrdersStore";
import useCartStore from "../stores/cartStore";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItemQuantity, removeFromCart } = useCartStore();
  const { placeOrder } = useOrderStore();

  const calculateSubtotal = () =>
    cart.reduce(
      (sum, item) => sum + item.product.discountPrice * item.quantity,
      0
    );
  const subtotal = calculateSubtotal();
  const shipping = 300;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to Shopping</span>
        </button>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Your Cart
          </h1>
        </div>

        {/* Empty Cart Message */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="p-4 bg-gray-100 rounded-full">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mt-6">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Looks like you haven't added anything to your cart yet. 
              Browse our collection and find something you'll love!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Cart Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                  </h2>

                  {/* Cart Item List */}
                  <div className="space-y-8">
                    {cart.map((item) => {
                      const hasDiscount = item.product.originalPrice > item.product.discountPrice;
                      const discountPercentage = hasDiscount
                        ? Math.round(((item.product.originalPrice - item.product.discountPrice) / item.product.originalPrice) * 100)
                        : 0;
                      
                      return (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row border-b border-gray-200 pb-6"
                        >
                          <div className="flex-shrink-0 w-full sm:w-32 h-32 mb-4 sm:mb-0 relative">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-32 h-32 object-cover rounded-lg shadow-sm"
                            />
                            {hasDiscount && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                -{discountPercentage}%
                              </div>
                            )}
                          </div>
                          <div className="flex-grow sm:ml-6">
                            <div className="flex justify-between">
                              <Link
                                to={`/product/${item.product.id}`}
                                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                              >
                                {item.product.name}
                              </Link>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            
                            <p className="text-gray-500 mt-1">
                              Size: {item.size}
                            </p>
                            
                            <div className="mt-2 flex items-center">
                              {hasDiscount ? (
                                <>
                                  <span className="text-gray-900 font-medium">
                                    Ksh {item.product.discountPrice.toFixed(2)}
                                  </span>
                                  <span className="ml-2 text-gray-500 text-sm line-through">
                                    Ksh {item.product.originalPrice.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-900 font-medium">
                                  Ksh {item.product.discountPrice.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="flex-shrink-0 text-gray-600 hover:text-blue-600 hover:bg-gray-100 p-2 transition-colors"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-10 text-center text-gray-900 font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="flex-shrink-0 text-gray-600 hover:text-blue-600 hover:bg-gray-100 p-2 transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              <div className="text-gray-900 font-medium">
                                Ksh {(item.product.discountPrice * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Continue Shopping Button */}
              <div className="mt-6">
                <button
                  onClick={() => navigate("/shop")}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  <ChevronLeft size={18} className="mr-1" />
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900 font-medium">
                        Ksh {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900 font-medium">
                        Ksh {shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="text-gray-900 font-medium">
                        Ksh {tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-lg text-gray-900 font-semibold">
                          Total
                        </span>
                        <span className="text-lg text-gray-900 font-bold">
                          Ksh {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => {
                        placeOrder();
                        navigate("/order-confirmation");
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <CreditCard size={20} className="mr-2" />
                      Place Order
                    </button>
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <span>Mobile Money Payment Available</span>
                      </div>
                      
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <span>Secure payment powered by Stripe</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;