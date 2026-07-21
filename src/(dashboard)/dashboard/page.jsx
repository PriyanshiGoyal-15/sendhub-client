import React, { useEffect } from "react";
import DashboardHeader from "../../components/features/dashboard/DashboardHeader";
import StatCards from "../../components/features/dashboard/StatCards";
import DailyMessagesChart from "../../components/features/dashboard/DailyMessagesChart";
import MessageStatusChart from "../../components/features/dashboard/MessageStatusChart";
import RecentActivity from "../../components/features/dashboard/RecentActivity";
import QuickStats from "../../components/features/dashboard/QuickStats";
import { useDashboardStore } from "../../store/DashboardStore";

export default function DashboardHome() {
  const { fetchAll, isLoading } = useDashboardStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="max-w-screen">
        <DashboardHeader />

        <StatCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <DailyMessagesChart />
          </div>
          <div className="lg:col-span-1">
            <MessageStatusChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div className="lg:col-span-1">
            <QuickStats />
          </div>
        </div>
      </div>
    </div>
  );
}
