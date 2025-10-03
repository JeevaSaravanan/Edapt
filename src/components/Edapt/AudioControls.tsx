import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Headphones, FileText } from "lucide-react";
import { toast } from "sonner";

interface AudioControlsProps {
  content: string;
}

export const AudioControls = ({ content }: AudioControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Derivative intuition transcript
  const derivativeTranscript = [
    "[0:00 - 0:10] You're driving down the highway, and your speedometer reads 60 miles per hour. But here's a puzzling question: what does that number actually mean right now, at this exact instant?",
    "[0:11 - 0:20] Speed is distance divided by time. But at a single frozen moment, no time has passed and no distance has been covered. So how can you have a speed? This paradox stumped mathematicians for two thousand years.",
    "[0:21 - 0:30] Newton and Leibniz had a brilliant insight in the 1600s: you can't measure an instant directly, but you can get infinitely close to it.",
    "[0:31 - 0:50] Imagine calculating your average speed over one minute. Then over one second. Then over one millisecond. As you shrink the time interval closer and closer to zero, your average speed approaches a specific number. That number—the one you're approaching but never quite calculating with actual zero time—is your instantaneous speed. That's a derivative.",
    "[0:51 - 1:05] Here's another way to see it. Draw a curve on paper. Pick a point on it, then pick another point nearby. Connect them with a straight line. That line's slope tells you the average rate of change between those points.",
    "[1:06 - 1:20] Now slide the second point closer... closer... infinitely close. The line rotates until it just barely kisses the curve at a single point—it becomes a tangent line. The slope of that tangent line is the derivative.",
    "[1:21 - 1:30] A derivative measures how fast something is changing at a precise moment. It's the instantaneous rate of change.",
    "[1:31 - 1:50] Position changing over time? The derivative is velocity. Velocity changing? The derivative is acceleration. A hillside's height changing? The derivative is the steepness. Temperature changing? The derivative tells you how fast it's rising or falling.",
    "[1:51 - 2:05] For the simple function f of x equals x squared, the derivative is f prime of x equals 2x. At any point, the curve's steepness is exactly twice the x-value. At x equals zero, it's flat. At x equals 2, it's rising with a slope of 4.",
    "[2:06 - 2:25] Before derivatives, we could only understand average behavior. With derivatives, we can analyze change with perfect precision at every single point. This unlocked modern physics, engineering, economics, and nearly every field that deals with change and motion.",
    "[2:26 - 2:40] The derivative is our mathematical way of capturing something profound: the rate of change in an ever-changing world. It lets us freeze a moment and ask, what's happening right now? That simple question, and its answer, changed everything."
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const prog = (audio.currentTime / audio.duration) * 100;
      setProgress(prog);
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      toast.success("Narration completed");
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (transcript.length === 0) {
        setTranscript(derivativeTranscript);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [transcript.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      toast.info("Narration paused");
    } else {
      audio.play();
      toast.success("Playing narration");
    }
  };

  const handleReset = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.pause();
    audio.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);
    toast.info("Narration reset");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Unmuted" : "Muted");
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Headphones className="w-5 h-5 text-accent" />
          Audio Narration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Derivative Explanation - Intuitive Approach
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src="/media/audio/narration/derivative_intuition_narration.mp3"
          preload="metadata"
        />

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Playback Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={handlePlayPause} 
            variant={isPlaying ? "secondary" : "default"}
            className="flex-1"
            size="lg"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset} 
            disabled={progress === 0}
            size="lg"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={toggleMute}
            size="lg"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Volume</label>
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
              disabled={isMuted}
            />
            <span className="text-sm text-muted-foreground w-10">{volume[0]}%</span>
          </div>
        </div>

        {/* Audio Info */}
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg space-y-1">
          <p className="font-semibold">🎙️ Google Cloud Text-to-Speech</p>
          <p>Voice: en-US-Neural2-J (Male) • Speed: 0.95x • Duration: 2:37</p>
        </div>

        {/* Transcript */}
        {transcript.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium">Transcript</label>
            </div>
            <ScrollArea className="h-[300px] w-full rounded-md border bg-muted/30 p-4">
              <div className="space-y-3">
                {transcript.map((line, index) => (
                  <p key={index} className="text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};