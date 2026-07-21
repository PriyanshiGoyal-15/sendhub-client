import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CampaignDetails from "./01_CampaignDetails";
import TemplateAudience from "./02_TemplateAudience";
import ScheduleSend from "./03_ScheduleSend";
import LivePreview from "./04_LivePreview";
import { useCampaignStore } from "../../../../store/CampaignStore";
import { useToast } from "../../../../components/UI/toast";

export default function CreateCampaignLayout({
  editMode = false,
  campaignId = null,
  initialData = null,
}) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createCampaign, updateCampaign } = useCampaignStore();

  const [localCampaignId, setLocalCampaignId] = useState(campaignId);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      type: "]",
      template: null,
      audienceTags: [],
      date: "",
      time: "",
      status: "Draft",
    },
  );

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!editMode && !localCampaignId) {
      const initDraft = async () => {
        try {
          setIsSaving(true);
          const data = await createCampaign({
            name: "Untitled Campaign",
            status: "Draft",
          });
          setLocalCampaignId(data.campaign._id);
          setIsSaving(false);
          setIsSaved(true);
        } catch (error) {
          console.error("Failed to init draft", error);
        }
      };
      initDraft();
    }
  }, [editMode, localCampaignId, createCampaign]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!editMode && localCampaignId) {
      setIsSaving(true);
      setIsSaved(false);

      const handler = setTimeout(async () => {
        try {
          await updateCampaign(localCampaignId, {
            ...formData,
            status: "Draft",
          });
          setIsSaving(false);
          setIsSaved(true);
        } catch (e) {
          setIsSaving(false);
          console.error("Auto-save failed", e);
        }
      }, 1000);

      return () => clearTimeout(handler);
    }
  }, [formData, editMode, localCampaignId, updateCampaign]);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const updateData = (data) => setFormData((prev) => ({ ...prev, ...data }));

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      if (localCampaignId) {
        await updateCampaign(localCampaignId, {
          ...formData,
          status: "Draft",
        });
      }
      addToast("Draft saved successfully!", "success");
      navigate("/campaigns");
    } catch (error) {
      addToast("Failed to save draft", "error");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/campaigns")}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {editMode ? "Edit Campaign" : "Create Campaign"}

              {!editMode && (
                <div className="flex items-center text-sm font-normal">
                  {isSaving && (
                    <span className="flex items-center text-gray-500">
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Saving...
                    </span>
                  )}
                  {isSaved && !isSaving && (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Campaign Saved
                    </span>
                  )}
                </div>
              )}
            </h1>
            <p className="text-gray-500 text-sm">
              {editMode
                ? "Update your WhatsApp campaign"
                : "Set up your WhatsApp campaign"}
            </p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                currentStep >= step
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`h-0.5 w-12 ${
                  currentStep > step ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
        <span className="ml-2 font-medium text-gray-700">
          {currentStep === 1 && "Campaign Details"}
          {currentStep === 2 && "Template & Audience"}
          {currentStep === 3 && "Schedule & Send"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <CampaignDetails
              data={formData}
              updateData={updateData}
              onNext={handleNext}
            />
          )}
          {currentStep === 2 && (
            <TemplateAudience
              data={formData}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
              onSaveDraft={handleSaveDraft}
            />
          )}
          {currentStep === 3 && (
            <ScheduleSend
              data={formData}
              updateData={updateData}
              onBack={handleBack}
              editMode={editMode}
              campaignId={localCampaignId}
              onSaveDraft={handleSaveDraft}
            />
          )}
        </div>

        {/* Live Preview Area */}
        <div className="lg:col-span-1">
          <LivePreview data={formData} updateData={updateData} />
        </div>
      </div>
    </div>
  );
}
