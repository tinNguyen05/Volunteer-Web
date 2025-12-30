/**
 * EventPosts Service - GraphQL Integration
 * Service for Event Details page with nested Posts & Comments
 */

import graphqlClient from '../api/graphqlClient';

/**
 * Get Event with nested Posts & Comments
 * @param {string} eventId - Event ID
 * @param {number} postPage - Page number for posts (default 0)
 * @param {number} postSize - Posts per page (default 10)
 * @param {number} commentSize - Comments per post (default 5)
 */
export const getEventWithPosts = async (eventId, postPage = 0, postSize = 10, commentSize = 5) => {
  try {
    const query = `
      query GetEventWithPosts($eventId: ID!, $postPage: Int!, $postSize: Int!, $commentSize: Int!) {
        getEvent(eventId: $eventId) {
          eventId
          eventName
          eventDescription
          eventLocation
          createdAt
          updatedAt
          memberCount
          postCount
          likeCount
          creatorInfo {
            userId
            username
            avatarId
          }
          listPosts(page: $postPage, size: $postSize) {
            pageInfo {
              page
              size
              totalElements
              totalPages
              hasNext
              hasPrevious
            }
            content {
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
              listComment(page: 0, size: $commentSize) {
                pageInfo {
                  page
                  size
                  totalElements
                  totalPages
                  hasNext
                  hasPrevious
                }
                content {
                  commentId
                  postId
                  content
                  createdAt
                  updatedAt
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
        }
      }
    `;

    const data = await graphqlClient.query(query, { 
      eventId, 
      postPage, 
      postSize, 
      commentSize 
    });

    return {
      success: true,
      data: data.getEvent
    };
  } catch (error) {
    console.error('Error fetching event with posts:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Load more comments for a specific post
 * @param {string} postId - Post ID
 * @param {number} page - Page number (default 0)
 * @param {number} size - Comments per page (default 5)
 */
export const getPostComments = async (postId, page = 0, size = 10) => {
  try {
    const query = `
      query GetPostComments($postId: ID!, $page: Int!, $size: Int!) {
        getPost(postId: $postId) {
          postId
          listComment(page: $page, size: $size) {
            pageInfo {
              page
              size
              totalElements
              totalPages
              hasNext
              hasPrevious
            }
            content {
              commentId
              postId
              content
              createdAt
              updatedAt
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

    const data = await graphqlClient.query(query, { postId, page, size });

    return {
      success: true,
      data: data.getPost.listComment
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create Post (GraphQL Mutation)
 * @param {Object} input - Post data
 */
export const createPostGraphQL = async (input) => {
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

    const data = await graphqlClient.mutation(mutation, { input });

    return {
      success: data.createPost.ok,
      data: data.createPost,
      message: data.createPost.message
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Edit Post (GraphQL Mutation)
 * @param {Object} input - Edit data with postId
 */
export const editPostGraphQL = async (input) => {
  try {
    const mutation = `
      mutation EditPost($input: EditPostInput!) {
        editPost(input: $input) {
          ok
          id
          message
          updatedAt
        }
      }
    `;

    const data = await graphqlClient.mutation(mutation, { input });

    return {
      success: data.editPost.ok,
      data: data.editPost,
      message: data.editPost.message
    };
  } catch (error) {
    console.error('Error editing post:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete Post (GraphQL Mutation)
 * @param {string} postId - Post ID
 */
export const deletePostGraphQL = async (postId) => {
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

    return {
      success: data.deletePost.ok,
      message: data.deletePost.message
    };
  } catch (error) {
    console.error('Error deleting post:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Like/Unlike Post or Comment
 * @param {Object} input - { targetId, targetType: "POST" or "COMMENT" }
 */
export const toggleLikeGraphQL = async (targetId, targetType) => {
  try {
    // Check if already liked (in real app, query current state first)
    // For now, we'll always call "like" and let backend handle toggle
    const mutation = `
      mutation Like($input: LikeInput!) {
        like(input: $input) {
          ok
          message
        }
      }
    `;

    const data = await graphqlClient.mutation(mutation, { 
      input: { targetId, targetType } 
    });

    return {
      success: data.like.ok,
      message: data.like.message
    };
  } catch (error) {
    console.error('Error toggling like:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Unlike (explicit unlike mutation)
 * @param {Object} input - { targetId, targetType }
 */
export const unlikeGraphQL = async (targetId, targetType) => {
  try {
    const mutation = `
      mutation Unlike($input: LikeInput!) {
        unlike(input: $input) {
          ok
          message
        }
      }
    `;

    const data = await graphqlClient.mutation(mutation, { 
      input: { targetId, targetType } 
    });

    return {
      success: data.unlike.ok,
      message: data.unlike.message
    };
  } catch (error) {
    console.error('Error unliking:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create Comment (GraphQL Mutation)
 * @param {Object} input - Comment data
 */
export const createCommentGraphQL = async (input) => {
  try {
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

    const data = await graphqlClient.mutation(mutation, { input });

    return {
      success: data.createComment.ok,
      data: data.createComment,
      message: data.createComment.message
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Edit Comment (GraphQL Mutation)
 * @param {Object} input - Edit data with commentId
 */
export const editCommentGraphQL = async (input) => {
  try {
    const mutation = `
      mutation EditComment($input: EditCommentInput!) {
        editComment(input: $input) {
          ok
          id
          message
          updatedAt
        }
      }
    `;

    const data = await graphqlClient.mutation(mutation, { input });

    return {
      success: data.editComment.ok,
      data: data.editComment,
      message: data.editComment.message
    };
  } catch (error) {
    console.error('Error editing comment:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete Comment (GraphQL Mutation)
 * @param {string} commentId - Comment ID
 */
export const deleteCommentGraphQL = async (commentId) => {
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

    return {
      success: data.deleteComment.ok,
      message: data.deleteComment.message
    };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Register for Event
 * @param {string} eventId - Event ID
 */
export const registerEventGraphQL = async (eventId) => {
  try {
    const mutation = `
      mutation RegisterEvent($eventId: ID!) {
        registerEvent(eventId: $eventId) {
          ok
          id
          message
          createdAt
        }
      }
    `;

    const data = await graphqlClient.mutation(mutation, { eventId });

    return {
      success: data.registerEvent.ok,
      data: data.registerEvent,
      message: data.registerEvent.message
    };
  } catch (error) {
    console.error('Error registering for event:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Unregister from Event
 * @param {string} eventId - Event ID
 */
export const unregisterEventGraphQL = async (eventId) => {
  try {
    const mutation = `
      mutation UnregisterEvent($eventId: ID!) {
        unregisterEvent(eventId: $eventId) {
          ok
          message
        }
      }
    `;

    const data = await graphqlClient.mutation(mutation, { eventId });

    return {
      success: data.unregisterEvent.ok,
      message: data.unregisterEvent.message
    };
  } catch (error) {
    console.error('Error unregistering from event:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
