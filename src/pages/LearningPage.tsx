import { useState, useEffect } from "react";
import { Header } from "@/components/Edapt/Header";
import { TextbookInput } from "@/components/Edapt/TextbookInput";
import { MindmapViewer } from "@/components/Edapt/MindmapViewer";
import { AudioControls } from "@/components/Edapt/AudioControls";
import { AnimatedVideoViewer } from "@/components/Edapt/AnimatedVideoViewer";
import { LearningSidebar } from "@/components/Edapt/LearningSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Brain, Volume2, Sparkles, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LearningPage = () => {
  const [currentContent, setCurrentContent] = useState("");
  const [hasContent, setHasContent] = useState(false);
  const [contentData, setContentData] = useState<any>(null);

  useEffect(() => {
    // Load current content from localStorage
    const current = localStorage.getItem("edapt_current");
    if (current) {
      const data = JSON.parse(current);
      setContentData(data);
      setCurrentContent(data.content);
      setHasContent(true);
    }
  }, []);

  const handleContentSubmit = (content: string) => {
    setCurrentContent(content);
    setHasContent(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <LearningSidebar />
        <SidebarInset>
          <Header />
          
          <main className="flex-1 container mx-auto px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Input */}
              <div className="lg:col-span-1">
                <TextbookInput onContentSubmit={handleContentSubmit} />
              </div>

              {/* Right Column - Visualization and Controls */}
              <div className="lg:col-span-2 space-y-6">
                {hasContent ? (
                  <Tabs defaultValue="mindmap" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="mindmap" className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Mindmap
                      </TabsTrigger>
                      <TabsTrigger value="audio" className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Audio
                      </TabsTrigger>
                      <TabsTrigger value="video" className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Animated Video
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="mindmap" className="mt-6">
                      <MindmapViewer content={currentContent} />
                    </TabsContent>
                    
                    <TabsContent value="audio" className="mt-6">
                      <AudioControls content={currentContent} />
                    </TabsContent>
                    
                    <TabsContent value="video" className="mt-6">
                      <AnimatedVideoViewer content={currentContent} />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-gradient-mindmap">
                    <div className="text-center p-8">
                      <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                        Ready to Visualize Learning
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        {contentData 
                          ? "Your content is loaded. Use the input panel to generate mindmaps and start learning."
                          : "Enter your textbook content to generate an interactive mindmap with AI-powered narration."
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Feature highlights - only show when no content */}
            {!hasContent && (
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
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Animated Videos</h3>
                  <p className="text-sm text-muted-foreground">
                    Watch Manim-powered animated explanations that bring concepts to life visually.
                  </p>
                </div>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LearningPage;