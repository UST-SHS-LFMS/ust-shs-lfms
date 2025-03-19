import { useState, useEffect } from "react";

function EditItem({ item, onClose, onDelete, onSave }) {
  const [formData, setFormData] = useState({
    category: "",
    dateLost: "",
    locationLost: "",
    lost_item_desc: "",
    lost_item_name: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Define options for Category and Location Lost dropdowns
  const categories = [
    "Personal Belongings",
    "Electronics",
    "School Supplies & Stationery",
    "Tumblers & Food Containers",
    "Clothing & Apparell",
    "Money & Valuables",
    "Documents",
    "Other",
  ];
  const locations = [
    "1st Floor",
    "2nd Floor",
    "3rd Floor",
    "4th Floor",
    "5th Floor (Cafeteria)",
    "6th Floor (Library)",
    "7th Floor",
    "8th Floor",
    "9th Floor",
    "10th Floor",
    "11th Floor",
    "12th Floor",
    "13th Floor",
    "14th Floor",
    "15th Floor",
  ];

  const API_URL =
    "https://ust-shs-lost-and-found-management-system.onrender.com";

  // Populate form with selected item details
  useEffect(() => {
    if (item) {
      setFormData({
        category: item.category || "",
        dateLost: item.dateLost || "",
        locationLost: item.locationLost || "",
        lost_item_desc: item.lost_item_desc || "",
        lost_item_name: item.lost_item_name || "",
      });
    }
  }, [item]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Save
  const handleSave = async () => {
    try {
      console.log("📤 Sending update request for lostID:", item.lostID);
      console.log("📤 Payload:", formData);
  
      const response = await fetch(`${API_URL}/api/items/${item.lostID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
  
      console.log("✅ Item updated successfully");
  
      onSave(item.lostID, formData); // ✅ Update the parent component's state immediately
      setShowSuccessPopup(true); // Show success popup
    } catch (error) {
      console.error("🔥 Error updating item:", error.message);
      alert(`Error updating item: ${error.message}`);
    }
  };  

  // Handle Delete
  const handleDelete = async () => {
    try {
      console.log("🗑️ Sending delete request for lostID:", item.lostID);

      const response = await fetch(`${API_URL}/api/items/${item.lostID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      console.log("✅ Item deleted successfully");
      onDelete(item.lostID); // ✅ Remove from UI only if the API succeeds
      onClose();
    } catch (error) {
      console.error("🔥 Error deleting item:", error.message);
      alert(`Error deleting item: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl relative">
        {/* Close "x" button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date Lost
              </label>
              <input
                type="date"
                name="dateLost"
                value={formData.dateLost}
                onChange={handleChange}
                className="cursor-pointer w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location Lost
              </label>
              <select
                name="locationLost"
                value={formData.locationLost}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              >
                <option value="">Select a location</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Name
              </label>
              <input
                type="text"
                name="lost_item_name"
                value={formData.lost_item_name}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="lost_item_desc"
                value={formData.lost_item_desc}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleDelete}
            className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-4xl hover:bg-red-600 transition-colors duration-200"
          >
            Remove
          </button>
          <button
            onClick={handleSave}
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="flex flex-col items-center gap-2 mb-4">
              <img
                src="https://i.imgur.com/eFvkfQz.png"
                alt="Checkmark"
                className="w-12 h-12"
              />
              <h2 className="text-lg font-medium text-gray-800">
                Item updated successfully!
              </h2>
              <p className="text-s text-gray-500">
                Your changes have been saved.
              </p>
            </div>
            <button
              onClick={() => {
                setShowSuccessPopup(false); // Close success popup
                onClose(); // Close the edit modal
              }}
              className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-4xl hover:bg-green-600 transition-colors duration-200"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditItem;
