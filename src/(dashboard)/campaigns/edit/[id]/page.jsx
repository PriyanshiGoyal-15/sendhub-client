"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCampaignStore } from "../../../../store/CampaignStore";
import CreateCampaignLayout from "../../../../components/features/campaign/create/00_CreateCampaignLayout";
import CampaignDetailsPage from "../../../../components/features/campaign/CampaignDetailsPage";
import { useToast } from "../../../../components/UI/toast";

export default function EditCampaignPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCampaign } = useCampaignStore();
  const { addToast } = useToast();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCampaign = async () => {
      try {
        const campaign = await getCampaign(id);
        if (!isMounted) return;

        // Map backend campaign format back to the UI format for the wizard
        let date = "";
        let time = "";
        if (campaign.startDate) {
          const d = new Date(campaign.startDate);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          date = `${year}-${month}-${day}`;

          const hours = String(d.getHours()).padStart(2, "0");
          const minutes = String(d.getMinutes()).padStart(2, "0");
          time = `${hours}:${minutes}`;
        }

        setInitialData({
          name: campaign.name,
          type: "Marketing Message",
          channels: campaign.channels || ["SMS"],
          templates: campaign.templates || { SMS: null, EMAIL: null },
          audienceTags: campaign.audienceTags || [],
          variables: campaign.variables || {},
          date: date,
          time: time,
          status: campaign.status,
          audience: campaign.audience,
          sent: campaign.sent,
          failed: campaign.failed,
          failureReason: campaign.failureReason,
        });
      } catch (error) {
        if (!isMounted) return;
        addToast("Failed to load campaign data", "error");
        navigate("/campaigns");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCampaign();

    return () => {
      isMounted = false;
    };
  }, [id, getCampaign, navigate, addToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Loading campaign...</p>
      </div>
    );
  }

  // Route based on campaign status
  if (initialData?.status && initialData.status !== "Draft") {
    // Return detailed view for anything that's not a draft
    return <CampaignDetailsPage campaignId={id} initialData={initialData} />;
  }

  return (
    <CreateCampaignLayout
      editMode={true}
      campaignId={id}
      initialData={initialData}
    />
  );
}
