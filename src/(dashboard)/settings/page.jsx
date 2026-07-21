import { useEffect } from "react";
import ProfileTab from "../../components/features/settings/ProfileTab";
import WhatsAppApiTab from "../../components/features/settings/WhatsAppApiTab";
import SendingLimitsTab from "../../components/features/settings/SendingLimitsTab";
import { useSettingStore } from "../../store/SettingStore";

export default function Settings() {
  const { fetchSettings, isLoading, settings } = useSettingStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (isLoading && !settings) {
    return (
      <div className="p-8 text-center text-gray-500">Loading settings...</div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="max-w-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-2">
            Manage your account and platform configuration.
          </p>
        </div>

        <div className="space-y-8 pb-12">
          {/* Sender Identity Card */}
          <ProfileTab />

          {/* WhatsApp API Configuration Card */}
          <WhatsAppApiTab />

          {/* Sending Limits */}
          <SendingLimitsTab />
        </div>
      </div>
    </div>
  );
}
