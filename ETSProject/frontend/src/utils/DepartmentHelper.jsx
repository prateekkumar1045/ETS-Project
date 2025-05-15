import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";

export const columns = [
    {
      name: 'S.No',
      selector: row => row.sno,
      
    },
    {
      name: 'Department Name',
      selector: row => row.dep_name,
      sortable: true,
    },
    {
      name: 'Actions',
      selector: row => row.action,
    },
  ];
  
  export const DepartmentButton = ({_id}) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this department?");
      if (confirmDelete) {
        try {
          const response = await axios.delete(`http://localhost:5000/api/department/${_id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.data.success) {
            alert("Department deleted successfully");
            window.location.reload(); // Reload to update the department list
          }
        } catch (error) {
          console.error("Error deleting department:", error);
          alert(error.response?.data?.error || "Error deleting department");
        }
      }
    }


    return (
      <div className="flex space-x-2">
      <button className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"  onClick={()=>navigate(`/admin-dashboard/department/${_id}`)}>
        Edit
      </button>
      <button className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer" onClick={handleDelete}>
        Delete
      </button>
    </div>
    
    );
  };
  