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
  const { tags, fetchFilters } = useContactStore();

  useEffect(() => {
    fetchTemplates();
    fetchFilters();
  }, [fetchTemplates, fetchFilters]);

  const handleNext = () => {
    if (!data.template) {
      addToast("Please select a template.", "error");
      return;
    }
    if (data.audienceTags.length === 0) {
      addToast("Please select at least one audience tag.", "error");
      return;
    }
    onNext();
  };

  const handleTemplateSelect = (template) => {
    updateData({ template });
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
    if (data.audienceTags.length === tags.length && tags.length > 0) {
      updateData({ audienceTags: [] });
    } else {
      updateData({ audienceTags: [...tags] });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Select Template
        </h2>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No templates found. Please create a template first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {templates.map((tpl) => (
              <div
                key={tpl._id}
                onClick={() => handleTemplateSelect(tpl)}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  data.template?._id === tpl._id
                    ? "border-green-500 bg-green-50 shadow-sm"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
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

        {/* Dynamic Variable Inputs */}
        {(() => {
          if (!data.template) return null;

          // Dynamically extract variables from content e.g. {{1}}, {{2}}
          const extractedMatches =
            data.template.content?.match(/\{\{\d+\}\}/g) || [];
          const uniqueVars = [...new Set(extractedMatches)].sort();

          if (uniqueVars.length === 0) return null;

          return (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-md font-bold text-gray-900 mb-3">
                Template Variables
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Fill in the values for this campaign's variables.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uniqueVars.map((v, idx) => {
                  const varNumber = v.replace(/[{}]/g, "");
                  // Fallback if the database didn't save the variable names array
                  const varName =
                    data.template.variables &&
                    data.template.variables[varNumber - 1]
                      ? data.template.variables[varNumber - 1]
                      : `Variable ${varNumber}`;

                  return (
                    <div key={v} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">{`{{${varNumber}}} - ${varName}`}</label>
                      <input
                        type="text"
                        placeholder={`Enter value for ${varName}`}
                        value={
                          data.variables
                            ? data.variables[String(varNumber)] ||
                              data.variables[varNumber] ||
                              ""
                            : ""
                        }
                        onChange={(e) => {
                          const newVars = { ...(data.variables || {}) };
                          newVars[String(varNumber)] = e.target.value;
                          updateData({ variables: newVars });
                        }}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                      />
                    </div>
                  );
                })}
              </div>
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
          {tags.length > 0 && (
            <button
              onClick={toggleSelectAllTags}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {data.audienceTags.length === tags.length
                ? "Deselect All"
                : "Select All"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
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
