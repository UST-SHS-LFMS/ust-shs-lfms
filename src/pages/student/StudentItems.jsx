import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FunnelIcon, MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import StudentSidebar from "../../components/student/StudentSidebar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EditItem from "../../components/student/EditItem";

function StudentItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); // State for modal
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email;

        const fetchItems = async () => {
          try {
            const response = await fetch(
              `http://localhost:3001/api/items?email=${userEmail}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch items");
            }
            const data = await response.json();
            setItems(data);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };

        fetchItems();
      } else {
        setLoading(false);
        setError("User not authenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle opening modal
  const handleEditClick = (item) => {
    setSelectedItem(item);
  };

  // Handle closing modal
  const handleClose = () => {
    setSelectedItem(null);
  };

  // Handle saving edits
const handleSave = async (lostID, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/items/${lostID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update item");
      }
  
      // Update the UI
      setItems((prevItems) =>
        prevItems.map((item) => (item.lostID === lostID ? { ...item, ...updatedData } : item))
      );
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  
  // Handle deleting an item
  const handleDelete = async (lostID) => {
    try {
      const response = await fetch(`http://localhost:3001/api/items/${lostID}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
  
      // Update the UI
      setItems((prevItems) => prevItems.filter((item) => item.lostID !== lostID));
      onClose(); // Close the modal after deleting
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF8F0]">
      <StudentSidebar />

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#FFA500]">MY LOST ITEMS</h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-64 rounded-lg bg-[#F3E6FF]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
            </div>
            <button className="flex items-center">
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-black text-lg">Loading...</div>
        ) : (
          /* Table */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {items.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No items found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left">Lost ID</th>
                    <th className="px-6 py-3 text-left">Item Name</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3 text-left">Date Lost</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.lostID}>
                      <td className="px-6 py-2 text-sm">{item.lostID}</td>
                      <td className="px-6 py-2 text-sm">{item.lost_item_name}</td>
                      <td className="px-6 py-2 text-sm">{item.category}</td>
                      <td className="px-6 py-2 text-sm">{item.dateLost}</td>
                      <td className="px-6 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "Found"
                              ? "bg-green-500 text-white"
                              : item.status === "Matched"
                              ? "bg-orange-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-2">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleEditClick(item)}
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* EditItem Modal */}
      {selectedItem && (
        <EditItem item={selectedItem} onClose={handleClose} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default StudentItems;
