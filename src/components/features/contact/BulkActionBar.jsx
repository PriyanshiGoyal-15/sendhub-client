import React from "react";
import { MdClose, MdLocalOffer, MdFileDownload, MdDelete } from "react-icons/md";

export default function BulkActionBar({
  selectedCount,
  onClear,
  onTag,
  onExport,
  onDelete,
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 px-4 py-3 flex items-center justify-between min-w-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onClear}
          className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="Clear selection"
        >
          <MdClose className="text-xl" />
        </button>
        <span className="font-semibold text-gray-800 text-sm">
          {selectedCount} contact{selectedCount !== 1 ? "s" : ""} selected
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onTag}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <MdLocalOffer className="text-gray-500" />
          Tag
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <MdFileDownload className="text-gray-500" />
          Export
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 transition-colors shadow-sm"
        >
          <MdDelete className="text-white" />
          Delete
        </button>
      </div>
    </div>
  );
}
