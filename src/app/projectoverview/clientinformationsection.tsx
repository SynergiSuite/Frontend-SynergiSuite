import React from "react";

export default function ClientInformationSection() {
  return (
    <>
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">
        Client Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Name
          </label>
          <input
            type="text"
            placeholder="Enter client name"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Email
          </label>
          <input
            type="email"
            placeholder="Enter client email"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            placeholder="Enter company name"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter phone number"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>
    </div>
    </>
  );
}
