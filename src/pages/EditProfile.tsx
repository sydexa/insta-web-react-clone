
import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';
import { api } from '../server/mockServer';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, UserRound, Upload } from 'lucide-react';
import { fileToDataUrl, validateImageFile } from '../utils/imageUtils';

type ProfileFormValues = {
  username: string;
  fullname: string;
  bio: string;
  email: string;
  profile_picture: string;
};

const EditProfile: React.FC = () => {
  const { user: currentUser, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      username: '',
      fullname: '',
      bio: '',
      email: '',
      profile_picture: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      // Populate form with current user data
      form.reset({
        username: currentUser.username,
        fullname: currentUser.fullname,
        bio: currentUser.bio,
        email: currentUser.email,
        profile_picture: currentUser.profile_picture,
      });
      setUserProfile(currentUser);
    }
  }, [currentUser, form]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setIsUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      form.setValue('profile_picture', dataUrl);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload photo');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      const updatedProfile = await api.updateUserProfile(currentUser.id, data);
      setUserProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-instagram-blue"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Card className="border-instagram-border">
        <CardHeader>
          <CardTitle className="text-xl font-normal">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src={form.watch('profile_picture')} alt={currentUser.username} />
                <AvatarFallback>
                  <UserRound className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <button 
                type="button"
                className="absolute -right-1 -bottom-1 bg-instagram-blue text-white p-1 rounded-full"
                onClick={triggerFileInput}
                disabled={isUploading}
              >
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h2 className="font-medium">{currentUser.username}</h2>
              <Button 
                variant="link" 
                className="p-0 h-auto text-instagram-blue"
                onClick={triggerFileInput}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-1" />
                {isUploading ? 'Uploading...' : 'Change Profile Photo'}
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="resize-none" 
                        placeholder="Write a short bio..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-instagram-blue hover:bg-instagram-blue/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;
