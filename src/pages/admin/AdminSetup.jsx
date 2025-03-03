import { useState } from "react";

function AdminSetup() {
  const [formData, setFormData] = useState({
    gradeLevel: "",
    employeeNumber: "",
    strand: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({ gradeLevel: "", employeeNumber: "", strand: "" });
  };

  const handleSave = () => {
    console.log("Profile Saved:", formData);
    // Add API call
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF8F0] px-4">
      {/* Header Section */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-2 px-4">
        <h1 className="text-4xl font-bold text-[#FFA500]">SETUP PROFILE</h1>
        <div className="flex space-x-4">
          <img
            src="https://i.imgur.com/mZTPNjN.png"
            alt="Logo 1"
            className="w-16 h-16"
          />
          <img
            src="https://i.imgur.com/zLWyGhA.png"
            alt="Logo 2"
            className="w-16 h-16"
          />
        </div>
      </div>

      {/* Subtitle */}
      <div className="w-full max-w-4xl px-4 mb-6">
        <p className="text-gray-600 text-lg">
          Enter the following information to continue.
        </p>
      </div>

      {/* Form */}
      <div className="p-4 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Affiliation
            </label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="">Select Affiliation</option>
              <option value="STEM">STEM</option>
              <option value="ABM">ABM</option>
              <option value="HUMSS">HUMSS</option>
              <option value="GAS">GAS</option>
              <option value="TVL">TVL</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Employee Number
            </label>
            <input
              type="text"
              name="employeeNumber"
              value={formData.employeeNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Enter Employee Number"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleClear}
            className="px-6 py-2.5 bg-white text-amber-400 border-2 border-amber-400 rounded-full hover:bg-amber-50 transition-colors duration-200 font-bold"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-amber-400 text-white border-2 border-amber-400 rounded-full hover:bg-amber-500 transition-colors duration-200 font-bold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSetup;
