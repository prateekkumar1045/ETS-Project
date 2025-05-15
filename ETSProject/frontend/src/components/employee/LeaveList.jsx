import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Helper for status badge color
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Approved: "bg-green-100 text-green-800 border-green-300",
  Rejected: "bg-red-100 text-red-800 border-red-300",
  All: "bg-gray-100 text-gray-800 border-gray-300",
};

// Helper for formatting dates
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const EmployeeLeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leave/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setLeaves(response.data.leaves);
          setFilteredLeaves(response.data.leaves);
        } else {
          console.error("Error fetching leave details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching leave details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  // Handle filtering by status
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === "All") {
      setFilteredLeaves(leaves);
    } else {
      const filtered = leaves.filter((leave) => leave.status === status);
      setFilteredLeaves(filtered);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-blue-100">
        <div className="text-2xl font-bold text-teal-700 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (leaves.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-blue-100">
        <button
          onClick={() => navigate("/employee-dashboard/leavelist/add")}
          className="mb-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform font-semibold"
        >
          Apply for Leave
        </button>
        <div className="text-2xl font-bold text-gray-500">No leave records found.</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-100 to-blue-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white/90 shadow-2xl rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h1 className="text-4xl font-extrabold text-teal-700 tracking-tight">Your Leave History</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/employee-dashboard/leavelist/add")}
              className="px-5 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform font-semibold"
            >
              + Apply for Leave
            </button>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredLeaves.map((leave, index) => (
            <div
              key={leave._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow p-6 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-teal-700">
                  {index + 1}. {leave.leaveType}
                </span>
                <span
                  className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${statusColors[leave.status] || statusColors.All}`}
                >
                  {leave.status}
                </span>
              </div>
              <div className="text-gray-600 mb-2">{leave.description}</div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">From: </span>
                  <span className="font-semibold text-gray-700">{formatDate(leave.fromDate)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">To: </span>
                  <span className="font-semibold text-gray-700">{formatDate(leave.toDate)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Applied: </span>
                  <span className="font-semibold text-gray-700">{formatDate(leave.appliedDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveList;
