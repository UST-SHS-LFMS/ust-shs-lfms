import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function StudentSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { uid } = location.state || {};

  const [formData, setFormData] = useState({
    gradeLevel: "",
    studentNumber: "",
    strand: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${uid}`, {
        method: "PUT", // Use PUT since we are updating an existing user document
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/student-profile");
      } else {
        console.error("Error saving profile:", await response.json());
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF8F0] px-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 px-4">
        <h1 className="text-4xl font-bold text-[#FFA500]">SETUP PROFILE</h1>
      </div>

      <div className="w-full max-w-4xl px-4">
        <p className="text-gray-600 text-lg">
          Enter the following information to continue.
        </p>
      </div>

      <div className="p-4 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold">
              Grade Level
            </label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Grade Level</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>

            <label className="block text-gray-700 font-semibold mt-4">
              Student Number
            </label>
            <input
              type="text"
              name="studentNumber"
              value={formData.studentNumber}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
              placeholder="Enter Student Number"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Strand</label>
            <select
              name="strand"
              value={formData.strand}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Strand</option>
              <option value="STEM">STEM</option>
              <option value="ABM">ABM</option>
              <option value="HUMSS">HUMSS</option>
              <option value="GAS">GAS</option>
              <option value="TVL">TVL</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
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
}

export default StudentSetup;
