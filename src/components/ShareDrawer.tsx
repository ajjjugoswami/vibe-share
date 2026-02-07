import { Drawer, Typography, App } from "antd";
import { X } from "lucide-react";
import { useState } from "react";

const { Text } = Typography;

interface ShareDrawerProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  shareTitle: string;
  shareText?: string;
}

const ShareDrawer = ({
  open,
  onClose,
  shareUrl,
  shareTitle,
  shareText,
}: ShareDrawerProps) => {
  const { message } = App.useApp();
  const [linkCopied, setLinkCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    message.success("Link copied!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareOnPlatform = (platform: string) => {
    const text = shareText || shareTitle;
    let url = "";
    
    switch (platform) {
      case "whatsapp":
        // Try to open WhatsApp app first, fallback to web
        url = `whatsapp://send?text=${encodeURIComponent(text + " " + shareUrl)}`;
        window.location.href = url;
        setTimeout(() => {
          window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`, "_blank");
        }, 500);
        return;
      case "instagram":
        // Instagram doesn't support direct web sharing - copy link
        copyLink();
        message.info("Link copied! Paste it in Instagram");
        return;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook": {
        // Try Facebook app first
        const fbUrl = `fb://facewebmodal/f?href=${encodeURIComponent(shareUrl)}`;
        window.location.href = fbUrl;
        setTimeout(() => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
        }, 500);
        return;
      }
      case "email":
        url = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(text + "\n\n" + shareUrl)}`;
        window.location.href = url;
        return;
      case "reddit":
        url = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case "pinterest":
        url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(text)}`;
        break;
      case "messenger":
        url = `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`;
        window.location.href = url;
        setTimeout(() => {
          window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=`, "_blank");
        }, 500);
        return;
      case "embed":
        copyLink();
        message.info("Embed link copied!");
        return;
    }
    
    if (url) window.open(url, "_blank");
  };

  const shareOptions = [
    { id: "embed", name: "Embed", icon: "📋", bgColor: "bg-gray-600" },
    { id: "whatsapp", name: "WhatsApp", icon: "💬", bgColor: "bg-[#25D366]" },
    { id: "twitter", name: "X", icon: "𝕏", bgColor: "bg-black" },
    { id: "facebook", name: "Facebook", icon: "f", bgColor: "bg-[#1877F2]" },
    { id: "email", name: "Email", icon: "✉️", bgColor: "bg-gray-500" },
    { id: "reddit", name: "Reddit", icon: "🤖", bgColor: "bg-[#FF4500]" },
    { id: "linkedin", name: "LinkedIn", icon: "in", bgColor: "bg-[#0A66C2]" },
    { id: "telegram", name: "Telegram", icon: "✈️", bgColor: "bg-[#0088cc]" },
    { id: "messenger", name: "Messenger", icon: "💬", bgColor: "bg-[#0084FF]" },
    { id: "pinterest", name: "Pinterest", icon: "P", bgColor: "bg-[#E60023]" },
  ];

  return (
    <Drawer
      title={null}
      placement="bottom"
      onClose={onClose}
      open={open}
      height="auto"
      className="share-drawer rounded-t-3xl z-50"
      closeIcon={null}
      styles={{
        body: { padding: "0", background: "#1a1a1a" },
      }}
    >
      <div className="bg-[#1a1a1a] rounded-t-3xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-base font-medium text-white">Share</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Share Options - Horizontal Scroll */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => shareOnPlatform(option.id)}
                className="flex flex-col items-center gap-2 min-w-[70px] active:scale-95 transition-transform"
              >
                <div className={`w-14 h-14 ${option.bgColor} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                  {option.icon}
                </div>
                <span className="text-xs text-white/80 text-center whitespace-nowrap">
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-3 py-2 border border-white/10">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-white/60 outline-none"
            />
            <button
              onClick={copyLink}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                linkCopied
                  ? "bg-green-500/20 text-green-400"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {linkCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default ShareDrawer;
