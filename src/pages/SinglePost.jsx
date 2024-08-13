import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSinglePost } from '@/api/queries';
import Post from '@/components/Post';
import Spinner from '@/components/Spinner';
import { useParams } from 'react-router-dom';
import usePostUpdates from '@/hooks/usePostUpdates';

const SinglePost = () => {
  const { id } = useParams();
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchSinglePost(id),
    enabled: !!id,
  });

  usePostUpdates();

  if (isLoading) {
    return <Spinner loading={isLoading} />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-3xl w-full p-4">
        <Post post={post} />
      </div>
    </div>
  );
};

export default SinglePost;
