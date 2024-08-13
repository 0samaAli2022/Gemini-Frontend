import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addComment, fetchComments } from '@/api/queries';
import Spinner from './Spinner';
import Comment from './Comment';

const CommentsModal = ({ postId, onClose }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });

  const addCommentMutation = useMutation({
    mutationFn: () => addComment(postId, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (isLoading) return <Spinner loading={isLoading} />;

  const handleAddComment = async () => {
    addCommentMutation.mutate();
  };

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
        <div className="mb-4 pb-7 max-h-64 overflow-y-auto">
          {comments &&
            comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
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
        {addCommentMutation.isError && (
          <p className="text-red-500 mt-2">
            {addCommentMutation.error.response.data.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentsModal;
