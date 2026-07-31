import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useToast } from "../../../components/UI/toast";
import { useCampaignStore } from "../../../store/CampaignStore";

export default function CampaignCard({ campaign }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { deleteCampaign } = useCampaignStore();
  const [showMenu, setShowMenu] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const menuRef = useRef(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Running":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Running
          </span>
        );
      case "Scheduled":
        return (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
              Scheduled
            </span>
            {timeLeft && (
              <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-200 flex items-center gap-1 shadow-sm">
                ⏱ {timeLeft}
              </span>
            )}
          </div>
        );
      case "Draft":
        return (
          <span className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-full shadow-sm">
            Draft
          </span>
        );
      case "Completed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Completed
          </span>
        );
      case "Failed":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  const handleDelete = async () => {
    try {
      await deleteCampaign(campaign._id);
      addToast("Campaign deleted successfully", "success");
    } catch (err) {
      addToast(
        err.response?.data?.message || "Failed to delete campaign",
        "error",
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (campaign.status !== "Scheduled" || !campaign.startDate) return;

    const updateTimer = () => {
      const now = new Date();
      const start = new Date(campaign.startDate);
      const diffMs = start - now;

      if (diffMs <= 0) {
        setTimeLeft("Delivering soon...");
        return;
      }

      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) {
        setTimeLeft(`in ${diffMins} min${diffMins !== 1 ? "s" : ""}`);
      } else if (diffMins < 24 * 60) {
        const diffHours = Math.floor(diffMins / 60);
        const remainingMins = diffMins % 60;
        setTimeLeft(`in ${diffHours}h ${remainingMins}m`);
      } else {
        const diffDays = Math.floor(diffMins / (24 * 60));
        setTimeLeft(`in ${diffDays} day${diffDays !== 1 ? "s" : ""}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [campaign.status, campaign.startDate]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
            {getStatusBadge(campaign.status)}
          </div>
          <p className="text-sm text-gray-500">
            {campaign.createdAt ? formatDate(campaign.createdAt) : "—"} &rarr;{" "}
            {campaign.startDate ? formatDate(campaign.startDate) : "—"}
          </p>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate(`/campaigns/edit/${campaign._id}`);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 size={14} className="text-gray-500" />
                Edit
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleDelete();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} className="text-red-500" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Progress</span>
          <span className="font-medium text-gray-900">
            {campaign.status === "Completed"
              ? 100
              : campaign.status === "Failed"
                ? 100
                : campaign.status === "Scheduled"
                  ? 20
                  : campaign.status === "Draft"
                    ? 5
                    : campaign.audience > 0
                      ? Math.round((campaign.sent / campaign.audience) * 100)
                      : 0}
            %
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${
              campaign.status === "Draft"
                ? "bg-slate-400"
                : campaign.status === "Scheduled"
                  ? "bg-yellow-400"
                  : campaign.status === "Failed"
                    ? "bg-red-500"
                    : "bg-green-500"
            }`}
            style={{
              width: `${campaign.status === "Completed" || campaign.status === "Failed" ? 100 : campaign.status === "Scheduled" ? 20 : campaign.status === "Draft" ? 5 : campaign.audience > 0 ? Math.round((campaign.sent / campaign.audience) * 100) : 0}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-2">
        <div>
          <p className="text-xs text-gray-500 mb-1">Audience</p>
          <p className="font-semibold text-gray-900">
            {(campaign.audience || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Sent</p>
          <p className="font-semibold text-gray-900">
            {(campaign.sent || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Read</p>
          <p className="font-semibold text-gray-900">
            {(campaign.read || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Replies</p>
          <p className="font-semibold text-gray-900">
            {(campaign.replies || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 mt-2 pt-3 flex gap-4 text-xs">
        <div className="text-gray-500">
          Delivery:{" "}
          <span className="font-semibold text-gray-900">
            {campaign.audience > 0
              ? Math.round((campaign.sent / campaign.audience) * 100)
              : 0}
            %
          </span>
        </div>
        <div className="text-gray-500">
          Read Rate:{" "}
          <span className="font-semibold text-gray-900">
            {campaign.sent > 0
              ? Math.round((campaign.read / campaign.sent) * 100)
              : 0}
            %
          </span>
        </div>
      </div>
    </div>
  );
}
