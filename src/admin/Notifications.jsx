import useOrderStore from '../stores/OrdersStore';

const Notifications = ({ onClear }) => {
  const { notifications } = useOrderStore();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={onClear}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear All
          </button>
        )}
      </div>
      
      {notifications.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md divide-y">
          {notifications.map((notification, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between">
                <p className="font-medium">Order #{notification.orderId}</p>
                <p className="text-sm text-gray-500">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
              <p className="text-gray-700 mt-1">{notification.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No notifications</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;