import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../components/student/StudentSidebar";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { TrashIcon } from "@heroicons/react/24/solid";

function AddLost() {
  const [newLostItem, setNewLostItem] = useState("");
  const [newLostItemDesc, setNewLostItemDesc] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLocationLost, setNewLocationLost] = useState("");
  const [newDateLost, setNewDateLost] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [status, setStatus] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    "https://i.imgur.com/v3LZMXQ.jpeg"
  );
  const [isAdding, setIsAdding] = useState(false);

  const navigate = useNavigate();
  const API_URL =
    "https://ust-shs-lost-and-found-management-system.onrender.com";

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setStatus("File size must be less than 5MB.");
    }
  };

  // Handle image deletion
  const handleImageDelete = () => {
    setImageFile(null);
    setPreviewUrl("https://i.imgur.com/v3LZMXQ.jpeg");
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      newLostItem.trim() !== "" &&
      newLostItemDesc.trim() !== "" &&
      newCategory.trim() !== "" &&
      newLocationLost.trim() !== "" &&
      newDateLost.trim() !== ""
    );
  };

  // Handle new lost item submission
  const onSubmitLostItem = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setStatus("You must be logged in to add a lost item.");
        return;
      }

      const emailToNotify = notifyEmail ? user.email : "banana";

      if (!isFormValid()) {
        setStatus("Please fill in all fields.");
        return;
      }

      setIsAdding(true);

      // Upload image to Firebase Storage
      let photoURL = null;
      if (imageFile) {
        const storageRef = ref(storage, `shs-photos/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        photoURL = await getDownloadURL(storageRef);
      }

      const response = await fetch(`${API_URL}/api/lost-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lost_item_name: newLostItem,
          lost_item_desc: newLostItemDesc,
          category: newCategory,
          locationLost: newLocationLost,
          dateLost: newDateLost,
          notifEmail: emailToNotify,
          department: "SHS",
          ...(photoURL && { photoURL }),
        }),
      });

      if (response.ok) {
        setIsAdding(false);
        setShowSuccessPopup(true);

        // Clear form fields
        setNewLostItem("");
        setNewLostItemDesc("");
        setNewCategory("");
        setNewLocationLost("");
        setNewDateLost("");
        setImageFile(null);
        setPreviewUrl("https://i.imgur.com/v3LZMXQ.jpeg");
      } else {
        setIsAdding(false);
        setStatus("Error adding lost item");
      }
    } catch (err) {
      setIsAdding(false);
      setStatus("Error adding lost item");
      console.error(err);
    }
  };

  // Fetch user email on component mount
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FFF8F0]">
      {/* Sidebar - Hidden on mobile */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#FFA500]">
            REPORT LOST ITEM
          </h1>
        </div>

        {/* Add Lost Item Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-10">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="newLostItem"
                className="block text-sm font-medium text-gray-700"
              >
                Item Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="newLostItem"
                value={newLostItem}
                onChange={(e) => setNewLostItem(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                placeholder="Item Name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="newLostItemDesc"
                className="block text-sm font-medium text-gray-700"
              >
                Item Description <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="newLostItemDesc"
                value={newLostItemDesc}
                onChange={(e) => setNewLostItemDesc(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                placeholder="Item Description"
                required
              />
            </div>

            <div>
              <label
                htmlFor="newCategory"
                className="block text-sm font-medium text-gray-700"
              >
                Category <span className="text-red-600">*</span>
              </label>
              <select
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                {[
                  "Personal Belongings",
                  "Electronics",
                  "School Supplies & Stationery",
                  "Tumblers & Food Containers",
                  "Clothing & Apparell",
                  "Money & Valuables",
                  "Documents",
                  "Other",
                ].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notification
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="notifyEmail"
                  checked={notifyEmail}
                  onChange={() => setNotifyEmail(!notifyEmail)}
                  className="mr-2"
                />
                <label htmlFor="notifyEmail" className="text-sm text-gray-700">
                  Notify my email ({userEmail})
                </label>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="newLocationLost"
                className="block text-sm font-medium text-gray-700"
              >
                Location Lost <span className="text-red-600">*</span>
              </label>
              <select
                id="newLocationLost"
                value={newLocationLost}
                onChange={(e) => setNewLocationLost(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                required
              >
                <option value="" disabled>
                  Select Location
                </option>
                {[
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
                  "14th Floor",
                  "15th Floor",
                ].map((floor) => (
                  <option key={floor} value={floor}>
                    {floor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="newDateLost"
                className="block text-sm font-medium text-gray-700"
              >
                Date Lost <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="newDateLost"
                min="2021-12-10"
                max={new Date().toISOString().split("T")[0]}
                value={newDateLost}
                onChange={(e) => setNewDateLost(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Image (Max 5MB)
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex items-center gap-2 mt-1">
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <img
                    src={previewUrl}
                    alt="Upload Preview"
                    className="w-40 h-30 object-cover rounded-lg border border-gray-300"
                  />
                </label>
                {imageFile && (
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    className="cursor-pointer text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setNewLostItem("");
                setNewLostItemDesc("");
                setNewCategory("");
                setNewLocationLost("");
                setNewDateLost("");
                setImageFile(null);
                setPreviewUrl("https://i.imgur.com/v3LZMXQ.jpeg");
              }}
              className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 border border-gray-300 rounded-4xl hover:bg-gray-400 transition-colors duration-200"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmationModal(true)}
              disabled={!isFormValid()}
              className={`cursor-pointer px-4 py-2 bg-green-500 text-white border border-green-500 rounded-4xl ${
                isFormValid()
                  ? "hover:bg-green-600"
                  : "opacity-50 cursor-not-allowed"
              } transition-colors duration-200`}
            >
              Submit
            </button>
          </div>
        </form>

        {/* Status Message */}
        <p className="text-red-600 mt-4">{status}</p>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">Make sure all information is correct.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-4xl hover:bg-gray-400 transition-colors duration-200"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  onSubmitLostItem();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-4xl hover:bg-green-600 transition-colors duration-200"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adding... Popup */}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <h2 className="text-lg font-medium text-gray-800">Adding...</h2>
              <p className="text-s text-gray-500">
                Please wait while we add your item.
              </p>
            </div>
          </div>
        </div>
      )}

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
                Item added successfully!
              </h2>
              <p className="text-s text-gray-500">
                You'll get an update if we find a matching item.
              </p>
            </div>
            <button
              onClick={() => navigate("/student-items")}
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

export default AddLost;
