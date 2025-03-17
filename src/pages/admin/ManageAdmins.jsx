import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import AdminSidebar from "../../components/admin/AdminSidebar";
import EditAdmin from "../../components/admin/EditAdmin";

function ManageAdmins() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();
  const API_URL = "https://ust-shs-lost-and-found-management-system.onrender.com";
  
  // Fetch admins from API
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admins`);
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  // Handle opening the edit modal
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  // Callback for when an admin is deleted
  const handleAdminDeleted = (deletedId) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== deletedId)); // Remove the deleted admin
    setIsEditModalOpen(false); // Close the modal
  };

  // Callback for when an admin's role is updated
  const handleRoleUpdated = (updatedId, newRole) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === updatedId ? { ...emp, role: newRole } : emp
      )
    ); // Update the role
    setIsEditModalOpen(false); // Close the modal
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter employees based on search query (case insensitive)
  const filteredEmployees = employees.filter((employee) =>
    employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className="flex min-h-screen bg-[#FFF8F0]">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#FFA500]">MANAGE ADMINS</h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-64 rounded-4xl bg-gray-200"
              />

              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/add-admin")}
            className="px-4 py-2 bg-blue-500 text-white rounded-4xl hover:bg-blue-600"
          >
            + Add Admin
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Employee ID</th>
                <th className="px-6 py-3 text-left">Full Name</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Date Added</th>
                <th className="px-6 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-2 text-sm">
                    {employee.employeeNumber}
                  </td>
                  <td className="px-6 py-2 text-sm">{employee.fullName}</td>
                  <td className="px-6 py-2 text-sm">{employee.role}</td>
                  <td className="px-6 py-2 text-sm">{employee.createdAt}</td>
                  <td className="px-6 py-2">
                    <button
                      onClick={() => handleEditClick(employee)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Admin Modal */}
      <EditAdmin
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={selectedEmployee}
        onDeleteSuccess={handleAdminDeleted} // Pass a callback for successful deletion
        onSaveSuccess={handleRoleUpdated} // Pass a callback for successful role update
      />
    </div>
  );
}

export default ManageAdmins;
