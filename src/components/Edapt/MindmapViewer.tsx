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

  // Generate mermaid diagram from content - Derivatives Mindmap
  const generateMermaidDiagram = (text: string) => {
    return `
    mindmap
      root((Derivatives))
        What Are They?
          Instantaneous Rate of Change
          Slope of Tangent Line
          Limit of Difference Quotient
        The Derivative Function f'(x)
          Where the limit exists
          Higher-order derivatives
        When Can We Differentiate?
          Must be continuous first
          Watch out for these
            Breaks in the curve
            Vertical tangents
            Sharp corners or cusps
        Rules & Shortcuts
          Basic Rules
            Constants become zero
            Power Rule
            Constant Multiple
            Sum & Difference
            Product Rule
            Quotient Rule
          Advanced Techniques
            Chain Rule
            Power + Chain combo
          Special Methods
            Implicit Differentiation
            Logarithmic Differentiation
        Common Functions
          Trig Functions
            sin, cos, tan
          Inverse Trig
          Exponentials e^x
          Logarithms ln x
        Real-World Uses
          Motion & Movement
            Velocity
            Acceleration
            Speed
          Business & Economics
            Marginal Cost
            Marginal Revenue
            Marginal Profit
          Growth & Change
            Population Growth
    `;
  };

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#dceaf7',
        primaryTextColor: '#4b5563',
        primaryBorderColor: '#c1e5f5',
        lineColor: '#9ca3af',
        secondaryColor: '#c2f1c8',
        tertiaryColor: '#f2cfee',
        secondaryBorderColor: '#fbe3d6',
        tertiaryBorderColor: '#d9f2d0'
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
                Auto-narrating: Understanding Derivatives Concept
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};