import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const Profile = () => {
  const { user } = useAuth(); // Get the logged-in user's data from authContext
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        console.log("Fetching employee data for user ID:", user._id); // Debugging line
        
        const response = await axios.get(`http://localhost:5000/api/employee/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setEmployee(response.data.employee);
        } else {
          console.error("Error fetching employee:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching employee:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchEmployee();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-red-600">Employee details not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 drop-shadow-lg">
          👤 My Profile
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={employee.userId.profileImage || "/default-profile.png"}
              alt={employee.userId.name}
              className="w-40 h-40 rounded-full object-cover border-4 border-teal-500 shadow-lg"
            />
          </div>

          {/* Employee Details */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Full Name</h3>
                <p className="text-gray-600">{employee.userId.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Employee ID</h3>
                <p className="text-gray-600">{employee.employeeId}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Employee Email</h3>
                <p className="text-gray-600">{employee.userId.email}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Date of Birth</h3>
                <p className="text-gray-600">{new Date(employee.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Gender</h3>
                <p className="text-gray-600">{employee.gender}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Department</h3>
                <p className="text-gray-600">{employee.department?.dep_name || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Marital Status</h3>
                <p className="text-gray-600">{employee.maritalStatus}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Designation</h3>
                <p className="text-gray-600">{employee.designation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;