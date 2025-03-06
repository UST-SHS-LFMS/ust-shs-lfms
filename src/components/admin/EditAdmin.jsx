import React, { useState } from "react";
import axios from "axios";

const EditAdmin = ({
  isOpen,
  onClose,
  employee,
  onDeleteSuccess,
  onSaveSuccess,
}) => {
  if (!isOpen || !employee) return null;

  const [role, setRole] = useState(employee.role);

  // Handle updating the admin's role
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/admins/${employee.id}`,
        { role }
      );
      if (response.status === 200) {
        alert("Admin role updated successfully");
        onSaveSuccess(employee.id, role); // Notify parent component
        onClose();
      }
    } catch (error) {
      alert("Error updating admin role");
      console.error(error);
    }
  };

  // Handle deleting the admin
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/admins/${employee.id}`
      );
      if (response.status === 200) {
        alert("Admin deleted successfully");
        onDeleteSuccess(employee.id); // Notify parent component
        onClose();
      }
    } catch (error) {
      alert("Error deleting admin");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-1/3 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Modal Content */}
        <div className="space-y-3">
          <p>
            <strong>Employee:</strong> {employee.fullName}
          </p>
          {/* Role Dropdown */}
          <label className="block font-semibold">Role:</label>
          <select
            className="w-full border rounded-lg p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Support Staff">Support Staff</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-4xl hover:bg-red-600"
          >
            Remove
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-4xl hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAdmin;