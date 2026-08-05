import React, { useEffect } from "react";
import CampaignCard, { CampaignCardSkeleton } from "./CampaignCard";
import { useCampaignStore } from "../../../store/CampaignStore";

export default function CampaignList() {
  const { campaigns, loading, fetchCampaigns, fetchFilters } =
    useCampaignStore();

  useEffect(() => {
    fetchFilters();
    fetchCampaigns();

    // Auto-refresh campaigns every 10 seconds for real-time status updates
    const interval = setInterval(() => {
      fetchCampaigns();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading && campaigns.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <CampaignCardSkeleton key={i} />
        ))}
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
