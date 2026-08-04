import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSettingStore } from "../../store/SettingStore";
import { useSearchStore } from "../../store/SearchStore";
import { useMessageLogStore } from "../../store/MessageLogStore";
import {
  MdOutlineSearch,
  MdOutlineNotifications,
  MdOutlineLogout,
} from "react-icons/md";
import {
  User,
  Megaphone,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";

function Topbar() {
  const { user, logout } = useAuth();
  const { settings, fetchSettings } = useSettingStore();
  const {
    search,
    results,
    isLoading: isSearchLoading,
    clearSearch,
  } = useSearchStore();
  const { recentLogs, fetchRecentLogs, unreadCount, clearUnread } =
    useMessageLogStore();

  const navigate = useNavigate();

  // Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    if (!settings) fetchSettings();
    fetchRecentLogs(5);
  }, [settings, fetchSettings, fetchRecentLogs]);

  // Handle Search Debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        search(searchQuery);
        setIsSearchOpen(true);
      } else {
        clearSearch();
        setIsSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, search, clearSearch]);

  const displayName = settings?.senderName || user?.name || "John Doe";
  const displayEmail = settings?.email || user?.email;

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      clearUnread();
    }
  };

  const handleSearchResultClick = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 className="text-green-500" size={16} />;
      case "Failed":
        return <X className="text-red-500" size={16} />;
      case "Read":
        return <CheckCircle2 className="text-blue-500" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  return (
    <div className="sticky top-0 w-full p-3 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-10">
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdOutlineSearch className="text-gray-400 text-xl" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim().length > 0) setIsSearchOpen(true);
            }}
            placeholder="Search contacts, campaigns, templates..."
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
          />

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
              {isSearchLoading ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Searching...
                </div>
              ) : (
                <>
                  {results.contacts?.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        Contacts
                      </div>
                      {results.contacts.map((c) => (
                        <button
                          key={c._id}
                          onClick={() =>
                            handleSearchResultClick(
                              `/contacts?search=${encodeURIComponent(c.name)}`,
                            )
                          }
                          className="w-full text-left flex items-center p-2 hover:bg-gray-50 rounded-md"
                        >
                          <User size={16} className="text-green-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {c.name}
                            </p>
                            <p className="text-xs text-gray-500">{c.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {results.campaigns?.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        Campaigns
                      </div>
                      {results.campaigns.map((c) => (
                        <button
                          key={c._id}
                          onClick={() => {
                            if (
                              c.status === "Draft" ||
                              c.status === "Scheduled"
                            ) {
                              handleSearchResultClick(
                                `/campaigns/edit/${c._id}`,
                              );
                            } else {
                              handleSearchResultClick(
                                `/campaigns?search=${encodeURIComponent(c.name)}`,
                              );
                            }
                          }}
                          className="w-full text-left flex items-center p-2 hover:bg-gray-50 rounded-md"
                        >
                          <Megaphone size={16} className="text-blue-500 mr-2" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {c.name}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {c.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {results.templates?.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        Templates
                      </div>
                      {results.templates.map((t) => (
                        <button
                          key={t._id}
                          onClick={() =>
                            handleSearchResultClick(
                              `/templates?search=${encodeURIComponent(t.name)}`,
                            )
                          }
                          className="w-full text-left flex items-center p-2 hover:bg-gray-50 rounded-md"
                        >
                          <FileText
                            size={16}
                            className="text-purple-500 mr-2"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {t.name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.contacts?.length === 0 &&
                    results.campaigns?.length === 0 &&
                    results.templates?.length === 0 && (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No results found
                      </div>
                    )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions and Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleNotifClick}
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdOutlineNotifications className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-900">
                  Recent Messages
                </h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {recentLogs.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No recent messages
                  </div>
                ) : (
                  recentLogs.map((log) => (
                    <div
                      key={log._id}
                      className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start space-x-3"
                    >
                      <div className="mt-0.5">{getStatusIcon(log.status)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium truncate">
                          {log.contactId?.name || "Unknown Contact"}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          Campaign: {log.campaignId?.name || "None"}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          log.status === "Delivered" || log.status === "Read"
                            ? "bg-green-100 text-green-700"
                            : log.status === "Failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-10 w-10 rounded-full overflow-hidden bg-yellow-500 flex items-center justify-center text-white font-bold flex-shrink-0 hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all"
            title="Profile"
          >
            {settings?.profileImage ? (
              <img src={settings.profileImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              getInitials(displayName)
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-lg shadow-lg py-1 z-20 border border-gray-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {displayName}
                </p>
                <p className="text-sm text-gray-500 truncate">{displayEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center transition-colors"
              >
                <MdOutlineLogout className="mr-2 text-lg text-gray-400" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
