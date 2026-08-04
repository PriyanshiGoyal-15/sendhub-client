import React from "react";
import { useToast } from "../../../../components/UI/toast";

export default function CampaignDetails({ data, updateData, onNext }) {
  const { addToast } = useToast();

  const handleNext = () => {
    if (!data.name.trim()) {
      addToast("Please enter a campaign name.", "error");
      return;
    }
    if (!data.channels || data.channels.length === 0) {
      addToast("Please select at least one channel.", "error");
      return;
    }
    onNext();
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Campaign Details</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Campaign Name
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="e.g. Summer Sale Announcement"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Campaign Type
        </label>
        <select
          value={data.type}
          onChange={(e) => updateData({ type: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="Marketing Message">Marketing Message</option>
          <option value="Utility Notification">Utility Notification</option>
          <option value="Authentication">Authentication</option>
        </select>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channels (Select at least one)
        </label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.channels?.includes("SMS") || false}
              onChange={(e) => {
                const current = data.channels || [];
                if (e.target.checked) updateData({ channels: [...current, "SMS"] });
                else updateData({ channels: current.filter((c) => c !== "SMS") });
              }}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-gray-700">SMS</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.channels?.includes("EMAIL") || false}
              onChange={(e) => {
                const current = data.channels || [];
                if (e.target.checked) updateData({ channels: [...current, "EMAIL"] });
                else updateData({ channels: current.filter((c) => c !== "EMAIL") });
              }}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-gray-700">Email</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Next: Template & Audience
        </button>
      </div>
    </div>
  );
}
