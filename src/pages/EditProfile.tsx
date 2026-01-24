import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography, Upload } from "antd";
import { ArrowLeft, Check, Upload as UploadIcon, Camera } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usersAPI } from "@/lib/api";
import { updateUser } from "@/store/slices/authSlice";
import UserAvatar from "@/components/UserAvatar";

const { TextArea } = Input;
const { Title, Text } = Typography;

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((s) => s.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    currentUser?.avatarUrl?.startsWith('https://res.cloudinary.com/') ? currentUser.avatarUrl : ''
  );
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [socialLinks, setSocialLinks] = useState({
    instagram: currentUser?.socialLinks?.instagram || '',
    twitter: currentUser?.socialLinks?.twitter || '',
    youtube: currentUser?.socialLinks?.youtube || '',
    spotify: currentUser?.socialLinks?.spotify || '',
    website: currentUser?.socialLinks?.website || ''
  });

  const currentAvatarUrl = uploadedImageUrl;

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const res = await usersAPI.uploadProfilePicture(file);
      setUploadedImageUrl(res.data.imageUrl);
      dispatch(updateUser(res.data.user));
      message.success('Profile picture uploaded successfully!');
    } catch (err: any) {
      message.error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async () => {
    if (!currentUser) return;
    const payload: any = { bio, socialLinks };
    if (username.trim()) payload.username = username.trim();
    
    if (uploadedImageUrl) {
      payload.avatarUrl = uploadedImageUrl;
    }

    try {
      setLoading(true);
      const res = await usersAPI.updateUser(currentUser.id, payload);
      dispatch(updateUser(res.data.user));
      message.success("Profile updated!");
      navigate(`/user/${res.data.user.username}`);
    } catch (err: any) {
      message.error(err.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-4 h-12 max-w-lg mx-auto">
          <Button type="text" size="small" onClick={() => navigate(-1)} icon={<ArrowLeft className="w-4 h-4" />} className="!w-8 !h-8" />
          <Title level={5} className="!mb-0 !text-sm">Edit Profile</Title>
          <Button type="text" size="small" onClick={onSubmit} loading={loading} icon={!loading && <Check className="w-4 h-4" />} className="!w-8 !h-8 !text-primary" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <UserAvatar avatarUrl={currentAvatarUrl} size={80} className="mb-3 ring-2 ring-primary/20 ring-offset-2 ring-offset-background" />
          <div className="flex flex-col items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="hidden"
            />
            <Button
              type="dashed"
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
              icon={<Camera className="w-4 h-4" />}
              className="!rounded-lg !h-10"
            >
              {uploading ? 'Uploading...' : uploadedImageUrl ? 'Change Image' : 'Upload Image'}
            </Button>
            {uploadedImageUrl && (
              <Text className="text-xs text-muted-foreground text-center">
                Image uploaded successfully
              </Text>
            )}
          </div>
        </div>

        {/* Form */}
        <Form layout="vertical">
          <Form.Item label={<Text className="text-xs">Username</Text>}>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" className="!rounded-[8px]" />
          </Form.Item>
          <Form.Item label={<Text className="text-xs">Bio</Text>}>
            <TextArea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="About you..." maxLength={150} showCount className="!rounded-[8px]" />
          </Form.Item>

          {/* Social Links */}
          <div className="space-y-3">
            <Text className="text-xs font-medium">Social Links</Text>
            
            <Form.Item label={<Text className="text-xs">Instagram</Text>}>
              <Input 
                value={socialLinks.instagram} 
                onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))} 
                placeholder="https://instagram.com/username" 
                className="!rounded-[8px]" 
              />
            </Form.Item>

            <Form.Item label={<Text className="text-xs">Twitter</Text>}>
              <Input 
                value={socialLinks.twitter} 
                onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))} 
                placeholder="https://twitter.com/username" 
                className="!rounded-[8px]" 
              />
            </Form.Item>

            <Form.Item label={<Text className="text-xs">YouTube</Text>}>
              <Input 
                value={socialLinks.youtube} 
                onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))} 
                placeholder="https://youtube.com/channel/..." 
                className="!rounded-[8px]" 
              />
            </Form.Item>

            <Form.Item label={<Text className="text-xs">Spotify</Text>}>
              <Input 
                value={socialLinks.spotify} 
                onChange={(e) => setSocialLinks(prev => ({ ...prev, spotify: e.target.value }))} 
                placeholder="https://open.spotify.com/artist/..." 
                className="!rounded-[8px]" 
              />
            </Form.Item>

            <Form.Item label={<Text className="text-xs">Website</Text>}>
              <Input 
                value={socialLinks.website} 
                onChange={(e) => setSocialLinks(prev => ({ ...prev, website: e.target.value }))} 
                placeholder="https://yourwebsite.com" 
                className="!rounded-[8px]" 
              />
            </Form.Item>
          </div>
        </Form>

        <Button block size="small" onClick={() => navigate(-1)} className="!rounded-[8px] !h-8 mt-4">Cancel</Button>
      </div>
    </div>
  );
};

export default EditProfile;