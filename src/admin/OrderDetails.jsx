import { useState, useEffect } from "react";
import useOrderStore from "../stores/OrdersStore";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  ArrowLeft, 
  Clock, 
  Edit, 
  AlertTriangle,
  CreditCard,
  Phone
} from "lucide-react";

const OrderDetails = ({ orderId, onBack }) => {
  const { orders, updateOrderStatus, addOrderNote } = useOrderStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [note, setNote] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);

  const order = orders.find((o) => o.id === orderId);

  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="text-center py-8">
        <p>Order not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center mx-auto"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Orders
        </button>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    if (newStatus && newStatus !== order.status) {
      updateOrderStatus(orderId, newStatus, statusNote);
      setIsUpdating(false);
      setStatusNote("");
    }
  };
  
  const handleAddNote = () => {
    if (note.trim()) {
      addOrderNote(orderId, note);
      setNote("");
      setShowNoteForm(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending Payment":
        return <Clock size={20} className="text-yellow-500" />;
      case "Payment Confirmed":
        return <CreditCard size={20} className="text-green-500" />;
      case "Processing":
        return <Package size={20} className="text-blue-500" />;
      case "Shipped":
        return <Truck size={20} className="text-blue-500" />;
      case "Out for Delivery":
        return <Truck size={20} className="text-purple-500" />;
      case "Delivered":
        return <CheckCircle size={20} className="text-green-500" />;
      case "Cancelled":
        return <AlertTriangle size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-gray-500" />;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const possibleStatuses = [
    "Pending Payment",
    "Payment Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  // Get payment details for display
  const paymentDetails = order.paymentMethod ? (
    <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
      <div className="flex items-center">
        <CreditCard size={18} className="text-green-600 mr-2" />
        <h4 className="font-medium text-green-800">Payment Information</h4>
      </div>
      <div className="mt-2">
        <p className="text-sm text-green-700">
          <span className="font-medium">Method:</span> {order.paymentMethod}
        </p>
        {order.paymentId && (
          <p className="text-sm text-green-700">
            <span className="font-medium">Transaction ID:</span> {order.paymentId}
          </p>
        )}
        <p className="text-sm text-green-700">
          <span className="font-medium">Date:</span> {
            formatDate(
              order.statusHistory.find(h => h.status === "Payment Confirmed")?.timestamp
            )
          }
        </p>
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Back</span>
          </button>
          <h2 className="text-2xl font-bold">Order #{order.id}</h2>
        </div>
        
        <div>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full 
            ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-800"
                : order.status === "Pending Payment"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "Cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Order Status with Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Order Status</h3>

        {/* Payment details banner */}
        {paymentDetails}

        {/* Timeline */}
        <div className="relative pb-8">
          {/* Status Timeline */}
          <div className="ml-6 relative border-l-2 border-gray-200 pl-8 space-y-10">
            {order.statusHistory && order.statusHistory.map((statusChange, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-10 mt-1.5">
                  <div className="h-6 w-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                    {getStatusIcon(statusChange.status)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{statusChange.status}</h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(statusChange.timestamp)}
                  </p>
                  {statusChange.notes && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      {statusChange.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Status Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium mb-3">Update Order Status</h4>
          {isUpdating ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="border rounded p-2 w-full"
                >
                  {possibleStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Note (Optional)</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a note about this status change"
                  className="border rounded p-2 w-full h-20"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update Status
                </button>
                <button
                  onClick={() => {
                    setIsUpdating(false);
                    setNewStatus(order.status);
                    setStatusNote("");
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsUpdating(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <Edit size={16} className="mr-2" />
              Change Status
            </button>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{order.customerInfo?.name || "Not available"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{order.customerInfo?.email || "Not available"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{order.customerInfo?.phone || "Not available"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Shipping Address</p>
            <p className="font-medium">{order.customerInfo?.address || "Not available"}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
            <Phone size={16} className="mr-1" />
            Contact Customer
          </button>
        </div>
      </div>

      {/* Order Items Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Order Items</h3>
        {order.items && order.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product.brand}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      KSH {item.product.discountPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      KSH {(item.quantity * item.product.discountPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No items in this order</p>
        )}

        {/* Order Summary */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  KSH {order.items
                    .reduce(
                      (sum, item) => sum + item.quantity * item.product.discountPrice,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">KSH {order.shipping?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">KSH {order.tax?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
                <span>Total</span>
                <span>KSH {order.totalPrice?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Notes Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Order Notes</h3>
          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
          >
            <Edit size={14} className="mr-1" />
            Add Note
          </button>
        </div>
        
        {showNoteForm && (
          <div className="mb-4">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add an internal note about this order..."
              className="w-full p-2 border rounded-md h-24"
            ></textarea>
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => setShowNoteForm(false)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!note.trim()}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50"
              >
                Save Note
              </button>
            </div>
          </div>
        )}
        
        {order.notes && order.notes.length > 0 ? (
          <div className="space-y-3">
            {order.notes.map((note, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-start">
                  <p className="text-gray-800">{note.text}</p>
                  <span className="text-xs text-gray-500">
                    {formatDate(note.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">By: {note.author || "Admin"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No notes for this order</p>
        )}
      </div>

      {/* Payment Overdue Alert */}
      {(order.status === "Pending Payment" && 
        new Date() - new Date(order.statusHistory[0].timestamp) > 1000 * 60 * 60 * 24) && (
        <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
          <div className="flex items-start">
            <AlertTriangle size={24} className="text-red-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Payment Overdue</h3>
              <p className="text-red-700">
                This order has been in "Pending Payment" status for more than 24 hours.
              </p>
              <div className="mt-4 flex space-x-3">
                <button className="px-4 py-2 bg-white text-red-700 border border-red-300 rounded-md hover:bg-red-50">
                  Send Payment Reminder
                </button>
                <button 
                  onClick={() => {
                    setNewStatus("Cancelled");
                    setStatusNote("Payment not received within 24 hours");
                    setIsUpdating(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;