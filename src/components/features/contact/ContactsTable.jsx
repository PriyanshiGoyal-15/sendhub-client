import React from "react";
import {
  MdOutlineChat,
  MdOutlineEdit,
  MdOutlineDelete,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { useContactStore } from "../../../store/ContactStore";
import { getTagColor, getStatusColor } from "../../../utils/getColor";

export default function ContactsTable({
  contacts = [],
  loading,
  error,
  onDelete,
  onEdit,
}) {
  const {
    currentPage,
    totalPages,
    totalContacts,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    selectedContacts,
    toggleSelectAll,
    toggleSelectContact,
  } = useContactStore();

  const indexOfFirstRow = (currentPage - 1) * rowsPerPage;
  const indexOfLastRow = indexOfFirstRow + contacts.length;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarBg = (name) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-green-100 text-green-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const allSelected =
    selectedContacts.length === contacts.length && contacts.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[calc(100vh-280px)]">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary shadow-sm"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Last Contacted
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Loading contacts...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No contacts found.
                </td>
              </tr>
            ) : (
              contacts.map((contact) => {
                const contactId = contact._id || contact.id;
                const isSelected = selectedContacts.includes(contactId);

                return (
                  <tr
                    key={contactId}
                    className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-green-50/50" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary shadow-sm"
                        checked={isSelected}
                        onChange={() => toggleSelectContact(contactId)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs mr-3 ${getAvatarBg(contact.name)}`}
                        >
                          {getInitials(contact.name)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {contact.name || "N/A"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {contact.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags && contact.tags.length > 0 ? (
                          contact.tags.map((tag, i) => (
                            <span
                              key={i}
                              className={`px-2.5 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}
                      >
                        {contact.status || "Lead"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.lastContacted
                        ? new Date(contact.lastContacted)
                            .toISOString()
                            .split("T")[0]
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3 text-gray-400">
                        {/* <button
                          className="hover:text-blue-500 transition-colors"
                          title="Chat"
                        >
                          <MdOutlineChat className="text-lg" />
                        </button> */}
                        <button
                          onClick={() => onEdit(contact)}
                          className="hover:text-gray-700 transition-colors"
                          title="Edit"
                        >
                          <MdOutlineEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => onDelete(contactId)}
                          className="hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <MdOutlineDelete className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && !error && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border-none bg-transparent text-gray-700 font-medium cursor-pointer focus:ring-0"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-gray-500">
              {totalContacts > 0
                ? `${indexOfFirstRow + 1}-${indexOfLastRow} of ${totalContacts}`
                : `0 of 0`}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md hover:bg-gray-200 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MdChevronLeft className="text-xl" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages}
                className="p-1 rounded-md hover:bg-gray-200 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MdChevronRight className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
