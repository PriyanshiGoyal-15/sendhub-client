import React from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <Topbar />
      {/* Main Content Area */}
      <div className="pt-20 pl-64 h-full">
        <main className="p-8">
          {children || (
            <div className="border-2 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center text-gray-400">
              Main Dashboard Content Goes Here
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
