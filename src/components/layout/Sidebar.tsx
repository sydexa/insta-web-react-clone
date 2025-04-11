
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex flex-col w-60 h-screen border-r border-instagram-border fixed left-0 top-0 bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-10">Instagram</h1>
        <nav className="space-y-3">
          <Link
            to="/"
            className={`flex items-center p-3 rounded-md transition-colors ${
              isActive('/') ? 'font-bold' : 'hover:bg-gray-100'
            }`}
          >
            <Home className={`mr-3 ${isActive('/') ? 'fill-black' : ''}`} size={24} />
            <span>Home</span>
          </Link>
          <Link
            to="/search"
            className={`flex items-center p-3 rounded-md transition-colors ${
              isActive('/search') ? 'font-bold' : 'hover:bg-gray-100'
            }`}
          >
            <Search className="mr-3" size={24} />
            <span>Search</span>
          </Link>
          <Link
            to="/create"
            className={`flex items-center p-3 rounded-md transition-colors ${
              isActive('/create') ? 'font-bold' : 'hover:bg-gray-100'
            }`}
          >
            <PlusSquare className="mr-3" size={24} />
            <span>Create</span>
          </Link>
          <Link
            to={`/profile/${user?.username}`}
            className={`flex items-center p-3 rounded-md transition-colors ${
              isActive(`/profile/${user?.username}`) ? 'font-bold' : 'hover:bg-gray-100'
            }`}
          >
            <User className="mr-3" size={24} />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-6">
        <button
          onClick={logout}
          className="flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors w-full"
        >
          <LogOut className="mr-3" size={24} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
