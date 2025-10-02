import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause } from "lucide-react";
import mermaid from "mermaid";

interface MindmapViewerProps {
  content: string;
}

export const MindmapViewer = ({ content }: MindmapViewerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNode, setCurrentNode] = useState(0);
  const mermaidRef = useRef<HTMLDivElement>(null);

  // Generate mermaid diagram from content
  const generateMermaidDiagram = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const mainTopic = "Photosynthesis";
    
    return `
    mindmap
      root((${mainTopic}))
        Light Reactions
          Chlorophyll
          Thylakoids
          ATP Production
          NADPH Formation
          Oxygen Release
        Calvin Cycle
          CO2 Fixation
          Stroma
          Glucose Formation
          Energy Consumption
        Importance
          Oxygen Production
          Food Chain Base
          Climate Regulation
          Energy Storage
    `;
  };

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#60a5fa',
        lineColor: '#6366f1',
        secondaryColor: '#10b981',
        tertiaryColor: '#8b5cf6'
      }
    });

    if (mermaidRef.current) {
      const diagram = generateMermaidDiagram(content);
      mermaidRef.current.innerHTML = `<div class="mermaid">${diagram}</div>`;
      mermaid.contentLoaded();
    }
  }, [content]);

  const handleZoomIn = () => {
    if (mermaidRef.current) {
      const svg = mermaidRef.current.querySelector('svg');
      if (svg) {
        const currentScale = parseFloat(svg.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || '1');
        svg.style.transform = `scale(${Math.min(currentScale * 1.2, 3)})`;
      }
    }
  };

  const handleZoomOut = () => {
    if (mermaidRef.current) {
      const svg = mermaidRef.current.querySelector('svg');
      if (svg) {
        const currentScale = parseFloat(svg.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || '1');
        svg.style.transform = `scale(${Math.max(currentScale * 0.8, 0.3)})`;
      }
    }
  };

  const handleReset = () => {
    if (mermaidRef.current) {
      const svg = mermaidRef.current.querySelector('svg');
      if (svg) {
        svg.style.transform = 'scale(1)';
      }
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            Interactive Mindmap
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button 
              variant={isPlaying ? "secondary" : "default"} 
              size="sm" 
              onClick={togglePlayback}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] bg-gradient-mindmap border border-border rounded-lg overflow-hidden">
          <div 
            ref={mermaidRef}
            className="w-full h-full flex items-center justify-center p-4"
          />
        </div>
        
        {isPlaying && (
          <div className="p-4 bg-primary/5 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-primary font-medium">
                Auto-narrating: Light Reactions
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};