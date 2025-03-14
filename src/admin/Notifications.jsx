import { useState } from 'react';
import { 
  Trash2, 
  Bell, 
  RefreshCw, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  ArrowRight,
  Eye
} from 'lucide-react';
import useOrderStore from '../stores/OrdersStore';

const Notifications = ({ onClear, onOrderSelect }) => {
  const { notifications, removeNotification, markNotificationAsRead } = useOrderStore();
  const [filter, setFilter] = useState('all');
  
  const filterNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(notification => !notification.isRead);
    
    // Filter by message content
    return notifications.filter(notification => {
      const message = notification.message.toLowerCase();
      if (filter === 'payment' && (message.includes('payment') || message.includes('paid'))) {
        return true;
      }
      if (filter === 'shipping' && (message.includes('shipped') || message.includes('delivery'))) {
        return true;
      }
      if (filter === 'order' && message.includes('order')) {
        return true;
      }
      return false;
    });
  };
  
  const filteredNotifications = filterNotifications();
  
  const getNotificationIcon = (notification) => {
    const message = notification.message.toLowerCase();
    
    if (message.includes('payment') || message.includes('paid')) {
      return <CheckCircle size={18} className="text-green-500" />;
    }
    if (message.includes('shipped') || message.includes('delivery')) {
      return <Package size={18} className="text-blue-500" />;
    }
    if (message.includes('cancelled')) {
      return <AlertTriangle size={18} className="text-red-500" />;
    }
    if (message.includes('placed') || message.includes('new order')) {
      return <Bell size={18} className="text-purple-500" />;
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onClear()}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
            disabled={notifications.length === 0}
          >
            <Trash2 size={16} className="inline-block mr-2" />
            Clear All
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <RefreshCw size={16} className="inline-block mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 text-sm font-medium ${
              filter === 'all'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-2 text-sm font-medium ${
              filter === 'unread'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Unread ({notifications.filter(n => !n.isRead).length})
          </button>
          <button
            onClick={() => setFilter('order')}
            className={`px-3 py-2 text-sm font-medium ${
              filter === 'order'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setFilter('payment')}
            className={`px-3 py-2 text-sm font-medium ${
              filter === 'payment'
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
        </nav>
      </div>
      
      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                notification.isRead 
                  ? 'bg-white border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification)}
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-900' : 'text-blue-800'}`}>
                      {notification.message}
                    </p>
                    <div className="flex-shrink-0 ml-4 flex">
                      <button
                        onClick={() => removeNotification(index)}
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-1 flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      {getRelativeTime(notification.timestamp)}
                    </p>
                    
                    {notification.orderId && (
                      <button
                        onClick={() => handleViewOrder(notification)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Eye size={14} className="mr-1" />
                        View Order
                        <ArrowRight size={14} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">
            {filter !== 'all' 
              ? 'Try selecting a different filter' 
              : 'When there are updates, they will appear here'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;