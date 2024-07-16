import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

const CommentsModal = ({ postId, isOpen, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (isOpen) {
      const fetchComments = async () => {
        try {
          const response = await axios.get(`/api/posts/${postId}/comments`);
          setComments(response.data.data.comments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };

      fetchComments();
    }
  }, [isOpen, postId]);

  const handleAddComment = async () => {
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content: newComment,
      });
      setComments([...comments, response.data.data.comment]);
      onCommentAdded();
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="mb-4 max-h-64 overflow-y-auto">
          {comments &&
            comments.map((comment) => (
              <div key={comment.id} className="mb-4 flex items-start">
                <Link to={`/profile/${comment.author.id}`}>
                  <img
                    src={comment.author.profile.photo}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full mr-4 cursor-pointer"
                  />
                </Link>
                <div>
                  <Link
                    to={`/profile/${comment.author.id}`}
                    className="text-gray-800 font-bold hover:underline"
                  >
                    {comment.author.name}
                  </Link>
                  <p className="text-gray-700">{comment.content}</p>
                  <span className="text-gray-500 text-sm">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full h-20 p-2 mb-4 bg-gray-100 text-gray-800 rounded-lg resize-none focus:outline-none"
          placeholder="Add a comment..."
        ></textarea>
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-black hover:bg-gray-700 text-white rounded-lg shadow-md focus:outline-none"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default CommentsModal;
