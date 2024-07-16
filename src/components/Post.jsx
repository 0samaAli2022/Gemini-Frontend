import React, { useState, useEffect } from "react";
import { FaHeart, FaComment, FaEllipsisH } from "react-icons/fa";
import CommentsModal from "../components/CommentsModal";
import EditPostModal from "./EditPostModal";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";
import { Link } from "react-router-dom";
import { usePosts } from "@/contexts/PostsContext";

const Post = ({ post }) => {
  const { user } = useAuth();
  const { posts, setPosts } = usePosts();
  const [likes, setLikes] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLike = async () => {
    try {
      await axios.post(`/api/posts/${post.id}/like`);
      setLikes(likes + 1);
    } catch (error) {
      if (error.response.data.message === "You already liked this post") {
        await axios.delete(`/api/posts/${post.id}/like`);
        setLikes(likes - 1);
      }
    }
  };

  const handleEditPost = () => {
    setIsEditModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
  };
  const handleCommentAdded = async () => {
    setCommentsCount(commentsCount + 1);
  };

  const handleComment = () => {
    setIsCommentModalOpen(true);
  };

  const handlePostUpdated = (updatedPost) => {
    // Update the local state immediately
    setUpdatedPost(updatedPost);
    setIsEditModalOpen(false); // Close the edit modal after update
  };

  // Update global state if updatedPost changes
  useEffect(() => {
    if (updatedPost) {
      setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    }
  }, [updatedPost, posts, setPosts]);

  // Function to render images with appropriate grid layout
  const renderImages = (images) => {
    const imageCount = images.length;

    if (imageCount === 1) {
      return (
        <img
          src={images[0]}
          alt="Post image"
          className="w-full max-h-96 object-cover rounded-lg"
        />
      );
    } else if (imageCount === 2) {
      return (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      );
    } else if (imageCount === 3) {
      return (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 relative">
      {isMenuOpen && (
        <div className="absolute top-4 right-7 bg-white shadow-md rounded-lg py-1 px-2 z-10">
          <button
            className="block w-full text-left text-gray-700 hover:bg-gray-200 py-1 px-2 rounded-md"
            onClick={handleEditPost}
          >
            Edit Post
          </button>
          <button
            className="block w-full text-left text-gray-700 hover:bg-gray-200 py-1 px-2 rounded-md"
            onClick={() => {
              //handleDeletePost();
              setIsMenuOpen(false);
            }}
          >
            Delete Post
          </button>
        </div>
      )}
      {user.id === post.author.id && (
        <div className="absolute top-2 right-2">
          <FaEllipsisH
            className="text-gray-600 cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
      )}
      <div className="flex items-center mb-4">
        <Link to={`/profile/${post.author.id}`}>
          <img
            src={post.author.profile.photo}
            alt={`${post.author.name}'s profile`}
            className="w-10 h-10 rounded-full mr-4"
          />
        </Link>
        <div>
          <Link to={`/profile/${post.author.id}`}>
            <h3 className="text-lg font-bold">{post.author.name}</h3>
            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </Link>
        </div>
      </div>

      <div className="mb-4">
        {post.images.length > 0 && renderImages(post.images)}
      </div>

      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <div className="flex justify-start items-center space-x-4">
        <button
          onClick={handleLike}
          className="flex items-center text-gray-700 hover:text-red-500"
        >
          <FaHeart className="mr-1" />
          {likes}
        </button>
        <button
          onClick={handleComment}
          className="flex items-center text-gray-700 hover:text-blue-500"
        >
          <FaComment className="mr-1" />
          {commentsCount}
        </button>
      </div>

      <CommentsModal
        postId={post.id}
        isOpen={isCommentModalOpen}
        onClose={handleCloseCommentModal}
        onCommentAdded={handleCommentAdded}
      />
      {isEditModalOpen && (
        <EditPostModal
          onClose={handleCloseEditModal}
          onPostUpdated={handlePostUpdated}
          postToEdit={post}
        />
      )}
    </div>
  );
};

export default Post;
