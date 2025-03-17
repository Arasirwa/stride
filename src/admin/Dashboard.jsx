import { useState, useEffect } from 'react';
import useOrderStore from '../stores/OrdersStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';

const Dashboard = () => {
  const { getAllOrders, getCurrentOrders } = useOrderStore();
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Generate last 7 days revenue data based on actual orders
    const allOrders = getAllOrders();
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Filter orders for this day
      const dayOrders = allOrders.filter(order => {
        const orderDate = new Date(order.statusHistory[0].timestamp);
        return orderDate.toDateString() === date.toDateString();
      });
      
      // Calculate total revenue for this day
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      last7Days.push({
        day: dayStr,
        revenue: dayRevenue
      });
    }
    
    setRevenueData(last7Days);
    setLoading(false);
  }, [getAllOrders]);

  const allOrders = getAllOrders();
  const currentOrders = getCurrentOrders();
  
  // Process order statuses for pie chart
  const orderStatuses = allOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(orderStatuses).map(([name, value]) => ({ name, value }));
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Calculate total revenue
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  
  // Count unique customers
  const uniqueCustomers = new Set(allOrders.map(order => order.customerInfo?.name || 'unknown')).size;

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Orders</p>
              <p className="text-2xl font-bold mt-1">{allOrders.length}</p>
              <p className="text-xs text-green-600">{currentOrders.length} active</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package size={22} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold mt-1">KSH {totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-green-600">+{(revenueData[6].revenue / 100).toFixed(0)}% today</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign size={22} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold mt-1">{uniqueCustomers}</p>
              <p className="text-xs text-green-600">Total customers</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users size={22} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth</p>
              <p className="text-2xl font-bold mt-1">
                {revenueData.length > 1 && revenueData[6].revenue > revenueData[5].revenue 
                  ? "↑" 
                  : "↓"}
                {revenueData.length > 1 
                  ? Math.abs(((revenueData[6].revenue - revenueData[5].revenue) / 
                     (revenueData[5].revenue || 1) * 100)).toFixed(1) 
                  : 0}%
              </p>
              <p className="text-xs text-gray-600">vs yesterday</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <TrendingUp size={22} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-base font-medium mb-4">Revenue (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`KSH ${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-base font-medium mb-4">Order Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
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
      
      {/* Recent Orders */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium">Recent Orders</h3>
        </div>
        {allOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">ID</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allOrders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">#{order.id}</td>
                    <td className="px-4 py-2 text-gray-500">{order.customerInfo?.name || "Unknown"}</td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(order.statusHistory[0].timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Pending Payment' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      KSH {order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No orders yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;