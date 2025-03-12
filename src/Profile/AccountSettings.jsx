import { useState } from "react";

const AccountSettings = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success", "error"
  const [activeTab, setActiveTab] = useState("email"); // "email" or "password"

  const handleChangeEmail = (e) => {
    e.preventDefault();
    // Simulated verification logic
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }
    setMessage("Verification email sent. Please check your inbox.");
    setMessageType("success");
    // Reset field after successful submission
    setEmail("");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setMessageType("error");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("Password should be at least 6 characters long.");
      setMessageType("error");
      return;
    }
    setMessage("Password updated successfully!");
    setMessageType("success");
    // Reset fields after successful submission
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-product">
      <h2 className="text-2xl font-heading font-bold text-secondary-800 mb-6">Account Settings</h2>
      
      {message && (
        <div 
          className={`mb-6 p-4 rounded-xl flex items-center text-sm ${
            messageType === "success" 
              ? "bg-success-100 text-success-700 border-l-4 border-success-500" 
              : "bg-danger-100 text-danger-700 border-l-4 border-danger-500"
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {messageType === "success" ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            )}
          </svg>
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-secondary-200 mb-6">
        <button
          className={`py-3 px-6 font-medium text-sm focus:outline-none ${
            activeTab === "email" 
              ? "text-primary-600 border-b-2 border-primary-600" 
              : "text-secondary-500 hover:text-secondary-700"
          }`}
          onClick={() => setActiveTab("email")}
        >
          Change Email
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm focus:outline-none ${
            activeTab === "password" 
              ? "text-primary-600 border-b-2 border-primary-600" 
              : "text-secondary-500 hover:text-secondary-700"
          }`}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {/* Email Form */}
      {activeTab === "email" && (
        <form onSubmit={handleChangeEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              New Email Address
            </label>
            <input
              type="email"
              className="w-full p-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition"
              placeholder="Enter your new email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Update Email
          </button>
        </form>
      )}

      {/* Password Form */}
      {activeTab === "password" && (
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-secondary-500">
              Password must be at least 6 characters long
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-success-600 hover:bg-success-700 text-white font-medium rounded-xl transition focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
};

export default AccountSettings;