import React from "react";
import { Zap } from "lucide-react";
import { useDashboardStore } from "../../../store/DashboardStore";

export default function QuickStats() {
  const { quickStats } = useDashboardStore();

  const stats = [
    {
      label: "Delivery Rate",
      value: quickStats?.deliveryRate ? `${quickStats.deliveryRate}%` : "0%",
      trend: "",
      progress: Number(quickStats?.deliveryRate) || 0,
      progressColor: "bg-white",
      trackColor: "bg-green-700/50",
    },
    {
      label: "Failure Rate",
      value: quickStats?.failureRate ? `${quickStats.failureRate}%` : "0%",
      trend: "",
      progress: Number(quickStats?.failureRate) || 0,
      progressColor: "bg-red-500",
      trackColor: "bg-black/20",
    },
  ];

  return (
    <div className="bg-green-500 rounded-xl shadow-sm border border-green-600 p-6 flex flex-col h-fit text-white w-full">
      <div className="flex items-center gap-2 mb-8 opacity-90">
        <Zap size={20} className="fill-white" />
        <h2 className="text-lg font-bold">Quick Stats</h2>
      </div>

      <div className="space-y-8">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="flex justify-between items-end mb-2 ">
              <span className="text-sm font-medium opacity-90">
                {stat.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-medium opacity-90">
                {stat.trend}
              </span>
            </div>
            <div
              className={`w-full ${stat.trackColor || "bg-green-700/50"} rounded-full h-1.5 overflow-hidden`}
            >
              <div
                className={`${stat.progressColor || "bg-white"} h-full rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${stat.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
