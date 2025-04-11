import { User, Post, Comment } from '../types';

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com'; // Using Vite's env variable syntax

// Mock database
let users: User[] = [
  {
    id: '1',
    username: 'johndoe',
    fullname: 'John Doe',
    email: 'john@example.com',
    profile_picture: 'https://i.pravatar.cc/150?img=1',
    bio: 'Photographer | Traveler | Food Lover',
    password: 'password123', // In a real app, this would be hashed
    follower_count: 2,
    following_count: 1
  },
  {
    id: '2',
    username: 'janedoe',
    fullname: 'Jane Doe',
    email: 'jane@example.com',
    profile_picture: 'https://i.pravatar.cc/150?img=5',
    bio: 'Digital Nomad | Adventure Seeker',
    password: 'password123',
    follower_count: 1,
    following_count: 2
  },
  {
    id: '3',
    username: 'alex_smith',
    fullname: 'Alex Smith',
    email: 'alex@example.com',
    profile_picture: 'https://i.pravatar.cc/150?img=8',
    bio: 'Web Developer | Coffee Enthusiast',
    password: 'password123',
    follower_count: 1,
    following_count: 1
  },
];

let posts: Post[] = [
  {
    id: '1',
    user_id: '1',
    image: 'https://picsum.photos/id/237/600/600',
    caption: 'My awesome dog! 🐕 #dogsofinstagram',
    like_count: 2,
    comments: ['1', '2'],
    created_at: 1680667200000, // timestamp for 2023-04-05
  },
  {
    id: '2',
    user_id: '1',
    image: 'https://picsum.photos/id/25/600/600',
    caption: 'Beautiful sunset at the beach 🌅 #sunset #beach',
    like_count: 1,
    comments: ['3'],
    created_at: 1681099200000, // timestamp for 2023-04-10
  },
  {
    id: '3',
    user_id: '2',
    image: 'https://picsum.photos/id/102/600/600',
    caption: 'Morning hike with amazing views 🏔️ #hiking #nature',
    like_count: 2,
    comments: ['4'],
    created_at: 1681531200000, // timestamp for 2023-04-15
  },
  {
    id: '4',
    user_id: '3',
    image: 'https://picsum.photos/id/1005/600/600',
    caption: 'Working on a new project! #coding #webdev',
    like_count: 1,
    comments: [],
    created_at: 1681790400000, // timestamp for 2023-04-18
  },
  {
    id: '5',
    user_id: '3',
    image: 'https://picsum.photos/id/1006/600/600',
    caption: 'Coffee time ☕ #coffee #worklife',
    like_count: 1,
    comments: ['5'],
    created_at: 1681963200000, // timestamp for 2023-04-20
  },
];

let comments: Comment[] = [
  {
    id: '1',
    post_id: '1',
    user_id: '2',
    content: 'So cute! 😍',
    created_at: 1714983000000, // timestamp
  },
  {
    id: '2',
    post_id: '1',
    user_id: '3',
    content: 'What breed is he?',
    created_at: 1714986600000, // timestamp
  },
  {
    id: '3',
    post_id: '2',
    user_id: '2',
    content: 'Gorgeous view!',
    created_at: 1715023700000, // timestamp
  },
  {
    id: '4',
    post_id: '3',
    user_id: '1',
    content: 'Looks amazing! Where is this?',
    created_at: 1715677200000, // timestamp
  },
  {
    id: '5',
    post_id: '5',
    user_id: '2',
    content: 'Nothing better than a good cup of coffee!',
    created_at: 1715850600000, // timestamp
  },
];

// Mock relationships between users (who follows whom)
let followRelationships: { follower_id: string; following_id: string }[] = [
  { follower_id: '1', following_id: '2' },
  { follower_id: '2', following_id: '1' },
  { follower_id: '2', following_id: '3' },
  { follower_id: '3', following_id: '1' },
];

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch wrapper with fallback to mock data
const fetchWithFallback = async<T>(url: string, options: RequestInit, fallbackFn: () => Promise<T>): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.warn(`API call failed, using mock data: ${error}`);
    return fallbackFn();
  }
};

