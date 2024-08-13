import React from 'react';
import ProfileView from '../components/ProfileView';
import PostsList from '@/components/PostsList';
import { useParams } from 'react-router-dom';
import Spinner from '@/components/Spinner';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserPosts } from '@/api/queries';
import useInfiniteScroll from '@/hooks/useInfiniteScrolls';

const ProfilePage = () => {
  const { id } = useParams();

  const {
    data,
    isError,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', id],
    queryFn: ({ pageParam = 1 }) => fetchUserPosts({ pageParam, id }),
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length + 1;
      return lastPage.meta.pagesCount >= nextPage ? nextPage : undefined;
    },
    refetchOnWindowFocus: false,
  });

  useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

  return (
    <>
      <div className="max-w-4xl mx-auto mt-20">
        <ProfileView />
      </div>
      <div className="my-8">
        <hr className="border-t-2 border-gray-300" />
      </div>
      <div className="max-w-4xl mx-auto">
        {(isFetching && !isFetchingNextPage) === true ? (
          <Spinner loading={isFetching} />
        ) : (
          <PostsList data={data} />
        )}
      </div>
    </>
  );
};

export default ProfilePage;
