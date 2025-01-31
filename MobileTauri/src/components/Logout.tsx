import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      try {
        // Clear user-related data from local storage
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");

        // Navigate to the login page
        navigate("/");
      } catch (error) {
        console.error("Error during logout:", error);
        alert("Failed to logout. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800000] via-[#A52A2A] to-[#D2691E] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6 text-[#800000]">Logout</h1>
        <p className="text-gray-800 mb-6">
          Are you sure you want to logout of your account?
        </p>
        <button
          onClick={handleLogout}
          className="w-full py-3 mt-4 bg-[#800000] text-white rounded-lg font-bold shadow-md hover:bg-red-900 transition-colors"
        >
          Confirm Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
