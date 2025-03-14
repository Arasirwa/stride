import { useState } from "react";
import useOrderStore from "../stores/OrdersStore";

const OrderDetails = ({ orderId, onBack }) => {
  const { orders, updateOrderStatus } = useOrderStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const order = orders.find((o) => o.id === orderId);

  console.log(orders);

  if (!order) {
    return (
      <div className="text-center py-8">
        <p>Order not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    if (newStatus && newStatus !== order.status) {
      updateOrderStatus(orderId, newStatus);
      setIsUpdating(false);
      setNewStatus("");
    }
  };

  const possibleStatuses = [
    "Pending Payment",
    "Payment Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <div>
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="mr-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold">Order #{order.id}</h2>
      </div>

      {/* Order Status Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Order Status</h3>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full 
            ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-800"
                : order.status === "Pending Payment"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {order.status}
          </span>
        </div>

        {isUpdating ? (
          <div className="flex items-center mt-4">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="mr-4 border rounded p-2"
            >
              <option value="">Select status</option>
              {possibleStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
            <button
              onClick={() => {
                setIsUpdating(false);
                setNewStatus("");
              }}
              className="ml-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsUpdating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Change Status
          </button>
        )}
      </div>

      {/* Order Items Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Order Items</h3>
        {order.items.length > 0 ? (
          <div className="divide-y">
            {order.items.map((item, index) => (
              <div key={index} className="py-4 flex justify-between">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × ksh:{item.product.discountPrice}
                  </p>
                </div>
                <p className="font-medium">
                  ksh: {(item.quantity * item.product.price).toFixed(2)}
                </p>
              </div>
            ))}

            {/* Subtotal */}
            <div className="py-4 flex justify-between font-medium">
              <p>Subtotal</p>
              <p>
                ksh:{" "}
                {order.items
                  .reduce(
                    (sum, item) => sum + item.quantity * item.product.price,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>

            {/* Shipping */}
            <div className="py-4 flex justify-between font-medium">
              <p>Shipping</p>
              <p>ksh: {order.shipping.toFixed(2)}</p>
            </div>

            {/* Tax */}
            <div className="py-4 flex justify-between font-medium">
              <p>Tax</p>
              <p>ksh: {order.tax.toFixed(2)}</p>
            </div>

            {/* Total */}
            <div className="py-4 flex justify-between font-bold text-lg border-t">
              <p>Total</p>
              <p>
                ksh:{" "}
                {(
                  order.items.reduce(
                    (sum, item) => sum + item.quantity * item.product.price,
                    0
                  ) +
                  order.shipping +
                  order.tax
                ).toFixed(2)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No items in this order</p>
        )}
      </div>

      {/* Order Status History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Status History</h3>
        <div className="space-y-4">
          {order.statusHistory?.length > 0 ? (
            order.statusHistory.map((statusChange, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="h-4 w-4 rounded-full bg-blue-600"></div>
                  {index < order.statusHistory.length - 1 && (
                    <div className="h-10 w-0.5 bg-blue-200 ml-1.5"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{statusChange.status}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(statusChange.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No status history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
