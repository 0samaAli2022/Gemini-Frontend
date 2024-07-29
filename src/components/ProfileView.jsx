import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { useAuth } from "../contexts/AuthProvider";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProfileView = ({ name, bio, previewImage, openModal }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await axios.get(`/api/users/${id}/isFollowing`);
        setIsFollowing(response.data.data.isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setLoading(false);
      }
    };
    checkFollowStatus();
  }, [id, user.id]);
  const handleFollow = async () => {
    try {
      await axios.post(`/api/users/${id}/follow`);
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  const handleUnfollow = async () => {
    try {
      await axios.delete(`/api/users/${id}/follow`);
      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-shrink-0 w-full md:w-48 md:mr-4 mb-4 md:mb-0 relative">
        <img
          className="h-48 w-full object-cover rounded-lg shadow-md"
          src={previewImage}
          alt="Profile"
        />
        {user.id === id && (
          <button
            className="absolute bottom-2 right-2 bg-black hover:bg-gray-700 text-white rounded-full p-2 focus:outline-none"
            onClick={openModal}
          >
            <FaCamera />
          </button>
        )}
      </div>
      <div className="flex-1">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <p className="text-gray-700">{name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Bio</label>
          <p className="text-gray-700">{bio}</p>
        </div>
        {user.id === id ? (
          <button
            onClick={openModal}
            className="px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-lg shadow-md focus:outline-none"
          >
            Edit Profile
          </button>
        ) : isFollowing ? (
          <button
            onClick={handleUnfollow}
            className="px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-lg shadow-md focus:outline-none"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className="px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-lg shadow-md focus:outline-none"
          >
            Follow
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
