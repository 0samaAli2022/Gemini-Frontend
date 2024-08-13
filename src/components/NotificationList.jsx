import React from 'react';
import { useNotifications } from '../contexts/NotificationProvider';
import NotificationCard from './NotificationCard';

const NotificationList = () => {
  const { notifications } = useNotifications();

  return (
    <div className="bg-white rounded-md shadow-lg ring-1 ring-gray-200 max-w-full max-h-80 overflow-y-auto">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">
          No notifications yet.
        </div>
      )}
    </div>
  );
};

export default NotificationList;
