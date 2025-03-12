import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MagnifyingGlassIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { FunnelIcon, ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";
import ItemInformation from "../../components/admin/ItemInformation";
import AdminSidebar from "../../components/admin/AdminSidebar";
import ItemFilter from "../../components/admin/ItemFilter";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "qrcode";
import { Timestamp } from "firebase/firestore";

const initialFilterState = {
  date: "",
  orderBy: "",
  category: "",
  status: "",
};

const tabItems = [
  "FOUND ITEMS",
  "LOST ITEMS",
  "POTENTIAL MATCHES",
  "ARCHIVE",
  "VIEW CICS",
];

const formatTimestamp = (timestamp) => {
  if (timestamp instanceof Timestamp) {
    const date = new Date(timestamp.toDate());
    return date.toLocaleDateString();
  } else if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  } else if (timestamp && typeof timestamp === "string") {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
  return "N/A";
};

function AdminItems() {
  const navigate = useNavigate();
  const [isItemInformationOpen, setIsItemInformationOpen] = useState(false);
  const [isItemFilterOpen, setIsItemFilterOpen] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "FOUND ITEMS"
  );
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [matchItems, setMatchItems] = useState([]);
  const [archiveItems, setArchiveItems] = useState([]);
  const [cicsItems, setCicsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [filters, setFilters] = useState(initialFilterState);
  const [categories, setCategories] = useState([
    "Personal Belongings",
    "Electronics",
    "School Supplies & Stationery",
    "Tumblers & Food Containers",
    "Clothing & Apparell",
    "Money & Valuables",
    "Documents",
    "Other",
  ]);
  const [statuses, setStatuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [qrCodes, setQrCodes] = useState({});

  const getActiveEndpoint = useCallback(() => {
    switch (activeTab) {
      case "FOUND ITEMS":
        return "found-items";
      case "LOST ITEMS":
        return "lost-items";
      case "POTENTIAL MATCHES":
        return "matches";
      case "ARCHIVE":
        return "archives";
      case "VIEW CICS":
        return "found-items"; // Changed to use the main found-items endpoint
      default:
        return "";
    }
  }, [activeTab]);

  const getDateFieldForTab = useCallback((tab) => {
    switch (tab) {
      case "FOUND ITEMS":
        return "dateFound";
      case "LOST ITEMS":
        return "dateLost";
      case "POTENTIAL MATCHES":
        return "matchTimestamp";
      case "ARCHIVE":
        return "date";
      case "VIEW CICS":
        return "dateFound";
      default:
        return "date";
    }
  }, []);

  //window.location.origin automatically switches between localhost and deployed domain for later
  const generateQRCode = useCallback(async (item) => {
    try {
      const itemUrl = `${window.location.origin}/admin/items/${item.id || item.matchId}`;
      const qrCodeDataURL = await QRCode.toDataURL(itemUrl);
      setQrCodes((prevQrCodes) => ({
        ...prevQrCodes,
        [item.id || item.matchId]: qrCodeDataURL,
      }));
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }, []);
  
  

  const handleDownloadPDF = async () => {
    try {
      // Fetch the PDF
      const response = await fetch("http://localhost:3001/api/generate-pdf", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "LostAndFoundReport.pdf";
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);

      alert("Failed to download PDF. Please try again later.");
    }
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const endpoint = getActiveEndpoint();
    const dateField = getDateFieldForTab(activeTab);

    console.log("Current activeTab:", activeTab);
    console.log("Endpoint:", endpoint);
    console.log("DateField:", dateField);

    try {
      const response = await axios.get(
        `http://localhost:3001/api/${endpoint}`,
        {
          params: {
            dateField,
            date: filters.date || "",
            orderBy: filters.orderBy || "",
            category: filters.category || "",
            status: filters.status || "",
            department: activeTab === "VIEW CICS" ? "CICS" : undefined,
          },
        }
      );

      let processedData = response.data;
      console.log(`Fetched ${activeTab} data:`, processedData); // Add this line for debugging

      if (activeTab === "FOUND ITEMS" || activeTab === "LOST ITEMS") {
        processedData = processedData.filter(
          (item) => item.department === "SHS"
        );
      }

      switch (activeTab) {
        case "FOUND ITEMS":
          setFoundItems(processedData);
          processedData.forEach(generateQRCode);
          break;
        case "LOST ITEMS":
          setLostItems(processedData);
          processedData.forEach(generateQRCode);
          break;
        case "POTENTIAL MATCHES":
          // Enhanced match items processing
          const matchItemsData = processedData.map((item) => {
            const processed = {
              ...item,
              id: item.matchId || item.id || item.newMatchID,
              matchId: item.matchId || item.newMatchID || item.id,
              lostID: item.lostID || item.lost_id,
              foundID: item.foundID || item.found_id,
              matchTimestamp: formatTimestamp(
                item.matchTimestamp || item.match_timestamp || item.dateMatched
              ),
            };
            console.log("Processed match item:", processed);
            return processed;
          });
          console.log("Processed match items data:", matchItemsData);
          setMatchItems(matchItemsData);
          matchItemsData.forEach(generateQRCode);
          break;
        case "ARCHIVE":
          setArchiveItems(Array.isArray(processedData) ? processedData : []);
          if (Array.isArray(processedData)) {
            processedData.forEach(generateQRCode);
          }
          break;
        case "VIEW CICS":
          const cicsItemsData = processedData
            .filter((item) => item.department === "CICS")
            .map((item) => ({
              ...item,
              id: item.id || item.foundID,
              dateFound: formatTimestamp(item.dateFound),
            }));
          setCicsItems(cicsItemsData);
          cicsItemsData.forEach(generateQRCode);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      console.error("Error details:", error.response?.data);
      // Set empty array if there's an error
      switch (activeTab) {
        case "FOUND ITEMS":
          setFoundItems([]);
          break;
        case "LOST ITEMS":
          setLostItems([]);
          break;
        case "POTENTIAL MATCHES":
          setMatchItems([]);
          break;
        case "ARCHIVE":
          setArchiveItems([]);
          break;
        case "VIEW CICS":
          setCicsItems([]);
          break;
      }
    } finally {
      setLoading(false);
    }
  }, [
    activeTab,
    filters,
    getActiveEndpoint,
    getDateFieldForTab,
    generateQRCode,
  ]);

  useEffect(() => {
    fetchItems();
    setSearchTerm("");
  }, [fetchItems]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/statuses");
        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  const handleItemClick = (item) => {
    setCurrentItem(item);
    setIsItemInformationOpen(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
  };

  const filterItems = (items) => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const renderTabContent = () => {
    console.log("renderTabContent called with activeTab:", activeTab);
    if (loading) {
      return <p className="text-center p-4">Loading...</p>;
    }

    let filteredItems = [];
    switch (activeTab) {
      case "FOUND ITEMS":
        filteredItems = filterItems(foundItems);
        break;
      case "LOST ITEMS":
        filteredItems = filterItems(lostItems);
        break;
      case "POTENTIAL MATCHES":
        filteredItems = filterItems(matchItems);
        break;
      case "ARCHIVE":
        filteredItems = filterItems(archiveItems);
        break;
      case "VIEW CICS":
        console.log("CICS items before filtering:", cicsItems);
        filteredItems = filterItems(cicsItems);
        console.log("CICS items after filtering:", filteredItems);
        break;
      default:
        return <p className="text-center p-4">No items available.</p>;
    }

    if (filteredItems.length === 0) {
      return <p className="text-center p-4">No items found.</p>;
    }

    switch (activeTab) {
      case "FOUND ITEMS":
        return renderFoundItemsTable(filteredItems);
      case "LOST ITEMS":
        return renderLostItemsTable(filteredItems);
      case "POTENTIAL MATCHES":
        return renderMatchItemsTable(filteredItems);
      case "ARCHIVE":
        return renderArchiveItemsTable(filteredItems);
      case "VIEW CICS":
        return renderCICSItemsTable(filteredItems);
      default:
        return <p className="text-center p-4">No items available.</p>;
    }
  };

  const renderFoundItemsTable = (items) => {
    return (
      <table className="w-full">
        <thead className="bg-gray-50 text-sm text-gray-600">
          <tr>
            <th className="px-6 py-3 text-left">Item ID</th>
            <th className="px-6 py-3 text-left">Item Name</th>
            <th className="px-6 py-3 text-left">Item Category</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Location Found</th>
            <th className="px-6 py-3 text-left">Date Found</th>
            <th className="px-6 py-3 text-left">QR Code</th>
            <th className="px-6 py-3 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-2 text-sm">{item.foundID}</td>
              <td className="px-6 py-2 text-sm">{item.found_item_name}</td>
              <td className="px-6 py-2 text-sm">{item.category}</td>
              <td className="px-6 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "Matched"
                      ? "bg-green-500 text-white"
                      : item.status === "Pending"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-2 text-sm">{item.locationFound}</td>
              <td className="px-6 py-2 text-sm">{item.dateFound}</td>
              <td className="px-6 py-2 text-sm">
                {qrCodes[item.id] && (
                  <a href={`http://localhost:5173/admin/items/${item.id}`} target="_blank" rel="noopener noreferrer">
                  <img src={qrCodes[item.id]} alt="QR Code" className="w-8 h-8" />
                </a>
                )}
              </td>
              <td>
                <button
                  onClick={() => handleItemClick(item)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <InformationCircleIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderLostItemsTable = (items) => {
    return (
      <table className="w-full">
        <thead className="bg-gray-50 text-sm text-gray-600">
          <tr>
            <th className="px-6 py-3 text-left">Item ID</th>
            <th className="px-6 py-3 text-left">Item Name</th>
            <th className="px-6 py-3 text-left">Item Category</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Location Lost</th>
            <th className="px-6 py-3 text-left">Date Lost</th>
            <th className="px-6 py-3 text-left">QR Code</th>
            <th className="px-6 py-3 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-2 text-sm">{item.lostID}</td>
              <td className="px-6 py-2 text-sm">{item.lost_item_name}</td>
              <td className="px-6 py-2 text-sm">{item.category}</td>
              <td className="px-6 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "Matched"
                      ? "bg-green-500 text-white"
                      : item.status === "Pending"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-2 text-sm">{item.locationLost}</td>
              <td className="px-6 py-2 text-sm">{item.dateLost}</td>
              <td className="px-6 py-2 text-sm">
                {qrCodes[item.id] && (
                  <img
                    src={qrCodes[item.id] || "/placeholder.svg"}
                    alt="QR Code"
                    className="w-8 h-8"
                  />
                )}
              </td>
              <td>
                <button
                  onClick={() => handleItemClick(item)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <InformationCircleIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderMatchItemsTable = (items) => {
    console.log("Rendering match items:", items);

    if (!items || items.length === 0) {
      return <p className="text-center p-4">No matched items found.</p>;
    }

    return (
      <table className="w-full">
        <thead className="bg-gray-50 text-sm text-gray-600">
          <tr>
            <th className="px-6 py-3 text-left">Match ID</th>
            <th className="px-6 py-3 text-left">Lost ID</th>
            <th className="px-6 py-3 text-left">Found ID</th>
            <th className="px-6 py-3 text-left">Date Matched</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            console.log("Rendering match item:", item);
            return (
              <tr key={item.id || item.matchId || `match-${Math.random()}`}>
                <td className="px-6 py-2 text-sm">{item.matchId || "N/A"}</td>
                <td className="px-6 py-2 text-sm">{item.lostID || "N/A"}</td>
                <td className="px-6 py-2 text-sm">{item.foundID || "N/A"}</td>
                <td className="px-6 py-2 text-sm">
                  {item.matchTimestamp || "N/A"}
                </td>

                <td>
                  <button
                    onClick={() => handleItemClick(item)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <InformationCircleIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderArchiveItemsTable = (items) => {
    if (!items || items.length === 0) {
      return <p className="text-center p-4">No archived items found.</p>;
    }

    return (
      <table className="w-full">
        <thead className="bg-gray-50 text-sm text-gray-600">
          <tr>
            <th className="px-6 py-3 text-left">Item ID</th>
            <th className="px-6 py-3 text-left">Item Name</th>
            <th className="px-6 py-3 text-left">Item Category</th>
            <th className="px-6 py-3 text-left">Location</th>
            <th className="px-6 py-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id || `archive-${Math.random()}`}>
              <td className="px-6 py-2 text-sm">
                {item.foundID || item.lostID || "N/A"}
              </td>
              <td className="px-6 py-2 text-sm">
                {item.found_item_name || item.lost_item_name || "N/A"}
              </td>
              <td className="px-6 py-2 text-sm">{item.category || "N/A"}</td>
              <td className="px-6 py-2 text-sm">
                {item.locationFound || item.locationLost || "N/A"}
              </td>
              <td className="px-6 py-2 text-sm">
                {item.dateFound || item.dateLost || "N/A"}
              </td>

              <td>
                <button
                  onClick={() => handleItemClick(item)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <InformationCircleIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCICSItemsTable = (items) => {
    console.log("Rendering CICS table with items:", items);
    if (!items || items.length === 0) {
      return <p className="text-center p-4">No CICS items found.</p>;
    }
    return (
      <table className="w-full">
        <thead className="bg-gray-50 text-sm text-gray-600">
          <tr>
            <th className="px-6 py-3 text-left">Item ID</th>
            <th className="px-6 py-3 text-left">Item Name</th>
            <th className="px-6 py-3 text-left">Item Category</th>
            <th className="px-6 py-3 text-left">Date Found</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-2 text-sm">{item.foundID}</td>
              <td className="px-6 py-2 text-sm">{item.found_item_name}</td>
              <td className="px-6 py-2 text-sm">{item.category}</td>
              <td className="px-6 py-2 text-sm">{item.dateFound}</td>
              <td>
                <button
                  onClick={() => handleItemClick(item)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <InformationCircleIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FFF8F0]">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-amber-500">
            LOST & FOUND ITEMS
            <button
              onClick={handleDownloadPDF}
              className="p-2 text-amber-500 hover:text-amber-600"
              title="Download Report"
            >
              <ArrowDownOnSquareIcon className="w-6 h-6" />
            </button>
          </h1>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center hover:text-gray-600"
              onClick={() => setIsItemFilterOpen(true)}
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-64 rounded-4xl bg-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {tabItems.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                console.log("Changing tab to:", tab);
                handleTabChange(tab);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white shadow-sm"
                  : "text-gray-500 hover:bg-white/50"
              }`}
            >
              {tab}
            </button>
          ))}

          {(activeTab === "FOUND ITEMS" || activeTab === "LOST ITEMS") && (
            <button
              onClick={() =>
                navigate(
                  activeTab === "FOUND ITEMS" ? "/add-found" : "/add-lost"
                )
              }
              className="ml-auto px-5 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600"
            >
              + Add Item
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <p className="text-center p-4">Loading...</p>
          ) : (
            <>
              {console.log("Current tab content:", activeTab)}
              {renderTabContent()}
            </>
          )}
        </div>

        <ItemInformation
          isOpen={isItemInformationOpen}
          onClose={() => setIsItemInformationOpen(false)}
          item={currentItem}
          activeTab={activeTab}
        />

        <ItemFilter
          isOpen={isItemFilterOpen}
          onClose={() => setIsItemFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          initialFilters={filters}
          categories={categories}
          statuses={statuses}
        />
      </div>
    </div>
  );
}

export default AdminItems;
