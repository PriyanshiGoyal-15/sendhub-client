import React from "react";
import {
  BookOpen,
  Send,
  CheckCircle2,
  Eye,
  AlertCircle,
  Megaphone,
} from "lucide-react";
import { useDashboardStore } from "../../../store/DashboardStore";

export default function StatCards() {
  const { dashboardData } = useDashboardStore();
  const cards = dashboardData?.cards || {};

  const stats = [
    {
      title: "Total Contacts",
      value: cards.totalContacts || 0,
      trend: "",
      isPositive: true,
      icon: BookOpen,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Messages Sent",
      value: cards.messagesSent || 0,
      trend: "",
      isPositive: true,
      icon: Send,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Delivered",
      value: cards.delivered || 0,
      trend: "",
      isPositive: true,
      icon: CheckCircle2,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Read",
      value: cards.read || 0,
      trend: "",
      isPositive: true,
      icon: Eye,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Failed",
      value: cards.failed || 0,
      trend: "",
      isPositive: false,
      icon: AlertCircle,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Active Campaigns",
      value: cards.activeCampaigns || 0,
      trend: "",
      isPositive: true,
      icon: Megaphone,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor} shrink-0`}>
              <stat.icon size={18} className={stat.iconColor} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">
                {stat.title}
              </p>
              <h3 className="text-lg font-bold text-gray-900 leading-none">
                {stat.value}
              </h3>
              <p
                className={`text-xs font-medium mt-2 ${
                  stat.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
