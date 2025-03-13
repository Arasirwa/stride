import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyOrderMessage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-secondary-50 px-4">
      <ShoppingBag size={48} className="text-secondary-400" />
      <h2 className="text-2xl font-semibold text-secondary-700 mt-4">
        No order to confirm
      </h2>
      <button
        className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        onClick={() => navigate("/shop")}
      >
        Go Back to Shop
      </button>
    </div>
  );
};

export default EmptyOrderMessage;
