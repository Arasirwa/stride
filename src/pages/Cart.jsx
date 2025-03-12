import React from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ChevronLeft,
  CreditCard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useProductStore from "../stores/productStore";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItemQuantity, removeFromCart, placeOrder } = useProductStore();

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
    <div className="min-h-screen bg-secondary-50">
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900">
            Your Cart
          </h1>
        </div>

        {/* Empty Cart Message */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <ShoppingBag size={48} className="text-secondary-400" />
            <h2 className="text-2xl font-semibold text-secondary-700 mt-4">
              Your cart is empty
            </h2>
            <p className="text-secondary-500 mt-2">
              Looks like you haven’t added anything yet.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-heading font-semibold text-secondary-900">
                    Cart Items (
                    {cart.reduce((sum, item) => sum + item.quantity, 0)})
                  </h2>

                  {/* Cart Item List */}
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row border-b border-secondary-200 pb-6"
                      >
                        <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                          />
                        </div>
                        <div className="flex-grow sm:ml-6">
                          <Link
                            to={`/product/${item.product.id}`}
                            className="text-lg font-medium underline text-secondary-900"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-secondary-500 mt-1">
                            Size: {item.size}
                          </p>
                          <p className="text-secondary-500 mt-1">
                            Price: {item.product.discountPrice}
                          </p>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center border border-secondary-300 rounded-lg">
                              <button
                                onClick={() =>
                                  updateCartItemQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="flex-shrink-0 text-secondary-600 hover:text-primary-600 p-2"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-10 text-center text-secondary-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateCartItemQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="flex-shrink-0 text-secondary-600 hover:text-primary-600 p-2"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-secondary-500 hover:text-danger-600 p-2 transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-4">
                <div className="p-6">
                  <h2 className="text-xl font-heading font-semibold text-secondary-900 mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Subtotal</span>
                      <span className="text-secondary-900 font-medium">
                        Ksh: {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Shipping</span>
                      <span className="text-secondary-900 font-medium">
                        Ksh: {shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Tax (8%)</span>
                      <span className="text-secondary-900 font-medium">
                        Ksh: {tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-secondary-200 pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-lg text-secondary-900 font-semibold">
                          Total
                        </span>
                        <span className="text-lg text-secondary-900 font-bold">
                          Ksh: {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => {
                        placeOrder();
                        navigate("/order-confirmation"); // Navigate to the confirmation page
                      }}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <CreditCard size={20} className="mr-2" />
                      Place Order
                    </button>
                    <div className="text-center mt-4">
                      <p className="text-sm text-secondary-500">
                        Mobile Money Payment Available
                      </p>
                    </div>

                    <div className="text-center mt-4">
                      <p className="text-sm text-secondary-500">
                        Secure payment powered by Stripe
                      </p>
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
