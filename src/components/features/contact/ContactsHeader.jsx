import React, { useRef, useState } from "react";
import { MdOutlineFileUpload, MdAdd } from "react-icons/md";
import { useContactStore } from "../../../store/ContactStore";
import { parseCSV } from "../../../utils/csvParser";
import { useToast } from "../../UI/toast";

export default function ContactsHeader({ onAddContact }) {
  const fileInputRef = useRef(null);
  const { createContact, fetchContacts } = useContactStore();
  const [isImporting, setIsImporting] = useState(false);
  const { addToast } = useToast();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const contactsToImport = parseCSV(text);

      if (contactsToImport.length === 0) {
        addToast("No valid contacts found in the CSV.", "error");
        setIsImporting(false);
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      // Import contacts sequentially to avoid overwhelming the backend
      for (const contact of contactsToImport) {
        try {
          if (contact.name || contact.email || contact.phone) {
            await createContact(contact);
            successCount++;
          }
        } catch (err) {
          console.error("Failed to import contact:", contact, err);
          errorCount++;
        }
      }

      await fetchContacts();

      if (errorCount === 0) {
        addToast(`Successfully imported ${successCount} contacts.`, "success");
      } else if (successCount > 0) {
        addToast(
          `Imported ${successCount} contacts, but failed on ${errorCount}.`,
          "error",
        );
      } else {
        addToast(`Failed to import any contacts.`, "error");
      }
    } catch (err) {
      console.error("Error reading CSV:", err);
      addToast("Error reading CSV file.", "error");
    } finally {
      setIsImporting(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your contact list</p>
      </div>
      <div className="flex space-x-3 mt-4 sm:mt-0">
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleImportClick}
          disabled={isImporting}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdOutlineFileUpload className="mr-2 text-sm text-gray-500" />
          {isImporting ? "Importing..." : "Import CSV"}
        </button>
        <button
          onClick={onAddContact}
          className="flex items-center px-4 py-2 bg-green-500 border border-transparent rounded-md text-xs sm:text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors"
        >
          <MdAdd className="mr-1 text-lg" />
          Add Contact
        </button>
      </div>
    </div>
  );
}
