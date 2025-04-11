
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
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
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-instagram-border"></div>
            <span className="px-3 text-instagram-darkGray text-sm font-semibold">OR</span>
            <div className="flex-grow border-t border-instagram-border"></div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-instagram-darkGray">
              Don't have an account? <Link to="/signup" className="text-instagram-blue font-semibold">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-instagram-darkGray mt-4">
        <p>This is a demo app. Use the following credentials:</p>
        <p className="font-medium">Email: john@example.com</p>
        <p className="font-medium">Password: password123</p>
      </div>
    </div>
  );
};

export default Login;
