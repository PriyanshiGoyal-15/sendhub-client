import React, { useState, useEffect } from "react";

export default function LivePreview({ data }) {
  const [variableValues, setVariableValues] = useState({});

  useEffect(() => {
    setVariableValues({});
  }, [data.template]);

  const getVariablesList = (content) => {
    const matches = content?.match(/\{\{\d+\}\}/g) || [];
    return [...new Set(matches)].sort();
  };

  const variables = data.template
    ? getVariablesList(data.template.content)
    : [];

  const handleVariableChange = (variable, value) => {
    setVariableValues((prev) => ({
      ...prev,
      [variable]: value,
    }));
  };

  let previewText =
    data.template?.content || "Select a template to preview your message...";
  variables.forEach((v) => {
    const val = variableValues[v];
    if (val) {
      previewText = previewText.replaceAll(v, val);
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Live Preview</h2>

      <div className="flex flex-col items-center">
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
                <div className="font-semibold text-sm">WABA Platform</div>
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

        {variables.length > 0 ? (
          <div className="w-full mt-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Variables
            </h3>
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
                    className="flex-1 bg-white border border-blue-500 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-6">
            Preview how your message will appear
          </p>
        )}
      </div>
    </div>
  );
}
