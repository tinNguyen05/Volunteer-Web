import client from '../api/client';

// Create a new post
export const createPost = async (postData) => {
  const response = await client.post('/posts/create', postData);
  return response.data;
};

// Get posts for an event
export const getPostsByEvent = async (eventId, page = 1, limit = 20) => {
  const response = await client.get(`/posts/event/${eventId}`, {
    params: { page, limit },
  });
  return response.data;
};

// Like/unlike a post
export const toggleLike = async (postId) => {
  const response = await client.post(`/posts/${postId}/like`);
  return response.data;
};

// Add a comment
export const addComment = async (postId, text) => {
  const response = await client.post('/posts/comment', {
    postId,
    text,
  });
  return response.data;
};

// Get comments for a post
export const getCommentsByPost = async (postId) => {
  const response = await client.get(`/posts/${postId}/comments`);
  return response.data;
};

// Delete a post
export const deletePost = async (postId) => {
  const response = await client.delete(`/posts/${postId}`);
  return response.data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const response = await client.delete(`/posts/comment/${commentId}`);
  return response.data;
};
