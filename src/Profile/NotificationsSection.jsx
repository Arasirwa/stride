import { useState } from "react";
import { Bell, X, AlertTriangle, CheckCircle, Package, Truck, Clock, RefreshCcw, XCircle } from "lucide-react";
import useOrderStore from "../stores/OrdersStore";

// Define notification types with their respective icons and colors
const notificationTypes = {
  order: { icon: Package, bgColor: "bg-blue-50", iconColor: "text-blue-500", borderColor: "border-blue-100" },
  payment: { icon: CheckCircle, bgColor: "bg-green-50", iconColor: "text-green-500", borderColor: "border-green-100" },
  shipping: { icon: Truck, bgColor: "bg-purple-50", iconColor: "text-purple-500", borderColor: "border-purple-100" },
  alert: { icon: AlertTriangle, bgColor: "bg-yellow-50", iconColor: "text-yellow-500", borderColor: "border-yellow-100" },
  cancelled: { icon: XCircle, bgColor: "bg-red-50", iconColor: "text-red-500", borderColor: "border-red-100" },
  returned: { icon: RefreshCcw, bgColor: "bg-gray-50", iconColor: "text-gray-500", borderColor: "border-gray-100" },
};

const NotificationsSection = () => {
  const { notifications, clearNotifications, removeNotification } = useOrderStore();
  const [filter, setFilter] = useState("all");

  // Categorize notification messages
  const getNotificationType = (notification) => {
    if (!notification?.message) return "order"; // Default to order-related notifications
    const message = notification.message.toLowerCase();

    if (message.includes("payment") || message.includes("paid") || message.includes("confirmed")) return "payment";
    if (message.includes("ship") || message.includes("delivery") || message.includes("shipped")) return "shipping";
    if (message.includes("cancel")) return "cancelled";
    if (message.includes("return")) return "returned";
    if (message.includes("alert") || message.includes("warning") || message.includes("attention")) return "alert";

    return "order";
  };

  // Format time for display
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "Unknown time"; // Handle missing timestamps

    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now - notificationTime;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return notificationTime.toLocaleDateString();
  };

  // Apply selected filter
  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter(n => getNotificationType(n) === filter);

  // Count notifications per category
  const counts = {
    all: notifications.length,
    order: notifications.filter(n => getNotificationType(n) === "order").length,
    payment: notifications.filter(n => getNotificationType(n) === "payment").length,
    shipping: notifications.filter(n => getNotificationType(n) === "shipping").length,
    alert: notifications.filter(n => getNotificationType(n) === "alert").length,
    cancelled: notifications.filter(n => getNotificationType(n) === "cancelled").length,
    returned: notifications.filter(n => getNotificationType(n) === "returned").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h3 className="text-xl font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
              {notifications.length}
            </span>
          )}
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="flex items-center px-3 py-1.5 text-sm text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
          >
            <X size={16} className="mr-1.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {notifications.length > 0 && (
        <div className="flex overflow-x-auto pb-2 mb-4 space-x-2">
          {Object.keys(counts)
            .filter(type => counts[type] > 0 || type === "all")
            .map(type => {
              const IconComponent = type === "all" ? Bell : notificationTypes[type]?.icon;

              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap flex items-center ${
                    filter === type
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <IconComponent size={14} className="mr-1.5" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {counts[type] > 0 && (
                    <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                      filter === type ? "bg-primary-200 text-primary-800" : "bg-gray-200 text-gray-700"
                    }`}>
                      {counts[type]}
                    </span>
                  )}
                </button>
              );
            })}
        </div>
      )}

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-xl border border-gray-100">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">
            {notifications.length === 0 
              ? "No new notifications" 
              : `No ${filter !== "all" ? filter : ""} notifications found`}
          </p>
          {filter !== "all" && (
            <button 
              onClick={() => setFilter("all")}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              View All Notifications
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => {
            const type = getNotificationType(notification);
            const { icon: IconComponent, bgColor, iconColor, borderColor } = notificationTypes[type];

            return (
              <div
                key={index}
                className={`p-4 border rounded-lg ${bgColor} ${borderColor} flex items-start gap-3 hover:shadow-sm transition-shadow`}
              >
                <div className={`mt-0.5 rounded-full p-2 ${iconColor} bg-white`}>
                  <IconComponent size={16} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-secondary-800">{notification.message}</p>
                    <button onClick={() => removeNotification(index)} className="text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 flex items-center whitespace-nowrap mt-1">
                    <Clock size={12} className="mr-1" />
                    {getRelativeTime(notification.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;
