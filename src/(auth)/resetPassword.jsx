import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdOutlineVpnKey, MdOutlineLock } from "react-icons/md";
import { useToast } from "../components/UI/toast";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const email = location.state?.email;
  const resetToken = location.state?.resetToken;
  const otp = location.state?.otp;

  useEffect(() => {
    // If user got here without going through forgot password, redirect back
    if (!email || !resetToken) {
      navigate("/forgetPassword");
    }
  }, [email, resetToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast("Passwords do not match!", "error");
      return;
    }

    try {
      const res = await api.post(`/auth/resetPassword/${resetToken}`, {
        email,
        otp,
        password,
        confirmPassword,
      });

      addToast(
        res.data.data?.message || "Password reset successfully!",
        "success",
      );
      navigate("/login");
    } catch (err) {
      addToast(
        err.response?.data?.error?.message || "An error occurred",
        "error",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set New Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineVpnKey className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Reset Password
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-hover"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
