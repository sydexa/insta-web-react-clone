import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { PostWithDetails } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../server/mockServer';
import { toast } from 'sonner';

interface PostProps {
  post: PostWithDetails;
  onComment: (postId: string, comment: string) => Promise<void>;
}

const Post: React.FC<PostProps> = ({ post, onComment }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.liked_by_current_user || false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const timeSince = (timestamp: number | string) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      if (liked) {
        await api.unlikePost(user.id, post.id);
        setLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await api.likePost(user.id, post.id);
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      toast.error('Failed to like/unlike post');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onComment(post.id, comment);
      setComment('');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleComments = showAllComments 
    ? post.comments 
    : post.comments.slice(0, 2);

  return (
    <div className="instagram-card">
      {/* Post Header */}
      <div className="flex items-center p-3">
        <Link to={`/profile/${post.user.username}`} className="flex items-center">
          <img 
            src={post.user.profile_picture} 
            alt={post.user.username}
            className="w-8 h-8 rounded-full object-cover mr-3" 
          />
          <span className="font-semibold">{post.user.username}</span>
        </Link>
        <button className="ml-auto text-gray-500">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img 
          src={post.image} 
          alt="Post" 
          className="w-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center mb-3">
          <button 
            className={`mr-4 ${liked ? 'text-instagram-red' : ''}`} 
            onClick={handleLike}
          >
            <Heart size={24} className={liked ? 'fill-instagram-red text-instagram-red animate-like' : ''} />
          </button>
          <button className="mr-4">
            <MessageCircle size={24} />
          </button>
          <button className="mr-4">
            <Send size={24} />
          </button>
          <button className="ml-auto">
            <Bookmark size={24} />
          </button>
        </div>

        {/* Likes count */}
        {likeCount > 0 && (
          <div className="font-semibold mb-2">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</div>
        )}

        {/* Caption */}
        <div className="mb-2">
          <Link to={`/profile/${post.user.username}`} className="font-semibold mr-2">
            {post.user.username}
          </Link>
          <span>{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="mt-1 mb-3">
            {post.comments.length > 2 && !showAllComments && (
              <button 
                className="text-instagram-darkGray text-sm mb-2"
                onClick={() => setShowAllComments(true)}
              >
                View all {post.comments.length} comments
              </button>
            )}
            
            {visibleComments.map((comment) => (
              <div key={comment.id} className="mb-1">
                <Link to={`/profile/${comment.user.username}`} className="font-semibold mr-2">
                  {comment.user.username}
                </Link>
                <span>{comment.content}</span>
              </div>
            ))}
          </div>
        )}

        {/* Post Date */}
        <div className="text-xs text-instagram-darkGray mt-1">
          {timeSince(post.created_at)}
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleComment} className="border-t border-instagram-border p-3 flex">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-grow bg-transparent focus:outline-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button 
          type="submit" 
          className={`font-semibold ${comment.trim() ? 'text-instagram-blue' : 'text-instagram-blue opacity-50'}`}
          disabled={!comment.trim() || isSubmitting}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default Post;
