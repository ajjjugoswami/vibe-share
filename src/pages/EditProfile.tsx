/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { ArrowLeft, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usersAPI } from "@/lib/api";
import { updateUser } from "@/store/slices/authSlice";
import UserAvatar from "@/components/UserAvatar";

const { TextArea } = Input;
const { Title, Text } = Typography;

const avatarOptions = [0, 1, 2, 3, 4, 5, 6, 7];
const emojiOptions = ['😎', '🎵', '🎧', '🎤', '🎸', '🎹', '🔥', '✨'];

const isEmoji = (s: string) => {
  try { return /[\p{Emoji}]/u.test(s); } catch { return false; }
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
    currentUser?.avatarUrl?.startsWith('avatar:') ? parseInt(currentUser.avatarUrl.split(':')[1], 10) : 0
  );
  const [selectedEmoji, setSelectedEmoji] = useState(
    currentUser?.avatarUrl?.startsWith('emoji:') ? currentUser.avatarUrl.split(':')[1] : '😎'
  );
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  const currentAvatarUrl = avatarType === 'emoji' ? `emoji:${selectedEmoji}` : `avatar:${selectedPreset}`;

  const onSubmit = async () => {
    if (!currentUser) return;
    const payload: any = { bio };
    if (username.trim()) payload.username = username.trim();
    payload.avatarUrl = avatarType === "emoji" && selectedEmoji && isEmoji(selectedEmoji) 
      ? `emoji:${selectedEmoji}` 
      : `avatar:${selectedPreset}`;

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
          <div className="flex gap-2 mb-4">
            <Button size="small" type={avatarType === 'preset' ? 'primary' : 'default'} onClick={() => setAvatarType('preset')} className="!rounded-lg !h-7 !text-xs">Avatars</Button>
            <Button size="small" type={avatarType === 'emoji' ? 'primary' : 'default'} onClick={() => setAvatarType('emoji')} className="!rounded-lg !h-7 !text-xs">Emojis</Button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {avatarType === 'preset' ? (
              avatarOptions.map((idx) => (
                <button key={idx} onClick={() => setSelectedPreset(idx)} className={`p-1.5 rounded-xl transition-all ${selectedPreset === idx ? 'ring-2 ring-primary bg-primary/10' : 'bg-secondary'}`}>
                  <UserAvatar avatarUrl={`avatar:${idx}`} size={36} />
                </button>
              ))
            ) : (
              emojiOptions.map((emoji) => (
                <button key={emoji} onClick={() => setSelectedEmoji(emoji)} className={`w-11 h-11 rounded-xl text-xl transition-all ${selectedEmoji === emoji ? 'ring-2 ring-primary bg-primary/10' : 'bg-secondary'}`}>
                  {emoji}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Form */}
        <Form layout="vertical">
          <Form.Item label={<Text className="text-xs">Username</Text>}>
            <Input size="small" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" className="!rounded-lg" />
          </Form.Item>
          <Form.Item label={<Text className="text-xs">Bio</Text>}>
            <TextArea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="About you..." maxLength={150} showCount className="!rounded-lg" />
          </Form.Item>
        </Form>

        <Button block size="small" onClick={() => navigate(-1)} className="!rounded-lg !h-8 mt-4">Cancel</Button>
      </div>
    </div>
  );
};

export default EditProfile;