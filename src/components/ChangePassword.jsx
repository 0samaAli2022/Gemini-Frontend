import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import Spinner from "./Spinner";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const data = {
      oldPassword,
      newPassword,
    };

    try {
      setIsLoading(true);
      await axios.patch("/api/auth/change-password", data);
      alert("Password changed successfully, please login again.");
      logout();
    } catch (error) {
      setError(error.response.data.message);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : (
        <div className="change-password-form">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="old-password"
                className="block text-sm font-medium text-gray-700"
              >
                Old Password
              </label>
              <input
                type="password"
                id="old-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2  bg-black hover:bg-gray-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
