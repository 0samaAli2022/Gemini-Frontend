import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchNotifications } from '@/api/queries';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';
import Spinner from '@/components/Spinner';
import { useAuth } from '@/contexts/AuthProvider';

const NotificationContext = createContext();

export const socket = io('http://localhost:3000');

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: !!user,
  });

  useEffect(() => {
    if (user) {
      socket.emit('join', user.id);
      console.log(`Joined room with ID: ${user.id}`);
    }

    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      queryClient.setQueryData(
        ['notifications', notification.id],
        notification
      );
    });

    // Check socket connection
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('notification');
    };
  }, [user]);

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data, queryClient]);

  if (isLoading) {
    return <Spinner loading={isLoading} />;
  }

  if (error) {
    return <div>Error fetching notifications</div>;
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
