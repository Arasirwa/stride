import { Package, Clock, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import React from "react";
import useOrderStore from "../stores/OrdersStore";
import { Link } from "react-router-dom";

const statusColors = {
  "Pending Payment": "bg-yellow-500",
  "Payment Confirmed": "bg-blue-500",
  Shipped: "bg-purple-500",
  "Out for Delivery": "bg-orange-500",
  Delivered: "bg-green-500",
};

const statusIcons = {
  "Pending Payment": Clock,
  "Payment Confirmed": Clock,
  Shipped: Package,
  "Out for Delivery": Package,
  Delivered: Package,
};

const OrdersSection = () => {
  const orders = useOrderStore((state) => state.getAllOrders());
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Your Orders</h3>
        {orders.length > 0 && (
          <span className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-xl border border-gray-100">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">You have no orders yet.</p>
          <Link to="/shop">
            <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl shadow-sm bg-white overflow-hidden"
            >
              {/* Order Header - Always visible */}
              <div
                className="p-4 border-b bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleOrderExpand(order.id)}
              >
                <div className="flex items-center space-x-4">
                  {statusIcons[order.status] && (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        statusColors[order.status] || "bg-gray-400"
                      }`}
                    >
                      {React.createElement(statusIcons[order.status], {
                        size: 20,
                        className: "text-white",
                      })}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-secondary-800">
                      Order #{order.id}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()} • {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium text-white rounded-full ${
                      statusColors[order.status] || "bg-gray-400"
                    }`}
                  >
                    {order.status}
                  </span>
                  {expandedOrders[order.id] ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </div>
              </div>

              {/* Order Details - Expandable */}
              {expandedOrders[order.id] && (
                <div className="p-4">
                  {/* Order Timeline */}
                  {/* Order Timeline */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-600 mb-3">
                      Order Status
                    </h5>
                    <div className="flex items-center justify-between relative">
                      {order.statusHistory.map((step, index) => {
                        const isLast = index === order.statusHistory.length - 1;
                        return (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center relative"
                          >
                            {/* Status Connector */}
                            {!isLast && (
                              <div
                                className={`absolute top-3 left-1/2 w-full h-1 
              ${statusColors[step.status] || "bg-gray-300"}`}
                              ></div>
                            )}

                            {/* Status Dot */}
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center 
              ${statusColors[step.status] || "bg-gray-400"} shadow-md`}
                            ></div>

                            {/* Status Label */}
                            <p className="text-xs text-gray-600 mt-2 text-center max-w-[80px] truncate">
                              {step.status}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items - Scrollable */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-3">
                      Items in this order
                    </h5>
                    <div className="max-h-64 overflow-y-auto pr-2 border rounded-lg">
                      <div className="divide-y">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center p-3 hover:bg-gray-50"
                          >
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="ml-4 flex-1">
                              <p className="font-medium text-secondary-800">
                                {item.product.name}
                              </p>
                              <div className="flex flex-wrap text-sm text-gray-600 mt-1">
                                <span className="mr-4">Size: {item.size}</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-secondary-800">
                                ${item.product.discountPrice.toFixed(2)}
                              </p>
                              {item.product.originalPrice >
                                item.product.discountPrice && (
                                <p className="text-xs text-gray-500 line-through">
                                  ${item.product.originalPrice.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Subtotal</span>
                      <span>
                        ksh:{" "}
                        {order.items
                          .reduce(
                            (total, item) =>
                              total +
                              item.product.discountPrice * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Shipping</span>
                      <span>ksh: 300</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Tax</span>
                      <span>ksh: 250</span>
                    </div>
                    <div className="border-t my-2"></div>
                    <div className="flex justify-between font-semibold text-secondary-800">
                      <span>Total</span>
                      <span>
                        ksh:{" "}
                        {(
                          order.items.reduce(
                            (total, item) =>
                              total +
                              item.product.discountPrice * item.quantity,
                            0
                          ) + 9.21
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
