import React, { useState, useEffect } from "react";
import StudentSidebar from "../../components/student/StudentSidebar";

function StudentSearch() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCategory) return;

    setLoading(true);
    console.log("Fetching data for category:", selectedCategory); // Debugging log
    fetch(
      `http://localhost:3001/api/found-items/category?category=${selectedCategory}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data);
        setLoading(false);
      })
      .catch((error) => {
        setCategoryData(null);
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <div className="flex min-h-screen bg-amber-50/50">
      <StudentSidebar />

      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-400 mb-6">
          SEARCH A CATEGORY
        </h1>

        <div className="w-full max-w-lg relative mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-3 px-5 text-gray-800 bg-white border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-amber-400 focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              Select a category...
            </option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Stationery">Stationery</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Display category count */}
        {loading ? (
          <p className="mt-4 text-gray-600">Loading...</p>
        ) : categoryData ? (
          <div className="mt-6 text-gray-800 w-full max-w-md bg-white rounded-lg shadow-sm">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">
                    {selectedCategory.charAt(0).toUpperCase() +
                      selectedCategory.slice(1)}
                  </td>
                  <td className=" px-4 py-2">{categoryData.count}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default StudentSearch;
