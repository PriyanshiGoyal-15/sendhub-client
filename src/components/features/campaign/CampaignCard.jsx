import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit2,
  Trash2,
  Eye,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  CalendarClock,
} from "lucide-react";
import { useToast } from "../../../components/UI/toast";
import { useCampaignStore } from "../../../store/CampaignStore";
import ConfirmModal from "../../../components/UI/ConfirmModal";

export default function CampaignCard({ campaign }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { deleteCampaign, createCampaign } = useCampaignStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const getStatusBadge = (status) => {
    switch (status) {
      case "Running":
        return (
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 text-[11px] font-bold tracking-wide uppercase rounded-md shadow-sm">
              Running
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          </div>
        );
      case "Scheduled":
        return (
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 text-[11px] font-bold tracking-wide uppercase rounded-md shadow-sm">
              Scheduled
            </span>
            {timeLeft && (
              <span className="text-[11px] text-yellow-600 font-medium flex items-center gap-1">
                ⏱ {timeLeft}
              </span>
            )}
          </div>
        );
      case "Draft":
        return (
          <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-bold tracking-wide uppercase rounded-md shadow-sm">
            Draft
          </span>
        );
      case "Completed":
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold tracking-wide uppercase rounded-md shadow-sm">
            Completed
          </span>
        );
      case "Failed":
        return (
          <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold tracking-wide uppercase rounded-md shadow-sm">
            Failed
          </span>
        );
      case "Partial":
      case "Partially Failed":
        return (
          <span className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 text-[11px] font-bold tracking-wide uppercase rounded-md shadow-sm">
            Partially Failed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 text-[11px] font-bold tracking-wide uppercase rounded-md shadow-sm">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

  const handleReschedule = async () => {
    try {
      const {
        _id,
        id,
        createdAt,
        updatedAt,
        __v,
        sent,
        failed,
        audience,
        startDate,
        failureReason,
        ...rest
      } = campaign;

      const newCampaignData = {
        ...rest,
        name: `${campaign.name} (Copy)`,
        status: "Draft",
        date: "",
        time: "",
      };

      const res = await createCampaign(newCampaignData);
      addToast(
        "Campaign duplicated as Draft. You can now edit and reschedule.",
        "success",
      );
      navigate(`/campaigns/edit/${res.campaign._id}`);
    } catch (err) {
      addToast("Failed to reschedule campaign", "error");
    }
  };

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

  const progressValue =
    campaign.status === "Completed" ||
    campaign.status === "Failed" ||
    campaign.status === "Partially Failed"
      ? 100
      : campaign.status === "Scheduled"
        ? 20
        : campaign.status === "Draft"
          ? 5
          : campaign.audience > 0
            ? Math.min(
                100,
                Math.round((campaign.sent / campaign.audience) * 100),
              )
            : 0;

  const getProgressColor = () => {
    if (campaign.status === "Draft") return "from-slate-300 to-slate-400";
    if (campaign.status === "Scheduled") return "from-yellow-300 to-yellow-500";
    if (campaign.status === "Failed") return "from-red-400 to-red-500";
    if (campaign.status === "Partially Failed" || campaign.status === "Partial")
      return "from-orange-400 to-orange-500";
    return "from-emerald-400 to-emerald-500";
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100/80 hover:border-blue-100 p-6 flex flex-col gap-5 transition-all duration-200 hover:-translate-y-0.5">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
              {campaign.name}
            </h3>
            {getStatusBadge(campaign.status)}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>Created {formatDate(campaign.createdAt)}</span>
            </div>
            {campaign.startDate &&
              campaign.startDate !== campaign.createdAt && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-300">•</span>
                  <span>Scheduled {formatDate(campaign.startDate)}</span>
                </div>
              )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => navigate(`/campaigns/edit/${campaign._id}`)}
            className="group/btn relative hover:z-50 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 p-2 rounded-full transition-colors focus:outline-none"
          >
            {campaign.status === "Draft" ? (
              <Edit2 size={16} />
            ) : (
              <Eye size={16} />
            )}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[11px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-sm">
              {campaign.status === "Draft" ? "Edit Campaign" : "View Details"}
            </span>
          </button>

          <button
            onClick={handleReschedule}
            className="group/btn relative hover:z-50 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 p-2 rounded-full transition-colors focus:outline-none"
          >
            <CalendarClock size={16} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[11px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-sm">
              Reschedule Campaign
            </span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="group/btn relative hover:z-50 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-colors focus:outline-none"
          >
            <Trash2 size={16} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[11px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-sm">
              Delete Campaign
            </span>
          </button>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="my-1">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-500">Progress</span>
          <span className="font-bold text-gray-900">{progressValue}%</span>
        </div>
        <div className="w-full bg-gray-100/80 rounded-full h-2 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-1000 ease-out`}
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 bg-gray-50/50 rounded-xl p-4 border border-gray-100">
        <div className="flex flex-col p-2 -m-2 rounded-lg hover:bg-white hover:shadow-sm hover:scale-105 transition-all cursor-default">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
            <Users size={14} /> Targets
          </div>
          <span className="text-xl font-bold text-gray-900">
            {(campaign.audience || 0).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col p-2 -m-2 rounded-lg hover:bg-white hover:shadow-sm hover:scale-105 transition-all cursor-default group/metric">
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold uppercase tracking-wider mb-1.5">
            <CheckCircle2 size={14} /> Sent
          </div>
          <span className="text-xl font-bold text-gray-900 group-hover/metric:text-green-700 transition-colors">
            {(campaign.sent || 0).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col p-2 -m-2 rounded-lg hover:bg-white hover:shadow-sm hover:scale-105 transition-all cursor-default group/metric">
          <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold uppercase tracking-wider mb-1.5">
            <XCircle size={14} /> Failed
          </div>
          <span className="text-xl font-bold text-gray-900 group-hover/metric:text-red-700 transition-colors">
            {(campaign.failed || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Alerts & Messages */}
      {(campaign.status === "Completed" ||
        ((campaign.status === "Partially Failed" ||
          campaign.status === "Partial") &&
          campaign.sent > 0)) &&
        !campaign.failureReason && (
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 flex items-start gap-2.5">
            <CheckCircle2
              size={16}
              className="text-emerald-500 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-emerald-700 font-medium">
              Successfully delivered {campaign.sent} messages.
            </p>
          </div>
        )}

      {(campaign.failureReason ||
        ((campaign.status === "Failed" ||
          campaign.status === "Partially Failed" ||
          campaign.status === "Partial") &&
          !campaign.failureReason)) && (
        <div className="bg-red-50/80 border border-red-100 rounded-lg p-3 flex items-start gap-2.5">
          <AlertCircle
            size={16}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <p
            className="text-xs text-red-700 font-medium line-clamp-2"
            title={campaign.failureReason}
          >
            {campaign.failureReason ||
              "Some messages failed to deliver. (Reason not captured for old campaigns)"}
          </p>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}

export function CampaignCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6 flex flex-col gap-5 animate-pulse">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded w-16 ml-2"></div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-1 mt-4">
        <div className="flex justify-between text-sm mb-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2"></div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 bg-gray-50/50 rounded-xl p-4 border border-gray-100 mt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col p-2">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
