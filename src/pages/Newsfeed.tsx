
import React, { useEffect, useState } from 'react';
import Post from '../components/posts/Post';
import { PostWithDetails } from '../types';
import { api } from '../server/mockServer';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Newsfeed: React.FC = () => {
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts and ensure they conform to PostWithDetails type
        const fetchedPosts = await api.getPosts();
        setPosts(fetchedPosts as PostWithDetails[]);
      } catch (error) {
        toast.error('Failed to load posts');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleAddComment = async (postId: string, content: string) => {
    if (!user) return;

    try {
      const newComment = await api.addComment(user.id, postId, content);
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));
    } catch (error) {
      toast.error('Failed to add comment');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-instagram-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {posts.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
          <p className="text-instagram-darkGray">
            Follow users or create posts to see content here.
          </p>
        </div>
      ) : (
        posts.map(post => (
          <Post 
            key={post.id} 
            post={post} 
            onComment={handleAddComment}
          />
        ))
      )}
    </div>
  );
};

export default Newsfeed;
