import React, { useEffect, useState, useRef } from "react";
import { MdOutlineSearch, MdKeyboardArrowDown } from "react-icons/md";
import { useContactStore } from "../../../store/ContactStore";
import { useDebounce } from "../../../hooks/useDebounce";
import { getTagColor, getStatusColor } from "../../../utils/getColor";

export default function ContactsFilter() {
  const {
    statuses,
    tags,
    fetchFilters,
    setSearchQuery,
    setActiveStatus,
    setActiveTag,
    activeStatus,
    activeTag,
  } = useContactStore();

  const [localSearch, setLocalSearch] = useState("");
  const debouncedSearch = useDebounce(localSearch, 400);

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  const statusDropdownRef = useRef(null);
  const tagDropdownRef = useRef(null);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  // Trigger search when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setIsStatusDropdownOpen(false);
      }
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target)
      ) {
        setIsTagDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectStatus = (status) => {
    setActiveStatus(status);
    setIsStatusDropdownOpen(false);
  };

  const handleSelectTag = (tag) => {
    setActiveTag(tag);
    setIsTagDropdownOpen(false);
  };

  const handleClearFilters = () => {
    setLocalSearch("");
    setActiveStatus("");
    setActiveTag("");
  };

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MdOutlineSearch className="text-gray-400 text-xl" />
        </div>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by name, phone, or email..."
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary text-gray-900 bg-white shadow-sm transition-all"
        />
      </div>

      <div className="flex items-center gap-4 w-full xl:w-auto">
        {(localSearch || activeStatus || activeTag) && (
          <button
            onClick={handleClearFilters}
            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors whitespace-nowrap"
          >
            Clear all
          </button>
        )}

        {/* Status Dropdown */}
        <div className="relative w-full sm:w-40" ref={statusDropdownRef}>
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-all"
          >
            <span className="truncate">{activeStatus || "All Statuses"}</span>
            <MdKeyboardArrowDown
              className={`ml-2 text-lg text-gray-500 transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isStatusDropdownOpen && (
            <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
              <button
                onClick={() => handleSelectStatus("")}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  !activeStatus
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                All Statuses
              </button>
              {statuses.map((status, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectStatus(status)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center ${
                    activeStatus === status
                      ? "bg-primary/5"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                  >
                    {status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tag Dropdown */}
        <div className="relative w-full sm:w-40" ref={tagDropdownRef}>
          <button
            type="button"
            onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all"
          >
            <span className="truncate">{activeTag || "All Tags"}</span>
            <MdKeyboardArrowDown
              className={`ml-2 text-lg text-gray-500 transition-transform duration-200 ${isTagDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isTagDropdownOpen && (
            <div className="absolute z-50 mt-2 w-full right-0 sm:right-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
              <button
                onClick={() => handleSelectTag("")}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  !activeTag
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                All Tags
              </button>
              {tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectTag(tag)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center ${
                    activeTag === tag ? "bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
