import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function usePostUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on('postUpdated', (updatedPost) => {
      queryClient.setQueryData(['posts'], (prev) => {
        if (prev) {
          // console.log('Previous data:', prev);
          const updatedData = {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((post) =>
                  post.id === updatedPost.id ? updatedPost : post
                ),
              },
            })),
          };
          // console.log('Updated data:', updatedData);
          return updatedData;
        }
        return prev;
      });

      queryClient.setQueryData(['posts', updatedPost.id], updatedPost);
    });

    return () => {
      socket.off('postUpdated');
    };
  }, [queryClient]);
}

export default usePostUpdates;
