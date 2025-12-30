import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, MessageCircle, Send, Edit2, Trash2, MoreVertical,
  Calendar, MapPin, Users, UserPlus, X, User, Clock
} from 'lucide-react';
import { getEventWithPosts, createPostGraphQL, toggleLikeGraphQL, createCommentGraphQL, 
  editPostGraphQL, deletePostGraphQL, registerEventGraphQL, unregisterEventGraphQL, 
  getPostComments } from '../../services/eventPostsService';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/formatDate';

export default function EventPostsBankDash() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [event, setEvent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postPageInfo, setPostPageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postForm, setPostForm] = useState({ content: '' });
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  // Fetch event and initial posts
  useEffect(() => {
    if (eventId) fetchEventData();
  }, [eventId]);

  const fetchEventData = async (page = 0) => {
    try {
      setLoading(true);
      const response = await getEventWithPosts(eventId, page, 10, 3);
      
      if (response.success) {
        const eventData = response.data;
        
        setEvent({
          id: eventData.eventId,
          name: eventData.eventName,
          description: eventData.eventDescription,
          location: eventData.eventLocation,
          createdAt: eventData.createdAt,
          memberCount: eventData.memberCount,
          postCount: eventData.postCount,
          likeCount: eventData.likeCount,
          creatorId: eventData.creatorInfo?.userId,
          creatorName: eventData.creatorInfo?.username || 'Unknown'
        });

        if (eventData.listPosts) {
          setPostPageInfo(eventData.listPosts.pageInfo);
          
          const mappedPosts = eventData.listPosts.content.map(post => ({
            id: post.postId,
            eventId: post.eventId,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            creatorId: post.creatorInfo?.userId,
            creatorName: post.creatorInfo?.username || 'Anonymous',
            creatorAvatar: post.creatorInfo?.avatarId,
            isLiked: false,
            comments: post.listComment?.content?.map(c => ({
              id: c.commentId,
              postId: c.postId,
              content: c.content,
              createdAt: c.createdAt,
              likeCount: c.likeCount,
              creatorId: c.creatorInfo?.userId,
              creatorName: c.creatorInfo?.username || 'Anonymous',
              creatorAvatar: c.creatorInfo?.avatarId
            })) || [],
            commentPageInfo: post.listComment?.pageInfo
          }));

          setPosts(mappedPosts);
        }
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postForm.content.trim()) return;

    try {
      const result = await createPostGraphQL({
        eventId: parseInt(eventId),
        content: postForm.content
      });

      if (result.success) {
        const newPost = {
          id: result.data.postId,
          eventId: result.data.eventId,
          content: result.data.content,
          createdAt: result.data.createdAt,
          likeCount: 0,
          commentCount: 0,
          creatorId: user.userId,
          creatorName: user.username,
          isLiked: false,
          comments: []
        };

        setPosts([newPost, ...posts]);
        setPostForm({ content: '' });
        setShowCreatePostModal(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleEditPost = async () => {
    if (!postForm.content.trim()) return;

    try {
      const result = await editPostGraphQL({
        postId: editingPost.id,
        content: postForm.content
      });

      if (result.success) {
        setPosts(posts.map(p => 
          p.id === editingPost.id 
            ? { ...p, content: postForm.content, updatedAt: new Date().toISOString() }
            : p
        ));
        setShowEditPostModal(false);
        setEditingPost(null);
        setPostForm({ content: '' });
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    try {
      const result = await deletePostGraphQL(postId);
      if (result.success) {
        setPosts(posts.filter(p => p.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikePost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Optimistic update
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, isLiked: !p.isLiked, likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1 }
        : p
    ));

    try {
      const result = await toggleLikeGraphQL(postId, 'POST');
      if (!result.success) {
        // Revert on failure
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, isLiked: post.isLiked, likeCount: post.likeCount }
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, isLiked: post.isLiked, likeCount: post.likeCount }
          : p
      ));
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    try {
      const result = await createCommentGraphQL({
        postId: parseInt(postId),
        content: commentText
      });

      if (result.success) {
        const newComment = {
          id: result.data.commentId,
          postId: result.data.postId,
          content: result.data.content,
          createdAt: result.data.createdAt,
          likeCount: 0,
          creatorId: user.userId,
          creatorName: user.username
        };

        setPosts(posts.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                comments: [...p.comments, newComment],
                commentCount: p.commentCount + 1
              }
            : p
        ));

        setCommentInputs({ ...commentInputs, [postId]: '' });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLoadMoreComments = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post || !post.commentPageInfo?.hasNext) return;

    setLoadingComments({ ...loadingComments, [postId]: true });

    try {
      const nextPage = post.commentPageInfo.page + 1;
      const result = await getPostComments(postId, nextPage, 5);

      if (result.success && result.data.content) {
        const newComments = result.data.content.map(c => ({
          id: c.commentId,
          postId: c.postId,
          content: c.content,
          createdAt: c.createdAt,
          likeCount: c.likeCount,
          creatorId: c.creatorInfo?.userId,
          creatorName: c.creatorInfo?.username || 'Anonymous'
        }));

        setPosts(posts.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                comments: [...p.comments, ...newComments],
                commentPageInfo: result.data.pageInfo
              }
            : p
        ));
      }
    } catch (error) {
      console.error('Error loading more comments:', error);
    } finally {
      setLoadingComments({ ...loadingComments, [postId]: false });
    }
  };

  const handleLoadMorePosts = async () => {
    if (!postPageInfo?.hasNext) return;

    setLoadingMore(true);
    try {
      const nextPage = postPageInfo.page + 1;
      const response = await getEventWithPosts(eventId, nextPage, 10, 3);

      if (response.success && response.data.listPosts) {
        const newPosts = response.data.listPosts.content.map(post => ({
          id: post.postId,
          eventId: post.eventId,
          content: post.content,
          createdAt: post.createdAt,
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          creatorId: post.creatorInfo?.userId,
          creatorName: post.creatorInfo?.username || 'Anonymous',
          isLiked: false,
          comments: post.listComment?.content?.map(c => ({
            id: c.commentId,
            content: c.content,
            createdAt: c.createdAt,
            creatorName: c.creatorInfo?.username || 'Anonymous'
          })) || [],
          commentPageInfo: post.listComment?.pageInfo
        }));

        setPosts([...posts, ...newPosts]);
        setPostPageInfo(response.data.listPosts.pageInfo);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRegisterEvent = async () => {
    try {
      const result = await registerEventGraphQL(eventId);
      if (result.success) {
        setIsRegistered(true);
        setEvent({ ...event, memberCount: event.memberCount + 1 });
      }
    } catch (error) {
      console.error('Error registering event:', error);
    }
  };

  const handleUnregisterEvent = async () => {
    try {
      const result = await unregisterEventGraphQL(eventId);
      if (result.success) {
        setIsRegistered(false);
        setEvent({ ...event, memberCount: event.memberCount - 1 });
      }
    } catch (error) {
      console.error('Error unregistering event:', error);
    }
  };

  const isOwner = user && event && event.creatorId === user.userId;
  const isManager = user && user.role === 'EVENT_MANAGER';
  const isAdmin = user && user.role === 'ADMIN';

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#343C6A]">Không tìm thấy sự kiện</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ===== BLOCK 1: EVENT HERO CARD ===== */}
        <div className="bg-white rounded-[25px] shadow-sm p-8">
          {/* Header with Badge */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#343C6A] mb-2">{event.name}</h1>
              <p className="text-[#718EBF] leading-relaxed">{event.description}</p>
            </div>
            <span className="px-4 py-2 bg-[#16DBCC]/10 text-[#16DBCC] rounded-full font-semibold text-sm">
              Đang mở
            </span>
          </div>

          {/* Meta Info Grid (2x2) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <MetaItem 
              icon={Calendar} 
              label="Ngày tạo" 
              value={formatDate(event.createdAt)} 
            />
            <MetaItem 
              icon={MapPin} 
              label="Địa điểm" 
              value={event.location || 'Chưa cập nhật'} 
            />
            <MetaItem 
              icon={User} 
              label="Người tổ chức" 
              value={event.creatorName} 
            />
            <MetaItem 
              icon={Users} 
              label="Tham gia" 
              value={`${event.memberCount || 0} người`} 
            />
          </div>

          {/* Action Bar - Role-based */}
          <div className="flex gap-3 pt-6 border-t border-gray-100">
            {user?.role === 'USER' && !isRegistered && (
              <button 
                onClick={handleRegisterEvent}
                className="flex-1 bg-[#2D60FF] text-white rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <UserPlus size={20} />
                <span>Đăng ký tham gia</span>
              </button>
            )}

            {user?.role === 'USER' && isRegistered && (
              <button 
                onClick={handleUnregisterEvent}
                className="flex-1 border-2 border-[#FE5C73] text-[#FE5C73] rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-[#FE5C73]/5 hover:-translate-y-0.5 transition-all"
              >
                <X size={20} />
                <span>Hủy đăng ký</span>
              </button>
            )}

            {isOwner && isManager && (
              <>
                <button 
                  className="flex-1 border-2 border-[#2D60FF] text-[#2D60FF] rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-[#2D60FF]/5 hover:-translate-y-0.5 transition-all"
                >
                  <Edit2 size={20} />
                  <span>Chỉnh sửa sự kiện</span>
                </button>
                <button 
                  className="flex-1 bg-[#2D60FF] text-white rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <Users size={20} />
                  <span>Quản lý tình nguyện viên</span>
                </button>
              </>
            )}

            {isAdmin && (
              <button 
                className="bg-[#FE5C73] text-white rounded-2xl px-6 py-3 font-semibold flex items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Trash2 size={20} />
                <span>Xóa sự kiện</span>
              </button>
            )}
          </div>
        </div>

        {/* ===== BLOCK 2: CREATE POST WIDGET ===== */}
        <div className="bg-white rounded-[25px] shadow-sm p-6">
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2D60FF] to-[#0A06F4] flex items-center justify-center text-white font-semibold text-lg">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            {/* Input (pill shape) */}
            <input
              type="text"
              placeholder="Chia sẻ suy nghĩ của bạn về sự kiện này..."
              onClick={() => setShowCreatePostModal(true)}
              readOnly
              className="flex-1 px-6 py-4 bg-[#F5F7FA] text-[#343C6A] placeholder-[#B1B1B1] rounded-[30px] cursor-pointer hover:bg-gray-100 transition-all focus:outline-none"
            />
          </div>
        </div>

        {/* ===== BLOCK 3: DISCUSSION FEED ===== */}
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard 
                key={post.id}
                post={post}
                currentUser={user}
                onLike={handleLikePost}
                onDelete={handleDeletePost}
                onEdit={(post) => {
                  setEditingPost(post);
                  setPostForm({ content: post.content });
                  setShowEditPostModal(true);
                }}
                commentInput={commentInputs[post.id] || ''}
                onCommentChange={(value) => setCommentInputs({ ...commentInputs, [post.id]: value })}
                onCommentSubmit={() => handleAddComment(post.id)}
                isExpanded={expandedComments[post.id]}
                onToggleComments={() => setExpandedComments({ 
                  ...expandedComments, 
                  [post.id]: !expandedComments[post.id] 
                })}
                onLoadMoreComments={() => handleLoadMoreComments(post.id)}
                loadingMoreComments={loadingComments[post.id]}
              />
            ))}

            {/* Load More Posts */}
            {postPageInfo?.hasNext && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMorePosts}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-white text-[#2D60FF] border-2 border-[#2D60FF] rounded-2xl font-semibold hover:bg-[#2D60FF]/5 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {loadingMore ? 'Đang tải...' : 'Xem thêm bài viết'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <Modal
          title="Tạo bài viết mới"
          onClose={() => {
            setShowCreatePostModal(false);
            setPostForm({ content: '' });
          }}
          onSubmit={handleCreatePost}
          submitText="Đăng bài"
        >
          <textarea
            value={postForm.content}
            onChange={(e) => setPostForm({ content: e.target.value })}
            placeholder="Bạn đang nghĩ gì?"
            className="w-full px-6 py-4 bg-[#F5F7FA] text-[#343C6A] placeholder-[#B1B1B1] rounded-2xl border-0 focus:ring-2 focus:ring-[#2D60FF] resize-none"
            rows="5"
          />
        </Modal>
      )}

      {/* Edit Post Modal */}
      {showEditPostModal && (
        <Modal
          title="Chỉnh sửa bài viết"
          onClose={() => {
            setShowEditPostModal(false);
            setEditingPost(null);
            setPostForm({ content: '' });
          }}
          onSubmit={handleEditPost}
          submitText="Cập nhật"
        >
          <textarea
            value={postForm.content}
            onChange={(e) => setPostForm({ content: e.target.value })}
            className="w-full px-6 py-4 bg-[#F5F7FA] text-[#343C6A] rounded-2xl border-0 focus:ring-2 focus:ring-[#2D60FF] resize-none"
            rows="5"
          />
        </Modal>
      )}
    </div>
  );
}

// ===== HELPER COMPONENTS =====

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#2D60FF]/10 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-[#2D60FF]" />
      </div>
      <div>
        <p className="text-xs text-[#718EBF]">{label}</p>
        <p className="text-sm font-semibold text-[#343C6A]">{value}</p>
      </div>
    </div>
  );
}

