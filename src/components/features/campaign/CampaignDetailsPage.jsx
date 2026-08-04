import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Info,
  RefreshCw,
  Mail,
  Users,
  AlertCircle,
  CornerUpLeft,
} from "lucide-react";
import { useCampaignStore } from "../../../store/CampaignStore";
import { useToast } from "../../../components/UI/toast";
import api from "../../../api/axios";

export default function CampaignDetailsPage({ campaignId, initialData }) {
  const navigate = useNavigate();
  const { updateCampaign } = useCampaignStore();
  const { addToast } = useToast();

  const [logs, setLogs] = useState([]);
  const [pendingContacts, setPendingContacts] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const [filterChannel, setFilterChannel] = useState("All");
  const [filterTag, setFilterTag] = useState("All");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (
          initialData.status === "Scheduled" ||
          initialData.status === "Draft"
        ) {
          // If scheduled, it hasn't run yet, so fetch the target audience directly
          if (initialData.audienceTags && initialData.audienceTags.length > 0) {
            const tagsString = initialData.audienceTags.join(",");
            const res = await api.get(
              `/contact?audienceTags=${encodeURIComponent(tagsString)}&limit=100`,
            );
            if (res.data.success || res.data.contacts) {
              setPendingContacts(res.data.contacts || []);
            }
          }
        } else {
          // Otherwise fetch the actual delivery logs
          const res = await api.get(
            `/message-logs/recent?campaignId=${campaignId}&limit=100`,
          );
          if (res.data.success) {
            setLogs(res.data.logs);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
  }, [campaignId, initialData]);

  const handleReschedule = async () => {
    try {
      await updateCampaign(campaignId, { status: "Draft" });
      addToast(
        "Campaign converted to Draft. You can now edit and reschedule.",
        "success",
      );
      window.location.reload();
    } catch (err) {
      addToast("Failed to reschedule campaign", "error");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
      case "Failed":
        return (
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
      case "Partially Failed":
        return (
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
      case "Scheduled":
        return (
          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
        <h2 className="text-gray-900 font-semibold text-lg">
          Campaign Results
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleReschedule}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} />
            Reschedule
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {initialData.name}
                </h1>
                {getStatusBadge(initialData.status)}
              </div>
              <p className="text-gray-500 text-sm flex items-center gap-3">
                <span>Sent {formatDate(initialData.startDate)}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{initialData.audience || 0} recipients</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>Channels: {(initialData.channels || []).join(", ")}</span>
              </p>
            </div>

            <button
              onClick={() => navigate("/campaigns")}
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={14} className="mr-1" />
              Back to campaigns
            </button>
          </div>

          {/* Progress Steps (Visual only) */}
          <div className="flex items-center justify-center mb-10 text-sm font-medium">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={18} />
              <span>Build</span>
            </div>
            <div className="w-16 h-[1px] bg-gray-300 mx-4"></div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={18} />
              <span>Review</span>
            </div>
            <div className="w-16 h-[1px] bg-gray-300 mx-4"></div>
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                3
              </div>
              <span>Results</span>
            </div>
          </div>

          {initialData.failureReason && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong>Campaign Error:</strong> {initialData.failureReason}
              </div>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                <Users size={16} />
                Total Recipients
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {initialData.audience || 0}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 size={16} />
                Sent
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {initialData.sent || 0}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-2">
                <XCircle size={16} />
                Failed
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {initialData.failed || 0}
              </div>
            </div>

            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                <CornerUpLeft size={16} />
                Bounced / Replied
              </div>
              <div className="text-4xl font-bold text-gray-900">0</div>
            </div> */}
          </div>

          {/* Info Banner */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 text-sm text-gray-500 mb-8 shadow-sm">
            <Info size={16} className="text-gray-400" />
            Showing delivery status only. Open, click, and reply tracking aren't
            available in this version.
          </div>

          {/* Recipients Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">
                Recipients{" "}
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs ml-2">
                  {initialData.status === "Scheduled" ||
                  initialData.status === "Draft"
                    ? pendingContacts.filter(
                        (c) =>
                          filterTag === "All" ||
                          (c.tags && c.tags.includes(filterTag)),
                      ).length *
                      (initialData.channels || ["SMS"]).filter(
                        (ch) => filterChannel === "All" || ch === filterChannel,
                      ).length
                    : logs.filter(
                        (l) =>
                          (filterChannel === "All" ||
                            l.channel === filterChannel) &&
                          (filterTag === "All" ||
                            (l.contactId?.tags &&
                              l.contactId.tags.includes(filterTag))),
                      ).length}
                </span>
              </h3>

              <div className="flex items-center gap-3">
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="bg-white border border-gray-200 text-gray-700 text-xs font-medium py-1.5 px-3 rounded-md focus:outline-none focus:border-gray-400"
                >
                  <option value="All">All Channels</option>
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                </select>

                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="bg-white border border-gray-200 text-gray-700 text-xs font-medium py-1.5 px-3 rounded-md focus:outline-none focus:border-gray-400"
                >
                  <option value="All">All Tags</option>
                  {(initialData.audienceTags || []).map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase text-xs font-semibold tracking-wider">
                    <th className="px-6 py-3 font-medium">Recipient</th>
                    <th className="px-6 py-3 font-medium">Channel</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingLogs ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Loading recipients...
                      </td>
                    </tr>
                  ) : initialData.status === "Scheduled" ||
                    initialData.status === "Draft" ? (
                    pendingContacts.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No recipients found matching these audience tags.
                        </td>
                      </tr>
                    ) : (
                      pendingContacts
                        .filter(
                          (contact) =>
                            filterTag === "All" ||
                            (contact.tags && contact.tags.includes(filterTag)),
                        )
                        .flatMap((contact) =>
                          (initialData.channels || ["SMS"])
                            .filter(
                              (ch) =>
                                filterChannel === "All" || ch === filterChannel,
                            )
                            .map((ch, idx) => (
                              <tr
                                key={`${contact._id}-${ch}-${idx}`}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="font-medium text-gray-900">
                                    {contact.name || "Unknown"}
                                  </div>
                                  <div className="text-gray-500 text-xs mt-0.5 flex flex-wrap gap-1 items-center">
                                    {contact.tags &&
                                      contact.tags.length > 0 && (
                                        <span className="uppercase font-semibold">
                                          {contact.tags[0]}
                                        </span>
                                      )}
                                    {contact.email && (
                                      <span>{contact.email}</span>
                                    )}
                                    {contact.phone && (
                                      <span>{contact.phone}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                      ch === "EMAIL"
                                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                                        : "bg-purple-50 text-purple-700 border border-purple-100"
                                    }`}
                                  >
                                    {ch}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-yellow-50 text-yellow-700 border-yellow-200">
                                    PENDING
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate">
                                  Scheduled for delivery
                                </td>
                              </tr>
                            )),
                        )
                    )
                  ) : logs.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No recipient logs found for this campaign.
                      </td>
                    </tr>
                  ) : (
                    logs
                      .filter(
                        (log) =>
                          (filterChannel === "All" ||
                            log.channel === filterChannel) &&
                          (filterTag === "All" ||
                            (log.contactId?.tags &&
                              log.contactId.tags.includes(filterTag))),
                      )
                      .map((log) => (
                        <tr
                          key={log._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {log.contactId?.name || "Unknown"}
                            </div>
                            <div className="text-gray-500 text-xs mt-0.5 flex flex-wrap gap-1 items-center">
                              {log.contactId?.tags &&
                                log.contactId.tags.length > 0 && (
                                  <span className="uppercase font-semibold">
                                    {log.contactId.tags[0]}
                                  </span>
                                )}
                              {log.contactId?.email && (
                                <span>{log.contactId.email}</span>
                              )}
                              {log.contactId?.phone && (
                                <span>{log.contactId.phone}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                log.channel === "EMAIL"
                                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                                  : "bg-purple-50 text-purple-700 border border-purple-100"
                              }`}
                            >
                              {log.channel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                log.status === "DELIVERED"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td
                            className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate"
                            title={log.error || "Sent successfully"}
                          >
                            {log.error || "Sent successfully"}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
