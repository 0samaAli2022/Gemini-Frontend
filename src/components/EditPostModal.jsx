import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { usePosts } from "@/contexts/PostsContext";

const EditPostModal = ({ onClose, onPostUpdated, postToEdit }) => {
  const [title, setTitle] = useState(postToEdit.title);
  const [content, setContent] = useState(postToEdit.content);
  const [privacy, setPrivacy] = useState(postToEdit.privacy);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("privacy", privacy);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.patch(
        `/api/posts/${postToEdit.id}`,
        formData
      );
      const post = response.data.data.post;
      onPostUpdated(post);
      onClose();
    } catch (error) {
      setError(error.response.data.message);
      console.error("Error updating post:", error);
    }
  };
  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Concatenate new images and previews with existing ones
    setImages([...images, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none"
          />
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-20 p-2 mb-2 bg-gray-100 text-gray-800 rounded-lg resize-none focus:outline-none"
          ></textarea>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="w-full p-2 mb-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="FOLLOWERS">Followers</option>
          </select>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 font-bold">
              Upload New Images
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
                <div className="flex flex-col items-center justify-center pt-7">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-500 group-hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V4m0 0H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-3m-3-2l-1.414 1.414a1 1 0 00-1.172 0L12 4.586l-.707-.707a1 1 0 00-1.414 0L8 6m4-2v6"
                    />
                  </svg>
                  <p className="pt-1 text-sm tracking-wider text-gray-500 group-hover:text-gray-600">
                    Select images
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  className="opacity-0"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          {imagePreviews.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-700 font-bold mb-2">Image Previews:</p>
              <div className="grid grid-cols-3 gap-2">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 focus:outline-none"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-lg shadow-md focus:outline-none"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditPostModal;
