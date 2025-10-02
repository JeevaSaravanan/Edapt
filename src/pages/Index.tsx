import { useState } from "react";
import { Header } from "@/components/Edapt/Header";
import { TextbookInput } from "@/components/Edapt/TextbookInput";
import { MindmapViewer } from "@/components/Edapt/MindmapViewer";
import { AudioControls } from "@/components/Edapt/AudioControls";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, Volume2, Sparkles } from "lucide-react";

const Index = () => {
  const [currentContent, setCurrentContent] = useState("");
  const [hasContent, setHasContent] = useState(false);

  const handleContentSubmit = (content: string) => {
    setCurrentContent(content);
    setHasContent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-6">
        {/* Progress indicator */}
        <div className="mb-6 p-4 bg-card rounded-lg border shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Learning Progress</h2>
            <Badge variant="secondary" className="bg-success/10 text-success">
              Biology • Chapter 3
            </Badge>
          </div>
          <Progress value={hasContent ? 75 : 25} className="h-2" />
          <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Content Input
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Mindmap Generation
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio Narration
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Interactive Learning
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <div className="lg:col-span-1">
            <TextbookInput onContentSubmit={handleContentSubmit} />
          </div>

          {/* Right Column - Visualization and Controls */}
          <div className="lg:col-span-2 space-y-6">
            {hasContent ? (
              <>
                <MindmapViewer content={currentContent} />
                <AudioControls content={currentContent} />
              </>
            ) : (
              <div className="h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-gradient-mindmap">
                <div className="text-center p-8">
                  <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    Ready to Visualize Learning
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Enter your textbook content to generate an interactive mindmap with AI-powered narration.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg border shadow-soft">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Transform textbook content into visual mindmaps using advanced AI algorithms.
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-lg border shadow-soft">
            <div className="w-12 h-12 bg-gradient-learning rounded-lg flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Interactive Narration</h3>
            <p className="text-sm text-muted-foreground">
              Listen to AI-generated audio explanations with customizable speed and voice.
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-lg border shadow-soft">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Visual Learning</h3>
            <p className="text-sm text-muted-foreground">
              Engage with interactive diagrams that make complex concepts easier to understand.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;