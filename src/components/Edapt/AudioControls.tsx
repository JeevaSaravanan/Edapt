import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Square, Volume2, VolumeX, Mic, FileText } from "lucide-react";
import { toast } from "sonner";

interface AudioControlsProps {
  content: string;
}

export const AudioControls = ({ content }: AudioControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [speed, setSpeed] = useState("1");
  const [voice, setVoice] = useState("default");
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = () => {
    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      return;
    }

    if (speechSynthesis.paused && speechRef.current) {
      speechSynthesis.resume();
      setIsPlaying(true);
      startProgressTracking();
      return;
    }

    // Extract key concepts for narration
    const concepts = [
      "Photosynthesis is the process by which plants convert light energy into chemical energy.",
      "The process involves two main stages: light-dependent reactions and the Calvin cycle.",
      "Light reactions occur in thylakoids and produce ATP and NADPH.",
      "The Calvin cycle takes place in the stroma and produces glucose.",
      "This process is essential for life on Earth as it produces oxygen and food."
    ];

    setTranscript(concepts);
    const textToRead = concepts.join(" ");
    const estimatedDuration = (textToRead.length / 15) * 1000; // Rough estimate
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = parseFloat(speed);
    utterance.volume = isMuted ? 0 : volume[0] / 100;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setProgress(0);
      startProgressTracking();
      toast.success("Started narration");
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      toast.info("Narration completed");
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      toast.error("Error during narration");
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const startProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
          return 100;
        }
        return prev + 1;
      });
    }, 500);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);
    setTranscript([]);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    toast.info("Narration stopped");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (speechRef.current) {
      speechRef.current.volume = isMuted ? volume[0] / 100 : 0;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mic className="w-5 h-5 text-accent" />
          Audio Narration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Playback Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={handlePlay} 
            variant={isPlaying ? "secondary" : "default"}
            className="flex-1"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleStop} 
            disabled={!isPlaying && progress === 0}
            className="px-4"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
          <Button variant="outline" onClick={toggleMute} className="px-4">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Audio Settings */}
        <div className="space-y-3">
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
              />
              <span className="text-sm text-muted-foreground w-10">{volume[0]}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Speed</label>
              <Select value={speed} onValueChange={setSpeed}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="0.75">0.75x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Voice</label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Transcript */}
        {transcript.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium">Transcript</label>
            </div>
            <ScrollArea className="h-[200px] w-full rounded-md border bg-muted/30 p-4">
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