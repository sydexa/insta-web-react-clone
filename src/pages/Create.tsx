
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../server/mockServer';
import { toast } from 'sonner';

const Create: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagePreview) {
      toast.error('Please select an image');
      return;
    }
    
    if (!user) {
      toast.error('You must be logged in to create a post');
      return;
    }
    
    setLoading(true);
    try {
      await api.createPost(user.id, imagePreview, caption);
      toast.success('Post created successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {!imagePreview ? (
          <div className="border-2 border-dashed border-instagram-border rounded-md p-6 text-center">
            <label className="block cursor-pointer">
              <ImagePlus size={48} className="mx-auto text-instagram-darkGray mb-4" />
              <span className="block text-lg font-semibold mb-2">Upload a photo</span>
              <span className="block text-sm text-instagram-darkGray mb-4">
                Drag and drop or click to browse
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                type="button"
                className="bg-instagram-blue text-white font-semibold py-2 px-4 rounded"
              >
                Select from computer
              </button>
            </label>
          </div>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1"
            >
              <X size={20} />
            </button>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full rounded-md"
            />
          </div>
        )}
        
        {imagePreview && (
          <div>
            <label htmlFor="caption" className="block font-medium mb-2">
              Caption
            </label>
            <textarea
              id="caption"
              rows={4}
              placeholder="Write a caption..."
              className="w-full border border-instagram-border rounded-md p-3 focus:outline-none focus:border-gray-400"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>
          </div>
        )}
        
        {imagePreview && (
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-instagram-blue text-white py-2 rounded font-medium ${
              loading ? 'opacity-70' : 'hover:bg-blue-500'
            }`}
          >
            {loading ? 'Posting...' : 'Share'}
          </button>
        )}
      </form>
    </div>
  );
};

export default Create;
