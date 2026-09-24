import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/UI/toast";
import { useNavigate, Link } from "react-router-dom";
import {
  MdOutlineMailOutline,
  MdOutlineRemoveRedEye,
  MdOutlinePersonOutline,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { FaPaperPlane } from "react-icons/fa";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await register(name, email, password);
      addToast("Successfully registered!", "success");
      navigate("/app");
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || "Failed to register";
      setError(errMsg);
      addToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="flex items-center space-x-2 text-2xl font-bold mb-8">
          <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
            <FaPaperPlane className="text-white text-xl" />
          </div>
          <span>SendHub</span>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[450px]">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-500">Sign up to get started</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlinePersonOutline className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineMailOutline className="text-gray-400 text-lg" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  placeholder="you@company.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  placeholder="Enter your password"
                  className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <MdOutlineVisibilityOff className="text-gray-400 text-lg hover:text-gray-600" />
                  ) : (
                    <MdOutlineRemoveRedEye className="text-gray-400 text-lg hover:text-gray-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center font-medium bg-red-50 p-2.5 rounded-lg">
                {error}
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default Register;
