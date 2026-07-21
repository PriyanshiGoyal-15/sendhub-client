"use client";

import React from "react";
import CampaignHeader from "../../components/features/campaign/CampaignHeader";
import CampaignList from "../../components/features/campaign/CampaignList";

export default function Campaigns() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <CampaignHeader />
      <CampaignList />
    </div>
  );
}
