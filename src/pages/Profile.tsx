import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Grid } from 'lucide-react';
import { UserProfile, Post } from '../types';
import { api } from '../server/mockServer';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      setLoading(true);
      try {
        const profileData = await api.getUser(username);
        setUser(profileData);
        
        const userPosts = await api.getUserPosts(profileData.id);
        setPosts(userPosts);
      } catch (error) {
        toast.error('Failed to load profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, currentUser]);

  const handleFollow = async () => {
    if (!user || !currentUser) return;
    
    setFollowLoading(true);
    try {
      if (user.is_following) {
        await api.unfollowUser(currentUser.id, user.id);
        setUser({
          ...user,
          is_following: false,
          follower_count: Math.max(0, user.follower_count - 1)
        });
      } else {
        await api.followUser(currentUser.id, user.id);
        setUser({
          ...user,
          is_following: true,
          follower_count: user.follower_count + 1
        });
      }
    } catch (error) {
      toast.error('Failed to follow/unfollow user');
      console.error(error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-instagram-blue"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">User not found</h2>
        <p className="text-instagram-darkGray">
          The user you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const isCurrentUserProfile = currentUser?.id === user?.id;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start mb-10 p-4">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 mb-4 md:mb-0 md:mr-10">
          <img 
            src={user?.profile_picture} 
            alt={user?.username} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center mb-4">
            <h1 className="text-xl md:text-2xl font-light mr-4">{user?.username}</h1>
            
            {isCurrentUserProfile ? (
              <button 
                className="bg-instagram-lightGray text-black font-semibold px-4 py-1.5 rounded text-sm flex items-center"
                onClick={() => navigate('/edit-profile')}
              >
                <Settings size={16} className="mr-2" /> Edit Profile
              </button>
            ) : (
              <button 
                className={`px-6 py-1.5 rounded text-sm font-semibold ${
                  user?.is_following
                    ? 'bg-instagram-lightGray text-black' 
                    : 'bg-instagram-blue text-white'
                }`}
                onClick={handleFollow}
                disabled={followLoading}
              >
                {user?.is_following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
          
          <div className="flex space-x-6 mb-4 text-sm">
            <div><span className="font-semibold">{posts.length}</span> posts</div>
            <div><span className="font-semibold">{user?.follower_count}</span> followers</div>
            <div><span className="font-semibold">{user?.following_count}</span> following</div>
          </div>
          
          <div className="text-sm">
            <div className="font-semibold">{user?.fullname}</div>
            <p className="whitespace-pre-line">{user?.bio}</p>
          </div>
        </div>
      </div>
      
      {/* Profile Tabs */}
      <div className="border-t border-instagram-border">
        <div className="flex justify-center">
          <button className="flex items-center py-3 px-4 border-t border-black text-sm font-semibold">
            <Grid size={12} className="mr-2" /> POSTS
          </button>
        </div>
      </div>
      
      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-6">
        {posts.map(post => (
          <div key={post.id} className="aspect-square relative">
            <img 
              src={post.image} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No Posts Yet</h2>
          <p className="text-instagram-darkGray">
            {isCurrentUserProfile 
              ? "When you share photos, they'll appear on your profile."
              : "This user hasn't posted any photos yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
