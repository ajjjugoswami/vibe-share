/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Row, Col, Radio, message } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usersAPI } from "@/lib/api";
import { updateUser } from "@/store/slices/authSlice";
import UserAvatar from "@/components/UserAvatar";

const { TextArea } = Input;

const avatarOptions = [0, 1, 2, 3, 4, 5, 6, 7];

const isEmoji = (s: string) => {
  try {
    return /[\p{Emoji}]/u.test(s);
  } catch (e) {
    // Fallback: basic unicode range
    return /[\u{1F300}-\u{1F6FF}]/u.test(s);
  }
};

const Settings = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((s) => s.auth.user);

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    if (!currentUser) return;
    const payload: any = {};
    if (values.username) payload.username = values.username.trim();
    if (values.bio !== undefined) payload.bio = values.bio;

    if (values.avatarType === "emoji" && values.emoji) {
      if (!isEmoji(values.emoji)) return message.error("Please pick a valid emoji");
      payload.avatarUrl = `emoji:${values.emoji}`;
    }

    if (values.avatarType === "preset" && values.preset !== undefined) {
      payload.avatarUrl = `avatar:${values.preset}`;
    }

    try {
      setLoading(true);
      const res = await usersAPI.updateUser(currentUser.id, payload);
      const updatedUser = res.data.user;
      dispatch(updateUser(updatedUser));
      message.success("Settings saved");
      navigate(`/user/${updatedUser.username}`);
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  const initialAvatar = currentUser.avatarUrl || "";
  const initialValues = {
    username: currentUser.username,
    bio: currentUser.bio || "",
    avatarType: initialAvatar.startsWith("emoji:") ? "emoji" : initialAvatar.startsWith("avatar:") ? "preset" : "preset",
    emoji: initialAvatar.startsWith("emoji:") ? initialAvatar.split(":")[1] : "",
    preset: initialAvatar.startsWith("avatar:") ? parseInt(initialAvatar.split(":")[1], 10) : 0,
  };

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <div className="card-elevated p-6 max-w-2xl">
        <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
          <Form.Item label="Avatar">
            <Row gutter={12} align="middle">
              <Col>
                <Form.Item name="avatarType" noStyle>
                  <Radio.Group>
                    <Radio value="preset">Preset</Radio>
                    <Radio value="emoji">Emoji</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="preset" noStyle>
                  <Radio.Group>
                    {avatarOptions.map((idx) => (
                      <Radio.Button value={idx} key={idx} style={{ marginRight: 8 }}>
                        <UserAvatar avatarUrl={`avatar:${idx}`} size={40} />
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="emoji" label="Emoji (optional)" style={{ marginTop: 12 }}>
              <Input placeholder="e.g. 😎" maxLength={2} style={{ width: 120 }} />
            </Form.Item>

            <div className="mt-4">
              <Form.Item shouldUpdate>
                {({ getFieldValue }) => (
                  <div className="flex items-center gap-4">
                    <div>Preview</div>
                    <UserAvatar
                      avatarUrl={
                        getFieldValue("avatarType") === "emoji"
                          ? `emoji:${getFieldValue("emoji") || "🙂"}`
                          : `avatar:${getFieldValue("preset") || 0}`
                      }
                      size={56}
                    />
                  </div>
                )}
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter a username" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Bio" name="bio">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
