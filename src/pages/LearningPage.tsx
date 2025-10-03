import { useState, useEffect } from "react";
import { Header } from "@/components/Edapt/Header";
import { MindmapViewer } from "@/components/Edapt/MindmapViewer";
import { AudioControls } from "@/components/Edapt/AudioControls";
import { AnimatedVideoViewer } from "@/components/Edapt/AnimatedVideoViewer";
import { LearningSidebar } from "@/components/Edapt/LearningSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Brain, Volume2, Video, Search, Sparkles, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useContentGeneration } from "@/hooks/use-content-generation";
import { Progress } from "@/components/ui/progress";

const LearningPage = () => {
  const [query, setQuery] = useState("");
  const [hasContent, setHasContent] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("");
  
  const { loading, error, content, generateContent, pollUntilComplete } = useContentGeneration();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (content) {
      setHasContent(true);
      const historyItem = {
        id: content.session_id,
        query: query,
        topic: content.topic,
        session_id: content.session_id,
        createdAt: new Date().toISOString()
      };
      
      const existingHistory = JSON.parse(localStorage.getItem("edapt_history") || "[]");
      localStorage.setItem("edapt_history", JSON.stringify([historyItem, ...existingHistory]));
      localStorage.setItem("edapt_current", JSON.stringify({ ...historyItem, content }));
    }
  }, [content, query]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }

    try {
      setGenerationProgress(0);
      setGenerationMessage("Initializing AI agents...");
      
      const sessionId = await generateContent({
        query: query,
        narrative_style: 'intuitive',
        target_duration: 120,
        include_video: true
      });

      setGenerationProgress(20);
      setGenerationMessage("Generating mindmap and narrative...");
      
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 5, 90));
      }, 3000);

      setGenerationMessage("Creating audio narration...");
      
      const result = await pollUntilComplete(sessionId);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationMessage("Content ready!");
      
      toast.success(\`Content generated for: \${result.topic}\`);
      
      setTimeout(() => {
        setGenerationProgress(0);
        setGenerationMessage("");
      }, 2000);
      
    } catch (err) {
      console.error("Generation error:", err);
      setGenerationProgress(0);
      setGenerationMessage("");
      toast.error("Failed to generate content. Please try again.");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <LearningSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 container mx-auto px-6 py-6">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()} placeholder="Ask anything you want to learn about..." className="pl-10 h-12 text-base" disabled={loading} />
                  </div>
                  <Button onClick={handleSearch} size="lg" className="px-6" disabled={loading}>{loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>) : (<><Sparkles className="w-4 h-4 mr-2" />Generate</>)}</Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">Example: "Derivatives in Calculus" or "Newton's laws of motion"</p>
                {loading && generationProgress > 0 && (<div className="mt-4 space-y-2"><Progress value={generationProgress} className="h-2" /><div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /><span>{generationMessage}</span></div></div>)}
              </CardContent>
            </Card>
            <Tabs defaultValue="mindmap" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mindmap" className="flex items-center gap-2"><Brain className="w-4 h-4" />Mindmap</TabsTrigger>
                <TabsTrigger value="audio" className="flex items-center gap-2"><Volume2 className="w-4 h-4" />Audio</TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2"><Video className="w-4 h-4" />Animated Video</TabsTrigger>
              </TabsList>
              <TabsContent value="mindmap" className="mt-6">
                {hasContent && content ? (<MindmapViewer content={content.mindmap_code} />) : (<Card><CardContent className="flex items-center justify-center min-h-[400px]"><div className="text-center"><Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-semibold text-muted-foreground mb-2">No Content Yet</h3><p className="text-muted-foreground">Enter a query above to generate an interactive mindmap</p></div></CardContent></Card>)}
              </TabsContent>
              <TabsContent value="audio" className="mt-6">
                {hasContent && content ? (<AudioControls content={content.audio_url} />) : (<Card><CardContent className="flex items-center justify-center min-h-[400px]"><div className="text-center"><Volume2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-semibold text-muted-foreground mb-2">No Content Yet</h3><p className="text-muted-foreground">Enter a query above to generate audio explanations</p></div></CardContent></Card>)}
              </TabsContent>
              <TabsContent value="video" className="mt-6">
                {hasContent && content ? (<AnimatedVideoViewer content={content.video_url} />) : (<Card><CardContent className="flex items-center justify-center min-h-[400px]"><div className="text-center"><Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-semibold text-muted-foreground mb-2">No Content Yet</h3><p className="text-muted-foreground">Enter a query above to generate animated videos</p></div></CardContent></Card>)}
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LearningPage;
