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

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleAdminDeleted = (deletedId) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== deletedId));
    setIsEditModalOpen(false);
  };

  const handleRoleUpdated = (updatedId, newRole) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedId ? { ...emp, role: newRole } : emp))
    );
    setIsEditModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FFF8F0] overflow-hidden">
      <AdminSidebar className="hidden md:block" />

      <div className="flex-1 p-4 md:p-6 w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-[#FFA500] whitespace-nowrap mr-4">
            MANAGE ADMINS
          </h1>
          <div className="relative w-full md:w-64">
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-200 text-sm"
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/add-admin")}
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm md:text-base"
          >
            + Add Admin
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[600px] md:min-w-full">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left">Employee ID</th>
                  <th className="px-4 md:px-6 py-3 text-left">Full Name</th>
                  <th className="px-4 md:px-6 py-3 text-left">Role</th>
                  <th className="px-4 md:px-6 py-3 text-left">Date Added</th>
                  <th className="px-4 md:px-6 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-4 md:px-6 py-2 text-sm">
                      {employee.employeeNumber}
                    </td>
                    <td className="px-4 md:px-6 py-2 text-sm">
                      {employee.fullName}
                    </td>
                    <td className="px-4 md:px-6 py-2 text-sm">
                      {employee.role}
                    </td>
                    <td className="px-4 md:px-6 py-2 text-sm">
                      {employee.createdAt}
                    </td>
                    <td className="px-4 md:px-6 py-2">
                      <button
                        onClick={() => handleEditClick(employee)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <PencilSquareIcon className="cursor-pointer w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EditAdmin
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={selectedEmployee}
        onDeleteSuccess={handleAdminDeleted}
        onSaveSuccess={handleRoleUpdated}
      />
    </div>
  );
}

export default ManageAdmins;
