
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../server/mockServer';
import { toast } from 'sonner';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Search users when debounced query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const users = await api.searchUsers(debouncedQuery);
        setResults(users);
      } catch (error) {
        toast.error('Failed to search users');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [debouncedQuery]);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">Search</h1>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchIcon size={18} className="text-instagram-darkGray" />
        </div>
        <input
          type="text"
          placeholder="Search users"
          className="w-full bg-gray-100 border border-transparent rounded-lg pl-10 py-2 focus:outline-none focus:border-instagram-border"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-instagram-blue"></div>
        </div>
      ) : (
        <div>
          {query && results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-instagram-darkGray">No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map(user => (
                <Link 
                  key={user.id}
                  to={`/profile/${user.username}`}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <img 
                    src={user.profile_picture} 
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover mr-3" 
                  />
                  <div>
                    <div className="font-semibold">{user.username}</div>
                    <div className="text-instagram-darkGray text-sm">{user.fullname}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      
      {!query && (
        <div className="text-center py-10">
          <SearchIcon size={48} className="mx-auto text-instagram-darkGray mb-4" />
          <h2 className="text-xl font-semibold mb-2">Search for users</h2>
          <p className="text-instagram-darkGray">
            Search for users by username or name.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
