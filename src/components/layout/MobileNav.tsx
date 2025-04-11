
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-instagram-border bg-white z-10">
      <nav className="flex justify-around items-center h-14">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center p-2 ${
            isActive('/') ? 'text-black' : 'text-gray-500'
          }`}
        >
          <Home size={24} className={isActive('/') ? 'fill-black' : ''} />
        </Link>
        <Link
          to="/search"
          className={`flex flex-col items-center justify-center p-2 ${
            isActive('/search') ? 'text-black' : 'text-gray-500'
          }`}
        >
          <Search size={24} />
        </Link>
        <Link
          to="/create"
          className={`flex flex-col items-center justify-center p-2 ${
            isActive('/create') ? 'text-black' : 'text-gray-500'
          }`}
        >
          <PlusSquare size={24} />
        </Link>
        <Link
          to={`/profile/${user?.username}`}
          className={`flex flex-col items-center justify-center p-2 ${
            isActive(`/profile/${user?.username}`) ? 'text-black' : 'text-gray-500'
          }`}
        >
          <User size={24} />
        </Link>
      </nav>
    </div>
  );
};

export default MobileNav;
