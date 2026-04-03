import { useState, useEffect, useRef, useCallback } from "react";
import { Timer, Gauge, Repeat, Repeat1, Shuffle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/hooks/useHaptic";

export type RepeatMode = "off" | "all" | "one";

interface PlayerControlsProps {
  onSleepTimerEnd: () => void;
  onRepeatModeChange: (mode: RepeatMode) => void;
  onShuffleChange: (enabled: boolean) => void;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
}

const SLEEP_OPTIONS = [
  { label: "5m", minutes: 5 },
  { label: "10m", minutes: 10 },
  { label: "15m", minutes: 15 },
  { label: "30m", minutes: 30 },
  { label: "45m", minutes: 45 },
  { label: "1h", minutes: 60 },
];

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const PlayerControls = ({
  onSleepTimerEnd,
  onRepeatModeChange,
  onShuffleChange,
  repeatMode,
  shuffleEnabled,
}: PlayerControlsProps) => {
  const [sleepMinutes, setSleepMinutes] = useState<number | null>(null);
  const [sleepRemaining, setSleepRemaining] = useState<number>(0); // seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [expandedPanel, setExpandedPanel] = useState<"sleep" | "speed" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sleep timer countdown
  useEffect(() => {
    if (sleepMinutes === null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setSleepRemaining(sleepMinutes * 60);
    timerRef.current = setInterval(() => {
      setSleepRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setSleepMinutes(null);
          onSleepTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sleepMinutes, onSleepTimerEnd]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    triggerHaptic("selection");
    // Apply to all iframes via postMessage (YouTube)
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      try {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "setPlaybackRate", args: [speed] }),
          "*"
        );
      } catch {}
    });
  }, []);

  const handleSleepSet = (minutes: number) => {
    setSleepMinutes(minutes);
    setExpandedPanel(null);
    triggerHaptic("success");
  };

  const cancelSleep = () => {
    setSleepMinutes(null);
    setSleepRemaining(0);
    triggerHaptic("light");
  };

  const cycleRepeat = () => {
    const modes: RepeatMode[] = ["off", "all", "one"];
    const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    onRepeatModeChange(next);
    triggerHaptic("selection");
  };

  const toggleShuffle = () => {
    onShuffleChange(!shuffleEnabled);
    triggerHaptic("selection");
  };

  return (
    <div className="border-t border-border/30 bg-card/50 shrink-0">
      {/* Expanded Panels */}
      {expandedPanel === "sleep" && (
        <div className="px-3 py-3 border-b border-border/20 bg-muted/30 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">Sleep Timer</p>
            <button onClick={() => setExpandedPanel(null)} className="p-1 rounded-full hover:bg-muted">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {SLEEP_OPTIONS.map((opt) => (
              <button
                key={opt.minutes}
                onClick={() => handleSleepSet(opt.minutes)}
                className={cn(
                  "py-2 rounded-lg text-xs font-medium transition-all",
                  sleepMinutes === opt.minutes
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {expandedPanel === "speed" && (
        <div className="px-3 py-3 border-b border-border/20 bg-muted/30 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">Playback Speed</p>
            <button onClick={() => setExpandedPanel(null)} className="p-1 rounded-full hover:bg-muted">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {SPEED_OPTIONS.map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={cn(
                  "py-2 rounded-lg text-xs font-medium transition-all",
                  playbackSpeed === speed
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                )}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex items-center justify-around px-2 py-2">
        {/* Shuffle */}
        <button
          onClick={toggleShuffle}
          className={cn(
            "flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all active:scale-95",
            shuffleEnabled ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Shuffle className="w-4 h-4" />
          <span className="text-[9px] font-medium">Shuffle</span>
        </button>

        {/* Repeat */}
        <button
          onClick={cycleRepeat}
          className={cn(
            "flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all active:scale-95",
            repeatMode !== "off" ? "text-primary" : "text-muted-foreground"
          )}
        >
          {repeatMode === "one" ? (
            <Repeat1 className="w-4 h-4" />
          ) : (
            <Repeat className="w-4 h-4" />
          )}
          <span className="text-[9px] font-medium">
            {repeatMode === "off" ? "Repeat" : repeatMode === "all" ? "All" : "One"}
          </span>
        </button>

        {/* Speed */}
        <button
          onClick={() => setExpandedPanel(expandedPanel === "speed" ? null : "speed")}
          className={cn(
            "flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all active:scale-95",
            playbackSpeed !== 1 ? "text-primary" : "text-muted-foreground",
            expandedPanel === "speed" && "bg-muted"
          )}
        >
          <Gauge className="w-4 h-4" />
          <span className="text-[9px] font-medium">
            {playbackSpeed !== 1 ? `${playbackSpeed}x` : "Speed"}
          </span>
        </button>

        {/* Sleep Timer */}
        <button
          onClick={() => {
            if (sleepMinutes !== null) {
              cancelSleep();
            } else {
              setExpandedPanel(expandedPanel === "sleep" ? null : "sleep");
            }
          }}
          className={cn(
            "flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all active:scale-95",
            sleepMinutes !== null ? "text-primary" : "text-muted-foreground",
            expandedPanel === "sleep" && "bg-muted"
          )}
        >
          <Timer className="w-4 h-4" />
          <span className="text-[9px] font-medium">
            {sleepMinutes !== null ? formatTime(sleepRemaining) : "Sleep"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PlayerControls;
