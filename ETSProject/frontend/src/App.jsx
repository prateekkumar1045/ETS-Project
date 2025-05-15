import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import AdminSummary from './components/dashboard/AdminSummary';
import DepartmentList from './components/department/DepartmentList';
import AddDepartment from './components/department/AddDepartment'; // ✅ Ensure this is imported
import EditDepartment from './components/department/EditDepartment'; // ✅ Ensure this is imported
import List from './components/employee/List';
import Add from './components/employee/Add';
import View from './components/employee/View';
import Edit from './components/employee/Edit';
import AddSalary from './components/salary/AddSalary'; // ✅ Ensure this is imported
import SalaryHistory from './components/salary/SalaryHistory';
import Dashboard from "./components/employee/Dashboard";
import Profile from "./components/employee/Profile";
import LeaveList from "./components/employee/LeaveList";
import Salary from "./components/employee/Salary";
import Setting from "./components/employee/Setting";
import AddLeave from "./components/employee/AddLeave";
import LeaveManagement from "./components/leave/LeaveManagement";
import LeaveEach from "./components/leave/LeaveEach";
import LeaveDetails from "./components/leave/LeaveDetails";
import ChangePassword from './pages/AdminPassChange';  
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }>
          {/* ✅ Relative paths for nested routes */}
          <Route index element={<AdminSummary />} />
          <Route path="/admin-dashboard/departments" element={<DepartmentList />} />
          <Route path="/admin-dashboard/add-department" element={<AddDepartment />} />
          <Route path="/admin-dashboard/department/:id" element={<EditDepartment/>} />
          <Route path="/admin-dashboard/employees" element={<List/>} />
          <Route path="/admin-dashboard/add-employee" element={<Add />} />
          <Route path="/admin-dashboard/employees/view/:id" element={<View />} />
          <Route path="/admin-dashboard/employees/edit/:id" element={<Edit />} />
          <Route path="/admin-dashboard/add-salary" element={<AddSalary />} />
          <Route path="/admin-dashboard/employees/salary/:employeeId" element={<SalaryHistory />} />
          <Route path="/admin-dashboard/leave" element={<LeaveManagement />} />
          <Route path="/admin-dashboard/leave/:id" element={<LeaveDetails />} />
          <Route path="/admin-dashboard/employees/leaveEach/:id" element={<LeaveEach />} />
          <Route path="/admin-dashboard/settings" element={<ChangePassword />} />
        </Route>

        <Route path="/employee-dashboard" element={<EmployeeDashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leavelist" element={<LeaveList />} />
          <Route path="leavelist/add" element={<AddLeave />} />
          <Route path="salary" element={<Salary />} />
          <Route path="setting" element={<Setting />} />
        </Route>
     
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
