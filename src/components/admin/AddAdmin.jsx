import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./AdminSidebar";

const API_URL = "https://ust-shs-lost-and-found-management-system.onrender.com";

const AddAdminForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    employeeNumber: "",
    role: "", // Default selection
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

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
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  return (
    <div className="flex min-h-screen bg-[#FFF8F0]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#FFA500]">ADD ADMIN</h1>
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
                maxLength="100"
                required
              />
              {/* Display character count */}
              <p className="text-sm text-gray-500 mt-1">
                {formData.fullName.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                UST Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange(e);
                }}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                placeholder="juandcruz@ust.edu.ph"
                maxLength="50"
                required
              />
              {/* Display character count */}
              <p className="text-sm text-gray-500 mt-1">
                {formData.email.length}/50 characters
              </p>

              {/* Email validation message */}
              {!formData.email.endsWith("@ust.edu.ph") &&
                formData.email.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    Email must end with @ust.edu.ph
                  </p>
                )}
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
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                  if (value.length > 10) value = value.slice(0, 10); // Restrict to 10 digits
                  handleChange({ target: { name: "employeeNumber", value } });
                }}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                placeholder="0123456789"
                maxLength="10"
                required
              />
              {/* Display character count */}
              <p className="text-sm text-gray-500 mt-1">
                {formData.employeeNumber.length}/10 characters
              </p>

              {/* Validation Message */}
              {formData.employeeNumber.length > 0 &&
                formData.employeeNumber.length !== 10 && (
                  <p className="text-sm text-red-600 mt-1">
                    Employee number must be exactly 10 digits.
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role <span className="text-red-600">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="cursor-pointer mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
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
              className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 transition-colors duration-200"
            >
              Back
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClear}
                className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 border border-gray-300 rounded-4xl hover:bg-gray-400 transition-colors duration-200"
              >
                Clear
              </button>
              <button
                type="submit"
                className={`cursor-pointer px-4 py-2 bg-green-500 text-white border border-green-500 rounded-4xl ${
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

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">Make sure all information is correct.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 rounded-4xl hover:bg-gray-400 transition-colors duration-200"
              >
                No
              </button>
              <button
                onClick={async () => {
                  setShowConfirmationModal(false);
                  setLoading(true);

                  try {
                    const response = await fetch(`${API_URL}/api/add-admin`, {
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
                }}
                className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-4xl hover:bg-green-600 transition-colors duration-200"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Message */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
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

            {/* Done button */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/manage-admins")}
                className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-4xl hover:bg-green-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAdminForm;
