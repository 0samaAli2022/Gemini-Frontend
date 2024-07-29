import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileView from "../components/ProfileView";
import ProfileEditModal from "../components/ProfileEditModal";
import PostsList from "@/components/PostsList";
import { useParams } from "react-router-dom";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [bio, setBio] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const fetchPosts = async () => {
    if (!hasMore) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/posts?page=${page}&userId=${id}`);
      const newPosts = response.data.data.posts;
      setPosts((prevPosts) =>
        page === 1 ? newPosts : [...prevPosts, ...newPosts]
      );
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts();
  }, [id]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${id}`);
        const fetchedUser = response.data.data.user;
        setUser(fetchedUser);
        setBio(fetchedUser.profile.bio);
        setName(fetchedUser.name);
        setPreviewImage(fetchedUser.profile.photo);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
      setIsModalOpen(false);
      setLoading(true);
      const response = await axios.patch(`/api/users/${user.id}`, formData);
      const updatedUser = response.data.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
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
      <div className="max-w-4xl mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-4">{user.name}'s Profile</h1>
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <ProfileView
            name={name}
            bio={bio}
            previewImage={previewImage}
            openModal={openModal}
          />
        )}
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
        {isLoading ? (
          <Spinner loading={isLoading} />
        ) : (
          <PostsList posts={posts} />
        )}
      </div>
    </>
  );
};

export default ProfilePage;
