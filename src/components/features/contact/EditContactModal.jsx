import React, { useState, useEffect } from "react";
import { useContactStore } from "../../../store/ContactStore";
import { useToast } from "../../../components/UI/toast";
import { MdClose } from "react-icons/md";
import { getTagColor } from "../../../utils/getColor";

export default function EditContactModal({ contact, onClose }) {
  const { updateContact, statuses, tags } = useContactStore();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Lead",
    tags: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [predefinedTags, setPredefinedTags] = useState(
    tags && tags.length > 0 ? tags : [],
  );
  const [newTagInput, setNewTagInput] = useState("");

  useEffect(() => {
    if (tags && tags.length > 0) setPredefinedTags(tags);
  }, [tags]);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        status: contact.status || "Lead",
        tags: contact.tags || [],
      });
    }
  }, [contact]);

  if (!contact) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomTag = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      e.preventDefault();
      const val = newTagInput.trim();
      if (val && !predefinedTags.includes(val)) {
        setPredefinedTags((prev) => [...prev, val]);
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, val] }));
      } else if (
        val &&
        predefinedTags.includes(val) &&
        !formData.tags.includes(val)
      ) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, val] }));
      }
      setNewTagInput("");
    }
  };

  const handleTagClick = (chip) => {
    setFormData((prev) => {
      const hasTag = prev.tags.includes(chip);
      return {
        ...prev,
        tags: hasTag
          ? prev.tags.filter((t) => t !== chip)
          : [...prev.tags, chip],
      };
    });
  };

  const handleDeleteTag = (e, tagToDelete) => {
    e.stopPropagation();
    setPredefinedTags((prev) => prev.filter((t) => t !== tagToDelete));
    if (formData.tags.includes(tagToDelete)) {
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.filter((t) => t !== tagToDelete),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateContact(contact._id || contact.id, formData);
      addToast("Contact updated successfully", "success");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update contact");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Contact</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[80vh] overflow-y-auto"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              />
            </div>

            {/* Status Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              >
                {statuses.length === 0 && (
                  <option value={formData.status}>{formData.status}</option>
                )}
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {predefinedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`group flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${
                      formData.tags.includes(tag)
                        ? `${getTagColor(tag)} border-transparent ring-1 ring-black/5`
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span>{tag}</span>
                    <span
                      onClick={(e) => handleDeleteTag(e, tag)}
                      className={`ml-1 -mr-1 hidden group-hover:flex items-center justify-center rounded-full hover:bg-black/10 ${
                        formData.tags.includes(tag)
                          ? "text-current"
                          : "text-gray-400"
                      }`}
                    >
                      <MdClose className="text-sm" />
                    </span>
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="+ Add tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleAddCustomTag}
                  onBlur={handleAddCustomTag}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-full w-24 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-gray-50 text-gray-700"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-green-600 focus:outline-none disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
