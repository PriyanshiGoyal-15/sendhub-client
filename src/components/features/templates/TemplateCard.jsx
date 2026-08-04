import { Edit2, Trash2 } from "lucide-react";

export default function TemplateCard({
  template,
  isSelected,
  onClick,
  onEdit,
  onDelete,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // returns YYYY-MM-DD
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Marketing":
        return "bg-amber-100 text-amber-700";
      case "Utility":
        return "bg-green-100 text-green-700";
      case "Authentication":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  // Truncate content for the card view
  const displayContent =
    template.content.length > 100
      ? template.content.substring(0, 100) + "..."
      : template.content;

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 cursor-pointer transition-colors bg-white ${
        isSelected
          ? "border-green-500 shadow-sm"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{template.name}</h3>
        <div className="flex space-x-2 text-gray-400">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(template);
            }}
            className="hover:text-gray-600 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(template);
            }}
            className="hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex space-x-2 mb-3">
        <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
          {template.channel || "SMS"}
        </span>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(
            template.category,
          )}`}
        >
          {template.category}
        </span>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(
            template.status || "Approved",
          )}`}
        >
          {template.status || "Approved"}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {displayContent}
      </p>

      <div className="flex items-center text-xs text-gray-500 space-x-3">
        <span>{template.language || "English"}</span>
        <span>
          Modified{" "}
          {formatDate(template.updatedAt || template.createdAt || new Date())}
        </span>
        <span>
          {template.variableCount || 0}{" "}
          {template.variableCount === 1 ? "variable" : "variables"}
        </span>
      </div>
    </div>
  );
}
