import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthProvider';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProfileEditModal from './ProfileEditModal';
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, checkFollowStatus } from '@/api/queries';

const ProfileView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserProfile(id),
    refetchOnWindowFocus: false,
  });

  const { data: isFollowing } = useQuery({
    queryKey: ['isFollowing', id],
    queryFn: checkFollowStatus(id),
    refetchOnWindowFocus: false,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/users/${id}/follow`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isFollowing', id] });
      toast.success('User followed successfully');
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`/api/users/${id}/follow`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isFollowing', id] });
      toast.success('User unfollowed successfully');
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleFollow = async () => {
    followMutation.mutate();
  };

  const handleUnfollow = async () => {
    unfollowMutation.mutate();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <Spinner loading={isLoading} />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Profile Image Section */}
        <div className="relative flex-shrink-0 w-full md:w-48">
          <img
            className="h-48 w-48 object-cover rounded-full border-4 border-gray-200 shadow-lg"
            src={userProfile.profile.photo}
            alt="Profile"
          />
          {userProfile.id === user.id && (
            <button
              className="absolute bottom-2 right-2 bg-black text-white rounded-full p-2 shadow-md hover:bg-gray-700"
              onClick={openModal}
            >
              <FaCamera />
            </button>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{userProfile.name}</h1>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Bio</h2>
            <p className="text-gray-700">{userProfile.profile.bio}</p>
          </div>
          {userProfile.id === user.id ? (
            <button
              onClick={openModal}
              className="px-6 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-700"
            >
              Edit Profile
            </button>
          ) : isFollowing ? (
            <button
              onClick={handleUnfollow}
              className="px-6 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-700"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="px-6 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-700"
            >
              Follow
            </button>
          )}
        </div>
      </div>
      {isModalOpen && <ProfileEditModal closeModal={closeModal} />}
    </div>
  );
};

export default ProfileView;