// Mock API functions
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const fallbackFn = async () => {
      await delay(500);
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid credentials');
      
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token: 'mock-jwt-token' };
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
      fallbackFn
    );
  },
  
  register: async (username: string, email: string, fullname: string, password: string) => {
    const fallbackFn = async () => {
      await delay(500);
      
      if (users.some(u => u.username === username)) {
        throw new Error('Username already taken');
      }
      
      if (users.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      const newUser: User = {
        id: String(users.length + 1),
        username,
        email,
        fullname,
        profile_picture: `https://i.pravatar.cc/150?img=${users.length + 10}`,
        bio: '',
        password,
        follower_count: 0,
        following_count: 0
      };
      
      users.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      return { user: userWithoutPassword, token: 'mock-jwt-token' };
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/auth/register`,
      {
        method: 'POST',
        body: JSON.stringify({ username, email, fullname, password }),
      },
      fallbackFn
    );
  },
  
  // Users
  getUser: async (username: string) => {
    const fallbackFn = async () => {
      await delay(300);
      const user = users.find(u => u.username === username);
      if (!user) throw new Error('User not found');
      
      const { password: _, ...userWithoutPassword } = user;
      
      // Check if the current user is following this user
      const currentUserStr = localStorage.getItem('instagram_user');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        const isFollowing = followRelationships.some(
          rel => rel.follower_id === currentUser.id && rel.following_id === user.id
        );
        return {
          ...userWithoutPassword,
          is_following: isFollowing
        };
      }
      
      return userWithoutPassword;
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/users/${username}`,
      { method: 'GET' },
      fallbackFn
    );
  },
  
  updateUserProfile: async (userId: string, profileData: Partial<Omit<User, 'id' | 'password' | 'follower_count' | 'following_count'>>) => {
    const fallbackFn = async () => {
      await delay(500);
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) throw new Error('User not found');
      
      // Check if username is being changed and is already taken by another user
      if (profileData.username && 
          profileData.username !== users[userIndex].username && 
          users.some(u => u.username === profileData.username && u.id !== userId)) {
        throw new Error('Username already taken');
      }
      
      // Check if email is being changed and is already taken by another user
      if (profileData.email && 
          profileData.email !== users[userIndex].email && 
          users.some(u => u.email === profileData.email && u.id !== userId)) {
        throw new Error('Email already registered');
      }
      
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        ...profileData
      };
      
      // Update user data in localStorage if this is the current user
      const storedUser = localStorage.getItem('instagram_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id === userId) {
          const { password: _, ...updatedUser } = users[userIndex];
          localStorage.setItem('instagram_user', JSON.stringify(updatedUser));
        }
      }
      
      const { password: _, ...userWithoutPassword } = users[userIndex];
      return userWithoutPassword;
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/users/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(profileData),
      },
      fallbackFn
    );
  },
  
  searchUsers: async (query: string) => {
    const fallbackFn = async () => {
      await delay(300);
      const results = users.filter(
        u => u.username.includes(query) || u.fullname.includes(query)
      );
      return results.map(({ password: _, ...user }) => user);
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`,
      { method: 'GET' },
      fallbackFn
    );
  },
  
  followUser: async (currentUserId: string, targetUserId: string) => {
    const fallbackFn = async () => {
      await delay(300);
      const currentUserIndex = users.findIndex(u => u.id === currentUserId);
      const targetUserIndex = users.findIndex(u => u.id === targetUserId);
      
      if (currentUserIndex === -1 || targetUserIndex === -1) throw new Error('User not found');
      
      // Check if already following
      const alreadyFollowing = followRelationships.some(
        rel => rel.follower_id === currentUserId && rel.following_id === targetUserId
      );
      
      if (!alreadyFollowing) {
        // Add follow relationship
        followRelationships.push({
          follower_id: currentUserId,
          following_id: targetUserId
        });
        
        // Update following count for current user
        users[currentUserIndex].following_count += 1;
        
        // Update follower count for target user
        users[targetUserIndex].follower_count += 1;
      }
      
      return { success: true };
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/users/${currentUserId}/follow/${targetUserId}`,
      { method: 'POST' },
      fallbackFn
    );
  },
  
  unfollowUser: async (currentUserId: string, targetUserId: string) => {
    const fallbackFn = async () => {
      await delay(300);
      const currentUserIndex = users.findIndex(u => u.id === currentUserId);
      const targetUserIndex = users.findIndex(u => u.id === targetUserId);
      
      if (currentUserIndex === -1 || targetUserIndex === -1) throw new Error('User not found');
      
      // Find and remove follow relationship
      const relationshipIndex = followRelationships.findIndex(
        rel => rel.follower_id === currentUserId && rel.following_id === targetUserId
      );
      
      if (relationshipIndex !== -1) {
        // Remove relationship
        followRelationships.splice(relationshipIndex, 1);
        
        // Update following count for current user
        users[currentUserIndex].following_count = Math.max(0, users[currentUserIndex].following_count - 1);
        
        // Update follower count for target user
        users[targetUserIndex].follower_count = Math.max(0, users[targetUserIndex].follower_count - 1);
      }
      
      return { success: true };
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/users/${currentUserId}/unfollow/${targetUserId}`,
      { method: 'POST' },
      fallbackFn
    );
  },
  
  // Posts
  getPosts: async () => {
    const fallbackFn = async () => {
      await delay(500);
      // Get current user from localStorage to check likes
      const currentUserStr = localStorage.getItem('instagram_user');
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      
      // Return posts in reverse chronological order
      return posts
        .slice()
        .sort((a, b) => b.created_at - a.created_at) // Sort by timestamp
        .map(post => {
          // Find the post's user
          const postUser = users.find(u => u.id === post.user_id);
          
          if (postUser) {
            // Check if current user is following this post's author
            const is_following = currentUser ? 
              followRelationships.some(
                rel => rel.follower_id === currentUser.id && rel.following_id === postUser.id
              ) : false;
              
            // Get user data without password
            const { password: _, ...userWithoutPassword } = postUser;
            
            return {
              ...post,
              user: {
                ...userWithoutPassword,
                is_following
              },
              comments: comments
                .filter(c => c.post_id === post.id)
                .map(comment => {
                  const commentUser = users.find(u => u.id === comment.user_id);
                  const { password: __, ...commentUserWithoutPassword } = commentUser || users[0];
                  return {
                    ...comment,
                    user: commentUserWithoutPassword
                  };
                }),
            };
          }
          
          return post;
        });
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/posts`,
      { method: 'GET' },
      fallbackFn
    );
  },
  
  getUserPosts: async (userId: string) => {
    const fallbackFn = async () => {
      await delay(300);
      return posts
        .filter(p => p.user_id === userId)
        .sort((a, b) => b.created_at - a.created_at); // Sort by timestamp
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/users/${userId}/posts`,
      { method: 'GET' },
      fallbackFn
    );
  },
  
  createPost: async (userId: string, image: string, caption: string) => {
    const fallbackFn = async () => {
      await delay(500);
      const newPost: Post = {
        id: String(posts.length + 1),
        user_id: userId,
        image,
        caption,
        like_count: 0,
        comments: [],
        created_at: Date.now(), // Use timestamp
      };
      
      posts.push(newPost);
      return newPost;
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/posts`,
      {
        method: 'POST',
        body: JSON.stringify({ userId, image, caption }),
      },
      fallbackFn
    );
  },
  
  likePost: async (userId: string, postId: string) => {
    const fallbackFn = async () => {
      await delay(200);
      const post = posts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      post.like_count = (post.like_count || 0) + 1;
      post.liked_by_current_user = true;
      
      return { success: true };
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/posts/${postId}/like`,
      {
        method: 'POST',
        body: JSON.stringify({ userId }),
      },
      fallbackFn
    );
  },
  
  unlikePost: async (userId: string, postId: string) => {
    const fallbackFn = async () => {
      await delay(200);
      const post = posts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      post.like_count = Math.max(0, (post.like_count || 0) - 1);
      post.liked_by_current_user = false;
      
      return { success: true };
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/posts/${postId}/unlike`,
      {
        method: 'POST',
        body: JSON.stringify({ userId }),
      },
      fallbackFn
    );
  },
  
  // Comments
  addComment: async (userId: string, postId: string, content: string) => {
    const fallbackFn = async () => {
      await delay(300);
      const post = posts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      const newComment: Comment = {
        id: String(comments.length + 1),
        post_id: postId,
        user_id: userId,
        content,
        created_at: Date.now(), // Use timestamp
      };
      
      comments.push(newComment);
      post.comments.push(newComment.id);
      
      return {
        ...newComment,
        user: users.find(u => u.id === userId),
      };
    };
    
    return fetchWithFallback(
      `${API_BASE_URL}/posts/${postId}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ userId, content }),
      },
      fallbackFn
    );
  },
};
