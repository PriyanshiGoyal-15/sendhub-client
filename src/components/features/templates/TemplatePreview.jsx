import { useState, useEffect } from "react";
import { MessageCircle, Smartphone } from "lucide-react";

export default function TemplatePreview({ template }) {
  const [variableValues, setVariableValues] = useState({});

  // Reset variable values when template changes
  useEffect(() => {
    setVariableValues({});
  }, [template]);

  if (!template) {
    return (
      <div className="h-[70%] flex flex-col items-center justify-center text-gray-500 pb-20">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Smartphone size={32} className="text-slate-400" />
        </div>
        <p className="text-lg">Select a template</p>
        <p className="text-lg">to preview it</p>
      </div>
    );
  }

  // Extract variables
  const getVariablesList = (content) => {
    const matches = content?.match(/{{\d+}}/g) || [];
    return [...new Set(matches)].sort();
  };

  const variables = getVariablesList(template.content);

  const handleVariableChange = (variable, value) => {
    setVariableValues((prev) => ({
      ...prev,
      [variable]: value,
    }));
  };

  let previewText = template.content || "";
  variables.forEach((v) => {
    const val = variableValues[v];
    if (val) {
      previewText = previewText.replaceAll(v, val);
    }
  });

  return (
    <div className="flex flex-col h-fit ">
      {/* Phone Preview */}
      <div className="bg-[#E5DDD5] rounded-3xl p-4 border-[8px] border-black shadow-xl relative overflow-hidden mb-6 h-[280px]">
        {/* Status Bar / Header */}
        <div className="bg-[#075E54] -mx-4 -mt-4 px-4 py-3 text-white flex items-center space-x-2 rounded-t-2xl shadow-sm z-10 relative">
          <MessageCircle size={20} className="fill-white" />
          <span className="font-semibold text-sm">WABA Platform</span>
        </div>

        {/* Message Bubble */}
        <div className="bg-[#DCF8C6] p-3 rounded-lg rounded-tl-none mt-4 max-w-[90%] shadow-sm relative text-sm text-gray-800">
          <div className="whitespace-pre-wrap">{previewText}</div>
          <div className="text-[10px] text-gray-500 text-right mt-1">
            12:00 PM
          </div>
        </div>
      </div>

      {/* Variables Section */}
      {variables.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">
            Variables
          </h4>
          <p className="text-xs text-gray-500 mb-3">
            Note: This is only for previewing the message. To permanently add or
            edit variables, edit the template.
          </p>
          <div className="space-y-3">
            {variables.map((v) => (
              <div key={v} className="flex items-center space-x-3">
                <span className="text-blue-600 font-medium text-sm w-8">
                  {v}
                </span>
                <input
                  type="text"
                  value={variableValues[v] || ""}
                  onChange={(e) => handleVariableChange(v, e.target.value)}
                  placeholder={`Value for ${v}`}
                  className="flex-1 bg-white border border-blue-500 rounded-md px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meta Info */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex">
          <span className="font-medium w-24">Category:</span>
          <span>{template.category}</span>
        </div>
        <div className="flex">
          <span className="font-medium w-24">Status:</span>
          <span>{template.status || "Approved"}</span>
        </div>
        <div className="flex">
          <span className="font-medium w-24">Language:</span>
          <span>{template.language || "English"}</span>
        </div>
      </div>
    </div>
  );
}
