
import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-60 pb-14 md:pb-0 min-h-screen">
        <div className="max-w-3xl mx-auto py-4 px-4">{children}</div>
      </div>
      <MobileNav />
    </div>
  );
};

export default Layout;
