import React, { useEffect } from "react";
import CampaignCard from "./CampaignCard";
import { useCampaignStore } from "../../../store/CampaignStore";

export default function CampaignList() {
  const { campaigns, loading, fetchCampaigns, fetchFilters } =
    useCampaignStore();

  useEffect(() => {
    fetchFilters();
    fetchCampaigns();
  }, []);

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">No campaigns found.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign._id} campaign={campaign} />
      ))}
    </div>
  );
}
