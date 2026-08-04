import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  MessageSquare,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useToast } from "../../UI/toast";
import { useSettingStore } from "../../../store/SettingStore";

export default function ProviderApiTab() {
  const { settings, saveSettings } = useSettingStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    sendgridApiKey: "",
    sendgridFromEmail: "",
  });

  const [openPanel, setOpenPanel] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showTwilioToken, setShowTwilioToken] = useState(false);
  const [showSendgridKey, setShowSendgridKey] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        twilioAccountSid: settings.twilioAccountSid || "",
        twilioAuthToken: settings.twilioAuthToken || "",
        twilioPhoneNumber: settings.twilioPhoneNumber || "",
        sendgridApiKey: settings.sendgridApiKey || "",
        sendgridFromEmail: settings.sendgridFromEmail || "",
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (panel) => {
    setIsSaving(true);
    const result = await saveSettings(formData);
    setIsSaving(false);

    if (result.success) {
      addToast("Configuration saved successfully", "success");
      setOpenPanel(null); // Close panel on success
    } else {
      addToast(result.error || "Failed to save configuration", "error");
    }
  };

  const handleCancel = () => {
    // Reset form to saved settings
    if (settings) {
      setFormData({
        twilioAccountSid: settings.twilioAccountSid || "",
        twilioAuthToken: settings.twilioAuthToken || "",
        twilioPhoneNumber: settings.twilioPhoneNumber || "",
        sendgridApiKey: settings.sendgridApiKey || "",
        sendgridFromEmail: settings.sendgridFromEmail || "",
      });
    }
    setOpenPanel(null);
  };

  const isTwilioConnected =
    settings?.twilioAccountSid && settings?.twilioAuthToken;
  const isSendgridConnected =
    settings?.sendgridApiKey && settings?.sendgridFromEmail;

  const StatusBadge = ({ connected }) => {
    if (connected) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          <CheckCircle2 size={12} /> CONNECTED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
        <XCircle size={12} /> DISCONNECTED
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 w-full">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Connected Services
        </h2>
        <p className="text-sm text-gray-500">
          Manage your integration connections for sending campaigns.
        </p>
      </div>

      <div className="space-y-4">
        {/* TWILIO (SMS) PANEL */}
        <div
          className={`border rounded-lg transition-all ${
            openPanel === "twilio"
              ? "border-green-200 shadow-md"
              : "border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-t-lg gap-4 sm:gap-0">
            <div className="flex items-start sm:items-center gap-4">
              <div
                className={`p-2 rounded-full ${
                  isTwilioConnected
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-3">
                  Twilio <StatusBadge connected={isTwilioConnected} />
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  SMS Delivery · Requires Account SID and Auth Token
                </p>
              </div>
            </div>
            {openPanel !== "twilio" && (
              <button
                onClick={() => setOpenPanel("twilio")}
                className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
              >
                {isTwilioConnected ? "Manage" : "Reconnect"}
              </button>
            )}
          </div>

          {/* Expanded Content */}
          {openPanel === "twilio" && (
            <div className="p-6 bg-white border-t border-gray-100 space-y-5 rounded-b-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account SID
                </label>
                <input
                  type="text"
                  name="twilioAccountSid"
                  value={formData.twilioAccountSid}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                  placeholder="e.g. AC1234567890abcdef1234567890abcdef"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auth Token
                </label>
                <div className="relative">
                  <input
                    type={showTwilioToken ? "text" : "password"}
                    name="twilioAuthToken"
                    value={formData.twilioAuthToken}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors pr-10"
                    placeholder="Enter your Twilio Auth Token"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTwilioToken(!showTwilioToken)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showTwilioToken ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Phone Number
                </label>
                <input
                  type="text"
                  name="twilioPhoneNumber"
                  value={formData.twilioPhoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                  placeholder="e.g. +1234567890"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleSave("twilio")}
                  disabled={
                    isSaving ||
                    !formData.twilioAccountSid ||
                    !formData.twilioAuthToken ||
                    !formData.twilioPhoneNumber
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SENDGRID (EMAIL) PANEL */}
        <div
          className={`border rounded-lg transition-all ${
            openPanel === "sendgrid"
              ? "border-green-200 shadow-md"
              : "border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-t-lg gap-4 sm:gap-0">
            <div className="flex items-start sm:items-center gap-4">
              <div
                className={`p-2 rounded-full ${
                  isSendgridConnected
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-3">
                  SendGrid <StatusBadge connected={isSendgridConnected} />
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Email Delivery · Requires API Key and Verified Email
                </p>
              </div>
            </div>
            {openPanel !== "sendgrid" && (
              <button
                onClick={() => setOpenPanel("sendgrid")}
                className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
              >
                {isSendgridConnected ? "Manage" : "Reconnect"}
              </button>
            )}
          </div>

          {/* Expanded Content */}
          {openPanel === "sendgrid" && (
            <div className="p-6 bg-white border-t border-gray-100 space-y-5 rounded-b-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showSendgridKey ? "text" : "password"}
                    name="sendgridApiKey"
                    value={formData.sendgridApiKey}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors pr-10"
                    placeholder="e.g. SG.xxxxxxxxxx"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSendgridKey(!showSendgridKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showSendgridKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verified From Email
                </label>
                <input
                  type="text"
                  name="sendgridFromEmail"
                  value={formData.sendgridFromEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                  placeholder="e.g. info@yourbrand.com"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleSave("sendgrid")}
                  disabled={
                    isSaving ||
                    !formData.sendgridApiKey ||
                    !formData.sendgridFromEmail
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
