
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, UserProfile } from '../types';
import { api } from '../server/mockServer';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{
    isAuthenticated: boolean;
    user: UserProfile | null;
    loading: boolean;
    error: string | null;
  }>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // Check for existing user session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const user = localStorage.getItem('instagram_user');
      const token = localStorage.getItem('instagram_token');

      if (user && token) {
        setState({
          isAuthenticated: true,
          user: JSON.parse(user),
          loading: false,
          error: null,
        });
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState({ ...state, loading: true, error: null });

    try {
      const { user, token } = await api.login(email, password);

      localStorage.setItem('instagram_user', JSON.stringify(user));
      localStorage.setItem('instagram_token', token);

      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: (error as Error).message,
      });
    }
  };

  const register = async (username: string, email: string, fullName: string, password: string) => {
    setState({ ...state, loading: true, error: null });

    try {
      const { user, token } = await api.register(username, email, fullName, password);

      localStorage.setItem('instagram_user', JSON.stringify(user));
      localStorage.setItem('instagram_token', token);

      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: (error as Error).message,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('instagram_user');
    localStorage.removeItem('instagram_token');

    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  const clearError = () => {
    setState({ ...state, error: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
