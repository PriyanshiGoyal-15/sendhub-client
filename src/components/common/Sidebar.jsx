import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSettingStore } from "../../store/SettingStore";
import { FaPaperPlane } from "react-icons/fa";
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
  // { name: "Inbox", path: "/inbox", icon: MdOutlineChat },
  // { name: "Analytics", path: "/analytics", icon: MdOutlineAnalytics },
  { name: "Settings", path: "/settings", icon: MdOutlineSettings },
];

function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { user } = useAuth();
  const { settings, fetchSettings } = useSettingStore();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!settings) {
      fetchSettings();
    }
  }, [settings, fetchSettings]);

  const displayName = settings?.senderName || user?.name;

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
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative z-50 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          isCollapsed ? "md:w-[80px]" : "md:w-[240px]"
        } w-[240px] transition-all duration-300 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col justify-between h-full`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full"
        >
          <X size={16} />
        </button>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 z-50 shadow-sm transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div>
          {/* Top Logo Area */}
          <div
            className={`flex items-center py-4 border-b border-gray-200 ${isCollapsed ? "px-4 justify-center" : "px-4"}`}
          >
            <div
              className={`bg-primary rounded-lg p-1.5 flex items-center justify-center flex-shrink-0 ${isCollapsed ? "mr-0" : "mr-3"}`}
            >
              <FaPaperPlane className="text-white text-xl" />
            </div>
            <span
              className={`text-gray-900 font-bold text-lg whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"}`}
            >
              SendHub
            </span>
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
                  className={`flex items-center py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-200/50 text-green-800"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } ${isCollapsed ? "px-0 justify-center" : "px-4"}`}
                >
                  <item.icon
                    className={`text-xl ${isActive ? "text-green-700" : "text-gray-500"} ${isCollapsed ? "mr-0" : "mr-3"} flex-shrink-0`}
                  />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"}`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile Area */}
        <div
          className={`border-t border-gray-200 p-4 flex ${isCollapsed ? "justify-center" : ""}`}
        >
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}
          >
            <div
              className={`h-10 w-10 rounded-full overflow-hidden bg-yellow-500 flex items-center justify-center text-white font-bold flex-shrink-0 ${isCollapsed ? "mr-0" : "mr-3"}`}
            >
              {settings?.profileImage ? (
                <img
                  src={settings.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(displayName)
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"}`}
            >
              <p className="text-sm font-medium text-gray-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
