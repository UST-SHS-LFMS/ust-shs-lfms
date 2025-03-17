import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function UserSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { uid, email } = location.state || {};
  const API_URL =
    "https://ust-shs-lost-and-found-management-system.onrender.com";

  const [formData, setFormData] = useState({
    gradeLevel: "",
    studentNumber: "",
    strand: "",
    affiliation: "",
    employeeNumber: "",
    role: "student", // Default role is student
  });

  const [isFaculty, setIsFaculty] = useState(false);

  useEffect(() => {
    // Check if the email contains ".shs@gmail.com" to determine if the user is faculty
    if (email && email.includes(".shs@gmail.com")) {
      setIsFaculty(true);
      setFormData((prevData) => ({ ...prevData, role: "faculty" })); // Update role to faculty
    }
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // studentNumber and employeeNumber
    if (
      (name === "studentNumber" || name === "employeeNumber") &&
      !/^\d{0,10}$/.test(value)
    ) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Prepare the data to be sent based on the user's role
      const requestBody = isFaculty
        ? {
            affiliation: formData.affiliation,
            employeeNumber: formData.employeeNumber,
            role: formData.role, // role is "faculty"
          }
        : {
            gradeLevel: formData.gradeLevel,
            studentNumber: formData.studentNumber,
            strand: formData.strand,
            role: formData.role, // role is "student"
          };

      const response = await fetch(`${API_URL}/api/users/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        navigate(`/student-profile`); // Navigate to the correct profile page
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
        <h1 className="text-4xl font-bold text-[#FFA500]">REGISTRATION</h1>
      </div>

      <div className="w-full max-w-4xl px-4">
        <p className="text-gray-600 text-lg">
          Enter the following information to continue.
        </p>
      </div>

      <div className="p-4 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isFaculty ? (
            // Faculty Form
            <>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Affiliation
                </label>
                <select
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Affiliation</option>
                  <option value="STEM">STEM</option>
                  <option value="ABM">ABM</option>
                  <option value="HUMSS">HUMSS</option>
                  <option value="GAS">GAS</option>
                  <option value="TVL">TVL</option>
                </select>

                <label className="block text-gray-700 font-semibold mt-4">
                  Employee Number
                </label>
                <input
                  type="text"
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter Employee Number"
                />
              </div>
            </>
          ) : (
            // Student Form
            <>
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
                <label className="block text-gray-700 font-semibold">
                  Strand
                </label>
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
            </>
          )}
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

export default UserSetup;
