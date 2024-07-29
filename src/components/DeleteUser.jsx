import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import axios from "axios";
import Spinner from "./Spinner";

const DeleteUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/users/${user.id}`, {
        data: { password },
      });
      logout();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setError("");
    setPassword("");
  };

  return (
    <>
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : (
        <div>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Account
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-1/3 p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Confirm Delete
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete this account? This action
                  cannot be undone. Once deleted, you will not be able to
                  recover your account and all of your data will be permanently
                  deleted.
                </p>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="flex justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 mr-2 bg-gray-500 hover:bg-gray-700 text-white rounded-md focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md focus:outline-none"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DeleteUser;
