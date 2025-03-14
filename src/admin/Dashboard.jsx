import useOrderStore from '../stores/OrdersStore';

const Dashboard = () => {
  const { getAllOrders, getCurrentOrders } = useOrderStore();
  const allOrders = getAllOrders();
  const currentOrders = getCurrentOrders();
  
  const orderStatuses = allOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-600">Total Orders</h3>
          <p className="text-3xl font-bold">{allOrders.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-600">Active Orders</h3>
          <p className="text-3xl font-bold">{currentOrders.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-600">Completed Orders</h3>
          <p className="text-3xl font-bold">{allOrders.length - currentOrders.length}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Order Status Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(orderStatuses).map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{status}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(count / allOrders.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
