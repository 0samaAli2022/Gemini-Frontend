import React from "react";
import { FaCamera } from "react-icons/fa";

const ProfileEditModal = ({
  name,
  bio,
  previewImage,
  handleNameChange,
  handleBioChange,
  handleImageChange,
  handleUpdateProfile,
  closeModal,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={handleBioChange}
            className="w-full h-40 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg resize-none focus:outline-none"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Profile Image
          </label>
          <div className="relative">
            <img
              className="h-48 w-48 object-cover rounded-lg shadow-md"
              src={previewImage}
              alt="Profile"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-48 h-48 opacity-0 cursor-pointer"
              style={{ zIndex: 11 }}
            />
            <button
              className="absolute bottom-2 right-72 bg-black hover:bg-gray-700 text-white rounded-full p-2 focus:outline-none"
              style={{ zIndex: 10 }}
            >
              <FaCamera />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateProfile}
            className="px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-lg shadow-md focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
