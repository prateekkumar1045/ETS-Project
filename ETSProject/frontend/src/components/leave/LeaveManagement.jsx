import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leave/", {
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

  // Handle search by employee name
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = leaves.filter((leave) =>
      leave.employeeName.toLowerCase().includes(value)
    );

    const finalFiltered =
      filterStatus === "All"
        ? filtered
        : filtered.filter((leave) => leave.status === filterStatus);

    setFilteredLeaves(finalFiltered);
  };

  // Handle filter by status
  const handleFilter = (status) => {
    setFilterStatus(status);

    const filtered = leaves.filter((leave) =>
      searchTerm
        ? leave.employeeName.toLowerCase().includes(searchTerm)
        : true
    );

    const finalFiltered =
      status === "All"
        ? filtered
        : filtered.filter((leave) => leave.status === status);

    setFilteredLeaves(finalFiltered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-blue-100">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-teal-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <div className="text-xl font-bold text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-teal-100 to-blue-100 min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl p-10 animate-fade-in border border-slate-200">
        <h1 className="text-4xl font-extrabold text-black mb-8 text-center tracking-tight flex items-center justify-center gap-3">
          <span>🗂️</span>
          Leave Management
        </h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by Employee Name"
            className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-teal-400 transition"
          />
          <div className="flex gap-2 flex-wrap">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => handleFilter(status)}
                className={`px-5 py-2 rounded-lg font-semibold shadow transition
                  ${
                    filterStatus === status
                      ? status === "Approved"
                        ? "bg-green-500 text-white"
                        : status === "Rejected"
                        ? "bg-red-500 text-white"
                        : status === "Pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-teal-100"
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 uppercase text-xs">
                <th className="px-4 py-3 text-left">S.No</th>
                <th className="px-4 py-3 text-left">Employee Name</th>
                <th className="px-4 py-3 text-left">Employee ID</th>
                <th className="px-4 py-3 text-left">Leave Type</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Total Days</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave, index) => (
                <tr key={leave._id} className="hover:bg-teal-50 transition">
                  <td className="px-4 py-3 text-center font-semibold">{index + 1}</td>
                  <td className="px-4 py-3">{leave.employeeName}</td>
                  <td className="px-4 py-3">{leave.employeeId}</td>
                  <td className="px-4 py-3">{leave.leaveType}</td>
                  <td className="px-4 py-3">{leave.department}</td>
                  <td className="px-4 py-3 text-center">
                    {Math.ceil(
                      (new Date(leave.toDate) - new Date(leave.fromDate)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                      ${leave.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : leave.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : leave.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"}
                    `}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/admin-dashboard/leave/${leave._id}`)}
                      className="px-4 py-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:from-teal-600 hover:to-blue-600 transition text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default LeaveManagement;