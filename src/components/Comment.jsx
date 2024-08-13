import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment, editComment } from '@/api/queries';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

function Comment({ comment, onDelete }) {
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);

  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation({
    mutationFn: () => deleteComment(comment.post_id, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', comment.post_id],
      });
      onDelete();
      setMenuVisible(false);
      toast.success('Comment deleted successfully');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: () => editComment(comment.post_id, comment.id, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', comment.post_id],
      });
      setMenuVisible(false);
      setEditMode(false);
      toast.success('Comment updated successfully');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleDelete = () => {
    deleteCommentMutation.mutate();
  };

  const handleEdit = () => {
    setEditMode(true);
    setMenuVisible(false);
  };

  const handleSave = () => {
    editCommentMutation.mutate();
  };

  const handleCancel = () => {
    setEditMode(false);
    setNewContent(comment.content);
  };

  return (
    <div className="mb-4 flex items-start relative">
      <Link to={`/profile/${comment.author.id}`}>
        <img
          src={comment.author.profile.photo}
          alt={comment.author.name}
          className="w-10 h-10 rounded-full mr-4 cursor-pointer"
        />
      </Link>
      <div className="flex-grow">
        <Link
          to={`/profile/${comment.author.id}`}
          className="text-gray-800 font-bold"
        >
          {comment.author.name}
        </Link>
        {editMode ? (
          <div>
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
              >
                {editCommentMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
            {editCommentMutation.isError && (
              <p className="block text-red-500 mt-2">
                {editCommentMutation.error.response.data.message}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-700">{comment.content}</p>
        )}
        <span className="text-gray-500 text-sm">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      {user.id === comment.author.id && (
        <div className="ml-auto relative">
          <button
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaEllipsisV size={15} />
          </button>
          {menuVisible && (
            <div className="absolute right-0 my-2 w-48 bg-white border rounded shadow-md z-10">
              <button
                onClick={handleEdit}
                className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100 w-full"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100 w-full"
              >
                {deleteCommentMutation.isPending ? (
                  <Spinner loading={deleteCommentMutation.isPending} />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Comment;
