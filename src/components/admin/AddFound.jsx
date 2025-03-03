import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AddFound() {
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(new Set()); // Track matched pairs to avoid duplicate checks

  const [newFoundItem, setNewFoundItem] = useState("");
  const [newFoundItemDesc, setNewFoundItemDesc] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLocationFound, setNewLocationFound] = useState("");
  const [newDateFound, setNewDateFound] = useState("");
  const [status, setStatus] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State for modal visibility

  const navigate = useNavigate();
  const API_URL = "http://localhost:3001/api";

  // Fetch data
  const getFoundItems = async () => {
    try {
      const response = await fetch(`${API_URL}/found-items`);
      const data = await response.json();
      setFoundItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getLostItems = async () => {
    try {
      const response = await fetch(`${API_URL}/lost-items`);
      const data = await response.json();
      setLostItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`);
      const data = await response.json();
      setMatches(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Efficient keyword-based matching function
  const matchItems = (lostItem, foundItem) => {
    if (!lostItem.lost_item_desc || !foundItem.found_item_desc) {
      console.error("Missing item description:", lostItem, foundItem);
      return false;
    }

    if (lostItem.status !== "Pending" || foundItem.status !== "Pending") {
      return false;
    }

    // Ensure categories match
    if (lostItem.category !== foundItem.category) {
      return false;
    }

    // Convert descriptions into keyword sets
    const lostKeywords = new Set(
      lostItem.lost_item_desc.toLowerCase().split(/\s+/)
    );
    const foundKeywords = new Set(
      foundItem.found_item_desc.toLowerCase().split(/\s+/)
    );

    // Check if there's any overlap
    return [...lostKeywords].some((keyword) => foundKeywords.has(keyword));
  };

  // Automatically match found items with lost items
  useEffect(() => {
    lostItems.forEach((lostItem) => {
      foundItems.forEach((foundItem) => {
        const matchKey = `${lostItem.id}-${foundItem.id}`;

        if (!matchedPairs.has(matchKey) && matchItems(lostItem, foundItem)) {
          createMatch(lostItem, foundItem);
          setMatchedPairs((prev) => new Set(prev).add(matchKey)); // Prevent duplicate matches
        }
      });
    });
  }, [lostItems, foundItems]); // Ensures matches only update when lists change

  // Create a match entry in the database
  const createMatch = async (lostItem, foundItem) => {
    try {
      const response = await fetch(`${API_URL}/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lostDocId: lostItem.id,
          foundDocId: foundItem.id,
          lostID: lostItem.lostID,
          foundID: foundItem.foundID,
        }),
      });

      if (response.ok) {
        console.log("Match Created");

        const lostItemEmail = lostItem.notifEmail;

        // Prepare the email content
        const subject = "Match Found for Your Lost Item";
        const message = `
          <h1>Match Found!</h1>
          <p>Your lost item ("${lostItem.lost_item_name}") has been matched with a found item.</p>
          <p>Location: ${lostItem.locationLost} and ${foundItem.locationFound}</p>
          <p>Date Matched: ${new Date().toISOString()}</p>
          <p>Thank you for using our service!</p>
        `;

        // Send email by making a request to the backend's /send-email endpoint
        const emailResponse = await fetch(`${API_URL}/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: lostItemEmail,
            subject: subject,
            message: message,
          }),
        });

        if (emailResponse.ok) {
          console.log("Email sent successfully!");
        } else {
          console.error("Failed to send email");
        }

        // Optional: Update frontend or fetch new items
        getMatches();
        getLostItems();
        getFoundItems();
      } else {
        console.error("Match Not Found");
      }
    } catch (err) {
      console.error("Error creating match:", err);
    }
  };

  // Handle new found item submission
  const onSubmitFoundItem = async () => {
    try {
      if (
        !newFoundItem ||
        !newFoundItemDesc ||
        !newCategory ||
        !newLocationFound ||
        !newDateFound
      ) {
        setStatus("Please fill in all fields.");
        return;
      }

      const response = await fetch(`${API_URL}/found-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          found_item_name: newFoundItem,
          found_item_desc: newFoundItemDesc,
          category: newCategory,
          locationFound: newLocationFound,
          dateFound: newDateFound,
          department: "SHS",
        }),
      });

      if (response.ok) {
        getFoundItems();
        getMatches(); // Call getMatches() only after successful submission
        setStatus("Found item added successfully!");

        // Clear form fields
        setNewFoundItem("");
        setNewFoundItemDesc("");
        setNewCategory("");
        setNewLocationFound("");
        setNewDateFound("");
      } else {
        setStatus("Error adding found item");
      }
    } catch (err) {
      setStatus("Error adding found item");
      console.error(err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getLostItems();
    getFoundItems();
  }, []); // **getMatches() is NOT called here**

  return (
    <div className="flex min-h-screen bg-[#FFF8F0]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#FFA500]">ADD FOUND ITEM</h1>
        </div>

        {/* Add Found Item Form */}
        <form className="grid grid-cols-2 gap-8 p-10">
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="newFoundItem"
                className="block text-sm font-medium text-gray-700"
              >
                Item Name
                <div className="inline text-red-600">*</div>
              </label>
              <input
                type="text"
                id="newFoundItem"
                value={newFoundItem}
                onChange={(e) => setNewFoundItem(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                placeholder="Item Name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="newFoundItemDesc"
                className="block text-sm font-medium text-gray-700"
              >
                Item Description
                <div className="inline text-red-600">*</div>
              </label>
              <input
                type="text"
                id="newFoundItemDesc"
                value={newFoundItemDesc}
                onChange={(e) => setNewFoundItemDesc(e.target.value)}
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
                Category
                <div className="inline text-red-600">*</div>
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
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="newLocationFound"
                className="block text-sm font-medium text-gray-700"
              >
                Location Found
                <div className="inline text-red-600">*</div>
              </label>
              <select
                id="newLocationFound"
                value={newLocationFound}
                onChange={(e) => setNewLocationFound(e.target.value)}
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
                  "13th Floor",
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
                htmlFor="newDateFound"
                className="block text-sm font-medium text-gray-700"
              >
                Date Found
                <div className="inline text-red-600">*</div>
              </label>
              <input
                type="date"
                id="newDateFound"
                max={new Date().toISOString().split("T")[0]}
                value={newDateFound}
                onChange={(e) => setNewDateFound(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 transition-colors duration-200"
            >
              Back
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setNewFoundItem("");
                  setNewFoundItemDesc("");
                  setNewCategory("");
                  setNewLocationFound("");
                  setNewDateFound("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-4xl hover:bg-gray-100 not-visited:transition-colors duration-200"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmationModal(true)} // Show confirmation modal
                className="px-4 py-2 bg-green-500 text-white border border-green-600 rounded-4xl hover:bg-green-600 transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </div>
        </form>

        <p className="text-red-600 mt-4">{status}</p>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">Make sure all information is correct.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  onSubmitFoundItem();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddFound;