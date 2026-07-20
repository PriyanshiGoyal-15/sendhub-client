import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useContactStore } from "../../../store/ContactStore";
import { getTagColor } from "../../../utils/getColor";

export default function ApplyTagModal({ onClose, selectedCount }) {
  const { tags, bulkAddTags } = useContactStore();
  const [selectedTags, setSelectedTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleApply = async () => {
    if (selectedTags.length === 0) {
      onClose();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await bulkAddTags(selectedTags);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to apply tags");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-start p-6 pb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Apply Tag</h2>
            <p className="text-sm text-gray-500 mt-1">
              Add a tag to {selectedCount} selected contact
              {selectedCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <div className="p-6 pt-4">
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${
                  selectedTags.includes(tag)
                    ? `${getTagColor(tag)} border-transparent ring-1 ring-black/5`
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {tag}
              </button>
            ))}
            {tags.length === 0 && (
              <div className="text-sm text-gray-500 w-full text-center py-4">
                No tags available. Create some tags in Add/Edit contact first.
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={saving || selectedTags.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md hover:bg-green-600 focus:outline-none disabled:opacity-50"
            >
              {saving ? "Applying..." : "Apply Tag"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
