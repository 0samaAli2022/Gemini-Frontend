import React, { useState, useEffect, useCallback } from "react";
import PostsList from "@/components/PostsList";
import CreatePostButton from "@/components/CreatePostButton";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { debounce } from "@/lib/utils";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;

    try {
      setIsLoading(true);
      console.log(page);
      const response = await axios.get(`/api/posts?page=${page}`);
      const newPosts = response.data.data.posts;
      setPosts((prevPosts) =>
        page === 1 ? newPosts : [...prevPosts, ...newPosts]
      );
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1 &&
        hasMore &&
        !isLoading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 300);
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };
  return (
    <div className="max-w-2xl mx-auto mt-20">
      <CreatePostButton onPostCreated={handlePostCreated} />
      {isLoading ? (
        <Spinner loading={isLoading} />
      ) : (
        <PostsList posts={posts} />
      )}
    </div>
  );
};

export default HomePage;
