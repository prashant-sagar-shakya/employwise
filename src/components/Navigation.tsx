import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function Navigation() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm backdrop-filter ${
        theme === "dark"
          ? "bg-gray-800/80 text-white"
          : "bg-white/80 text-gray-900"
      } shadow-lg border-b border-opacity-20 ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <p
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              EmployWise
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === "dark"
                  ? "hover:bg-gray-700/50 text-white"
                  : "hover:bg-gray-100/50 text-gray-900"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-900" />
              )}
            </motion.button>
            {token && (
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-500/30"
              >
                Logout
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
