
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !fullName || !username || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      await register(username, email, fullName, password);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  if (error) {
    toast.error(error);
    clearError();
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white p-8 border border-instagram-border rounded mb-4">
          <h1 className="text-4xl font-bold text-center mb-8">Instagram</h1>
          
          <div className="text-center mb-6">
            <h2 className="text-instagram-darkGray font-semibold text-lg">Sign up to see photos and videos from your friends.</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-instagram-border rounded-sm px-2 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-instagram-border rounded-sm px-2 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full border border-instagram-border rounded-sm px-2 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-instagram-border rounded-sm px-2 py-2 text-sm focus:outline-none focus:border-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-instagram-blue text-white py-2 rounded font-medium ${
                loading ? 'opacity-70' : 'hover:bg-blue-500'
              }`}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-instagram-darkGray">
              By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 border border-instagram-border rounded text-center">
          <p className="text-sm">
            Have an account? <Link to="/login" className="text-instagram-blue font-semibold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
