import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineSearch,
  MdOutlineNotifications,
  MdOutlineLogout,
} from "react-icons/md";

function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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
    <div className="fixed top-0 left-64 right-0 h-fit p-3 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdOutlineSearch className="text-gray-400 text-xl" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
          />
        </div>
      </div>

      {/* Right: Actions and Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <MdOutlineNotifications className="text-2xl" />
          {/* Red Dot Indicator */}
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold flex-shrink-0 hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all"
            title="Profile"
          >
            {getInitials(user?.name || "John Doe")}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-lg shadow-lg py-1 z-20 border border-gray-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
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
