import React from "react";
import { useAuth } from "../../context/authContext";

const Dashboard = () => {
  const { user } = useAuth(); // Access the logged-in user's data

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-teal-600 mb-4">Employee Dashboard</h1>
        <div className="bg-teal-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Welcome, {user?.name || "Employee"}❤️</h2>
          <p className="text-gray-600 mt-2">
            This is your dashboard. Here, you can view your profile, manage your leave requests, and check your salary details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;