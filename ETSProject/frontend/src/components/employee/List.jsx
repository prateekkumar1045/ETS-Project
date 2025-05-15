import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/employee', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            name: emp.userId.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            department: emp.department?.dep_name || 'N/A',
            profileImage: emp.userId.profileImage,
            action: (
              <div className="flex gap-4">
                <Link to={`/admin-dashboard/employees/view/${emp._id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">View</Link>
                <Link to={`/admin-dashboard/employees/edit/${emp._id}`} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</Link>
                <Link to={`/admin-dashboard/employees/salary/${emp._id}`} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Salary</Link>
                <Link to={`/admin-dashboard/employees/leaveEach/${emp._id}`} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Leave</Link>
              </div>
            ),
          }));
          setEmployees(data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    { name: 'No', selector: (row) => row.sno, sortable: true, width: '70px' },
    {
      name: 'Image',
      selector: (row) => (
        <img
          src={row.profileImage}
          alt={row.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-300"
          onError={(e) => {
            e.target.src = '/default-profile.png';
          }}
        />
      ),
      width: '80px',
    },
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'DOB', selector: (row) => row.dob, sortable: true },
    { name: 'Department', selector: (row) => row.department, sortable: true },
    { name: 'Actions', selector: (row) => row.action, width: '300px' },
  ];

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Custom styles for row spacing
  const customStyles = {
    rows: {
      style: {
        marginBottom: '5px', // Add space between rows
        padding: '5px 0', // Add padding inside rows
      },
    },
  };

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Employees</h3>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Employee Name"
          className="px-4 py-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link
          to="/admin-dashboard/add-Employee"
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Add New Employee
        </Link>
      </div>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          pagination
          progressPending={loading}
          customStyles={customStyles} // Apply custom styles
        />
      </div>
    </div>
  );
};

export default List;
