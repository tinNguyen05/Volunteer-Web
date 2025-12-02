const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Event = require('../models/Event');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');
const { createNotification } = require('../services/notificationService');

// Create Post
const createPost = async (req, res) => {
  try {
    const { title, body, image, eventId } = req.body;

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    const post = new Post({
      title,
      body,
      image,
      author: req.user._id,
      event: eventId,
    });

    await post.save();

    // Populate author info
    await post.populate('author', 'name avatar role');

    // Send notification to event manager/creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      await createNotification({
        recipient: event.createdBy,
        sender: req.user._id,
        type: 'post_new',
        title: 'Bài viết mới',
        message: `${req.user.name} đã đăng bài mới trong sự kiện "${event.title}"`,
        relatedEvent: eventId,
        relatedPost: post._id,
      });
    }

    createdResponse(res, 'Post created successfully', { post });
  } catch (error) {
    console.error('Create Post Error:', error);
    errorResponse(res, 500, 'Failed to create post: ' + error.message);
  }
};

// Get Posts by Event
const getPostsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ event: eventId, isActive: true })
      .populate('author', 'name avatar role')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ event: eventId, isActive: true });

    successResponse(res, 'Posts retrieved successfully', {
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve posts: ' + error.message);
  }
};

// Like/Unlike Post
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return errorResponse(res, 404, 'Post not found');
    }

    const userIndex = post.likes.indexOf(req.user._id);
    let action = '';

    if (userIndex > -1) {
      // Unlike
      post.likes.splice(userIndex, 1);
      action = 'unliked';
    } else {
      // Like
      post.likes.push(req.user._id);
      action = 'liked';

      // Send notification to post author
      if (post.author.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: post.author,
          sender: req.user._id,
          type: 'like_new',
          title: 'Lượt thích mới',
          message: `${req.user.name} đã thích bài viết của bạn`,
          relatedPost: post._id,
          relatedEvent: post.event,
        });
      }
    }

    post.likesCount = post.likes.length;
    await post.save();

    successResponse(res, `Post ${action} successfully`, {
      likesCount: post.likesCount,
      liked: action === 'liked',
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to toggle like: ' + error.message);
  }
};

// Add Comment
const addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return errorResponse(res, 404, 'Post not found');
    }

    const comment = new Comment({
      text,
      author: req.user._id,
      post: postId,
    });

    await comment.save();
    await comment.populate('author', 'name avatar role');

    // Update comment count
    post.commentsCount += 1;
    await post.save();

    // Send notification to post author
    if (post.author.toString() !== req.user._id.toString()) {
      await createNotification({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment_new',
        title: 'Bình luận mới',
        message: `${req.user.name} đã bình luận về bài viết của bạn`,
        relatedPost: post._id,
        relatedEvent: post.event,
      });
    }

    createdResponse(res, 'Comment added successfully', { comment });
  } catch (error) {
    console.error('Add Comment Error:', error);
    errorResponse(res, 500, 'Failed to add comment: ' + error.message);
  }
};

// Get Comments by Post
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId, isActive: true })
      .populate('author', 'name avatar role')
      .sort({ createdAt: -1 });

    successResponse(res, 'Comments retrieved successfully', { comments });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve comments: ' + error.message);
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return errorResponse(res, 404, 'Post not found');
    }

    // Check authorization
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: You cannot delete this post');
    }

    post.isActive = false;
    await post.save();

    successResponse(res, 'Post deleted successfully');
  } catch (error) {
    errorResponse(res, 500, 'Failed to delete post: ' + error.message);
  }
};

module.exports = {
  createPost,
  getPostsByEvent,
  toggleLike,
  addComment,
  getCommentsByPost,
  deletePost,
};
