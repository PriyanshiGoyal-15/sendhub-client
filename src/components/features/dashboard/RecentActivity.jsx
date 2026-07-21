import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  Upload,
  FileText,
  UserPlus,
  Activity
} from "lucide-react";
import { useDashboardStore } from "../../../store/DashboardStore";

const getIconConfig = (type) => {
  switch (type?.toLowerCase()) {
    case "campaign":
      return { icon: Megaphone, iconBg: "bg-blue-100", iconColor: "text-blue-600" };
    case "import":
      return { icon: Upload, iconBg: "bg-indigo-100", iconColor: "text-indigo-600" };
    case "template":
      return { icon: FileText, iconBg: "bg-purple-100", iconColor: "text-purple-600" };
    case "contact":
      return { icon: UserPlus, iconBg: "bg-green-100", iconColor: "text-green-600" };
    default:
      return { icon: Activity, iconBg: "bg-gray-100", iconColor: "text-gray-600" };
  }
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

export default function RecentActivity() {
  const navigate = useNavigate();
  const { recentActivity } = useDashboardStore();

  const activities = useMemo(() => {
    if (!recentActivity) return [];
    
    return recentActivity.map((activity, index) => {
      const iconConfig = getIconConfig(activity.type);
      return {
        id: index,
        title: activity.title,
        type: activity.type,
        time: formatTimeAgo(activity.time),
        ...iconConfig
      };
    });
  }, [recentActivity]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col flex-1 h-full min-w-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-500">
            Latest actions across the platform
          </p>
        </div>
        <button
          onClick={() => navigate("/campaigns")}
          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          View all
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-5">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 items-start">
            <div
              className={`p-2 rounded-lg shrink-0 mt-0.5 ${activity.iconBg}`}
            >
              <activity.icon size={16} className={activity.iconColor} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 leading-snug">
                {activity.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                  {activity.type}
                </span>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
