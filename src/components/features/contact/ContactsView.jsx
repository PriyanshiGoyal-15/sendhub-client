import React, { useEffect, useState } from "react";
import ContactsHeader from "./ContactsHeader";
import ContactsFilter from "./ContactsFilter";
import ContactsTable from "./ContactsTable";
import EditContactModal from "./EditContactModal";
import AddContactModal from "./AddContactModal";
import BulkActionBar from "./BulkActionBar";
import ApplyTagModal from "./ApplyTagModal";
import ConfirmModal from "../../UI/ConfirmModal";
import { useContactStore } from "../../../store/ContactStore";
import { useToast } from "../../UI/toast";

export default function ContactsView() {
  const {
    contacts,
    loading,
    error,
    fetchContacts,
    deleteContact,
    selectedContacts,
    clearSelection,
    bulkDelete,
  } = useContactStore();

  const [editingContact, setEditingContact] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isApplyTagModalOpen, setIsApplyTagModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    id: null,
    isBulk: false,
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = (id) => {
    setDeleteConfirmation({ isOpen: true, id, isBulk: false });
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
  };

  const handleBulkDelete = () => {
    setDeleteConfirmation({ isOpen: true, id: null, isBulk: true });
  };

  const executeDelete = async () => {
    const { id, isBulk } = deleteConfirmation;
    if (isBulk) {
      try {
        await bulkDelete();
        addToast(
          `Successfully deleted ${selectedContacts.length} contacts.`,
          "success",
        );
      } catch (err) {
        console.error("Failed to delete contacts", err);
        addToast("Failed to delete some contacts.", "error");
      }
    } else {
      try {
        await deleteContact(id);
        addToast("Contact deleted.", "success");
      } catch (err) {
        console.error("Failed to delete contact", err);
        addToast("Failed to delete contact.", "error");
      }
    }
  };

  const handleBulkExport = () => {
    const selectedData = contacts.filter((c) =>
      selectedContacts.includes(c._id || c.id),
    );
    if (selectedData.length === 0) return;

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Status",
      "Tags",
      "Last Contacted",
    ];
    const csvRows = [headers.join(",")];

    selectedData.forEach((c) => {
      const row = [
        `"${c.name || ""}"`,
        `"${c.email || ""}"`,
        `"${c.phone || ""}"`,
        `"${c.status || ""}"`,
        `"${(c.tags || []).join(";")}"`,
        `"${c.lastContacted ? new Date(c.lastContacted).toISOString().split("T")[0] : ""}"`,
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `contacts_export_${new Date().getTime()}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-screen w-full relative">
      <ContactsHeader onAddContact={() => setIsAddModalOpen(true)} />
      <div className="mt-6 flex flex-col gap-4">
        <ContactsFilter />
        <ContactsTable
          contacts={contacts}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      <BulkActionBar
        selectedCount={selectedContacts.length}
        onClear={clearSelection}
        onTag={() => setIsApplyTagModalOpen(true)}
        onExport={handleBulkExport}
        onDelete={handleBulkDelete}
      />

      {editingContact && (
        <EditContactModal
          contact={editingContact}
          onClose={() => setEditingContact(null)}
        />
      )}
      {isAddModalOpen && (
        <AddContactModal onClose={() => setIsAddModalOpen(false)} />
      )}
      {isApplyTagModalOpen && (
        <ApplyTagModal
          selectedCount={selectedContacts.length}
          onClose={() => setIsApplyTagModalOpen(false)}
        />
      )}
      <ConfirmModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, id: null, isBulk: false })
        }
        onConfirm={executeDelete}
        title={deleteConfirmation.isBulk ? "Delete Contacts" : "Delete Contact"}
        message={
          deleteConfirmation.isBulk
            ? `Are you sure you want to delete ${selectedContacts.length} contacts? This action cannot be undone.`
            : "Are you sure you want to delete this contact? This action cannot be undone."
        }
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
