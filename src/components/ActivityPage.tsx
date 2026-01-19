import { Heart, UserPlus, MessageCircle, Music } from "lucide-react";

const activities = [
  {
    type: "like",
    user: "luna.waves",
    avatar: "from-neon-purple to-neon-pink",
    action: "liked your playlist",
    target: "summer vibes",
    time: "2m",
  },
  {
    type: "follow",
    user: "beatdropper",
    avatar: "from-neon-cyan to-neon-purple",
    action: "started following you",
    time: "15m",
  },
  {
    type: "comment",
    user: "chill.hub",
    avatar: "from-neon-green to-neon-cyan",
    action: "commented:",
    target: "this playlist hits different 🔥",
    time: "1h",
  },
  {
    type: "like",
    user: "vibes.fm",
    avatar: "from-neon-pink to-orange-500",
    action: "liked your playlist",
    target: "late night drives",
    time: "2h",
  },
  {
    type: "follow",
    user: "indie.soul",
    avatar: "from-yellow-500 to-neon-pink",
    action: "started following you",
    time: "3h",
  },
  {
    type: "save",
    user: "music.hunter",
    avatar: "from-blue-500 to-neon-cyan",
    action: "saved your playlist",
    target: "lo-fi study session",
    time: "5h",
  },
];

const ActivityPage = () => {
  return (
    <div className="pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-center h-14">
          <h1 className="font-display font-semibold text-lg">Activity</h1>
        </div>
      </header>

      <div className="divide-y divide-border">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${activity.avatar} p-[2px] flex-shrink-0`}>
              <div className="w-full h-full rounded-full bg-card" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
                {activity.target && (
                  <span className="font-medium"> {activity.target}</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
            </div>

            {/* Action Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              activity.type === "like" ? "text-neon-pink" :
              activity.type === "follow" ? "text-neon-cyan" :
              activity.type === "comment" ? "text-neon-purple" :
              "text-foreground"
            }`}>
              {activity.type === "like" && <Heart className="w-5 h-5" fill="currentColor" />}
              {activity.type === "follow" && <UserPlus className="w-5 h-5" />}
              {activity.type === "comment" && <MessageCircle className="w-5 h-5" />}
              {activity.type === "save" && <Music className="w-5 h-5" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;
