import React, { useEffect } from "react";
import { useToast } from "../../../../components/UI/toast";
import { useTemplateStore } from "../../../../store/TemplateStore";
import { useContactStore } from "../../../../store/ContactStore";

export default function TemplateAudience({
  data,
  updateData,
  onNext,
  onBack,
  onSaveDraft,
}) {
  const { addToast } = useToast();
  const { templates, fetchTemplates, loading } = useTemplateStore();
  const { filters, tags, fetchFilters } = useContactStore();

  useEffect(() => {
    fetchTemplates();
    fetchFilters();
  }, [fetchTemplates, fetchFilters]);

  const handleNext = () => {
    const selectedChannels = data.channels || [];
    for (const channel of selectedChannels) {
      if (!data.templates || !data.templates[channel]) {
        addToast(`Please select a ${channel} template.`, "error");
        return;
      }
    }

    if (data.audienceTags.length === 0) {
      addToast("Please select at least one audience tag.", "error");
      return;
    }
    onNext();
  };

  const handleTemplateSelect = (channel, template) => {
    const isCurrentlySelected = data.templates?.[channel]?._id === template._id;
    updateData({
      templates: {
        ...(data.templates || {}),
        [channel]: isCurrentlySelected ? null : template,
      },
    });
  };

  const toggleAudienceTag = (tag) => {
    const isSelected = data.audienceTags.includes(tag);
    if (isSelected) {
      updateData({ audienceTags: data.audienceTags.filter((t) => t !== tag) });
    } else {
      updateData({ audienceTags: [...data.audienceTags, tag] });
    }
  };

  const toggleSelectAllTags = () => {
    if (data.audienceTags.length === filters.length && filters.length > 0) {
      updateData({ audienceTags: [] });
    } else {
      updateData({ audienceTags: [...filters] });
    }
  };

  const selectedChannels = data.channels || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Select Templates
        </h2>

        {selectedChannels.map((channel) => {
          const channelTemplates = templates.filter(
            (t) => (t.channel || "SMS") === channel,
          );

          return (
            <div key={channel} className="mb-6">
              <h3 className="text-md font-bold text-gray-800 mb-2">
                {channel} Template
              </h3>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                </div>
              ) : channelTemplates.length === 0 ? (
                <div className="text-center p-4 text-gray-500 border rounded-xl bg-gray-50">
                  No {channel} templates found. Please create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                  {channelTemplates.map((tpl) => (
                    <div
                      key={tpl._id}
                      onClick={() => handleTemplateSelect(channel, tpl)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        data.templates?.[channel]?._id === tpl._id
                          ? "border-green-500 bg-green-50 shadow-sm"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {tpl.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            tpl.category === "Marketing"
                              ? "bg-orange-100 text-orange-700"
                              : tpl.category === "Utility"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {tpl.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {tpl.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Dynamic Variable Inputs */}
        {(() => {
          let totalVars = 0;
          const channelVars = {};

          selectedChannels.forEach((channel) => {
            const tpl = data.templates?.[channel];
            if (tpl) {
              const extractedMatches = tpl.content?.match(/\{\{\d+\}\}/g) || [];
              const uniqueVars = [...new Set(extractedMatches)].sort();
              
              if (uniqueVars.length > 0) {
                channelVars[channel] = uniqueVars.map((v) => {
                  const varNumber = v.replace(/[{}]/g, "");
                  const varName = tpl.variables && tpl.variables[varNumber - 1]
                      ? tpl.variables[varNumber - 1]
                      : `Variable ${varNumber}`;
                  totalVars++;
                  return { varNumber, varName, original: v };
                });
              }
            }
          });

          if (totalVars === 0) return null;

          return (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-md font-bold text-gray-900 mb-3">
                Template Variables
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Fill in the values for this campaign's variables by channel.
              </p>
              
              {Object.keys(channelVars).map(channel => (
                <div key={channel} className="mb-6">
                  <h4 className="text-sm font-bold text-gray-800 mb-3">{channel} Variables</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {channelVars[channel].map(({varNumber, varName, original}) => (
                      <div key={original} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">{`{{${varNumber}}} - ${varName}`}</label>
                        <input
                          type="text"
                          placeholder={`Enter value for ${varName}`}
                          value={
                            data.variables?.[channel]?.[String(varNumber)] || ""
                          }
                          onChange={(e) => {
                            const newVars = { ...(data.variables || {}) };
                            if (!newVars[channel]) newVars[channel] = {};
                            newVars[channel] = { ...newVars[channel], [String(varNumber)]: e.target.value };
                            updateData({ variables: newVars });
                          }}
                          className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Target Audience
        </h2>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Select tags to target specific contact groups
          </p>
          {filters.length > 0 && (
            <button
              onClick={toggleSelectAllTags}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {data.audienceTags.length === filters.length
                ? "Deselect All"
                : "Select All"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.length > 0 ? (
            filters.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleAudienceTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  data.audienceTags.includes(tag)
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {tag}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-400">
              No tags found. Add tags in the Contacts page.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={onSaveDraft}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleNext}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Next: Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
