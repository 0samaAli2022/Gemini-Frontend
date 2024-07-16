import React from "react";
import axios from "axios";
import PostsList from "@/components/PostsList";
import { useState, useEffect } from "react";
import CreatePostButton from "@/components/CreatePostButton";
import { usePosts } from "@/contexts/PostsContext";
const HomePage = () => {
  const { posts, setPosts, isLoading, setUserId } = usePosts();

  useEffect(() => {
    setUserId(null);
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <CreatePostButton onPostCreated={handlePostCreated} />
      <PostsList posts={posts} />
    </div>
  );
};

export default HomePage;
