import React from "react";
import { Plus, Download, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your WhatsApp Business activity
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => navigate("/campaigns/create")}
          className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Plus size={16} className="mr-2" />
          New Campaign
        </button>

        <button
          onClick={() => navigate("/contacts")}
          className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={16} className="mr-2" />
          Import Contacts
        </button>

        <button
          onClick={() => navigate("/templates")}
          className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
        >
          <FileText size={16} className="mr-2" />
          Create Template
        </button>
      </div>
    </div>
  );
}
