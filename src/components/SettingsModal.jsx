import React, { useState } from "react";
import { createPortal } from "react-dom";
import ChangePassword from "./ChangePassword";
import DeleteUser from "./DeleteUser";

const settingsData = [
  { title: "Change Password", component: ChangePassword },
  { title: "Delete Account", component: DeleteUser },
  // Add more settings as needed
];

const SettingsModal = ({ isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-3/4 max-w-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Settings
        </h2>
        {settingsData.map((setting, index) => (
          <div key={index} className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer text-gray-900 dark:text-white"
              onClick={() => toggleSection(index)}
            >
              <h3 className="text-lg font-medium">{setting.title}</h3>
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  expandedSection === index ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {expandedSection === index && (
              <div className="mt-2 text-gray-700 dark:text-gray-300">
                <setting.component />
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2  bg-black hover:bg-gray-700 text-white rounded-md  focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SettingsModal;
