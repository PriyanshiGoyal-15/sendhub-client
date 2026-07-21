import { Trash2 } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  templateName,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Trash2 className="text-red-500" size={24} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Delete Template
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            This will permanently remove the template{" "}
            <span className="font-semibold text-gray-700">
              "{templateName}"
            </span>
            . This action cannot be undone.
          </p>

          <div className="flex justify-center space-x-3 w-full">
            <button
              onClick={onClose}
              className="px-4 py-2 flex-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 flex-1 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
