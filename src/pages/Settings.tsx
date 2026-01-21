/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, message, Modal, Typography } from "antd";
import { useAppSelector } from "@/store/hooks";



const { Title, Text } = Typography;

const Settings = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((s) => s.auth.user);

  const handleChangePassword = () => {
    message.info("Change password coming soon!");
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: "Delete account",
      content: "This action is irreversible. Account deletion is not implemented yet.",
      okType: "danger",
      onOk: async () => {
        message.info("Account deletion coming soon!");
      },
    });
  };

  if (!currentUser) return null;

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <div className="card-elevated p-6 max-w-2xl">
        <Title level={4}>Account</Title>

        <div className="mb-4">
          <Text type="secondary">Email</Text>
          <div className="mt-1">{currentUser?.email || "—"}</div>
        </div>

        <div className="mb-6">
          <Button onClick={handleChangePassword}>Change Password</Button>
        </div>

        <Title level={5} className="!mt-6">Danger Zone</Title>
        <Button danger onClick={handleDeleteAccount}>
          Delete account
        </Button>
      </div>
    </div>
  );
};

export default Settings;
