import { useState, useEffect } from "react";
import { useToast } from "../../UI/toast";
import { useSettingStore } from "../../../store/SettingStore";

export default function SendingLimitsTab() {
  const { settings, saveSettings } = useSettingStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    dailyLimit: settings?.dailyLimit || 1000,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        dailyLimit: settings.dailyLimit || 1000,
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
      addToast("Sending limits updated successfully!", "success");
    } else {
      addToast(result.error || "Failed to update sending limits", "error");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6 w-full">
      <div className="border-b border-gray-100 pb-5 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Sending Limits</h2>
        <p className="text-sm text-gray-500">
          Default daily send limits and caps for your campaigns.
        </p>
      </div>
      <div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            name="dailyLimit"
            value={formData.dailyLimit}
            onChange={handleChange}
            className="w-24 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
          />
          <span className="text-gray-600 text-sm">messages per day</span>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          To protect deliverability, campaigns send up to this many messages per
          day. Contact support to increase your limits.
        </p>
      </div>
      <div className="flex justify-start pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Limits"}
        </button>
      </div>
    </div>
  );
}
