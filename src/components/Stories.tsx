const stories = [
  { username: "Your story", gradient: "from-muted to-muted", isYou: true },
  { username: "luna.wav", gradient: "from-neon-purple to-neon-pink", hasNew: true },
  { username: "beatdrop", gradient: "from-neon-cyan to-neon-purple", hasNew: true },
  { username: "vibes.fm", gradient: "from-neon-pink to-orange-500", hasNew: true },
  { username: "chill.hub", gradient: "from-neon-green to-neon-cyan", hasNew: false },
  { username: "indie.kid", gradient: "from-yellow-500 to-neon-pink", hasNew: true },
];

const Stories = () => {
  return (
    <div className="flex gap-4 px-4 py-4 overflow-x-auto scrollbar-hide border-b border-border">
      {stories.map((story, index) => (
        <button key={index} className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className={`w-16 h-16 rounded-full p-[2px] ${
            story.hasNew || story.isYou
              ? `bg-gradient-to-br ${story.gradient}`
              : "bg-muted"
          }`}>
            <div className="w-full h-full rounded-full bg-card p-[2px]">
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${story.gradient} opacity-50`} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground truncate w-16 text-center">
            {story.username}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Stories;
