import React from "react";
import { useNavigate } from "react-router-dom";

const EmailVerified = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Email Verified
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Your email has been successfully verified.
        </p>
        <button
          onClick={handleLoginRedirect}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default EmailVerified;
