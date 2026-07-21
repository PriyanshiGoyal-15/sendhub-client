import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../UI/toast";
import { useSettingStore } from "../../../store/SettingStore";

export default function ProfileTab() {
  const { user } = useAuth();
  const { settings, saveSettings } = useSettingStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    senderName: settings?.senderName || user?.name || "",
    email: settings?.email || user?.email || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        senderName: settings.senderName || "",
        email: settings.email || "",
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    </div>
  );
}
