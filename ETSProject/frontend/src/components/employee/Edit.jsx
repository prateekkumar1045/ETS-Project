import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaIdBadge, FaBirthdayCake, FaVenusMars, FaSuitcase, FaBuilding, FaMoneyBill, FaUserShield, FaUpload } from "react-icons/fa";

const Edit = () => {
  const { id } = useParams(); // Get employee ID from the URL
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeAndDepartments = async () => {
      try {
        // Fetch employee details
        const employeeResponse = await axios.get(`http://localhost:5000/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (employeeResponse.data.success) {
          const employee = employeeResponse.data.employee;
          setFormData({
            name: employee.userId.name,
            email: employee.userId.email,
            employeeId: employee.employeeId,
            dob: new Date(employee.dob).toISOString().split("T")[0],
            gender: employee.gender,
            maritalStatus: employee.maritalStatus,
            designation: employee.designation,
            department: employee.department?._id || "",
            salary: employee.salary,
            role: employee.userId.role,
          });
          console.log("Fetched employee data:", employee.gender);
          
        }

        // Fetch departments
        const departmentResponse = await axios.get("http://localhost:5000/api/department", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (departmentResponse.data.success) {
          setDepartments(departmentResponse.data.departments);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeAndDepartments();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const updatedData = new FormData();
  Object.keys(formData).forEach((key) => {
    updatedData.append(key, formData[key]);
  });

  try {
    const response = await axios.put(`http://localhost:5000/api/employee/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success) {
      navigate("/admin-dashboard/employees");
    } else {
      console.error("Server Error:", response.data.error);
    }
  } catch (error) {
    console.error("Error updating employee:", error.response?.data?.error || error.message);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 drop-shadow-lg">
          ✏️ Edit Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          {[
            { label: "Full Name", icon: <FaUser />, type: "text", name: "name", placeholder: "John Doe" },
            { label: "Email", icon: <FaEnvelope />, type: "email", name: "email", placeholder: "john@example.com" },
            { label: "Employee ID", icon: <FaIdBadge />, type: "text", name: "employeeId", placeholder: "EMP123" },
            { label: "Date of Birth", icon: <FaBirthdayCake />, type: "date", name: "dob" },
            {
              label: "Gender",
              icon: <FaVenusMars />,
              type: "select",
              name: "gender",
              options: ["Male", "Female", "Other"],
            },
            {
              label: "Marital Status",
              icon: <FaVenusMars />,
              type: "select",
              name: "maritalStatus",
              options: ["Single", "Married", "Other"],
            },
            { label: "Designation", icon: <FaSuitcase />, type: "text", name: "designation", placeholder: "Software Engineer" },
            {
              label: "Department",
              icon: <FaBuilding />,
              type: "select",
              name: "department",
              options: departments.map((dep) => ({ value: dep._id, label: dep.dep_name })),
            },
            { label: "Salary", icon: <FaMoneyBill />, type: "number", name: "salary", placeholder: "50000" },
            {
              label: "Role",
              icon: <FaUserShield />,
              type: "select",
              name: "role",
              options: ["admin", "employee"],
            },
            { label: "Upload Image", icon: <FaUpload />, type: "file", name: "image" },
          ].map((field, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="text-xl text-gray-600">{field.icon}</div>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option, idx) =>
                    typeof option === "string" ? (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ) : (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={field.type !== "file" ? formData[field.name] || "" : undefined}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded"
                />
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="text-center">
           <button
                            type="submit"
                            className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300"
                        >
                            ✨ Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;