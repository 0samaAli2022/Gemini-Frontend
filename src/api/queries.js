import axios from 'axios';

const fetchPosts = async (pageParam) => {
  const response = await axios.get(`/api/posts?page=${pageParam}`);
  return response.data;
};

const fetchSinglePost = async (postId) => {
  const response = await axios.get(`/api/posts/${postId}`);
  return response.data.data.post;
};

const updatePost = async (postId, formData) => {
  const response = await axios.patch(`/api/posts/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.post;
};

const fetchComments = async (postId) => {
  const response = await axios.get(`/api/posts/${postId}/comments`);
  return response.data.data.comments;
};

const fetchNotifications = async () => {
  const response = await axios.get('/api/notifications');
  return response.data.data.notifications;
};

const addComment = async (postId, commentText) => {
  const response = await axios.post(`/api/posts/${postId}/comments`, {
    content: commentText,
  });
  return response.data.data.comment;
};

const deleteComment = async (postId, commentId) => {
  const response = await axios.delete(
    `/api/posts/${postId}/comments/${commentId}`
  );
  return response.data;
};

const editComment = async (postId, commentId, content) => {
  const response = await axios.put(
    `/api/posts/${postId}/comments/${commentId}`,
    {
      content,
    }
  );
  return response.data.data.comment;
};

const createPost = async (formData) => {
  const response = await axios.post(`/api/posts`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.post;
};

const fetchUserPosts = async ({ pageParam = 1, id }) => {
  const response = await axios.get(
    `/api/posts?page=${pageParam}${id ? `&userId=${id}` : ''}`
  );
  return response.data;
};

const fetchUserProfile = async (id) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data.data.user;
};

const checkFollowStatus = (id) => async () => {
  const response = await axios.get(`/api/users/${id}/isFollowing`);
  return response.data.data.isFollowing;
};

const MarkNotifcationAsRead = async (id) => {
  const response = await axios.post(`/api/notifications/${id}/read`);
  return response;
};

export {
  fetchUserProfile,
  checkFollowStatus,
  fetchPosts,
  fetchSinglePost,
  fetchUserPosts,
  updatePost,
  createPost,
  fetchComments,
  addComment,
  deleteComment,
  editComment,
  MarkNotifcationAsRead,
  fetchNotifications,
};
