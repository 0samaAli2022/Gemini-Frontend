import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PostsContexts = createContext();
const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/posts${userId ? `?userId=${userId}` : ""}`
        );
        const posts = response.data.data.posts;
        setPosts(posts);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [userId]);
  return (
    <PostsContexts.Provider value={{ posts, setPosts, isLoading, setUserId }}>
      {children}
    </PostsContexts.Provider>
  );
};

export const usePosts = (userId) => useContext(PostsContexts);
export default PostsProvider;
