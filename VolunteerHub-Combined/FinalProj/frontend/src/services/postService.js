/**
 * Post Service - GraphQL Integration
 * Tích hợp với backend GraphQL API để quản lý Posts và Comments
 */
import graphqlClient from '../api/graphqlClient';

// Create a new post
export const createPost = async ({ title, body, image, eventId }) => {
  try {
    const mutation = `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          ok
          id
          message
          createdAt
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, {
      input: { 
        eventId, 
        content: body
      }
    });
    
    return { success: data.createPost.ok, message: data.createPost.message, data: data.createPost };
  } catch (error) {
    console.error('Create post error:', error);
    return { success: false, error: error.message || 'Không thể tạo bài viết' };
  }
};

// Edit existing post
export const editPost = async (postId, content) => {
  try {
    const mutation = `
      mutation EditPost($input: EditPostInput!) {
        editPost(input: $input) {
          ok
          message
          updatedAt
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, {
      input: { postId, content }
    });
    
    return { success: data.editPost.ok, message: data.editPost.message };
  } catch (error) {
    console.error('Edit post error:', error);
    return { success: false, error: error.message };
  }
};

// Get posts for an event (Deprecated - use getEventById with nested posts instead)
export const getPostsByEvent = async (eventId, page = 0, size = 20) => {
  try {
    // Use findPosts query to get posts by eventId filter
    const query = `
      query FindPosts($page: Int!, $size: Int!) {
        findPosts(page: $page, size: $size) {
          content {
            postId
            eventId
            content
            createdAt
            commentCount
            likeCount
            creatorInfo {
              userId
              username
              avatarId
            }
          }
        }
      }
    `;
    
    const data = await graphqlClient.query(query, { page, size });
    return { success: true, data: { posts: data.findPosts.content } };
  } catch (error) {
    console.error('Get posts error:', error);
    return { success: false, error: error.message };
  }
};

// Get post by ID with nested comments
export const getPostById = async (postId) => {
  try {
    const query = `
      query GetPost($postId: ID!) {
        getPost(postId: $postId) {
          postId
          eventId
          content
          createdAt
          updatedAt
          commentCount
          likeCount
          creatorInfo {
            userId
            username
            avatarId
          }
          listComment(page: 0, size: 50) {
            content {
              commentId
              postId
              content
              createdAt
              likeCount
              creatorInfo {
                userId
                username
                avatarId
              }
            }
          }
        }
      }
    `;
    
    const data = await graphqlClient.query(query, { postId });
    return { success: true, data: data.getPost };
  } catch (error) {
    console.error('Get post error:', error);
    return { success: false, error: error.message };
  }
};

// Like/unlike a post
export const toggleLike = async (postId) => {
  try {
    const mutation = `
      mutation LikePost($input: LikeInput!) {
        like(input: $input) {
          ok
          message
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, {
      input: { targetType: 'POST', targetId: postId }
    });
    
    return { success: data.like.ok, message: data.like.message };
  } catch (error) {
    console.error('Toggle like error:', error);
    return { success: false, error: error.message };
  }
};

// 🔥 Alias for EventFeed component
export const likePost = toggleLike;

// Unlike a post
export const unlikePost = async (postId) => {
  try {
    const mutation = `
      mutation UnlikePost($input: LikeInput!) {
        unlike(input: $input) {
          ok
          message
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, {
      input: { targetType: 'POST', targetId: postId }
    });
    
    return { success: data.unlike.ok };
  } catch (error) {
    console.error('Unlike error:', error);
    return { success: false, error: error.message };
  }
};

// Add a comment
export const addComment = async (postId, text) => {
  try {
    // Ensure postId is clean Long ID (remove any mock prefix)
    const cleanPostId = typeof postId === 'string' 
      ? postId.replace(/^(mock-post-|post_\d+_)/, '')
      : postId;
    
    const mutation = `
      mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
          ok
          id
          message
          createdAt
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, {
      input: { postId: cleanPostId, content: text }
    });
    
    return { success: data.createComment.ok, message: data.createComment.message, data: data.createComment };
  } catch (error) {
    console.error('Add comment error:', error);
    return { success: false, error: error.message };
  }
};

// 🔥 Alias for EventFeed component
export const createComment = async ({ postId, content }) => {
  return addComment(postId, content);
};

// Edit a comment
export const editComment = async (commentId, content) => {
  try {
    const mutation = `
      mutation EditComment($input: EditCommentInput!) {
        editComment(input: $input) {
          ok
          message
          updatedAt
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, {
      input: { commentId, content }
    });
    
    return { success: data.editComment.ok };
  } catch (error) {
    console.error('Edit comment error:', error);
    return { success: false, error: error.message };
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const mutation = `
      mutation DeletePost($postId: ID!) {
        deletePost(postId: $postId) {
          ok
          message
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, { postId });
    return { success: data.deletePost.ok, message: data.deletePost.message };
  } catch (error) {
    console.error('Delete post error:', error);
    return { success: false, error: error.message };
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const mutation = `
      mutation DeleteComment($commentId: ID!) {
        deleteComment(commentId: $commentId) {
          ok
          message
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, { commentId });
    return { success: data.deleteComment.ok };
  } catch (error) {
    console.error('Delete comment error:', error);
    return { success: false, error: error.message };
  }
};
