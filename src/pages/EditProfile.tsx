/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { ArrowLeft, Camera, User, FileText, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usersAPI } from "@/lib/api";
import { updateUser } from "@/store/slices/authSlice";
import UserAvatar from "@/components/UserAvatar";

const { TextArea } = Input;
const { Title, Text } = Typography;

const avatarOptions = [0, 1, 2, 3, 4, 5, 6, 7];

const emojiOptions = ['😎', '🎵', '🎧', '🎤', '🎸', '🎹', '🎷', '🥁', '✨', '🌟', '🔥', '💜'];

const isEmoji = (s: string) => {
  try {
    return /[\p{Emoji}]/u.test(s);
  } catch (e) {
    return /[\u{1F300}-\u{1F6FF}]/u.test(s);
  }
};

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((s) => s.auth.user);

  const [loading, setLoading] = useState(false);
  const [avatarType, setAvatarType] = useState<'preset' | 'emoji'>(
    currentUser?.avatarUrl?.startsWith('emoji:') ? 'emoji' : 'preset'
  );
  const [selectedPreset, setSelectedPreset] = useState(
    currentUser?.avatarUrl?.startsWith('avatar:') 
      ? parseInt(currentUser.avatarUrl.split(':')[1], 10) 
      : 0
  );
  const [selectedEmoji, setSelectedEmoji] = useState(
    currentUser?.avatarUrl?.startsWith('emoji:') 
      ? currentUser.avatarUrl.split(':')[1] 
      : '😎'
  );
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  const currentAvatarUrl = avatarType === 'emoji' 
    ? `emoji:${selectedEmoji}` 
    : `avatar:${selectedPreset}`;

  const onSubmit = async () => {
    if (!currentUser) return;
    
    const payload: any = {};
    if (username.trim()) payload.username = username.trim();
    payload.bio = bio;

    if (avatarType === "emoji" && selectedEmoji) {
      if (!isEmoji(selectedEmoji)) return message.error("Please pick a valid emoji");
      payload.avatarUrl = `emoji:${selectedEmoji}`;
    } else {
      payload.avatarUrl = `avatar:${selectedPreset}`;
    }

    try {
      setLoading(true);
      const res = await usersAPI.updateUser(currentUser.id, payload);
      const updatedUser = res.data.user;
      dispatch(updateUser(updatedUser));
      message.success("Profile updated!");
      navigate(`/user/${updatedUser.username}`);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong">
        <div className="flex items-center justify-between px-4 h-16 max-w-2xl mx-auto">
          <Button 
            type="text" 
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-5 h-5" />}
            className="!w-10 !h-10 !rounded-xl"
          />
          <Title level={5} className="!mb-0">Edit Profile</Title>
          <Button 
            type="primary"
            onClick={onSubmit}
            loading={loading}
            icon={!loading && <Check className="w-4 h-4" />}
            className="!h-10 !rounded-xl btn-gradient !border-0"
          >
            Save
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Avatar Section */}
        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-50" />
              <UserAvatar avatarUrl={currentAvatarUrl} size={100} className="relative avatar-ring" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-background">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
            <Text type="secondary" className="text-sm">Tap below to change your avatar</Text>
          </div>

          {/* Avatar Type Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              type={avatarType === 'preset' ? 'primary' : 'default'}
              onClick={() => setAvatarType('preset')}
              className={`!h-10 !rounded-xl ${avatarType === 'preset' ? 'btn-gradient !border-0' : '!bg-secondary !border-0'}`}
            >
              Avatars
            </Button>
            <Button
              type={avatarType === 'emoji' ? 'primary' : 'default'}
              onClick={() => setAvatarType('emoji')}
              className={`!h-10 !rounded-xl ${avatarType === 'emoji' ? 'btn-gradient !border-0' : '!bg-secondary !border-0'}`}
            >
              Emojis
            </Button>
          </div>

          {/* Avatar Options */}
          {avatarType === 'preset' ? (
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPreset(idx)}
                  className={`relative p-2 rounded-2xl transition-all duration-200 ${
                    selectedPreset === idx 
                      ? 'bg-primary/20 ring-2 ring-primary' 
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  <UserAvatar avatarUrl={`avatar:${idx}`} size={48} className="mx-auto" />
                  {selectedPreset === idx && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-3">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`relative p-3 rounded-2xl text-2xl transition-all duration-200 ${
                    selectedEmoji === emoji 
                      ? 'bg-primary/20 ring-2 ring-primary' 
                      : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {emoji}
                  {selectedEmoji === emoji && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="glass rounded-3xl p-6">
          <Form layout="vertical">
            <Form.Item 
              label={
                <span className="flex items-center gap-2 text-foreground">
                  <User className="w-4 h-4" />
                  Username
                </span>
              }
            >
              <Input
                size="large"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="!bg-secondary/50 !border-border/30 !rounded-xl"
              />
            </Form.Item>

            <Form.Item 
              label={
                <span className="flex items-center gap-2 text-foreground">
                  <FileText className="w-4 h-4" />
                  Bio
                </span>
              }
            >
              <TextArea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself and your music taste..."
                maxLength={150}
                showCount
                className="!bg-secondary/50 !border-border/30 !rounded-xl"
              />
            </Form.Item>
          </Form>
        </div>

        {/* Cancel Button */}
        <div className="mt-6">
          <Button 
            block
            onClick={() => navigate(-1)}
            className="!h-12 !rounded-xl !bg-secondary hover:!bg-secondary/70 !border-0"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;