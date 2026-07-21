import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../components/UI/toast";
import { useCampaignStore } from "../../../../store/CampaignStore";
import { ChevronLeft } from "lucide-react";

export default function ScheduleSend({
  data,
  updateData,
  onBack,
  editMode,
  campaignId,
  onSaveDraft,
}) {
  const navigate = useNavigate();
  const { createCampaign, updateCampaign } = useCampaignStore();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setPresetTime = (preset) => {
    const dateObj = new Date();
    if (preset === "15m") {
      dateObj.setMinutes(dateObj.getMinutes() + 15);
    } else if (preset === "1h") {
      dateObj.setHours(dateObj.getHours() + 1);
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    updateData({ date, time });
  };

  const validateDateTime = () => {
    if (!data.date || !data.time) {
      addToast("Please select both Date and Time to proceed.", "error");
      return false;
    }
    return true;
  };

  const handleCreate = async (status) => {
    if (!validateDateTime()) return;

    setIsSubmitting(true);
    try {
      const startDate = new Date(`${data.date}T${data.time}`);
      // Generate a mock audience size based on number of tags
      const audienceSize = Math.max(data.audienceTags.length * 1500, 500);

      const payload = {
        ...data,
        name: data.name,
        status: status,
        startDate: startDate,
        audience: audienceSize,
      };

      // Since a draft is already created via auto-save, we just update it
      if (campaignId) {
        await updateCampaign(campaignId, payload);
        addToast(
          editMode
            ? "Campaign updated successfully!"
            : "Campaign created successfully!",
          "success",
        );
      } else {
        throw new Error("No campaign ID found to finalize");
      }

      navigate("/campaigns");
    } catch (err) {
      addToast(
        err.response?.data?.message ||
          (editMode
            ? "Failed to update campaign"
            : "Failed to create campaign"),
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        Schedule Campaign
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={data.date}
              onChange={(e) => updateData({ date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPresetTime("now")}
                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Now
              </button>
              <button
                type="button"
                onClick={() => setPresetTime("15m")}
                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                +15 min
              </button>
              <button
                type="button"
                onClick={() => setPresetTime("1h")}
                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                +1 hr
              </button>
            </div>
            <div className="relative">
              <input
                type="time"
                value={data.time}
                onChange={(e) => updateData({ time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Campaign Summary</h3>
        <div className="grid grid-cols-2 gap-y-4 text-sm pl-4">
          <div>
            <p className="text-gray-500 mb-1">Name</p>
            <p className="font-medium text-gray-900">{data.name || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Template</p>
            <p className="font-medium text-gray-900">
              {data.template?.name || "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Audience Tags</p>
            <p className="font-medium text-gray-900">
              {data.audienceTags.length > 0
                ? data.audienceTags.join(", ")
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Scheduled</p>
            <p className="font-medium text-gray-900">
              {data.date && data.time
                ? `${data.date} at ${data.time}`
                : "Send immediately"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 font-normal disabled:opacity-50 flex items-center cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Audience
        </button>
        <div className="flex gap-3">
          <button
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleCreate("Running")}
            disabled={isSubmitting}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isSubmitting
              ? editMode
                ? "Updating..."
                : "Sending..."
              : editMode
                ? "Update Now"
                : "Send Now"}
          </button>
          <button
            onClick={() => handleCreate("Scheduled")}
            disabled={isSubmitting}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isSubmitting
              ? editMode
                ? "Updating..."
                : "Scheduling..."
              : editMode
                ? "Update Schedule"
                : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
