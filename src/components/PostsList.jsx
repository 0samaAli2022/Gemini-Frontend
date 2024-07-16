import React from 'react';
import Post from './Post';

const PostsList = ({ posts }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsList;
