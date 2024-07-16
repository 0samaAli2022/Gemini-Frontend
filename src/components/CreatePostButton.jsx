import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import CreatePostModal from "./CreatePostModal";
import { useAuth } from "../contexts/AuthProvider";

const CreatePostButton = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="flex items-center p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-50"
        onClick={openModal}
      >
        <img
          src={user.profile.photo}
          alt={user.name}
          className="w-10 h-10 rounded-full mr-2"
        />
        <div className="bg-gray-100  hover:bg-gray-200 text-gray-600 rounded-full px-4 py-2 flex-1">
          What's on your mind, {user.name}?
        </div>
      </div>
      {isModalOpen && (
        <CreatePostModal onPostCreated={onPostCreated} onClose={closeModal} />
      )}
    </>
  );
};

export default CreatePostButton;
