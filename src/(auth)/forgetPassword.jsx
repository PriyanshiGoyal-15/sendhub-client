import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { useToast } from "../components/UI/toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/forgot-password", {
        email,
      });

      addToast("OTP sent successfully to your email!", "success");
      // Redirect to OTP verification page and pass the token and email
      navigate("/verifyOTP", {
        state: {
          email: email,
          resetToken: res.data.data.resetToken,
        },
      });
    } catch (err) {
      addToast(err.response?.data?.message || "An error occurred", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineMailOutline className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Send Reset Link
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Remember your password?
                </span>
              </div>
            </div>

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
    </div>
  );
}

export default ForgotPassword;
