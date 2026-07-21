import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCampaignStore } from "../../../store/CampaignStore";

export default function CampaignHeader() {
  const navigate = useNavigate();
  const { filters, activeStatus, setActiveStatus } = useCampaignStore();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Campaigns</h1>
          <p className="text-gray-500 text-sm">
            Manage your WhatsApp campaigns
          </p>
        </div>
        <button
          onClick={() => navigate("/campaigns/create")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
        >
          <Plus size={18} />
          Create Campaign
        </button>
      </div>

      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveStatus(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeStatus === filter
                ? "bg-green-500 text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
