import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { useTemplateStore } from "../../../store/TemplateStore";
import TemplateCard from "./TemplateCard";
import TemplatePreview from "./TemplatePreview";
import TemplateModal from "./TemplateModal";
import DeleteModal from "./DeleteModal";
import { useToast } from "../../../components/UI/toast";

export default function TemplateList() {
  const { addToast } = useToast();
  const {
    templates,
    loading,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useTemplateStore();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreateClick = () => {
    setTemplateToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (template) => {
    setTemplateToEdit(template);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (template) => {
    setTemplateToDelete(template);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTemplate = async (data) => {
    try {
      if (templateToEdit) {
        await updateTemplate(templateToEdit._id, data);
        addToast("Template updated successfully", "success");
        if (selectedTemplate?._id === templateToEdit._id) {
          setSelectedTemplate({ ...selectedTemplate, ...data });
        }
      } else {
        await createTemplate(data);
        addToast("Template created successfully", "success");
      }
      setIsModalOpen(false);
    } catch (error) {
      addToast(error.message || "Something went wrong", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;
    try {
      await deleteTemplate(templateToDelete._id);
      addToast("Template deleted successfully", "success");
      if (selectedTemplate?._id === templateToDelete._id) {
        setSelectedTemplate(null);
      }
      setIsDeleteModalOpen(false);
      setTemplateToDelete(null);
    } catch (error) {
      addToast(error.message || "Failed to delete template", "error");
    }
  };

  const categories = ["All", "Marketing", "Utility", "Authentication"];

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Message Templates
          </h1>
          <p className="text-gray-500">
            Create and manage your WhatsApp message templates
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <Plus size={18} />
          <span>Create Template</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
        {/* Left Side: List */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-hidden">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="flex-1 overflow-y-auto pr-2">
            {loading && templates.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No templates found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <TemplateCard
                    key={template._id}
                    template={template}
                    isSelected={selectedTemplate?._id === template._id}
                    onClick={() => setSelectedTemplate(template)}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="w-full lg:w-[400px] flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Live Preview</h2>
          <TemplatePreview template={selectedTemplate} />
        </div>
      </div>

      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTemplate}
        template={templateToEdit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        templateName={templateToDelete?.name || ""}
      />
    </div>
  );
}