function PostCard({ 
  post, currentUser, onLike, onDelete, onEdit,
  commentInput, onCommentChange, onCommentSubmit,
  isExpanded, onToggleComments, onLoadMoreComments, loadingMoreComments
}) {
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = currentUser && post.creatorId === currentUser.userId;
  const isAdmin = currentUser && currentUser.role === 'ADMIN';

  return (
    <div className="bg-white rounded-[25px] shadow-sm p-6 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#16DBCC] to-[#2D60FF] flex items-center justify-center text-white font-semibold text-lg">
            {post.creatorName?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-bold text-[#343C6A]">{post.creatorName}</p>
            <p className="text-sm text-[#718EBF] flex items-center gap-1">
              <Clock size={14} />
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        
        {/* Three-dot Menu */}
        {(isOwner || isAdmin) && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <MoreVertical size={20} className="text-[#718EBF]" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-10">
                {isOwner && (
                  <button
                    onClick={() => {
                      onEdit(post);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-[#343C6A] hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
                {(isOwner || isAdmin) && (
                  <button
                    onClick={() => {
                      onDelete(post.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-[#FE5C73] hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    <span>Xóa</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-[#718EBF] mb-4 leading-relaxed">{post.content}</p>

      {/* Interaction Bar */}
      <div className="flex items-center gap-6 py-4 border-t border-gray-100">
        <button 
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 font-semibold transition-all ${
            post.isLiked 
              ? 'text-[#FE5C73]' 
              : 'text-[#718EBF] hover:text-[#FE5C73]'
          }`}
        >
          <Heart 
            size={22} 
            fill={post.isLiked ? 'currentColor' : 'none'}
            className={post.isLiked ? 'animate-bounce' : ''}
          />
          <span>{post.likeCount || 0}</span>
        </button>

        <button 
          onClick={onToggleComments}
          className="flex items-center gap-2 text-[#718EBF] hover:text-[#2D60FF] font-semibold transition-all"
        >
          <MessageCircle size={22} />
          <span>{post.commentCount || 0} bình luận</span>
        </button>
      </div>

      {/* Comments Section (Accordion) */}
      {isExpanded && (
        <div className="mt-4 p-4 bg-[#F9FAFB] rounded-2xl space-y-3">
          {/* Comments List */}
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF82AC] to-[#2D60FF] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {comment.creatorName?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-[#343C6A]">{comment.creatorName}</span>
                      <span className="text-xs text-[#718EBF]">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-[#718EBF] mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}

              {/* Load More Comments */}
              {post.commentPageInfo?.hasNext && (
                <button
                  onClick={onLoadMoreComments}
                  disabled={loadingMoreComments}
                  className="text-sm text-[#2D60FF] font-semibold hover:underline disabled:opacity-50"
                >
                  {loadingMoreComments ? 'Đang tải...' : 'Xem thêm bình luận'}
                </button>
              )}
            </div>
          )}

          {/* Add Comment Input */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2D60FF] to-[#0A06F4] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => onCommentChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onCommentSubmit()}
                placeholder="Viết bình luận..."
                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-[#343C6A] placeholder-[#B1B1B1] focus:outline-none focus:ring-2 focus:ring-[#2D60FF]"
              />
              <button
                onClick={onCommentSubmit}
                disabled={!commentInput?.trim()}
                className="p-2 bg-[#2D60FF] text-white rounded-full hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ title, children, onClose, onSubmit, submitText }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[25px] shadow-lg max-w-2xl w-full p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#343C6A]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={24} className="text-[#718EBF]" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-[#718EBF] rounded-2xl font-semibold hover:bg-gray-50 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-3 bg-[#2D60FF] text-white rounded-2xl font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-[25px] shadow-sm p-12 text-center">
      {/* Icon Circle */}
      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#2D60FF]/10 to-[#16DBCC]/10 rounded-full flex items-center justify-center">
        <MessageCircle size={64} className="text-[#2D60FF]" />
      </div>
      
      {/* Heading */}
      <h3 className="text-2xl font-bold text-[#343C6A] mb-2">
        Chưa có bài viết nào
      </h3>
      
      {/* Subtext */}
      <p className="text-[#718EBF] mb-6">
        Hãy là người đầu tiên chia sẻ điều gì đó!
      </p>
      
      {/* CTA Badge */}
      <div className="inline-block px-6 py-3 bg-[#2D60FF]/10 text-[#2D60FF] rounded-full font-semibold">
        Bắt đầu cuộc trò chuyện 💬
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        {/* Event Card Skeleton */}
        <div className="bg-white rounded-[25px] shadow-sm p-8">
          <div className="h-8 bg-gray-200 rounded-2xl w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-2xl w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-2xl w-2/3 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>

        {/* Create Post Skeleton */}
        <div className="bg-white rounded-[25px] shadow-sm p-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 h-12 bg-gray-200 rounded-[30px]"></div>
          </div>
        </div>

        {/* Post Skeletons */}
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-[25px] shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
