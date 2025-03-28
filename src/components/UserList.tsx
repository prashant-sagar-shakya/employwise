import { useState, useEffect } from "react";
import { User, userService } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function UserList() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers(page);
      setUsers(response.data);
      setTotalPages(response.total_pages);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdate = async (user: User) => {
    try {
      await userService.updateUser(user.id, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen p-10 w-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="w-full px-0">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <p className="text-2xl font-bold mb-4 sm:mb-0">User Management</p>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              } border ${
                theme === "dark" ? "border-gray-700" : "border-gray-300"
              }`}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-lg p-6 backdrop-blur-lg backdrop-filter ${
                    theme === "dark"
                      ? "bg-gray-800/80 shadow-lg shadow-purple-500/20"
                      : "bg-white/80 shadow-lg shadow-indigo-500/20"
                  } border border-opacity-20 ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  {editingUser?.id === user.id ? (
                    <motion.div
                      initial={{ y: -300, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -300, opacity: 0 }}
                      transition={{ type: "spring", damping: 25 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50"
                    >
                      <motion.div
                        className={`w-full max-w-md mx-auto rounded-xl p-6 space-y-4 ${
                          theme === "dark" ? "bg-gray-800" : "bg-white"
                        }`}
                      >
                        <input
                          type="text"
                          value={editingUser.first_name}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              first_name: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 rounded-md ${
                            theme === "dark"
                              ? "bg-gray-700 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          value={editingUser.last_name}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              last_name: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 rounded-md ${
                            theme === "dark"
                              ? "bg-gray-700 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                          placeholder="Last Name"
                        />
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              email: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 rounded-md ${
                            theme === "dark"
                              ? "bg-gray-700 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                          placeholder="Email"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleUpdate(editingUser)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex justify-center mb-4">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-24 h-24 rounded-full ring-4 ring-indigo-500/30"
                          />
                        ) : (
                          <UserCircleIcon className="w-24 h-24 text-indigo-500" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-center mb-2">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p
                        className={`text-center mb-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {user.email}
                      </p>
                      <div className="flex justify-center space-x-2">
                        <motion.button
                          onClick={() => setEditingUser(user)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 ease-in-out shadow-lg shadow-indigo-500/30"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(user.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 ease-in-out shadow-lg shadow-red-500/30"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            } ${
              page === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-100"
            }`}
          >
            Previous
          </button>
          <span
            className={`px-4 py-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            } ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
