import React, { useState } from "react";

const ItemInformation = ({ isOpen, onClose, item, activeTab }) => {
  const [isClaimFormOpen, setClaimFormOpen] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [fullName, setFullName] = useState("");

  if (!isOpen || !item) return null;

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    await moveItem(); // Trigger the moveItem function
    setClaimFormOpen(false); // Close the claim form
  };

  const moveItem = async () => {
    try {
      const docId = item.id;

      if (!docId) {
        alert("No item ID found!");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/moveItem/${docId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentNumber, fullName }), // Include form data in the request
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Item claimed successfully");
        onClose(); // Close the modal after the move
      } else {
        alert("Failed to claim item");
      }
    } catch (error) {
      console.error("Error claiming item:", error);
      alert("An error occurred while claiming the item");
    }
  };

  const cancelMatch = async () => {
    try {
      const docId = item.id;
      console.log("Match ID:", docId);

      if (!docId) {
        alert("No item ID found!");
        return;
      }

      const cancelResponse = await fetch(
        `http://localhost:3001/api/cancelMatch/${docId}`,
        {
          method: "DELETE",
        }
      );

      if (!cancelResponse.ok) {
        throw new Error("Failed to cancel match");
      }

      const cancelData = await cancelResponse.json();

      if (!cancelData.success) {
        throw new Error("Failed to cancel match");
      }

      alert("Match cancelled successfully");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error cancelling match:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const renderFoundContent = () => (
    <>
      <p>
        <strong>Category:</strong> {item.category}
      </p>
      <p>
        <strong>Date Found:</strong> {item.dateFound}
      </p>
      <p>
        <strong>Found ID:</strong> {item.foundID}
      </p>
      <p>
        <strong>Description:</strong> {item.found_item_desc}
      </p>
      <p>
        <strong>Item Name:</strong> {item.found_item_name}
      </p>
      <p>
        <strong>Location Found:</strong> {item.locationFound}
      </p>
      <p>
        <strong>Status:</strong> {item.status}
      </p>
    </>
  );

  const renderLostContent = () => (
    <>
      <p>
        <strong>Category:</strong> {item.category}
      </p>
      <p>
        <strong>Date Lost:</strong> {item.dateLost}
      </p>
      <p>
        <strong>Lost ID:</strong> {item.lostID}
      </p>
      <p>
        <strong>Description:</strong> {item.lost_item_desc}
      </p>
      <p>
        <strong>Item Name:</strong> {item.lost_item_name}
      </p>
      <p>
        <strong>Location Lost:</strong> {item.locationLost}
      </p>
      <p>
        <strong>Status:</strong> {item.status}
      </p>
    </>
  );

  const renderMatchContent = () => {
    const { foundItem = {}, lostItem = {} } = item;

    return (
      <>
        <h3 className="text-md font-bold">Found Item</h3>
        <p>
          <strong>Category:</strong> {foundItem.category}
        </p>
        <p>
          <strong>Date Found:</strong> {foundItem.dateFound}
        </p>
        <p>
          <strong>Found ID:</strong> {foundItem.foundID}
        </p>
        <p>
          <strong>Description:</strong> {foundItem.found_item_desc}
        </p>
        <p>
          <strong>Item Name:</strong> {foundItem.found_item_name}
        </p>
        <p>
          <strong>Location Found:</strong> {foundItem.locationFound}
        </p>
        <p>
          <strong>Status:</strong> {foundItem.status}
        </p>

        <hr className="my-2" />

        <h3 className="text-md font-bold">Lost Item</h3>
        <p>
          <strong>Category:</strong> {lostItem.category}
        </p>
        <p>
          <strong>Date Lost:</strong> {lostItem.dateLost}
        </p>
        <p>
          <strong>Lost ID:</strong> {lostItem.lostID}
        </p>
        <p>
          <strong>Description:</strong> {lostItem.lost_item_desc}
        </p>
        <p>
          <strong>Item Name:</strong> {lostItem.lost_item_name}
        </p>
        <p>
          <strong>Location Lost:</strong> {lostItem.locationLost}
        </p>
        <p>
          <strong>Status:</strong> {lostItem.status}
        </p>
      </>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "FOUND ITEMS":
        return renderFoundContent();
      case "LOST ITEMS":
        return renderLostContent();
      case "MATCH ITEMS":
        return renderMatchContent();
      case "ARCHIVE":
        return renderFoundContent(); // Assuming archive displays found content
      default:
        return <p>No information available.</p>;
    }
  };

  const renderButton = () => {
    switch (activeTab) {
      case "FOUND ITEMS":
        return (
          <button
            onClick={() => setClaimFormOpen(true)} // Open the claim form
            className="px-8 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
          >
            Claim
          </button>
        );
      case "MATCH ITEMS":
        return (
          <button
            onClick={cancelMatch}
            className="px-8 py-2 bg-gray-500 text-white rounded-3xl hover:bg-gray-600"
          >
            Cancel Match
          </button>
        );
      case "LOST ITEMS":
      case "ARCHIVE":
        return null; // No button for these cases
      default:
        return null;
    }
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-1/2 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          {/* Container for Left and Right Sections */}
          <div className="flex space-x-0">
            {/* Left Section: Item Details */}
            <div className="w-1/2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  {activeTab === "FOUND ITEMS"
                    ? "Found Item Details"
                    : activeTab === "LOST ITEMS"
                      ? "Lost Item Details"
                      : activeTab === "MATCH ITEMS"
                        ? "Matching Item Details"
                        : activeTab === "ARCHIVE"
                          ? "Archived Item Details"
                          : "bruh"}
                </h2>
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                {renderContent()}
              </div>
            </div>

            {/* Right Section: Item Image */}
            <div className="w-1/2 flex justify-center items-center">
              <img
                src="https://i.imgur.com/R6u77UJ.png"
                alt="Item"
                className="w-48 h-48 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Conditional Button */}
          <div className="mt-4 text-right">{renderButton()}</div>
        </div>
      </div>

      {/* Claim Form Popup */}
      {isClaimFormOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-1/3 relative">
            <button
              onClick={() => setClaimFormOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Claimed by</h2>
            <form onSubmit={handleClaimSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Student Number"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
                >
                  Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemInformation;
