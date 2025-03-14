import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../stores/OrdersStore';
import useProductStore from '../stores/productStore';
import OrderList from '../admin/OrderList';
import OrderDetails from '../admin/OrderDetails';
import Dashboard from '../admin/Dashboard';
import Notifications from '../admin/Notifications';
import { 
  Home, 
  Package, 
  Bell, 
  Settings, 
  Users, 
  LogOut, 
  ShoppingBag, 
  BarChart,
  RefreshCw
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { orders, notifications, clearNotifications } = useOrderStore();
  const { fetchProducts } = useProductStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Fetch products when component mounts
    fetchProducts();
  }, [fetchProducts]);

  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveTab('orderDetails');
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const navigation = [
    { name: 'Dashboard', icon: Home, tab: 'dashboard', count: null },
    { name: 'Orders', icon: Package, tab: 'orders', count: orders.length },
    { name: 'Notifications', icon: Bell, tab: 'notifications', count: notifications.length },
    { name: 'Products', icon: ShoppingBag, tab: 'products', count: null },
    { name: 'Customers', icon: Users, tab: 'customers', count: null },
    { name: 'Reports', icon: BarChart, tab: 'reports', count: null },
    { name: 'Settings', icon: Settings, tab: 'settings', count: null },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 bg-gray-800">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <span className="text-white text-2xl font-bold">STRIDE Admin</span>
                </div>
                <nav className="mt-8 flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.tab);
                        if (item.tab !== 'orderDetails') {
                          setSelectedOrderId(null);
                        }
                      }}
                      className={`
                        group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full
                        ${
                          activeTab === item.tab
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }
                      `}
                    >
                      <item.icon
                        className={`
                          mr-3 flex-shrink-0 h-6 w-6
                          ${
                            activeTab === item.tab
                              ? 'text-white'
                              : 'text-gray-400 group-hover:text-gray-300'
                          }
                        `}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.name}</span>
                      {item.count ? (
                        <span
                          className={`
                            ml-3 inline-block py-0.5 px-2 text-xs rounded-full
                            ${
                              activeTab === item.tab
                                ? 'bg-gray-700 text-white'
                                : 'bg-gray-600 text-gray-300'
                            }
                          `}
                        >
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex-shrink-0 w-full group block"
                >
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block h-9 w-9 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Admin"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">Admin User</p>
                      <div className="flex items-center text-xs font-medium text-gray-400 group-hover:text-gray-300">
                        <LogOut className="mr-1 h-4 w-4" />
                        Exit Admin
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-gray-800 px-4 py-2 flex items-center justify-between">
          <span className="text-white text-xl font-bold">STRIDE Admin</span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-gray-800 bg-opacity-90">
            <div className="pt-16 pb-6 px-4">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab(item.tab);
                      if (item.tab !== 'orderDetails') {
                        setSelectedOrderId(null);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full
                      ${
                        activeTab === item.tab
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 flex-shrink-0 h-6 w-6
                        ${
                          activeTab === item.tab
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-gray-300'
                        }
                      `}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.count ? (
                      <span
                        className={`
                          ml-3 inline-block py-0.5 px-2 text-xs rounded-full
                          ${
                            activeTab === item.tab
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-600 text-gray-300'
                          }
                        `}
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </button>
                ))}
              </nav>
            </div>
            <div className="fixed bottom-0 w-full border-t border-gray-700 p-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center w-full"
              >
                <img
                  className="h-9 w-9 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Admin"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <div className="flex items-center text-xs font-medium text-gray-400">
                    <LogOut className="mr-1 h-4 w-4" />
                    Exit Admin
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {/* Refresh button */}
            <div className="fixed top-4 right-4 z-50">
              <button
                onClick={handleRefresh}
                className={`p-2 bg-white rounded-full shadow-md hover:bg-gray-100 ${refreshing ? 'animate-spin' : ''}`}
                title="Refresh data"
              >
                <RefreshCw size={20} className="text-blue-600" />
              </button>
            </div>
          
            <div className="py-6 md:py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Content goes here */}
                <div className="md:mt-0 mt-14"> {/* Add margin top on mobile to account for fixed header */}
                  {activeTab === 'dashboard' && <Dashboard />}
                  {activeTab === 'orders' && <OrderList onOrderSelect={handleOrderSelect} />}
                  {activeTab === 'orderDetails' && <OrderDetails orderId={selectedOrderId} onBack={() => setActiveTab('orders')} />}
                  {activeTab === 'notifications' && <Notifications onClear={clearNotifications} onOrderSelect={handleOrderSelect} />}
                  {activeTab === 'products' && (
                    <div className="text-center py-12">
                      <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">Products Management</h3>
                      <p className="mt-2 text-sm text-gray-500">This feature is coming soon.</p>
                    </div>
                  )}
                  {activeTab === 'customers' && (
                    <div className="text-center py-12">
                      <Users size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">Customer Management</h3>
                      <p className="mt-2 text-sm text-gray-500">This feature is coming soon.</p>
                    </div>
                  )}
                  {activeTab === 'reports' && (
                    <div className="text-center py-12">
                      <BarChart size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">Reports</h3>
                      <p className="mt-2 text-sm text-gray-500">This feature is coming soon.</p>
                    </div>
                  )}
                  {activeTab === 'settings' && (
                    <div className="text-center py-12">
                      <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">Admin Settings</h3>
                      <p className="mt-2 text-sm text-gray-500">This feature is coming soon.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;