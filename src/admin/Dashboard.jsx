import { useState, useEffect } from 'react';
import useOrderStore from '../stores/OrdersStore';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { getAllOrders, getCurrentOrders } = useOrderStore();
  const allOrders = getAllOrders();
  const currentOrders = getCurrentOrders();
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Generate last 7 days revenue data
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    
    // Generate random revenue data for demonstration
    const data = days.map(day => ({
      day,
      revenue: Math.floor(Math.random() * 10000) + 5000
    }));
    
    setRevenueData(data);
    setLoading(false);
  }, []);

  // Process order statuses for pie chart
  const orderStatuses = allOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(orderStatuses).map(([name, value]) => ({ name, value }));
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#e84393'];
  
  // Calculate total revenue
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  
  // Count unique customers (using simple approach for demo)
  const uniqueCustomers = new Set(allOrders.map(order => order.items[0]?.userId || 'anonymous')).size;
  
  // Find orders with potential issues (for demo, consider orders stuck in a status for longer than expected)
  const ordersWithIssues = allOrders.filter(order => 
    order.status !== 'Delivered' && 
    new Date() - new Date(order.statusHistory[order.statusHistory.length - 1].timestamp) > 1000 * 60 * 60 * 24 * 3 // More than 3 days
  ).length;

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold mt-2">{allOrders.length}</p>
              <p className="text-sm text-green-600 mt-1">+{Math.floor(allOrders.length * 0.1)} this week</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-3xl font-bold mt-2">Ksh {totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-green-600 mt-1">+12% this month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-3xl font-bold mt-2">{uniqueCustomers}</p>
              <p className="text-sm text-green-600 mt-1">+3 new today</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Issues</p>
              <p className="text-3xl font-bold mt-2">{ordersWithIssues}</p>
              <p className="text-sm text-red-600 mt-1">Requires attention</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Revenue (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`Ksh ${value}`, 'Revenue']} />
                <Legend />
                <Bar dataKey="revenue" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={4}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {allOrders.length > 0 ? (
          <div className="divide-y">
            {allOrders.slice(0, 5).map(order => (
              <div key={order.id} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {order.statusHistory[order.statusHistory.length - 1].timestamp 
                      ? new Date(order.statusHistory[order.statusHistory.length - 1].timestamp).toLocaleString() 
                      : 'Unknown date'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Pending Payment' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'}`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;