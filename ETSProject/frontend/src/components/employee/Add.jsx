import React, { useState, useEffect } from 'react';
import {
    FaUser, FaEnvelope, FaIdBadge, FaBirthdayCake, FaVenusMars, FaSuitcase,
    FaBuilding, FaMoneyBill, FaLock, FaUserShield, FaUpload
} from 'react-icons/fa';
import { fetchDepartments } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const getDepartments = async () => {
            const fetched = await fetchDepartments();
            setDepartments(fetched);
        };
        getDepartments();
    }, []);

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
            formDataObj.append(key, formData[key]);
        });

        console.log("Submitting Form Data:");
        for (let pair of formDataObj.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/employee/add",
                formDataObj,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                        // Do NOT manually set Content-Type here
                    }
                }
            );

            if (response.data.success) {
                navigate("/admin-dashboard/employees");
            } else {
                console.error("Server Error:", response.data.error);
            }
        } catch (error) {
            console.error("Error adding employee:", error.response?.data?.error || error.message);
        }
    };

    const fields = [
        { label: "Full Name", icon: <FaUser />, type: "text", name: "name", placeholder: "name" },
        { label: "Email", icon: <FaEnvelope />, type: "email", name: "email", placeholder: "abc@example.com" },
        { label: "Employee ID", icon: <FaIdBadge />, type: "text", name: "employeeId", placeholder: "EMP123" },
        { label: "Date of Birth", icon: <FaBirthdayCake />, type: "date", name: "dob" },
        {
            label: "Gender", icon: <FaVenusMars />, type: "select", name: "gender",
            options: ["Male", "Female", "Other"]
        },
        {
            label: "Marital Status", icon: <FaVenusMars />, type: "select", name: "maritalStatus",
            options: ["Single", "Married", "Other"]
        },
        { label: "Designation", icon: <FaSuitcase />, type: "text", name: "designation", placeholder: "Software Engineer" },
        {
            label: "Department", icon: <FaBuilding />, type: "select", name: "department",
            options: departments.map(dep => ({ value: dep._id, label: dep.dep_name }))
        },
        { label: "Salary", icon: <FaMoneyBill />, type: "number", name: "salary", placeholder: "50000" },
        { label: "Password", icon: <FaLock />, type: "password", name: "password", placeholder: "********" },
        {
            label: "Role", icon: <FaUserShield />, type: "select", name: "role",
            options: ["admin", "employee"]
        },
        { label: "Upload Image", icon: <FaUpload />, type: "file", name: "image" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-200 transform hover:scale-[1.01] transition duration-300">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12 drop-shadow-lg">
                    🚀 Add New Employee
                </h2>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fields.map((field, idx) => (
                            <div key={idx}>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    {field.icon} {field.label}
                                </label>
                                {field.type === "select" ? (
                                    <select
                                        name={field.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                        required
                                    >
                                        <option value="">Select {field.label}</option>
                                        {field.options?.map((option, i) =>
                                            typeof option === 'string' ? (
                                                <option key={i} value={option.toLowerCase()}>{option}</option>
                                            ) : (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            )
                                        )}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        accept={field.type === "file" ? "image/*" : undefined}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                        required={field.type !== "file"}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300"
                        >
                            ✨ Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Add;
