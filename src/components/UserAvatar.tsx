import React from "react";
import { Avatar } from "antd";

interface Props {
  avatarUrl?: string;
  size?: number | 'small' | 'default' | 'large';
  className?: string;
}

const gradientPresets = [
  "linear-gradient(135deg, #7C3AED, #A78BFA)",
  "linear-gradient(135deg, #6EE7B7, #3B82F6)",
  "linear-gradient(135deg, #F97316, #FB7185)",
  "linear-gradient(135deg, #06B6D4, #7C3AED)",
  "linear-gradient(135deg, #F59E0B, #EF4444)",
  "linear-gradient(135deg, #8B5CF6, #06B6D4)",
  "linear-gradient(135deg, #34D399, #06B6D4)",
  "linear-gradient(135deg, #F472B6, #7C3AED)",
];

export default function UserAvatar({ avatarUrl, size = 40, className }: Props) {
  if (!avatarUrl) {
    return <Avatar size={size} className={`bg-secondary ${className || ""}`} />;
  }

  // Emoji token: emoji:😊
  if (avatarUrl.startsWith("emoji:")) {
    const emoji = avatarUrl.split(":")[1] || "🙂";
    return (
      <div
        style={{
          width: typeof size === "number" ? size : 40,
          height: typeof size === "number" ? size : 40,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
          background: "transparent",
          fontSize: typeof size === "number" ? Math.round(size * 0.6) : 20,
        }}
        className={className}
      >
        <span>{emoji}</span>
      </div>
    );
  }

  // Avatar gradient token: avatar:idx (0..n)
  if (avatarUrl.startsWith("avatar:")) {
    const [, idxOrName] = avatarUrl.split(":");
    let bg = gradientPresets[0];
    const idx = parseInt(idxOrName, 10);
    if (!Number.isNaN(idx) && gradientPresets[idx]) bg = gradientPresets[idx];

    return (
      <div
        style={{
          width: typeof size === "number" ? size : 40,
          height: typeof size === "number" ? size : 40,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
          background: bg,
        }}
        className={className}
      />
    );
  }

  // Otherwise assume URL
  return <Avatar src={avatarUrl} size={size} className={className} />;
}
