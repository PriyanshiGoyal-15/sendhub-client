import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import Register from "./(auth)/register";
import Login from "./(auth)/login";
import ForgotPassword from "./(auth)/forgetPassword";
import VerifyOTP from "./(auth)/otp";
import ResetPassword from "./(auth)/resetPassword";
import DashboardLayout from "./(dashboard)/DashboardLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./App.css";

// Placeholder pages for sidebar items
import Contacts from "./(dashboard)/contacts/page";
import Campaigns from "./(dashboard)/campaigns/page";
import CreateCampaignPage from "./(dashboard)/campaigns/create/page";
import EditCampaignPage from "./(dashboard)/campaigns/edit/[id]/page";
import Templates from "./(dashboard)/templates/page";
import Inbox from "./(dashboard)/inbox/page";
import Analytics from "./(dashboard)/analytics/page";
import Settings from "./(dashboard)/settings/page";
import DashboardHome from "./(dashboard)/dashboard/page";

function App() {
  return (
    <Routes>
      {/* Public landing page — shown first to all visitors */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Auth routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgetPassword" element={<ForgotPassword />} />
      <Route path="/verifyOTP" element={<VerifyOTP />} />
      <Route path="/resetPassword" element={<ResetPassword />} />

      {/* Protected dashboard under /app */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="campaigns/create" element={<CreateCampaignPage />} />
        <Route path="campaigns/edit/:id" element={<EditCampaignPage />} />
        <Route path="templates" element={<Templates />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all → landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
