import { useState, useEffect } from "react";
import Sidebar from "./AdminSidebar";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const AddAdminForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    employeeNumber: "",
    role: "Support Staff", // Default selection
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Check if all fields are filled to enable the Submit button
  useEffect(() => {
    const { fullName, email, employeeNumber, role } = formData;
    setIsFormValid(
      fullName.trim() !== "" &&
        email.trim() !== "" &&
        employeeNumber.trim() !== "" &&
        role.trim() !== ""
    );
  }, [formData]);

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
          <div className="col-span-2 flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => window.history.back()} // Navigate back
              className="px-4 py-2 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 transition-colors duration-200"
            >
              Back
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-gray-300 text-gray-700 border border-gray-300 rounded-4xl hover:bg-gray-400 transition-colors duration-200"
              >
                Clear
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-green-500 text-white border border-green-500 rounded-4xl ${
                  !isFormValid || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-600"
                } transition-all duration-200`}
                disabled={loading || !isFormValid}
              >
                {loading ? "Adding..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Popup Message */}
      {/* Popup Message */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            {/* Close button (x mark) */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            {/* Checkmark image and message */}
            <div className="flex flex-col items-center gap-2 mb-4">
              <img
                src="https://i.imgur.com/eFvkfQz.png"
                alt="Checkmark"
                className="w-12 h-12"
              />
              <h2 className="text-lg font-medium text-gray-800">
                Admin added successfully!
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAdminForm;
