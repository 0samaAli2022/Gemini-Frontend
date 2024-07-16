import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import axios from "axios";
import ProfileView from "../components/ProfileView";
import ProfileEditModal from "../components/ProfileEditModal";
import PostsList from "@/components/PostsList";
import { useParams } from "react-router-dom";
import { usePosts } from "@/contexts/PostsContext";

const ProfilePage = () => {
  const { id } = useParams();
  const { posts, setPosts, isLoading, setUserId } = usePosts();
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [bio, setBio] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        const fetchedUser = response.data.data.user;
        setUserId(id);
        setUser(fetchedUser);
        setBio(fetchedUser.profile.bio);
        setName(fetchedUser.name);
        setPreviewImage(fetchedUser.profile.photo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [id]);

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("image", newImage);

      const response = await axios.patch(`/api/users/${user.id}`, formData);
      const updatedUser = response.data.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">{user.name}'s Profile</h1>
        <ProfileView
          name={name}
          bio={bio}
          previewImage={previewImage}
          openModal={openModal}
        />
        {isModalOpen && (
          <ProfileEditModal
            name={name}
            bio={bio}
            previewImage={previewImage}
            handleNameChange={handleNameChange}
            handleBioChange={handleBioChange}
            handleImageChange={handleImageChange}
            handleUpdateProfile={handleUpdateProfile}
            closeModal={closeModal}
          />
        )}
      </div>
      <div className="my-8">
        <hr className="border-t-2 border-gray-300" />
      </div>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">{user.name}'s Posts</h2>
        <PostsList posts={posts} />
      </div>
    </>
  );
};

export default ProfilePage;
