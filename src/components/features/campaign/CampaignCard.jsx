import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
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
          <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 text-[11px] font-bold tracking-wide uppercase rounded-md shadow-sm">
            Running
          </span>
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

        {/* Action Menu */}
        <div className="relative ml-4" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors focus:outline-none"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate(`/campaigns/edit/${campaign._id}`);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
              >
                {campaign.status === "Draft" ? (
                  <>
                    <Edit2 size={16} /> Edit Campaign
                  </>
                ) : (
                  <>
                    <Eye size={16} /> View Details
                  </>
                )}
              </button>
              <div className="h-px bg-gray-100 my-1 mx-2"></div>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleDelete();
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
              >
                <Trash2 size={16} /> Delete Campaign
              </button>
            </div>
          )}
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
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
            <Users size={14} /> Targets
          </div>
          <span className="text-xl font-bold text-gray-900">
            {(campaign.audience || 0).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold uppercase tracking-wider mb-1.5">
            <CheckCircle2 size={14} /> Sent
          </div>
          <span className="text-xl font-bold text-gray-900">
            {(campaign.sent || 0).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold uppercase tracking-wider mb-1.5">
            <XCircle size={14} /> Failed
          </div>
          <span className="text-xl font-bold text-gray-900">
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
    </div>
  );
}
