import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../components/UI/toast";

function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const inputRefs = useRef([]);

  const email = location.state?.email;
  const resetToken = location.state?.resetToken;

  useEffect(() => {
    // If user got here without going through forgot password, redirect back
    if (!email || !resetToken) {
      navigate("/forgetPassword");
    }
  }, [email, resetToken, navigate]);

  // Focus the first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const verifyOTP = async (otpString) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/verifyOTP", {
        email,
        otp: otpString,
      });

      addToast(
        res.data.data?.message || "OTP verified successfully!",
        "success",
      );

      // Navigate to reset password page and pass OTP along with token and email
      navigate("/resetPassword", {
        state: {
          email,
          resetToken,
          otp: otpString,
        },
      });
    } catch (err) {
      addToast(
        err.response?.data?.error?.message || "Invalid or Expired OTP",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }

    // Auto submit if it's the last one
    if (index === 5 && element.value !== "") {
      const fullOtp = [...otp];
      fullOtp[5] = element.value;
      verifyOTP(fullOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      e.target.previousSibling
    ) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOTP(otp.join(""));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold">{email}</span>.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                Enter Security Code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((data, index) => {
                  return (
                    <input
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-gray-50"
                      type="text"
                      name="otp"
                      maxLength="1"
                      key={index}
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      disabled={isLoading}
                    />
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
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

export default VerifyOTP;
