import React from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth(); // Access the logout function from the auth context
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem("token");

    // Call the logout function to update the auth context
    logout();

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="flex items-center text-white justify-between h-12 bg-teal-500 px-5">
      <p>Welcome {user?.name || "Admin"}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-1 bg-teal-700 hover:bg-teal-800 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
