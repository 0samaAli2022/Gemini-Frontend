import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MarkNotifcationAsRead } from '@/api/queries';
import { useNavigate } from 'react-router-dom';

const NotificationCard = ({ notification }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => MarkNotifcationAsRead(notification.id),
    onSuccess: () => {
      console.log('Notification marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
    },
  });

  const handleMarkAsRead = () => {
    navigate(`/posts/${notification.post_id}`);
    if (notification.read) return;
    mutation.mutate();
  };

  return (
    <div
      onClick={handleMarkAsRead}
      className={`flex items-center p-4 mb-2 border border-gray-200 shadow rounded-md transition-transform transform hover:scale-105 cursor-pointer ${
        notification.read
          ? 'bg-gray-100 text-gray-500'
          : 'bg-white text-gray-800'
      }`}
    >
      {/* {notification.type === 'success' ? (
        <FaCheckCircle className="text-green-500 mr-2" />
      ) : (
        <FaExclamationCircle className="text-red-500 mr-2" />
      )} */}
      <p className="text-sm font-medium">{notification.message}</p>
    </div>
  );
};

export default NotificationCard;
