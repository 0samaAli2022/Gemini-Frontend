import React from 'react';
import Post from './Post';

const PostsList = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      {data?.pages.map((page) =>
        page.data.posts.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
};

export default PostsList;
