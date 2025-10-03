import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, RotateCcw, Video, FileText, Volume2 } from "lucide-react";

interface AnimatedVideoViewerProps {
  content: string;
}

export const AnimatedVideoViewer = ({ content }: AnimatedVideoViewerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Derivative explanation transcript
  const derivativeTranscript = [
    "[0:00 - 0:03] Welcome to Understanding Derivatives. Let's explore one of the most fundamental concepts in calculus.",
    "[0:04 - 0:08] Here we have a simple function: f of x equals x squared. Notice how the curve gets steeper as we move to the right.",
    "[0:09 - 0:13] Let's start with something familiar: the secant line. This line connects two points on our curve.",
    "[0:14 - 0:18] The slope of this secant line represents the average rate of change between these two points. It's calculated as delta y over delta x.",
    "[0:19 - 0:22] But here's where it gets interesting. What happens when we bring the second point closer to the first?",
    "[0:23 - 0:30] Watch carefully. As the distance between the points shrinks, the secant line begins to rotate. It's approaching something special.",
    "[0:31 - 0:35] There! When the distance becomes infinitesimally small, the secant line becomes a tangent line. This represents the instantaneous rate of change at that exact point.",
    "[0:36 - 0:42] This process of taking the limit as delta x approaches zero is the formal definition of the derivative. It's written as f prime of x equals the limit of the difference quotient.",
    "[0:43 - 0:48] For our function, x squared, the derivative is 2x. At x equals 1, the slope of the tangent line is exactly 2.",
    "[0:49 - 0:54] The derivative tells us how fast our function is changing at any given point. It's the slope of the tangent line at that location.",
    "[0:55 - 1:10] Now watch as we move along the curve. See how the tangent line changes? At each point, the derivative gives us a different value. Near zero, the curve is flat, so the derivative is small. As we move right, the curve gets steeper, and the derivative increases.",
    "[1:11 - 1:18] This is the power of derivatives: they capture the instantaneous rate of change at every single point on a curve. Understanding this concept opens the door to analyzing motion, optimization, and change itself."
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setVideoProgress(progress);
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
      // Show transcript when video starts
      if (transcript.length === 0) {
        setTranscript(derivativeTranscript);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setVideoProgress(0);
    setCurrentTime(0);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Animated Learning Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player Area */}
        <div className="relative w-full h-[400px] bg-gradient-mindmap rounded-lg border-2 border-border overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            src="/media/videos/manim-sample/480p15/DerivativeExplanation_with_audio.mp4"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            Your browser does not support the video tag.
          </video>
          
          {!isPlaying && videoProgress === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
              <div className="text-center p-8">
                <Video className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Derivative Explanation Video
                </h3>
                <p className="text-white/80 max-w-md">
                  Click play to watch the animated explanation with narration
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Video Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePlayPause}
            size="lg"
            className="flex-1"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play Video
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
            disabled={videoProgress === 0}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 px-3">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground min-w-[3rem]">
              {Math.round(videoProgress)}%
            </span>
          </div>
        </div>

        {/* Transcript */}
        {transcript.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium">Video Transcript</label>
            </div>
            <ScrollArea className="h-[200px] w-full rounded-md border bg-muted/30 p-4">
              <div className="space-y-3">
                {transcript.map((line, index) => (
                  <p key={index} className="text-sm leading-relaxed">
                    <span className="font-semibold text-primary">[{index + 1}]</span> {line}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Video Info */}
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg space-y-1">
          <p className="font-semibold mb-1">🎬 Derivative Explanation with Manim</p>
          <p>Duration: 1:56 • Resolution: 854x480 • Format: MP4 with AAC Audio</p>
          <p>This mathematical animation was generated using Manim Community with Google Cloud Text-to-Speech narration.</p>
        </div>
      </CardContent>
    </Card>
  );
};
