import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { columns, DepartmentButton } from '../../utils/DepartmentHelper';
import axios from 'axios';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true)
      try {
        const response = await axios.get('http://localhost:5000/api/department', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const data = response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: <DepartmentButton _id={dep._id} />,
          }));

          setDepartments(data);
          setFilteredDepartments(data);
        }
      } catch (error) {
        if(error.response && !error.response.data.success){
          alert(error.response.data.error)
        }
      } finally{
        setDepLoading(false)
      }
    };

    fetchDepartments();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(query)
    );

    setFilteredDepartments(filtered);
  };

  return (

    <>{depLoading? <div>Loading...</div>: 

    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Departments</h3>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Dept Name"
          className="px-4 py-2 border border-gray-300 rounded"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Link
          to="/admin-dashboard/add-department"
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Add New Department
        </Link>
      </div>
      <div>
        <DataTable columns={columns} data={filteredDepartments} pagination />
      </div>
    </div>
  }</>
  );
};

export default DepartmentList;
