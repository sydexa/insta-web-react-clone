
// User Types
export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  profile_picture: string;
  bio: string;
  password: string;
  follower_count: number;
  following_count: number;
  is_following?: boolean;
}

export interface UserProfile extends Omit<User, 'password'> {}

// Post Types
export interface Post {
  id: string;
  user_id: string;
  image: string;
  caption: string;
  like_count?: number;
  liked_by_current_user?: boolean;
  comments: string[];
  created_at: number; // Changed to number timestamp
  user?: UserProfile;
}

// Modified PostWithDetails to not extend Post since the comments property has a different type
export interface PostWithDetails {
  id: string;
  user_id: string;
  image: string;
  caption: string;
  like_count?: number;
  liked_by_current_user?: boolean;
  comments: CommentWithUser[];
  created_at: number; // Changed to number timestamp
  user: UserProfile;
}

// Comment Types - Updated to underscore with timestamp
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: number; // Changed to number timestamp
}

export interface CommentWithUser extends Comment {
  user: UserProfile;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Context Types
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, fullname: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Profile Update Types
export interface ProfileUpdateData {
  username?: string;
  fullname?: string;
  email?: string;
  bio?: string;
  profile_picture?: string;
}
