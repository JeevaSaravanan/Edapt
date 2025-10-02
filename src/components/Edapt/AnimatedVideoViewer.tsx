import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, RotateCcw, Video, FileText } from "lucide-react";

interface AnimatedVideoViewerProps {
  content: string;
}

export const AnimatedVideoViewer = ({ content }: AnimatedVideoViewerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Generate sample transcript when video starts
      setTranscript([
        "Welcome to this animated explanation of the concept.",
        "We'll start by introducing the fundamental principles.",
        "First, let's examine the core components and their relationships.",
        "Notice how each element interacts with the others in the system.",
        "This animation demonstrates the process step by step.",
        "Finally, we'll see how everything comes together to form a complete understanding."
      ]);
    }
    // TODO: Integrate with Manim video generation API
  };

  const handleReset = () => {
    setIsPlaying(false);
    setVideoProgress(0);
    setTranscript([]);
    // TODO: Reset video playback
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
        <div className="relative w-full h-[400px] bg-gradient-mindmap rounded-lg border-2 border-border flex items-center justify-center">
          {!isPlaying ? (
            <div className="text-center p-8">
              <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                Manim Animation Ready
              </h3>
              <p className="text-muted-foreground max-w-md">
                Click play to generate and view the animated explanation of your content
              </p>
            </div>
          ) : (
            <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
              <p className="text-white">Video playing: {videoProgress}%</p>
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
                Generate & Play
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground min-w-[3rem]">
                {videoProgress}%
              </span>
            </div>
          </div>
        )}

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
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
          <p className="font-semibold mb-1">About Manim Animations:</p>
          <p>Mathematical Animation Engine creates beautiful, programmatic animations to explain complex concepts visually.</p>
        </div>
      </CardContent>
    </Card>
  );
};
