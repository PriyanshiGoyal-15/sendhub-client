"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCampaignStore } from "../../../../store/CampaignStore";
import CreateCampaignLayout from "../../../../components/features/campaign/create/00_CreateCampaignLayout";
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
          date = d.toISOString().split("T")[0];
          time = d.toISOString().split("T")[1].substring(0, 5);
        }

        setInitialData({
          name: campaign.name,
          type: "Marketing Message",
          template: campaign.template || null,
          audienceTags: campaign.audienceTags || [],
          variables: campaign.variables || {},
          date: date,
          time: time,
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

  return (
    <CreateCampaignLayout
      editMode={true}
      campaignId={id}
      initialData={initialData}
    />
  );
}
