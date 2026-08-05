import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../UI/toast";
import { useSettingStore } from "../../../store/SettingStore";

export default function ProfileTab() {
  const { user } = useAuth();
  const { settings, saveSettings } = useSettingStore();
  const { addToast } = useToast();
  const fileInputRef = React.useRef(null);

  const [formData, setFormData] = useState({
    senderName: settings?.senderName || user?.name || "",
    email: settings?.email || user?.email || "",
    profileImage: settings?.profileImage || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        senderName: settings.senderName || "",
        email: settings.email || "",
        profileImage: settings.profileImage || "",
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size < 100 * 1024) {
        // 100KB minimum
        addToast("Image size should be at least 100KB", "error");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        // 4MB maximum
        addToast("Image size should be less than 4MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveSettings(formData);
    setIsSaving(false);

    if (result.success) {
      addToast("Profile updated successfully!", "success");
    } else {
      addToast(result.error || "Failed to update profile", "error");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6 w-full">
      <div className="border-b border-gray-100 pb-5 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Sender Identity
        </h2>
        <p className="text-sm text-gray-500">
          This is how your identity appears on the platform.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
              {formData.profileImage ? (
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="w-full h-full focus:outline-none "
                >
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                  />
                </button>
              ) : (
                <span className="text-gray-400 text-sm font-medium">
                  No img
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    className="sr-only"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </label>
                {formData.profileImage && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={async () => {
                      const updatedForm = { ...formData, profileImage: "" };
                      setFormData(updatedForm);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }

                      // Auto-save the removal
                      setIsSaving(true);
                      const result = await saveSettings(updatedForm);
                      setIsSaving(false);
                      if (result.success) {
                        addToast("Profile photo removed", "success");
                      } else {
                        addToast("Failed to remove photo", "error");
                      }
                    }}
                    className="py-2 px-3 border border-red-200 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 transition-colors bg-white disabled:opacity-50"
                  >
                    {isSaving && !formData.profileImage
                      ? "Removing..."
                      : "Remove"}
                  </button>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                JPG, PNG, GIF between 100KB and 4MB
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sender Name
          </label>
          <input
            type="text"
            name="senderName"
            value={formData.senderName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
            placeholder="e.g. Acme Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
            placeholder="e.g. admin@example.com"
          />
        </div>

        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium mr-2">From</span>
            {formData.email || "admin@example.com"}
          </div>
          <span className="text-green-700 font-medium">
            verified via Platform
          </span>
        </div>
      </div>

      <div className="flex justify-start pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Image Preview Modal */}
      {isPreviewOpen && formData.profileImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-black overflow-hidden rounded-full shadow-2xl flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10 text-white"
            >
              <X size={20} />
            </button>
            <img
              src={formData.profileImage}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
