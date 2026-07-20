import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <Topbar />
      {/* Main Content Area */}
      <div className="pt-20 pl-64 h-full">
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
