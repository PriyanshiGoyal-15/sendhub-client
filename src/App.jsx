import { Routes, Route, Navigate } from "react-router-dom";
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
import Templates from "./(dashboard)/templates/page";
import Inbox from "./(dashboard)/inbox/page";
import Analytics from "./(dashboard)/analytics/page";
import Settings from "./(dashboard)/settings/page";
import DashboardHome from "./(dashboard)/dashboard/page";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgetPassword" element={<ForgotPassword />} />
      <Route path="/verifyOTP" element={<VerifyOTP />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Child routes for the dashboard */}
        <Route index element={<DashboardHome />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="templates" element={<Templates />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}

export default App;
