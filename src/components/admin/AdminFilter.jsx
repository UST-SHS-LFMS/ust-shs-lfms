import React, { useState } from "react";

function AdminFilter({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      {/* Modal Box */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Filter Admins</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Alphabetical Filter */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Arrange Alphabetically
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Role
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="support-staff">Support Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Order By */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Order By
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 bg-green-500 text-white rounded-4xl hover:bg-green-600 transition">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminFilter;
