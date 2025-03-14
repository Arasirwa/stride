import { useState } from "react";
import { Bell, LogOut, ShoppingBag, UserCircle } from "lucide-react";
import OrdersSection from "./OrdersSection";
import NotificationsSection from "./NotificationsSection";
import AccountSettings from "./AccountSettings";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("orders");

  const tabs = [
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Account Settings", icon: UserCircle },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-secondary-800">
          Your Profile
        </h2>
        <p className="text-secondary-500 mt-2">
          Manage your orders, notifications, and account settings
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow p-4 sticky top-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-lg"
                      : "hover:bg-gray-100 text-secondary-700"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon
                    className={`w-5 h-5 mr-3 ${
                      activeTab === tab.id ? "text-white" : "text-primary-500"
                    }`}
                    size={20}
                    strokeWidth={2}
                  />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
            <button className="w-full mt-4 py-2 bg-danger-500 text-secondary-900 rounded-lg text-sm font-medium border border-black-200 hover:bg-danger-600 transition-colors">
              Log out
            </button>

            <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-100">
              <h3 className="font-semibold text-primary-700 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-primary-600 mb-3">
                Contact our support team for any questions or issues.
              </p>
              <button className="w-full py-2 bg-white text-primary-600 rounded-lg text-sm font-medium border border-primary-200 hover:bg-primary-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4">
          <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-secondary-800">
                {activeTab === "orders" && "My Orders"}
                {activeTab === "notifications" && "Notifications"}
                {activeTab === "settings" && "Account Settings"}
              </h3>
            </div>

            <div className="transition-all">
              {activeTab === "orders" && <OrdersSection />}
              {activeTab === "notifications" && <NotificationsSection />}
              {activeTab === "settings" && <AccountSettings />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
