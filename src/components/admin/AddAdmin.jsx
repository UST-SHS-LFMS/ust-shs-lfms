import { useState } from "react";
import Sidebar from "./AdminSidebar";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const AddAdminForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    employeeNumber: "",
    role: "Support Staff", // Default selection
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({
      fullName: "",
      email: "",
      employeeNumber: "",
      role: "Super Admin",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/add-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowPopup(true);
        setFormData({
          fullName: "",
          email: "",
          employeeNumber: "",
          role: "Super Admin",
        });
      } else {
        console.error("Failed to add admin");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF8F0]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#FFA500]">ADD ADMIN</h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-64 rounded-lg bg-[#F3E6FF]"
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
            </div>

            <button className="flex items-center">
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Admin Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8 p-10">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                placeholder="Juan Dela Cruz"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                placeholder="example@company.com"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="employeeNumber"
                value={formData.employeeNumber}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                placeholder="2022178812"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role <span className="text-red-600">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                required
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Support Staff">Support Staff</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-white text-amber-400 border-2 border-amber-400 rounded-4xl hover:bg-amber-100 font-bold"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-white border border-amber-400 rounded-4xl hover:bg-amber-100 font-bold"
              disabled={loading}
            >
              {loading ? "Adding..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Popup Message */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <h2 className="text-lg font-medium text-gray-800">
                Admin added successfully
              </h2>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAdminForm;
