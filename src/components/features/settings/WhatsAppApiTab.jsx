import { useState, useEffect } from "react";
import { Copy, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "../../UI/toast";
import { useSettingStore } from "../../../store/SettingStore";

export default function WhatsAppApiTab() {
  const { settings, saveSettings } = useSettingStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    apiToken: settings?.apiToken || "",
    phoneNumberId: settings?.phoneNumberId || "",
    webhookUrl: settings?.webhookUrl || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        apiToken: settings.apiToken || "",
        phoneNumberId: settings.phoneNumberId || "",
        webhookUrl: settings.webhookUrl || "",
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = () => {
    if (formData.webhookUrl) {
      navigator.clipboard.writeText(formData.webhookUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveSettings(formData);
    setIsSaving(false);

    if (result.success) {
      addToast("Configuration saved successfully", "success");
    } else {
      addToast(result.error || "Failed to save configuration", "error");
    }
  };

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      addToast("Test failed: Please verify credentials", "error");
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6 w-full">
      <div className="border-b border-gray-100 pb-5 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          WhatsApp Business API Configuration
        </h2>
        <p className="text-sm text-gray-500">
          Connect your WhatsApp Business API credentials to start sending
          messages.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Token
          </label>
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              name="apiToken"
              value={formData.apiToken}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors pr-10"
              placeholder="Enter your WhatsApp API token"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number ID
          </label>
          <input
            type="text"
            name="phoneNumberId"
            value={formData.phoneNumberId}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
            placeholder="e.g. 123456789012345"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="webhookUrl"
              value={formData.webhookUrl}
              onChange={handleChange}
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
              placeholder="e.g. https://api.yourdomain.com/webhook/whatsapp"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              className={`px-4 py-2 border rounded-lg transition-colors flex items-center justify-center min-w-[3rem] ${
                isCopied
                  ? "border-green-500 bg-green-50 text-green-600"
                  : "border-gray-300 hover:bg-gray-100 text-gray-600"
              }`}
            >
              {isCopied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Use this URL in your WhatsApp Business API webhook settings
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-orange-500 shrink-0" size={20} />
          <div>
            <h4 className="text-sm font-medium text-orange-800">
              Connection Status
            </h4>
            <p className="text-sm text-orange-700 mt-1">
              API not connected. Enter your credentials and click save to
              connect.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Configuration"}
        </button>
        <button
          onClick={handleTest}
          disabled={isTesting}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isTesting ? "Testing..." : "Test Connection"}
        </button>
      </div>
    </div>
  );
}
