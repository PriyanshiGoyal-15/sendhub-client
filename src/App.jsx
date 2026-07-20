import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./(auth)/register";
import Login from "./(auth)/login";
import ForgotPassword from "./(auth)/forgetPassword";
import VerifyOTP from "./(auth)/otp";
import ResetPassword from "./(auth)/resetPassword";
import DashboardLayout from "./(dashboard)/dashboard/DashboardLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./App.css";

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
      />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}

export default App;
