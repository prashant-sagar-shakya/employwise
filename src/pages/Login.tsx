import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService, LoginCredentials } from "../services/api";
import toast from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(credentials);
      localStorage.setItem("token", response.token);
      toast.success("Login successful!");
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen h-screen w-screen flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`max-w-md w-full mx-auto my-auto space-y-8 p-8 rounded-xl backdrop-blur-lg backdrop-filter ${
          theme === "dark"
            ? "bg-gray-800/80 shadow-lg shadow-purple-500/20 border border-gray-700 border-opacity-20"
            : "bg-white/80 shadow-lg shadow-indigo-500/20 border border-gray-200 border-opacity-20"
        }`}
      >
        <div>
          <h2
            className={`mt-6 text-center text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Sign in to EmployWise
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="eve.holt@reqres.in"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="cityslicka"
              />
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all duration-200 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
