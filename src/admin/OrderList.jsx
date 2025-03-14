import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ArrowDown, 
  ArrowUp,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  AlertTriangle,
  Package,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import useOrderStore from '../stores/OrdersStore';

const OrderList = ({ onOrderSelect }) => {
  const { getAllOrders } = useOrderStore();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  
  const allOrders = getAllOrders() || [];
  
  // Filter orders by status
  const statusFiltered = filter === 'all' 
    ? allOrders 
    : allOrders.filter(order => order.status === filter);
  
  // Search filter
  const searchFiltered = searchTerm 
    ? statusFiltered.filter(order => 
        order.id.toString().includes(searchTerm) || 
        order.items.some(item => 
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.product.brand.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : statusFiltered;
    
  // Date range filter
  const dateFiltered = searchFiltered.filter(order => {
    if (!dateRange.from && !dateRange.to) return true;
    
    if (!order.statusHistory || !order.statusHistory.length) return true;
    
    const orderDate = new Date(order.statusHistory[0].timestamp);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;
    
    if (fromDate && toDate) {
      return orderDate >= fromDate && orderDate <= toDate;
    } else if (fromDate) {
      return orderDate >= fromDate;
    } else if (toDate) {
      return orderDate <= toDate;
    }
    
    return true;
  });
  
  // Sorting
  const sortedOrders = [...dateFiltered].sort((a, b) => {
    if (sortField === 'date') {
      if (!a.statusHistory?.length || !b.statusHistory?.length) return 0;
      
      const dateA = new Date(a.statusHistory[a.statusHistory.length - 1].timestamp);
      const dateB = new Date(b.statusHistory[b.statusHistory.length - 1].timestamp);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'id') {
      return sortDirection === 'asc' 
        ? a.id.toString().localeCompare(b.id.toString()) 
        : b.id.toString().localeCompare(a.id.toString());
    } else if (sortField === 'total') {
      return sortDirection === 'asc' 
        ? a.totalPrice - b.totalPrice 
        : b.totalPrice - a.totalPrice;
    }
    return 0;
  });
  
  // Get statuses for filter buttons
  const statuses = [...new Set(allOrders.map(order => order.status).filter(Boolean))];
  
  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / ordersPerPage));
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, dateRange.from, dateRange.to]);
  
  const getStatusIcon = (status) => {
    if (!status) return <Clock size={16} className="text-gray-500" />;
    
    switch (status) {
      case "Pending Payment":
        return <Clock size={16} className="text-yellow-500" />;
      case "Payment Confirmed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "Processing":
        return <Clock size={16} className="text-blue-500" />;
      case "Shipped":
        return <Truck size={16} className="text-blue-500" />;
      case "Out for Delivery":
        return <Truck size={16} className="text-purple-500" />;
      case "Delivered":
        return <CheckCircle size={16} className="text-green-500" />;
      case "Cancelled":
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString() + " " + 
           new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Filter size={16} className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <button
            onClick={() => alert('Export functionality would be implemented here')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center"
          >
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className={`bg-white rounded-lg shadow-md p-4 mb-6 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Order ID, product name..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                />
                <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                />
                <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
                setDateRange({ from: '', to: '' });
                setSortField('date');
                setSortDirection('desc');
              }}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 w-full"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Orders ({allOrders.length})
        </button>
        
        {statuses.map(status => {
          if (!status) return null;
          const count = allOrders.filter(order => order.status === status).length;
          return (
            <button 
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                filter === status 
                  ? status === 'Delivered' ? 'bg-green-100 text-green-800' 
                  : status === 'Pending Payment' ? 'bg-yellow-100 text-yellow-800'
                  : status === 'Cancelled' ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getStatusIcon(status)}
              <span className="ml-2">{status} ({count})</span>
            </button>
          );
        })}
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {sortedOrders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">
                        Order ID
                        {sortField === 'id' && (
                          sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('total')}
                    >
                      <div className="flex items-center">
                        Total
                        {sortField === 'total' && (
                          sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Last Updated
                        {sortField === 'date' && (
                          sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customerInfo?.name || "John Doe"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {order.items?.length || 0} item(s)
                          </span>
                          {(order.items?.length > 0) && (
                            <div className="ml-2 flex -space-x-2 overflow-hidden">
                              {order.items.slice(0, 3).map((item, index) => (
                                <img
                                  key={index}
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-6 h-6 rounded-full border border-white"
                                  title={item.product.name}
                                />
                              ))}
                              {order.items.length > 3 && (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs text-gray-500 border border-white">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        KSH {order.totalPrice?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'Pending Payment' ? 'bg-yellow-100 text-yellow-800' : 
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'}`}
                          >
                            {order.status || "Processing"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.statusHistory && order.statusHistory.length > 0 
                          ? formatDate(order.statusHistory[order.statusHistory.length - 1]?.timestamp) 
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => onOrderSelect(order.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastOrder, sortedOrders.length)}
                      </span>{' '}
                      of <span className="font-medium">{sortedOrders.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ArrowLeft size={16} />
                      </button>
                      
                      {/* Page buttons */}
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === i + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                          } text-sm font-medium`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <ArrowRight size={16} />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || dateRange.from || dateRange.to || filter !== 'all'
                ? 'Try adjusting your filters to find what you\'re looking for.'
                : 'When orders are placed, they will appear here.'}
            </p>
            {(searchTerm || dateRange.from || dateRange.to || filter !== 'all') && (
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                  setDateRange({ from: '', to: '' });
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;