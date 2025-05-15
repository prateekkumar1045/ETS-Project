import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const LeaveDetails = () => {
  const { id } = useParams(); // Leave ID from the URL
  const navigate = useNavigate();
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/adminleave/details/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setLeaveDetails(response.data.leaveDetails);
        } else {
          console.error("Error fetching leave details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching leave details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveDetails();
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/adminleave/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert(`Leave ${status.toLowerCase()} successfully`);
        navigate("/admin-dashboard/leave");
      } else {
        console.error("Error updating leave status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating leave status:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!leaveDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-gray-600">Leave details not found.</div>
      </div>
    );
  }

  const { employee, leaveType, description, fromDate, toDate, status,totalDate } = leaveDetails;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-teal-600 mb-6">Leave Details</h1>

        <div className="mb-6">
          <img
            src={employee.profileImage}
            alt={employee.name}
            className="w-24 h-24 rounded-full object-cover border border-gray-300 mb-4"
          />
          <p><strong>Employee ID:</strong> {employee.id}</p>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Department:</strong> {employee.department}</p>
        </div>

        <div className="mb-6">
          <p><strong>Leave Type:</strong> {leaveType}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>From:</strong> {new Date(fromDate).toLocaleDateString()}</p>
          <p><strong>To:</strong> {new Date(toDate).toLocaleDateString()}</p>
          <p><strong>Total Days:</strong> {totalDate}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>

        {status === "Pending" && (
          <div className="flex gap-4">
            <button
              onClick={() => handleStatusChange("Approved")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange("Rejected")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveDetails;