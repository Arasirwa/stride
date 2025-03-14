import { useState } from 'react';
import { 
  Bell, 
  CheckCircle,
  Clock,
  Package,
  ArrowRight,
  Eye,
  AlertTriangle,
  Check,
  BadgeAlert
} from 'lucide-react';
import useOrderStore from '../stores/OrdersStore';

const Notifications = ({ onOrderSelect }) => {
  const { 
    notifications, 
    removeNotification, 
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications 
  } = useOrderStore();
  
  const [filter, setFilter] = useState('all');
  
  const filterNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.isRead);
    if (filter === 'payments') return notifications.filter(n => n.type === 'payment');
    if (filter === 'shipping') return notifications.filter(n => n.type === 'shipping');
    if (filter === 'orders') return notifications.filter(n => n.type === 'order');
    return notifications;
  };
  
  const filteredNotifications = filterNotifications();
  
  const getNotificationIcon = (notification) => {
    const type = notification.type;
    
    if (type === 'payment') {
      return <CheckCircle size={18} className="text-green-500" />;
    }
    if (type === 'shipping') {
      return <Package size={18} className="text-blue-500" />;
    }
    if (type === 'cancellation') {
      return <AlertTriangle size={18} className="text-red-500" />;
    }
    if (type === 'delivery') {
      return <CheckCircle size={18} className="text-purple-500" />;
    }
    
    return <Clock size={18} className="text-gray-500" />;
  };
  
  // Format relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };
  
  const handleViewOrder = (notification) => {
    markNotificationAsRead(notifications.indexOf(notification));
    if (onOrderSelect && notification.orderId) {
      onOrderSelect(notification.orderId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        <div className="flex space-x-2">
          {notifications.filter(n => !n.isRead).length > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              <Check size={14} className="inline-block mr-1" />
              Mark all read
            </button>
          )}
          <button
            onClick={clearNotifications}
            className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-1" aria-label="Tabs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 text-sm font-medium ${
              filter === 'all'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-2 text-sm font-medium ${
              filter === 'unread'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Unread {notifications.filter(n => !n.isRead).length > 0 && 
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            }
          </button>
          <button
            onClick={() => setFilter('payments')}
            className={`px-3 py-2 text-sm font-medium ${
              filter === 'payments'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setFilter('shipping')}
            className={`px-3 py-2 text-sm font-medium ${
              filter === 'shipping'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Shipping
          </button>
          <button
            onClick={() => setFilter('orders')}
            className={`px-3 py-2 text-sm font-medium ${
              filter === 'orders'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders
          </button>
        </nav>
      </div>
      
      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${
                notification.isRead 
                  ? 'bg-white border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification)}
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className={`text-sm ${notification.isRead ? 'text-gray-800' : 'text-blue-800 font-medium'}`}>
                      {!notification.isRead && (
                        <BadgeAlert size={14} className="inline-block mr-1 text-blue-500" />
                      )}
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(notification.timestamp)}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center">
                    {notification.orderId && (
                      <button
                        onClick={() => handleViewOrder(notification)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Eye size={14} className="mr-1" />
                        View Order
                        <ArrowRight size={12} className="ml-1" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => removeNotification(index)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
          <Bell size={32} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
          <p className="text-gray-500 text-sm">
            {filter !== 'all' 
              ? 'No notifications match your current filter' 
              : 'New notifications will appear here'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;