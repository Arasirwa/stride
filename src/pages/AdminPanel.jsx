import { useState } from 'react';
import useOrderStore from '../stores/OrdersStore';
import OrderList from '../admin/OrderList';
import OrderDetails from '../admin/OrderDetails';
import Dashboard from '../admin/Dashboard';
import Notifications from '../admin/Notifications';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { orders, notifications, clearNotifications } = useOrderStore();

  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveTab('orderDetails');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <h1 className="text-white text-xl font-bold mb-8">Admin Panel</h1>
          <nav>
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left py-2 px-4 rounded ${
                    activeTab === 'dashboard' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Dashboard
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => {
                    setActiveTab('orders');
                    setSelectedOrderId(null);
                  }}
                  className={`w-full text-left py-2 px-4 rounded ${
                    activeTab === 'orders' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Orders
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left py-2 px-4 rounded ${
                    activeTab === 'notifications' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Notifications
                  {notifications.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'orders' && <OrderList onOrderSelect={handleOrderSelect} />}
          {activeTab === 'orderDetails' && <OrderDetails orderId={selectedOrderId} onBack={() => setActiveTab('orders')} />}
          {activeTab === 'notifications' && <Notifications onClear={clearNotifications} />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;