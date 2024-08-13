import React from 'react';
import PostsList from '@/components/PostsList';
import CreatePostButton from '@/components/CreatePostButton';
import Spinner from '@/components/Spinner';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/api/queries';
import useInfiniteScroll from '@/hooks/useInfiniteScrolls';
import usePostUpdates from '@/hooks/usePostUpdates';

const HomePage = () => {
  const {
    data,
    isError,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length + 1;
      return lastPage.meta.pagesCount >= nextPage ? nextPage : undefined;
    },
    refetchOnWindowFocus: false,
  });

  usePostUpdates();
  useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <CreatePostButton />
      {(isFetching && !isFetchingNextPage) === true ? (
        <Spinner loading={isFetching} />
      ) : (
        <PostsList data={data} />
      )}
    </div>
  );
};

export default HomePage;
