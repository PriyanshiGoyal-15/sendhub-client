import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaWhatsapp } from "react-icons/fa";
import {
  MdOutlineDashboard,
  MdOutlineContacts,
  MdOutlineCampaign,
  MdOutlineDescription,
  MdOutlineChat,
  MdOutlineAnalytics,
  MdOutlineSettings,
} from "react-icons/md";

const navItems = [
  { name: "Dashboard", path: "/", icon: MdOutlineDashboard },
  { name: "Contacts", path: "/contacts", icon: MdOutlineContacts },
  { name: "Campaigns", path: "/campaigns", icon: MdOutlineCampaign },
  { name: "Templates", path: "/templates", icon: MdOutlineDescription },
  { name: "Inbox", path: "/inbox", icon: MdOutlineChat },
  { name: "Analytics", path: "/analytics", icon: MdOutlineAnalytics },
  { name: "Settings", path: "/settings", icon: MdOutlineSettings },
];

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  // A helper to generate initials from the user's name
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-50 border-r border-gray-200 flex flex-col justify-between">
      <div>
        {/* Top Logo Area */}
        <div className="flex items-center px-4 py-4 border-b border-gray-200">
          <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center mr-3">
            <FaWhatsapp className="text-white text-xl" />
          </div>
          <span className="text-gray-900 font-bold text-lg">WABA Platform</span>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-200/50 text-green-800"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 text-xl ${isActive ? "text-green-700" : "text-gray-500"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
