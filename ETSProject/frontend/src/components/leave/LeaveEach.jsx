import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const EmployeeLeaveList = () => {
  const { user } = useAuth(); // Get the logged-in user's data from authContext
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/adminleave/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authentication
          },
        });

        if (response.data.success) {
          setLeaves(response.data.leaves); // Set the fetched leave data
          setFilteredLeaves(response.data.leaves); // Initialize filtered leaves
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (leaves.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-gray-600">No leave records found.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-teal-600 mb-6">Employee Leave History</h1>

        <div className="flex justify-between items-center mb-6">
          {/* Button to add a new leave */}
          {/* <button
            onClick={() => navigate("/employee-dashboard/leavelist/add")}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Apply for Leave
          </button> */}

          {/* Dropdown to filter by status */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">S.No</th>
              <th className="border border-gray-300 px-4 py-2">Leave Type</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">From</th>
              <th className="border border-gray-300 px-4 py-2">To</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Applied Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave, index) => (
              <tr key={leave._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{leave.leaveType}</td>
                <td className="border border-gray-300 px-4 py-2">{leave.description}</td>
                <td className="border border-gray-300 px-4 py-2">{leave.fromDate}</td>
                <td className="border border-gray-300 px-4 py-2">{leave.toDate}</td>
                <td className="border border-gray-300 px-4 py-2">{leave.status}</td>
                <td className="border border-gray-300 px-4 py-2">{leave.appliedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/admin-dashboard/employees")}
            className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 font-semibold"
          >
            Back to Employees
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveList;