import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import { Users, Phone } from "lucide-react";

export default function LivePreview({ data }) {
  const [previewContacts, setPreviewContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);

  // Fetch a preview of matching contacts whenever audience tags change
  useEffect(() => {
    const fetchAudiencePreview = async () => {
      if (!data.audienceTags || data.audienceTags.length === 0) {
        setPreviewContacts([]);
        setTotalMatches(0);
        return;
      }

      setLoadingContacts(true);
      try {
        const tagsString = data.audienceTags.join(",");
        const res = await api.get(
          `/contact?audienceTags=${encodeURIComponent(tagsString)}&limit=100`,
        );
        setPreviewContacts(res.data.contacts || []);
        setTotalMatches(res.data.total || 0);
      } catch (err) {
        console.error("Failed to fetch audience preview", err);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchAudiencePreview();
  }, [data.audienceTags]);

  const getVariablesList = (content) => {
    const matches = content?.match(/\{\{\d+\}\}/g) || [];
    return [...new Set(matches)].sort();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-6">Live Preview</h2>
        <div className="flex flex-col items-center gap-8 w-full">
          {(data.channels || []).length === 0 && (
            <p className="text-sm text-gray-500 text-center w-full">Select a channel to preview.</p>
          )}
          {(data.channels || []).map((channel) => {
            const tpl = data.templates?.[channel];
            let previewText =
              tpl?.content || `Select an ${channel} template to preview...`;
            
            const channelVariables = tpl ? getVariablesList(tpl.content) : [];
            channelVariables.forEach((v) => {
              const varNumber = v.replace(/[{}]/g, "");
              let val = data.variables ? data.variables[varNumber] : null;
              if (val) {
                previewText = previewText.replaceAll(v, val);
              }
            });

            if (channel === "SMS") {
              return (
                <div key={channel} className="w-full flex flex-col items-center">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                    SMS / WhatsApp Preview
                  </h3>
                  {/* Phone Container */}
                  <div className="w-[300px] h-[200px] bg-black rounded-[30px] p-2 relative shadow-xl overflow-hidden">
                    {/* Phone Screen */}
                    <div className="bg-[#EFEAE2] w-full h-full rounded-[24px] overflow-hidden flex flex-col relative">
                      {/* WhatsApp Header */}
                      <div className="bg-[#00a884] text-white px-4 py-2 flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="currentColor"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.333.158 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.332 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Brand</div>
                          <div className="text-[10px] text-white/80">Online</div>
                        </div>
                      </div>

                      {/* Message Bubble */}
                      <div className="p-3">
                        <div className="bg-white rounded-lg rounded-tl-none p-2 shadow-sm max-w-[85%] relative">
                          <p className="text-[12px] text-gray-800 leading-snug whitespace-pre-wrap">
                            {previewText}
                          </p>
                          <div className="text-[9px] text-gray-400 text-right mt-1">
                            12:00 PM
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (channel === "EMAIL") {
              return (
                <div key={channel} className="w-full flex flex-col items-center">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                    Email Preview
                  </h3>
                  {/* Email Container */}
                  <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-[#f2f6fc] px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        New Message
                      </div>
                      <div className="w-10"></div>
                    </div>
                    
                    {/* From/To/Subject */}
                    <div className="px-5 py-3 border-b border-gray-100 flex flex-col gap-3">
                      <div className="flex items-center text-sm">
                        <span className="w-16 text-gray-400 text-xs uppercase font-semibold">From</span>
                        <span className="font-medium text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-md text-xs border border-gray-200">yourbrand@example.com</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-16 text-gray-400 text-xs uppercase font-semibold">To</span>
                        <span className="font-medium text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-md text-xs border border-gray-200">customer@email.com</span>
                      </div>
                      <div className="flex items-center text-sm pt-1 border-t border-gray-50 mt-1">
                        <span className="w-16 text-gray-400 text-xs uppercase font-semibold">Subject</span>
                        <span className="font-medium text-gray-900">{tpl?.subject || "No subject specified"}</span>
                      </div>
                    </div>
                    
                    {/* Body */}
                    <div className="p-6 min-h-[200px] bg-white text-[14px] text-gray-800 whitespace-pre-wrap leading-relaxed font-sans">
                      {previewText}
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      {/* Target Audience Contact Preview */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            Audience Preview
          </h3>
          {totalMatches > 0 && (
            <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-1 rounded-full">
              {totalMatches} Total
            </span>
          )}
        </div>

        {loadingContacts ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
          </div>
        ) : previewContacts.length > 0 ? (
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
            {previewContacts.map((contact) => (
              <div
                key={contact._id}
                className="flex items-center justify-between p-2 rounded-lg border border-gray-100 bg-gray-50"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {contact.name}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {contact.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                    {contact.tags?.length > 2 && (
                      <span className="text-[10px] text-gray-500">
                        +{contact.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <Phone className="w-3 h-3" />
                  {contact.phone}
                </div>
              </div>
            ))}
            {totalMatches > previewContacts.length && (
              <p className="text-xs text-center text-gray-500 mt-3 italic">
                + {totalMatches - previewContacts.length} more contacts
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center p-4 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
            {data.audienceTags?.length > 0
              ? "No contacts found with these tags."
              : "Select target audience tags to see preview."}
          </p>
        )}
      </div>
    </div>
  );
}
